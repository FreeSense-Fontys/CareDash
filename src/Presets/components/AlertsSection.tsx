import { PresetAlert } from '../../types/Preset'

interface AlertsSectionProps {
    alerts: PresetAlert[]
    isReadOnly: boolean
    addAlert: () => void
    updateAlert: <K extends keyof PresetAlert>(idx: number, key: K, value: PresetAlert[K]) => void
    removeAlert: (idx: number) => void
}

const AlertsSection = ({
    alerts,
    isReadOnly,
    addAlert,
    updateAlert,
    removeAlert,
}: AlertsSectionProps) => {
    const vitalOptions: PresetAlert['vitals'][] = ['HR', 'SBP', 'DBP', 'SPO2', 'RR', 'ACT', 'T']

    return (
        <div className="border-t pt-4">
            <section className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Alerts</h3>
                    {!isReadOnly && (
                        <button
                            type="button"
                            onClick={addAlert}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            + Add Alert
                        </button>
                    )}
                </div>

                {alerts.length === 0 ? (
                    <p className="text-gray-500 italic">No alerts configured.</p>
                ) : (
                    <div className="space-y-2">
                        {alerts.map((alert, idx) => (
                            <div
                                key={idx}
                                className="flex flex-wrap items-center gap-2 md:gap-4"
                            >
                                {/* Vital Name */}
                                <select
                                    disabled={isReadOnly}
                                    value={alert.vitals}
                                    onChange={(e) =>
                                        updateAlert(idx, 'vitals', e.target.value as PresetAlert['vitals'])
                                    }
                                    className="border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                                >
                                    {vitalOptions.map((vn) => (
                                        <option key={vn} value={vn}>
                                            {vn}
                                        </option>
                                    ))}
                                </select>

                                {/* Condition */}
                                <select
                                    disabled={isReadOnly}
                                    value={alert.alertType}
                                    onChange={(e) =>
                                        updateAlert(idx, 'alertType', e.target.value as 'Above' | 'Below')
                                    }
                                    className="border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                                >
                                    <option value="Above">{'>'}</option>
                                    <option value="Below">{'<'}</option>
                                </select>

                                {/* Threshold */}
                                <input
                                    type="number"
                                    min={1}
                                    disabled={isReadOnly}
                                    value={alert.threshold}
                                    onChange={(e) =>
                                        updateAlert(idx, 'threshold', Math.max(1, Number(e.target.value)))
                                    }
                                    className="border rounded px-2 py-1 w-20 text-sm disabled:bg-gray-100"
                                    placeholder="Value"
                                />

                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        onClick={() => removeAlert(idx)}
                                        className="text-red-600 text-xl hover:text-red-800"
                                        title="Remove alert"
                                    >
                                        🗑
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default AlertsSection
