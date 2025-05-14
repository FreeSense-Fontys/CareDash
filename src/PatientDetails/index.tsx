import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { useEffect, useState } from 'react'
import exh from '../Auth'
import VitalGraph from './Components/vital-graph'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { chartAreaBorder } from './Components/graph-border'

Chart.register(CategoryScale)
Chart.register(ChartDataLabels)
Chart.register(chartAreaBorder)

interface PatientDetailsProps {
    patient: {
        name: string
        birthDate: string
        gender: string
        skinType?: string
        carePath?: string
        bmi?: number
    }
    wearableId: string | null
    currentDate: string
}

export default function DetailPage({
    patient,
    wearableId,
    currentDate,
}: PatientDetailsProps) {
    const [wearableData, setWearableData] = useState<any | undefined>()
    const [vitalGraphData, setVitalGraphData] = useState<any | undefined>()
    useEffect(() => {
        setWearableData(undefined)
        const getPatientDetail = async () => {
            if (!wearableId) return
            // note that this may take long to execute depending on how many vital measurements
            // that wearable has measured that day (e.g. the second Eric Berry in the list on April 10, 2025 has
            // almost 4000 measurements per vital)
            const data = await exh.tasks.api.get(
                'get-observations-by-day',
                `?wearableId=${wearableId}&date=${currentDate}`,
                {}
            )
            setWearableData(data)
            console.log('Wearable Data:', data)
        }
        getPatientDetail()
    }, [wearableId, currentDate])

    useEffect(() => {
        if (!wearableData) return
        const sbp = wearableData?.vitals.find((v: any) => v.name === 'SBP')
        const dbp = wearableData?.vitals.find((v: any) => v.name === 'DBP')
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
                            borderDash: (ctx: any) => missingData(ctx, [6, 6]),
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
                            borderDash: (ctx: any) => missingData(ctx, [6, 6]),
                        },
                        spanGaps: true,
                    },
                ],
            }
            vitalsData.push(bloodPressureChartData)
        }

        // creating charts for all other vitals except SBP and DBP
        for (const vitals of wearableData.vitals) {
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
                        data: vitals.series.map((vital: any) => vital.value),
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
                            borderDash: (ctx: any) => missingData(ctx, [6, 6]),
                        },
                        spanGaps: true,
                    },
                ],
            })
        }
        setVitalGraphData(vitalsData)
        // setVitalGraphData([...vitalsData, ...vitalsData])
    }, [wearableData])

    if (!wearableData) {
        return <div className="text-white">Loading...</div>
    }

    if (wearableData?.vitals.length == 0) {
        return <div className="text-white">No vitals data available</div>
    }

    const bloodPreasureChartData = {
        labels: wearableData?.vitals
            .find((object: any) => object.name == 'SBP')
            .series.map((x: any) => {
                const date: Date = new Date(x.timestamp)
                return `${date.getHours().toLocaleString()}:${
                    date.getMinutes().toString().length == 1
                        ? '0' + date.getMinutes()
                        : date.getMinutes()
                }`
            }),
        datasets: [
            {
                label: 'Systolic Blood Pressure',
                data: wearableData?.vitals
                    .find((object: any) => object.name == 'SBP')
                    .series.map((x: any) => x.value),
                borderColor: 'rgb(0, 80, 0)',
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                segment: {
                    borderColor: (ctx: any) =>
                        missingData(ctx, 'rgb(175, 175, 175)') ||
                        dangerousBPM(ctx, 'rgb(226, 30, 30)'),
                    borderDash: (ctx: any) => missingData(ctx, [6, 6]),
                },
                spanGaps: true,
            },
            {
                label: 'Diastolic Blood Pressure',
                data: wearableData?.vitals
                    .find((object: any) => object.name == 'DBP')
                    .series.map((x: any) => x.value),
                borderColor: 'rgb(0, 0, 80)',
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                segment: {
                    borderColor: (ctx: any) =>
                        missingData(ctx, 'rgb(175, 175, 175)') ||
                        dangerousLowBPM(ctx, 'rgb(226, 30, 30)'),
                    borderDash: (ctx: any) => missingData(ctx, [6, 6]),
                },
                spanGaps: true,
            },
        ],
    }
    const heartRateChartData = {
        labels: wearableData?.vitals
            .find((object: any) => object.name == 'HR')
            .series.map((x: any) => {
                const date: Date = new Date(x.timestamp)
                return `${date.getHours().toLocaleString()}:${
                    date.getMinutes().toString().length == 1
                        ? '0' + date.getMinutes()
                        : date.getMinutes()
                }`
            }),
        datasets: [
            {
                label: 'Heart Rate',
                data: wearableData?.vitals
                    .find((object: any) => object.name == 'HR')
                    .series.map((x: any) => x.value),
                borderColor: 'rgb(0, 80, 0)',
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                segment: {
                    borderColor: (ctx: any) =>
                        missingData(ctx, 'rgb(175, 175, 175)') ||
                        dangerousHeartRate(ctx, 'rgb(226, 30, 30)'),
                    borderDash: (ctx: any) => missingData(ctx, [6, 6]),
                },
                spanGaps: true,
            },
        ],
    }

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            {/* Patient Information */}
            <div className="bg-background rounded-md p-2">
                <div className="grid grid-cols-2 gap-2">
                    <p>Patient: {patient?.name}</p>
                    <p>Sex: {patient?.gender}</p>
                    <p>Care Path: {patient?.carePath}</p>
                    <p>BMI: {patient?.bmi}</p>
                    <p>DOB: {patient?.birthDate}</p>
                    <p>Skin Type: {patient?.skinType}</p>
                </div>
            </div>

            {vitalGraphData && (
                <div className="flex flex-wrap gap-4 w-full h-full items-center">
                    {vitalGraphData.map((vital: any, index: number) => {
                        return <VitalGraph key={index} chartData={vital} />
                    })}
                </div>
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
