import { Check } from 'lucide-react'

interface EditVitalButtonProps {
    vital: {
        name: string
        selected: boolean
        abbreviation: string[]
    }
    toggleVital: (index: number) => void
    index: number
}
const EditVitalButton = ({
    vital,
    toggleVital,
    index,
}: EditVitalButtonProps) => {
    return (
        <button
            key={vital.name}
            type="button"
            className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => toggleVital(index)}
            tabIndex={0}
            aria-pressed={vital.selected}
        >
            <span
                className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                    vital.selected
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300'
                }`}
            >
                {vital.selected && <Check size={12} />}
            </span>
            <span className="text-gray-700">
                {vital.name} [{vital.abbreviation.join(', ')}]
            </span>
        </button>
    )
}

export default EditVitalButton
