import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { useEffect, useState } from 'react'
import exh from '../Auth'
import VitalGraph from './Components/vital-graph'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { chartAreaBorder } from './Components/graph-border'
import { usePatient } from '../contexts/PatientProvider'

Chart.register(CategoryScale)
Chart.register(ChartDataLabels)
Chart.register(chartAreaBorder)

interface PatientDetailsProps {
    currentDate: string
}

export default function DetailPage({ currentDate }: PatientDetailsProps) {
    const [vitalGraphData, setVitalGraphData] = useState<any | undefined>()
    const { selectedPatient, selectedWearableId } = usePatient()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(true)
        setVitalGraphData(undefined)
        const getVitalData = async () => {
            if (!selectedWearableId) return
            // note that this may take long to execute depending on how many vital measurements
            // that wearable has measured that day (e.g. the second Eric Berry in the list on April 10, 2025 has
            // almost 4000 measurements per vital)
            const data = await exh.tasks.api.get(
                'get-observations-by-day',
                `?wearableId=${selectedWearableId}&date=${currentDate}`,
                {}
            )
            if (!data) return
            const sbp = data?.vitals.find((v: any) => v.name === 'SBP')
            const dbp = data?.vitals.find((v: any) => v.name === 'DBP')
            const vitalsData = []

            // creating a custom chart that contains both SBP and DBP only if they exist in the data
            let bloodPressureChartData = null
            if (sbp && dbp) {
                bloodPressureChartData = {
                    labels: sbp.series.map((x: any) => {
                        const date = new Date(x.timestamp)
                        return `${date.getHours().toLocaleString()}:${
                            date.getMinutes().toString().length == 1
                                ? '0' + date.getMinutes()
                                : date.getMinutes()
                        }`
                    }),
                    datasets: [
                        {
                            label: 'Systolic Blood Pressure',
                            data: sbp.series.map((x: any) => x.value),
                            borderColor: 'rgb(0, 80, 0)',
                            cubicInterpolationMode: 'monotone',
                            tension: 0.4,
                            segment: {
                                borderColor: (ctx: any) =>
                                    missingData(ctx, 'rgb(175, 175, 175)') ||
                                    dangerousBPM(ctx, 'rgb(226, 30, 30)'),
                                borderDash: (ctx: any) =>
                                    missingData(ctx, [6, 6]),
                            },
                            spanGaps: true,
                        },
                        {
                            label: 'Diastolic Blood Pressure',
                            data: dbp.series.map((x: any) => x.value),
                            borderColor: 'rgb(0, 0, 80)',
                            cubicInterpolationMode: 'monotone',
                            tension: 0.4,
                            segment: {
                                borderColor: (ctx: any) =>
                                    missingData(ctx, 'rgb(175, 175, 175)') ||
                                    dangerousLowBPM(ctx, 'rgb(226, 30, 30)'),
                                borderDash: (ctx: any) =>
                                    missingData(ctx, [6, 6]),
                            },
                            spanGaps: true,
                        },
                    ],
                }
                vitalsData.push(bloodPressureChartData)
            }

            // creating charts for all other vitals except SBP and DBP
            for (const vitals of data.vitals) {
                if (vitals.name == 'SBP' || vitals.name == 'DBP') continue
                vitalsData.push({
                    labels: vitals.series.map((vital: any) => {
                        const date: Date = new Date(vital.timestamp)
                        return `${date.getHours().toLocaleString()}:${
                            date.getMinutes().toString().length == 1
                                ? '0' + date.getMinutes()
                                : date.getMinutes()
                        }`
                    }),
                    datasets: [
                        {
                            label: vitals.name,
                            data: vitals.series.map(
                                (vital: any) => vital.value
                            ),
                            borderColor: 'rgb(0, 80, 0)',
                            cubicInterpolationMode: 'monotone',
                            tension: 0.4,
                            segment: {
                                // TODO: need to change this, currently only checking if value is under
                                // dangerous heart rate and temperature threshold. But, it should dynamically check based on the
                                // vital
                                borderColor: (ctx: any) =>
                                    missingData(ctx, 'rgb(175, 175, 175)') ||
                                    (vitals.name == 'HR'
                                        ? dangerousHeartRate(
                                              ctx,
                                              'rgb(226, 30, 30)'
                                          )
                                        : 'rgb(0, 80, 0)') ||
                                    (vitals.name == 'T'
                                        ? dangerousTemperature(
                                              ctx,
                                              'rgb(226, 30, 30)'
                                          )
                                        : 'rgb(0, 80, 0)'),
                                borderDash: (ctx: any) =>
                                    missingData(ctx, [6, 6]),
                            },
                            spanGaps: true,
                        },
                    ],
                })
            }
            if (vitalsData.length != 0)
                if (vitalsData.length != 0) setVitalGraphData(vitalsData)
            // setVitalGraphData([...vitalsData, ...vitalsData])
            setIsLoading(false)
        }

        getVitalData()
    }, [selectedWearableId, currentDate])

    if (isLoading) {
        return <div className="text-white">Loading...</div>
    }

    return (
        <div className="flex flex-col gap-4 h-full w-full">
            {/* Patient Information */}
            <div className="bg-background rounded-md p-2">
                <div className="grid grid-cols-2">
                    <p>Patient: {selectedPatient?.name}</p>
                    <p>Sex: {selectedPatient?.gender}</p>
                    <p>Care Path: {selectedPatient?.carePath}</p>
                    <p>BMI: {selectedPatient?.bmi}</p>
                    <p>DOB: {selectedPatient?.birthDate}</p>
                    <p>Skin Type: {selectedPatient?.skinType}</p>
                </div>
            </div>

            {vitalGraphData != undefined ? (
                <div className="flex flex-wrap gap-4 h-full items-center">
                    {vitalGraphData.map((vital: any, index: number) => {
                        return <VitalGraph key={index} chartData={vital} />
                    })}
                </div>
            ) : (
                <div className="text-white">No data available</div>
            )}
        </div>
    )
}

const dangerousTemperature = (ctx: any, value: any) =>
    ctx.p0.parsed.y >= 40 ||
    ctx.p1.parsed.y >= 40 ||
    ctx.p0.parsed.y <= 34 ||
    ctx.p1.parsed.y <= 34
        ? value
        : undefined

const dangerousHeartRate = (ctx: any, value: any) =>
    ctx.p0.parsed.y >= 90 ||
    ctx.p1.parsed.y >= 90 ||
    ctx.p0.parsed.y <= 40 ||
    ctx.p1.parsed.y <= 40
        ? value
        : undefined

const dangerousBPM = (ctx: any, value: any) =>
    ctx.p0.parsed.y >= 140 ||
    ctx.p1.parsed.y >= 140 ||
    ctx.p0.parsed.y <= 90 ||
    ctx.p1.parsed.y <= 90
        ? value
        : undefined
const dangerousLowBPM = (ctx: any, value: any) =>
    ctx.p0.parsed.y <= 82 || ctx.p1.parsed.y <= 82 ? value : undefined

const missingData = (ctx: any, value: any) =>
    ctx.p0.skip || ctx.p1.skip ? value : undefined
