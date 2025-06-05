import { useContext, useState } from 'react'
import { PresetContext } from './PresetProvider'
import { Preset } from '../../types/Preset'
import DeletePreset from './DeletePreset'

const PresetDashboard = () => {
    const context = useContext(PresetContext)
    const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
    const [presetToDelete, setPresetToDelete] = useState<Preset | null>(null)

    if (!context) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                Preset context not found.
            </div>
        )
    }

    const { preset, setPreset } = context

    if (!preset || preset.length === 0) {
        return (
            <div
                className="h-[70vh] overflow-y-auto text-center text-gray-500 p-4"
                data-testid="preset-dashboard"
            >
                No presets available.
            </div>
        )
    }

    const handleEdit = (preset: Preset) => {
        console.log('Edit clicked for preset:', preset)
        // Replace with your actual navigation or modal logic
    }

    const handleDelete = (preset: Preset) => {
        setPresetToDelete(preset)
    }

    return (
        <div data-testid="preset-dashboard">
            {preset.map((presetItem) => {
                const isSelected = selectedPresetId === presetItem.id

                return (
                    <div
                        key={presetItem.id}
                        className={`flex items-center h-20 p-3 mb-2 cursor-pointer rounded-xsm transition-all duration-200 ${
                            isSelected
                                ? 'bg-secondary text-white'
                                : 'bg-background hover:bg-gray-100'
                        }`}
                        onClick={() =>
                            setSelectedPresetId(
                                isSelected ? null : presetItem.id || null
                            )
                        }
                    >
                        {/* Left: Preset Name */}
                        <div className="flex items-center gap-4 ml-4 w-1/3">
                            <span className="font-medium truncate text-lg">
                                {presetItem.name}
                            </span>
                        </div>

                        {/* Center: Carepath ID */}
                        <div
                            className={`italic w-1/3 ${
                                isSelected ? 'text-white' : 'text-gray-600'
                            }`}
                        >
                            {presetItem.carepathId}
                        </div>

                        {/* Right: Action Buttons */}
                        <div className="flex justify-end w-1/3 gap-3 pr-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleEdit(presetItem)
                                }}
                                className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(presetItem)
                                }}
                                className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )
            })}

            {presetToDelete && preset && (
                <DeletePreset
                    preset={presetToDelete}
                    presets={preset}
                    setPreset={setPreset}
                    onCancel={() => setPresetToDelete(null)}
                    onComplete={() => setPresetToDelete(null)}
                />
            )}
        </div>
    )
}

export default PresetDashboard