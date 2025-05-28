import { ChartJSContext } from '../../types/ChartJSContext'

export const dangerousTemperature = (ctx: ChartJSContext, value: string) =>
    ctx.p0.parsed.y >= 40 ||
    ctx.p1.parsed.y >= 40 ||
    ctx.p0.parsed.y <= 34 ||
    ctx.p1.parsed.y <= 34
        ? value
        : undefined

export const dangerousHeartRate = (ctx: ChartJSContext, value: string) =>
    ctx.p0.parsed.y >= 90 ||
    ctx.p1.parsed.y >= 90 ||
    ctx.p0.parsed.y <= 40 ||
    ctx.p1.parsed.y <= 40
        ? value
        : undefined

export const dangerousBPM = (ctx: ChartJSContext, value: string) =>
    ctx.p0.parsed.y >= 140 ||
    ctx.p1.parsed.y >= 140 ||
    ctx.p0.parsed.y <= 90 ||
    ctx.p1.parsed.y <= 90
        ? value
        : undefined
export const dangerousLowBPM = (ctx: ChartJSContext, value: string) =>
    ctx.p0.parsed.y <= 82 || ctx.p1.parsed.y <= 82 ? value : undefined

export const missingData = (ctx: ChartJSContext, value: number[]) =>
    ctx.p0.skip || ctx.p1.skip ? value : undefined
