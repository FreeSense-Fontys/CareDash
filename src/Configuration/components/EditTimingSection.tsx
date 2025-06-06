interface EditTimingSectionProps {
    timingConfig: {
        mode: string
        tInterval: number
        unit: string
    }
    updateTimingConfig: (key: string, value: string | number) => void
}
const EditTimingSection = ({
    timingConfig,
    updateTimingConfig,
}: EditTimingSectionProps) => {
    return (
        <div className="grid grid-cols-4 gap-4 border-t pt-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Timing</h2>
            <div className="flex items-center gap-3">
                <select
                    value={timingConfig.mode}
                    onChange={(e) =>
                        updateTimingConfig('interval', e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Interval">Interval</option>
                </select>
                <span className="text-gray-600">Every</span>
                <input
                    type="number"
                    value={timingConfig.tInterval}
                    onChange={(e) =>
                        updateTimingConfig(
                            'tInterval',
                            parseInt(e.target.value) || 1
                        )
                    }
                    className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                />
                <select
                    value={timingConfig.unit}
                    onChange={(e) => updateTimingConfig('unit', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Minutes">Minutes</option>
                </select>
            </div>
        </div>
    )
}

export default EditTimingSection
