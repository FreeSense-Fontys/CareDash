import { ChartJSContext } from '../../types/ChartJSContext'

import { Alert } from '../../types/Alert'

const RED_COLOR = 'rgb(226, 30, 30)'

const MISSING_DATA_COLOR = 'rgb(175, 175, 175)'

export const dangerousTemperature = (ctx: ChartJSContext, alerts: Alert[]) => {
    const relevantAlerts = alerts.filter((alert) => alert.data.vital === 'T')
    let shouldBeRed = false

    relevantAlerts.forEach((alert) => {
        if (
            alert.data.alertType === 'Above' &&
            (ctx.p0.parsed.y > alert.data.threshold ||
                ctx.p1.parsed.y > alert.data.threshold)
        ) {
            shouldBeRed = true
        }
        if (
            alert.data.alertType === 'Below' &&
            (ctx.p0.parsed.y < alert.data.threshold ||
                ctx.p1.parsed.y < alert.data.threshold)
        ) {
            shouldBeRed = true
        }
    })
    return shouldBeRed ? RED_COLOR : undefined
}

export const dangerousHeartRate = (ctx: ChartJSContext, alerts: Alert[]) => {
    const relevantAlerts = alerts.filter((alert) => alert.data.vital === 'HR')
    let shouldBeRed = false

    relevantAlerts.forEach((alert) => {
        if (
            alert.data.alertType === 'Above' &&
            (ctx.p0.parsed.y > alert.data.threshold ||
                ctx.p1.parsed.y > alert.data.threshold)
        ) {
            shouldBeRed = true
        }
        if (
            alert.data.alertType === 'Below' &&
            (ctx.p0.parsed.y < alert.data.threshold ||
                ctx.p1.parsed.y < alert.data.threshold)
        ) {
            shouldBeRed = true
        }
    })
    return shouldBeRed ? RED_COLOR : undefined
}

export const dangerousBPM = (ctx: ChartJSContext, alerts: Alert[]) => {
    const relevantAlerts = alerts.filter((alert) => alert.data.vital === 'SBP')
    let shouldBeRed = false

    relevantAlerts.forEach((alert) => {
        if (
            alert.data.alertType === 'Above' &&
            (ctx.p0.parsed.y > alert.data.threshold ||
                ctx.p1.parsed.y > alert.data.threshold)
        ) {
            shouldBeRed = true
        }
        if (
            alert.data.alertType === 'Below' &&
            (ctx.p0.parsed.y < alert.data.threshold ||
                ctx.p1.parsed.y < alert.data.threshold)
        ) {
            shouldBeRed = true
        }
    })
    return shouldBeRed ? RED_COLOR : undefined
}
export const dangerousLowBPM = (ctx: ChartJSContext, alerts: Alert[]) => {
    const relevantAlerts = alerts.filter((alert) => alert.data.vital === 'DBP')
    let shouldBeRed = false

    relevantAlerts.forEach((alert) => {
        if (
            alert.data.alertType === 'Above' &&
            (ctx.p0.parsed.y > alert.data.threshold ||
                ctx.p1.parsed.y > alert.data.threshold)
        ) {
            shouldBeRed = true
        }
        if (
            alert.data.alertType === 'Below' &&
            (ctx.p0.parsed.y < alert.data.threshold ||
                ctx.p1.parsed.y < alert.data.threshold)
        ) {
            shouldBeRed = true
        }
    })
    return shouldBeRed ? RED_COLOR : undefined
}
export const missingData = (ctx: ChartJSContext, value: number[]) =>
    ctx.p0.skip || ctx.p1.skip ? MISSING_DATA_COLOR : undefined
