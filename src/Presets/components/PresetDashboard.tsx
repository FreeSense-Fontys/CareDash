import { useContext, useState } from 'react'
import { PresetContext } from './PresetProvider'
import { Preset } from '../../types/Preset'
import DeletePreset from './DeletePreset'
import EditPresetPage from './EditPresets'

const PresetDashboard = () => {
    const context = useContext(PresetContext)
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null)
    const [presetToDelete, setPresetToDelete] = useState<Preset | null>(null)
    const [editingPreset, setEditingPreset] = useState<Preset | null>(null)
    const [isAdding, setIsAdding] = useState(false)

    if (!context) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                Preset context not found.
            </div>
        )
    }

    const { preset, setPreset } = context

    const handleEdit = (preset: Preset) => {
        setEditingPreset(preset)
        setIsAdding(false)
    }

    const handleAddNew = () => {
        setEditingPreset(null)
        setIsAdding(true)
    }

    const closeForm = () => {
        setEditingPreset(null)
        setIsAdding(false)
        setSelectedPreset(null)
    }

    const handleSave = (savedPreset?: Preset) => {
        if (!savedPreset || !preset) {
            closeForm()
            return
        }

        let updatedPresets: Preset[]
        if (savedPreset.id && preset.some((p) => p.id === savedPreset.id)) {
            updatedPresets = preset.map((p) =>
                p.id === savedPreset.id ? savedPreset : p
            )
        } else {
            const newId = savedPreset.id || `preset-${Date.now()}`
            updatedPresets = [...preset, { ...savedPreset, id: newId }]
        }

        setPreset(updatedPresets)
        closeForm()
    }

    if (editingPreset) {
        return (
            <EditPresetPage
                presetToEdit={editingPreset}
                onCancel={closeForm}
                onSaveComplete={handleSave}
                mode={'edit'}
            />
        )
    }

    if (isAdding) {
        return (
            <EditPresetPage
                presetToEdit={null}
                onCancel={closeForm}
                onSaveComplete={handleSave}
                mode={'add'}
            />
        )
    }

    if (selectedPreset) {
        return (
            <EditPresetPage
                presetToEdit={selectedPreset}
                onCancel={closeForm}
                onSaveComplete={handleSave}
                mode={'view'}
            />
        )
    }

    if (!preset || preset.length === 0) {
        return (
            <div
                className="h-[70vh] overflow-y-auto text-center text-gray-500 p-4"
                data-testid="preset-dashboard"
            >
                No presets available.
                <div className="mt-4">
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Add New Preset
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div data-testid="preset-dashboard" className="text-gray-800">
            {preset.map((presetItem) => (
                <div
                    key={presetItem.id}
                    onClick={() => setSelectedPreset(presetItem)}
                    className={`flex items-center justify-between py-4 border-t border-gray-300 px-2 hover:bg-gray-100 cursor-pointer ${
                        selectedPreset === presetItem ? 'bg-gray-100' : ''
                    }`}
                >
                    <div className="text-xl font-medium">
                        {presetItem.name}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(presetItem)
                            }}
                            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
                            aria-label="Edit"
                        >
                            ✏️
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setPresetToDelete(presetItem)
                            }}
                            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
                            aria-label="Delete"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            ))}

            <div className="mt-6 text-right pr-2">
                <button
                    onClick={handleAddNew}
                    className="text-base text-blue-600 hover:underline"
                >
                    Add Template
                </button>
            </div>

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
