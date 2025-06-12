import Chart from 'chart.js/auto'
import { CategoryScale, Decimation } from 'chart.js'
import { useEffect, useState } from 'react'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { chartAreaBorder } from './Components/graph-border'

import exh from '../Auth'
import VitalGraph from './Components/vital-graph'
import { usePatient } from '../contexts/PatientProvider'
import { VitalSeries, WearableDataByDay } from '../types/WearableDataByDay'
import { ChartJSContext } from '../types/ChartJSContext'
import { Vital } from '../types/Vital'
import { Alert } from '../types/Alert'

import * as TempAlerts from './Components/TempAlerts'
import { rqlBuilder } from '@extrahorizon/javascript-sdk'

Chart.register(CategoryScale, ChartDataLabels, chartAreaBorder, Decimation)

interface PatientDetailsProps {
    currentDate: string
}

export default function DetailPage({ currentDate }: PatientDetailsProps) {
    const [vitalGraphData, setVitalGraphData] = useState<any | undefined>()
    const { selectedPatient, selectedWearableId } = usePatient()
    const [isLoading, setIsLoading] = useState(true)
    const [refreshTime, setRefreshTime] = useState(new Date())

    // gets data for patient and sets graph data
    useEffect(() => {
        setIsLoading(true)
        setVitalGraphData(undefined)
        const getVitalData = async () => {
            if (!selectedWearableId) {
                setIsLoading(false)
                return
            }

            // fetching alerts
            const tempAlerts = await exh.data.documents.find<Alert>('alert', {
                rql: rqlBuilder()
                    .eq('data.wearableId', selectedWearableId)
                    .build(),
            })
            const alerts = tempAlerts.data as unknown as Alert[]
            // note that this may take long to execute depending on how many vital measurements
            // that wearable has measured that day (e.g. the second Eric Berry in the list on April 10, 2025 has
            // almost 4000 measurements per vital)
            const data = (await exh.tasks.api.get(
                'get-observations-by-day',
                `?wearableId=${selectedWearableId}&date=${currentDate}`,
                {}
            )) as WearableDataByDay
            if (!data) {
                setIsLoading(false)
                return
            }
            const sbp = data?.vitals.find((v: VitalSeries) => v.name === 'SBP')
            const dbp = data?.vitals.find((v: VitalSeries) => v.name === 'DBP')
            const vitalsData = []

            console.log(dbp)

            // creating a custom chart that contains both SBP and DBP only if they exist in the data
            let bloodPressureChartData = null
            if (sbp && dbp) {
                bloodPressureChartData = {
                    datasets: [
                        {
                            label: 'Systolic Blood Pressure',
                            data: sbp.series.map((x: Vital) => ({
                                y: x.value,
                                x: new Date(x.timestamp).getTime(),
                            })),
                            borderColor: 'rgb(0, 80, 0)',
                            cubicInterpolationMode: 'monotone',
                            tension: 0.4,
                            segment: {
                                borderColor: (ctx: ChartJSContext) =>
                                    TempAlerts.missingData(
                                        ctx,
                                        [175, 175, 175]
                                    ) ||
                                    TempAlerts.dangerousVital(
                                        ctx,
                                        alerts || [],
                                        sbp.name
                                    ),
                                borderDash: (ctx: ChartJSContext) =>
                                    TempAlerts.missingData(ctx, [6, 6]),
                            },
                            spanGaps: true,
                        },
                        {
                            label: 'Diastolic Blood Pressure',
                            data: dbp.series.map((x: Vital) => ({
                                y: x.value,
                                x: new Date(x.timestamp).getTime(),
                            })),
                            borderColor: 'rgb(0, 0, 80)',
                            cubicInterpolationMode: 'monotone',
                            tension: 0.4,
                            segment: {
                                borderColor: (ctx: ChartJSContext) =>
                                    TempAlerts.missingData(
                                        ctx,
                                        [175, 175, 175]
                                    ) ||
                                    TempAlerts.dangerousVital(
                                        ctx,
                                        alerts || [],
                                        dbp.name
                                    ),
                                borderDash: (ctx: ChartJSContext) =>
                                    TempAlerts.missingData(ctx, [6, 6]),
                            },
                            spanGaps: true,
                        },
                    ],
                }
            }

            // creating charts for all other vitals except SBP and DBP
            for (const vitals of data.vitals) {
                if (vitals.name == 'SBP') {
                    vitalsData.push(bloodPressureChartData)
                    continue
                }
                if (vitals.name == 'DBP') continue // skip DBP as it's already included in the blood pressure chart

                vitalsData.push({
                    datasets: [
                        {
                            label: vitals.name,
                            data: vitals.series.map((vital: Vital) => ({
                                y: vital.value,
                                x: new Date(vital.timestamp).getTime(),
                            })),
                            borderColor: 'rgb(0, 80, 0)',
                            cubicInterpolationMode: 'monotone',
                            tension: 0.4,
                            segment: {
                                borderColor: (ctx: ChartJSContext) =>
                                    TempAlerts.missingData(
                                        ctx,
                                        [175, 175, 175]
                                    ) ||
                                    (vitals.name == 'HR'
                                        ? TempAlerts.dangerousVital(
                                              ctx,
                                              alerts || [],
                                              vitals.name
                                          )
                                        : 'rgb(0, 80, 0)'),
                                borderDash: (ctx: ChartJSContext) =>
                                    TempAlerts.missingData(ctx, [6, 6]),
                            },
                            spanGaps: true,
                        },
                    ],
                })
            }
            if (vitalsData.length != 0) setVitalGraphData(vitalsData)
            setIsLoading(false)
        }

        getVitalData()

        // Set up interval to refresh every minute (60000ms)
        const intervalId = setInterval(() => {
            setRefreshTime(new Date()) // Update refresh time to trigger useEffect
        }, 60 * 1000)

        // Clean up interval on component unmount
        return () => clearInterval(intervalId)
    }, [selectedWearableId, currentDate, refreshTime])

    if (isLoading) {
        return <div className="text-white">Loading...</div>
    }

    return (
        <div className="flex flex-col gap-4 h-full w-full">
            {/* Patient Information */}
            <div className="bg-background rounded-md p-2">
                <div className="grid grid-cols-2">
                    <p>Patient: {selectedPatient?.data.name}</p>
                    <p>Sex: {selectedPatient?.data.gender}</p>
                    <p>Care Paths: N/A</p>
                    <p>BMI: {selectedPatient?.bmi}</p>
                    <p>DOB: {selectedPatient?.data.birthDate}</p>
                    <p>Skin Type: {selectedPatient?.skinType}</p>
                </div>
            </div>

            {vitalGraphData != undefined ? (
                <div className="grid grid-cols-2 gap-4">
                    {vitalGraphData.map((vital: Vital, index: number) => {
                        return <VitalGraph key={index} chartData={vital} />
                    })}
                </div>
            ) : (
                <div className="text-white">No data available</div>
            )}
        </div>
    )
}
