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
    wearableId: string | null
    currentDate: string
}

//todo: wearable id should be changed to patient id and get wearable id from there
export default function DetailPage({
    wearableId,
    currentDate,
}: PatientDetailsProps) {
    const [wearableData, setWearableData] = useState<any | undefined>()

    console.log('WearableId: ', wearableId)
    useEffect(() => {
        const getPatientDetail = async () => {
            const data = await exh.tasks.api.get(
                'get-observations-by-day',
                `?wearableId=${wearableId}&date=${'2025-04-17'}`,
                {}
            )
            console.log('Wearable data: ', data)
            setWearableData(data)
        }
        getPatientDetail()
    }, [wearableId])

    const bloodPreasureChartData = {
        labels: wearableData?.vitals
            .find((object: any) => object.name == 'SBP')
            .series.map((x: any) => {
                let date: Date = new Date(x.timestamp)
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
                let date: Date = new Date(x.timestamp)
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
    const tempratureChartData = {
        labels: wearableData?.vitals
            .find((object: any) => object.name == 'T')
            .series.map((x: any) => {
                let date: Date = new Date(x.timestamp)
                return `${date.getHours().toLocaleString()}:${
                    date.getMinutes().toString().length == 1
                        ? '0' + date.getMinutes()
                        : date.getMinutes()
                }`
            }),
        datasets: [
            {
                label: 'Temperature',
                data: wearableData?.vitals
                    .find((object: any) => object.name == 'T')
                    .series.map((x: any) => x.value),
                borderColor: 'rgb(0, 80, 0)',
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                segment: {
                    borderColor: (ctx: any) =>
                        missingData(ctx, 'rgb(175, 175, 175)') ||
                        dangerousTemprature(ctx, 'rgb(226, 30, 30)'),
                    borderDash: (ctx: any) => missingData(ctx, [6, 6]),
                },
                spanGaps: true,
            },
        ],
    }

    return (
        <div className="App">
            <span style={{ display: 'flex' }}>
                <VitalGraph chartData={bloodPreasureChartData} />
                <VitalGraph chartData={heartRateChartData} />
                <VitalGraph chartData={tempratureChartData} />
            </span>
        </div>
    )
}

const dangerousTemprature = (ctx: any, value: any) =>
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
    ctx.p0.parsed.y >= 90 ||
    ctx.p1.parsed.y >= 90 ||
    ctx.p0.parsed.y <= 60 ||
    ctx.p1.parsed.y <= 60
        ? value
        : undefined

const missingData = (ctx: any, value: any) =>
    ctx.p0.skip || ctx.p1.skip ? value : undefined
