import { Alert } from '../../types/Alert'
import { VitalName } from '../../types/Vital'

interface AlertsSectionProps {
    alerts: Alert[]
    carepathId: string
    isReadOnly: boolean
    addAlert: () => void
    updateAlert: (idx: number, key: keyof Alert['data'], value: any) => void
    removeAlert: (idx: number) => void
}

const AlertsSection = ({
    alerts,
    isReadOnly,
    addAlert,
    updateAlert,
    removeAlert,
}: AlertsSectionProps) => {
    const vitalNamesArray = Object.values(VitalName)

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

                {alerts.length === 0 && (
                    <p className="text-gray-500 italic">
                        No alerts configured.
                    </p>
                )}

                <div className="space-y-2">
                    {alerts.map((alert, idx) => (
                        <div
                            key={alert.id}
                            className="flex flex-wrap items-center gap-2 md:gap-4"
                        >
                            {/* Vital Name */}
                            <select
                                disabled={isReadOnly}
                                value={alert.data.vital}
                                onChange={(e) =>
                                    updateAlert(idx, 'vital', e.target.value)
                                }
                                className="border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                            >
                                {vitalNamesArray.map((vn) => (
                                    <option key={vn} value={vn}>
                                        {vn}
                                    </option>
                                ))}
                            </select>

                            {/* Condition */}
                            <select
                                disabled={isReadOnly}
                                value={alert.data.alertType}
                                onChange={(e) =>
                                    updateAlert(
                                        idx,
                                        'alertType',
                                        e.target.value as 'Above' | 'Below'
                                    )
                                }
                                className="border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                            >
                                <option value="Above">{'>'}</option>
                                <option value="Below">{'<'}</option>
                            </select>

                            {/* Threshold */}
                            <input
                                disabled={isReadOnly}
                                type="number"
                                value={alert.data.threshold}
                                onChange={(e) =>
                                    updateAlert(
                                        idx,
                                        'threshold',
                                        +e.target.value
                                    )
                                }
                                className="border rounded px-2 py-1 w-20 text-sm disabled:bg-gray-100"
                                placeholder="Value"
                            />

                            {!isReadOnly && (
                                <button
                                    onClick={() => removeAlert(idx)}
                                    className="text-red-600 text-xl hover:text-red-800"
                                    type="button"
                                    title="Remove alert"
                                >
                                    🗑
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default AlertsSection
