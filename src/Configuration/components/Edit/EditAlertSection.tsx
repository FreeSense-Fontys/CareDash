import { Alert } from '../../../types/Alert'
import { Plus } from 'lucide-react'
import EditAlertColumn from './EditAlertColumn'

interface EditAlertSectionProps {
    alertLeft: Alert[]
    alertRight: Alert[]
    setTempAlerts: (alerts: Alert[]) => void
    tempAlerts: Alert[]
    deleteAlertConfig: (id: string) => void
    addAlert: () => void
}

const EditAlertSection = ({
    alertLeft,
    alertRight,
    setTempAlerts,
    tempAlerts,
    deleteAlertConfig,
    addAlert,
}: EditAlertSectionProps) => {
    return (
        <>
            <div className="grid grid-cols-4 gap-4 border-t pt-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Alerts</h2>
                <div className="col-span-3 flex gap-6">
                    {[alertLeft, alertRight].map((column, columnIndex) => {
                        const columnKey = columnIndex === 0 ? 'left' : 'right'
                        return (
                            <div key={columnKey} className="flex-1 space-y-2">
                                {column.map((config) => (
                                    <EditAlertColumn
                                        config={config}
                                        tempAlerts={tempAlerts}
                                        setTempAlerts={setTempAlerts}
                                        deleteAlertConfig={deleteAlertConfig}
                                        columnIndex={columnIndex}
                                        key={config.id || columnKey}
                                    />
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={addAlert}
                    className="mt-4 text-blue-500 hover:text-blue-700 font-medium flex items-center cursor-pointer"
                >
                    <Plus size={16} />
                    Add Alert
                </button>
            </div>
        </>
    )
}

export default EditAlertSection
