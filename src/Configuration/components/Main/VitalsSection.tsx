interface VitalsSectionProps {
    vitalLeft: string[]
    vitalRight: string[]
}

const VitalsSection = ({ vitalLeft, vitalRight }: VitalsSectionProps) => {
    return (
        <div className="grid grid-cols-4 gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Vitals</h2>
            <div className="col-span-3 flex gap-6">
                {[vitalLeft, vitalRight].map((column, columnIndex) => (
                    <div key={columnIndex} className="flex-1 space-y-2">
                        {column.map((vital, index) => (
                            <div
                                key={index}
                                className="flex items-start p-2 bg-blue-50 border-l-4 border-blue-500 rounded"
                            >
                                <p className="text-grey-700">{vital}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VitalsSection
