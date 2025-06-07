import { PresetTiming } from '../../types/Preset'

interface TimingsSectionProps {
    timings: PresetTiming[]
    isReadOnly: boolean
    addTiming: () => void
    updateTiming: <K extends keyof PresetTiming>(idx: number, key: K, value: PresetTiming[K]) => void
    removeTiming: (idx: number) => void
}

const TimingsSection = ({
    timings,
    isReadOnly,
    addTiming,
    updateTiming,
    removeTiming,
}: TimingsSectionProps) => {
    const timeUnits: PresetTiming['time'][] = ['Seconds', 'Minutes', 'Hours', 'Days']

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
                    <p className="text-gray-500 italic">No timings configured.</p>
                )}

                {timings.map((timing, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 md:gap-4">
                        <span className="text-sm">Every</span>

                        {/* Value input */}
                        <input
                            type="number"
                            min="1"
                            disabled={isReadOnly}
                            placeholder="Value"
                            className="w-16 border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                            value={timing.value}
                            onChange={(e) =>
                                updateTiming(idx, 'value', Math.max(1, Number(e.target.value)))
                            }
                        />

                        {/* Unit selector */}
                        <select
                            disabled={isReadOnly}
                            value={timing.time}
                            onChange={(e) =>
                                updateTiming(idx, 'time', e.target.value as PresetTiming['time'])
                            }
                            className="border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                        >
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
