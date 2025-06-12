import { ChartJSContext } from '../../types/ChartJSContext'

import { Alert } from '../../types/Alert'
import { VitalName } from '../../types/Vital'

const RED_COLOR = 'rgb(226, 30, 30)'

// const MISSING_DATA_COLOR = 'rgb(175, 175, 175)'

export const dangerousVital = (
    ctx: ChartJSContext,
    alerts: Alert[],
    vital: VitalName
) => {
    const relevantAlerts = alerts.filter((alert) => alert.data.vital === vital)
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
    ctx.p0.skip || ctx.p1.skip ? value : undefined
