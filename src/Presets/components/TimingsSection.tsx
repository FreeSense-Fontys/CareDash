import { Timing } from '../../types/Timing'
import {
    TIME_ENUM_TO_STRING,
    TIME_STRING_TO_ENUM,
    TIMING_TYPE_ENUM_TO_STRING,
    TIMING_TYPE_STRING_TO_ENUM,
} from '../../types/utils/Timing.utils'

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
    const timingTypes = Object.keys(TIMING_TYPE_STRING_TO_ENUM)
    const timeUnits = Object.keys(TIME_STRING_TO_ENUM)
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
                        {/* Type selector */}
                        <select
                            disabled={isReadOnly}
                            value={TIMING_TYPE_ENUM_TO_STRING[timing.type]}
                            onChange={(e) =>
                                updateTiming(
                                    idx,
                                    'type',
                                    TIMING_TYPE_STRING_TO_ENUM[e.target.value]
                                )
                            }
                            className="border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                        >
                            {timingTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>

                        <span className="text-sm">Every</span>

                        {/* Value input */}
                        <input
                            type="number"
                            min="1"
                            disabled={isReadOnly}
                            placeholder="Value"
                            className="w-16 border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                            value={timing.value ?? ''}
                            onChange={(e) => {
                                const val = Number(e.target.value)
                                updateTiming(
                                    idx,
                                    'value',
                                    val > 0 ? val : undefined
                                )
                            }}
                        />

                        {/* Unit selector */}
                        <select
                            disabled={isReadOnly}
                            value={
                                timing.time !== undefined
                                    ? TIME_ENUM_TO_STRING[timing.time]
                                    : ''
                            }
                            onChange={(e) =>
                                updateTiming(
                                    idx,
                                    'time',
                                    e.target.value === ''
                                        ? undefined
                                        : TIME_STRING_TO_ENUM[e.target.value]
                                )
                            }
                            className="border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                        >
                            <option value="">Select unit</option>
                            {timeUnits.map((unit) => (
                                <option key={unit} value={unit}>
                                    {unit}
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
