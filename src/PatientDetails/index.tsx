import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
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
            const alerts = tempAlerts.data ?? []
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

            // creating a custom chart that contains both SBP and DBP only if they exist in the data
            let bloodPressureChartData = null
            if (sbp && dbp) {
                bloodPressureChartData = {
                    labels: sbp.series.map((x: Vital) => {
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
                            data: sbp.series.map((x: Vital) => x.value),
                            borderColor: 'rgb(0, 80, 0)',
                            cubicInterpolationMode: 'monotone',
                            tension: 0.4,
                            segment: {
                                borderColor: (ctx: ChartJSContext) =>
                                    TempAlerts.missingData(
                                        ctx,
                                        [175, 175, 175]
                                    ) ||
                                    TempAlerts.dangerousBPM(ctx, alerts || []),
                                borderDash: (ctx: ChartJSContext) =>
                                    TempAlerts.missingData(ctx, [6, 6]),
                            },
                            spanGaps: true,
                        },
                        {
                            label: 'Diastolic Blood Pressure',
                            data: dbp.series.map((x: Vital) => x.value),
                            borderColor: 'rgb(0, 0, 80)',
                            cubicInterpolationMode: 'monotone',
                            tension: 0.4,
                            segment: {
                                borderColor: (ctx: ChartJSContext) =>
                                    TempAlerts.missingData(
                                        ctx,
                                        [175, 175, 175]
                                    ) ||
                                    TempAlerts.dangerousLowBPM(
                                        ctx,
                                        alerts || []
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
                    labels: vitals.series.map((vital: Vital) => {
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
                                (vital: Vital) => vital.value
                            ),
                            borderColor: 'rgb(0, 80, 0)',
                            cubicInterpolationMode: 'monotone',
                            tension: 0.4,
                            segment: {
                                // TODO: need to change this, currently only checking if value is under
                                // dangerous heart rate and temperature threshold. But, it should dynamically check based on the
                                // vital
                                borderColor: (ctx: ChartJSContext) =>
                                    TempAlerts.missingData(
                                        ctx,
                                        [175, 175, 175]
                                    ) ||
                                    (vitals.name == 'HR'
                                        ? TempAlerts.dangerousHeartRate(
                                              ctx,
                                              alerts || []
                                          )
                                        : 'rgb(0, 80, 0)') ||
                                    (vitals.name == 'T'
                                        ? TempAlerts.dangerousTemperature(
                                              ctx,
                                              alerts || []
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
    }, [selectedWearableId, currentDate])

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
                    <p>
                        Care Paths:{' '}
                        {Array.isArray(selectedPatient?.carepaths)
                            ? selectedPatient.carepaths
                                  .map((cp) => cp.name)
                                  .join(', ')
                            : selectedPatient?.carepaths ?? 'N/A'}
                    </p>
                    <p>BMI: {selectedPatient?.bmi}</p>
                    <p>DOB: {selectedPatient?.birthDate}</p>
                    <p>Skin Type: {selectedPatient?.skinType}</p>
                </div>
            </div>

            {vitalGraphData != undefined ? (
                <div className="flex flex-wrap gap-4 h-full items-center">
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
