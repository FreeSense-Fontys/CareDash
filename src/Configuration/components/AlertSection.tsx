import { Alert } from '../../types/Alert'
import { Trash2, Plus } from 'lucide-react'

interface AlertSectionProps {
    alertLeft: Alert[]
    alertRight: Alert[]
    setTempAlerts: (alerts: Alert[]) => void
    tempAlerts: Alert[]
    deleteAlertConfig: (id: string) => void
    addAlert: () => void
}

const AlertSection = ({
    alertLeft,
    alertRight,
    setTempAlerts,
    tempAlerts,
    deleteAlertConfig,
    addAlert,
}: AlertSectionProps) => {
    const vitalAbreviations = ['HR', 'SBP', 'DBP', 'SpO2', 'RR', 'ACT', 'T']

    return (
        <div className="grid grid-cols-4 gap-4 border-t pt-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Alerts</h2>
            <div className="col-span-3 flex gap-6">
                {[alertLeft, alertRight].map((column, columnIndex) => (
                    <div key={columnIndex} className="flex-1 space-y-2">
                        {column.map((config) => (
                            <div
                                key={config.id || columnIndex}
                                className="flex items-center gap-3"
                            >
                                <select
                                    value={config.data.vital}
                                    onChange={(e) =>
                                        setTempAlerts(
                                            tempAlerts.map((alert) => {
                                                if (alert.id === config.id) {
                                                    return {
                                                        ...alert,
                                                        data: {
                                                            ...alert.data,
                                                            vital: e.target
                                                                .value,
                                                        },
                                                    }
                                                }
                                                return alert
                                            })
                                        )
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {vitalAbreviations.map((vital) => {
                                        return (
                                            <option key={vital} value={vital}>
                                                {vital}
                                            </option>
                                        )
                                    })}
                                </select>

                                <select
                                    value={
                                        config.data.alertType == 'Above'
                                            ? '>'
                                            : '<'
                                    }
                                    onChange={(e) =>
                                        setTempAlerts(
                                            tempAlerts.map((alert) => {
                                                if (alert.id === config.id) {
                                                    return {
                                                        ...alert,
                                                        data: {
                                                            ...alert.data,
                                                            alertType:
                                                                e.target
                                                                    .value ===
                                                                '>'
                                                                    ? 'Above'
                                                                    : 'Below',
                                                        },
                                                    }
                                                }
                                                return alert
                                            })
                                        )
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="<">&lt;</option>
                                    <option value=">">&gt;</option>
                                </select>

                                <input
                                    type="text"
                                    value={config.data.threshold}
                                    onChange={(e) =>
                                        setTempAlerts(
                                            tempAlerts.map((alert) => {
                                                if (alert.id === config.id) {
                                                    return {
                                                        ...alert,
                                                        data: {
                                                            ...alert.data,
                                                            threshold:
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                ) || 0,
                                                        },
                                                    }
                                                }
                                                return alert
                                            })
                                        )
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Value"
                                />

                                <button
                                    onClick={() => deleteAlertConfig(config.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}

                        {columnIndex === 1 && (
                            <button
                                onClick={addAlert}
                                className="mt-4 text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1 pb-1 pl-80"
                            >
                                <Plus size={16} />
                                Add Alert
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AlertSection
