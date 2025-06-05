import { Time, Timing, TimingType } from '../../types/Timing'

interface TimingsSectionProps {
    timings: Timing[]
    isReadOnly: boolean
    addTiming: () => void
    updateTiming: (idx: number, key: keyof Timing, value: any) => void
    removeTiming: (idx: number) => void
}

const TimingsSection = ({
    timings,
    isReadOnly,
    addTiming,
    updateTiming,
    removeTiming,
}: TimingsSectionProps) => {
    const timingTypesArray = Object.values(TimingType).filter(
        (v) => typeof v === 'string'
    ) as string[]

    const timeUnitsArray = Object.values(Time).filter(
        (v) => typeof v === 'number'
    ) as Time[]

    return (
        <div className="border-t pt-4">
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Timings</h2>
                    {!isReadOnly && (
                        <button
                            type="button"
                            onClick={addTiming}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            + Add Timing
                        </button>
                    )}
                </div>

                {timings.length === 0 && (
                    <p className="text-gray-500 italic">
                        No timings configured.
                    </p>
                )}

                {timings.map((timing, idx) => (
                    <div
                        key={timing.id}
                        className="flex flex-wrap items-center gap-2 md:gap-4"
                    >
                        {/* Type dropdown */}
                        <select
                            disabled={isReadOnly}
                            value={timing.type}
                            onChange={(e) =>
                                updateTiming(
                                    idx,
                                    'type',
                                    e.target.value as unknown as TimingType
                                )
                            }
                            className="border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                        >
                            {timingTypesArray.map((tt) => (
                                <option key={tt} value={tt}>
                                    {tt}
                                </option>
                            ))}
                        </select>

                        <span className="text-sm">Every</span>

                        {/* Time value */}
                        <input
                            type="number"
                            min="1"
                            disabled={isReadOnly}
                            placeholder="Value"
                            className="w-16 border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                            value={timing.value ?? ''}
                            onChange={(e) => {
                                const num = Number(e.target.value)
                                if (num > 0) {
                                    updateTiming(idx, 'value', num)
                                } else {
                                    updateTiming(idx, 'value', undefined)
                                }
                            }}
                        />

                        {/* Unit dropdown */}
                        <select
                            disabled={isReadOnly}
                            value={timing.time ?? ''}
                            onChange={(e) =>
                                updateTiming(
                                    idx,
                                    'time',
                                    e.target.value === ''
                                        ? undefined
                                        : (Number(e.target.value) as Time)
                                )
                            }
                            className="border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                        >
                            <option value="">Select unit</option>
                            {timeUnitsArray.map((tu) => (
                                <option key={tu} value={tu}>
                                    {Time[tu]}
                                </option>
                            ))}
                        </select>

                        {!isReadOnly && (
                            <button
                                type="button"
                                onClick={() => removeTiming(idx)}
                                className="text-red-600 text-xl hover:text-red-800"
                                title="Remove timing"
                            >
                                🗑
                            </button>
                        )}
                    </div>
                ))}
            </section>
        </div>
    )
}

export default TimingsSection
