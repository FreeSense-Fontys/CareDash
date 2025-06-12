import EditVitalButton from './EditVitalButton'

interface EditVitalsSectionProps {
    vitals: {
        name: string
        selected: boolean
        abbreviation: string[]
    }[]
    toggleVital: (index: number) => void
}

const EditVitalsSection = ({ vitals, toggleVital }: EditVitalsSectionProps) => {
    return (
        <div className="grid grid-cols-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Vitals</h2>
            <div className="grid grid-cols-2 col-span-3 gap-4">
                {vitals.map((vital, index) => (
                    <EditVitalButton
                        vital={vital}
                        toggleVital={toggleVital}
                        index={index}
                        key={vital.name}
                    />
                ))}
            </div>
        </div>
    )
}

export default EditVitalsSection
