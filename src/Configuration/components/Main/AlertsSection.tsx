interface AlertsSectionProps {
    alertLeft: string[]
    alertRight: string[]
}

const AlertsSection = ({ alertLeft, alertRight }: AlertsSectionProps) => {
    return (
        <div className="grid grid-cols-4 gap-4 border-t pt-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Alerts</h2>
            <div className="col-span-3 flex gap-6">
                {[alertLeft, alertRight].map((column, columnIndex) => (
                    <div key={columnIndex} className="flex-1 space-y-2">
                        {column.map((alert, index) => (
                            <div
                                key={index}
                                className="flex items-start p-2 bg-red-50 border-l-4 border-red-400 rounded"
                            >
                                <p className="text-red-700 ">{alert}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AlertsSection
