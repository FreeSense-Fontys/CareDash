import { Trash2 } from 'lucide-react'

interface EditAlertColumnProps {
    config: {
        id: string
        data: {
            vital: string
            alertType: 'Above' | 'Below'
            threshold: number
        }
    }
    tempAlerts: any[]
    setTempAlerts: (alerts: any[]) => void
    deleteAlertConfig: (id: string) => void
    columnIndex: number
}

const EditAlertColumn = ({
    config,
    tempAlerts,
    setTempAlerts,
    deleteAlertConfig,
    columnIndex,
}: EditAlertColumnProps) => {
    const vitalAbreviations = ['HR', 'SBP', 'DBP', 'SpO2', 'RR', 'ACT', 'T']

    const changeTempAlertsVitals = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setTempAlerts(
            tempAlerts.map((alert) => {
                if (alert.id === config.id) {
                    return {
                        ...alert,
                        data: {
                            ...alert.data,
                            vital: e.target.value,
                        },
                    }
                }
                return alert
            })
        )
    }

    const changeTempAlertsAlertType = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setTempAlerts(
            tempAlerts.map((alert) => {
                if (alert.id === config.id) {
                    return {
                        ...alert,
                        data: {
                            ...alert.data,
                            alertType:
                                e.target.value === '>' ? 'Above' : 'Below',
                        },
                    }
                }
                return alert
            })
        )
    }

    const changeTempAlertThershold = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTempAlerts(
            tempAlerts.map((alert) => {
                if (alert.id === config.id) {
                    return {
                        ...alert,
                        data: {
                            ...alert.data,
                            threshold: parseFloat(e.target.value) || 0,
                        },
                    }
                }
                return alert
            })
        )
    }
    return (
        <div key={config.id || columnIndex} className="flex items-center gap-3">
            <select
                value={config.data.vital}
                onChange={(e) => changeTempAlertsVitals(e)}
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
                value={config.data.alertType == 'Above' ? '>' : '<'}
                onChange={(e) => changeTempAlertsAlertType(e)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="<">&lt;</option>
                <option value=">">&gt;</option>
            </select>

            <input
                type="text"
                value={config.data.threshold}
                onChange={(e) => changeTempAlertThershold(e)}
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
    )
}
export default EditAlertColumn
