import { Preset } from '../../types/Preset'

interface DeletePresetProps {
    preset: Preset
    presets: Preset[]
    setPreset: React.Dispatch<React.SetStateAction<Preset[] | null>>
    onCancel: () => void
    onComplete: () => void
}

const DeletePreset = ({
    preset,
    presets,
    setPreset,
    onCancel,
    onComplete,
}: DeletePresetProps) => {
    const handleConfirm = () => {
        console.log('setPreset:', setPreset)

        const updated = presets ? presets.filter((p) => p.id !== preset.id) : []
        setPreset(updated)
        onComplete()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Confirm Delete
                </h2>
                <p className="text-gray-600 mb-6">
                    Do you want to delete{' '}
                    <span className="font-medium">{preset.name}</span>?
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        No
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeletePreset
