import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPencil } from '@fortawesome/free-solid-svg-icons'
import { PresetContext } from './PresetProvider'
import { Preset } from '../../types/Preset'
import DeletePreset from './DeletePreset'
import EditPresetPage from './EditPresets'
import exh from '../../Auth'

const PresetDashboard = () => {
    const context = useContext(PresetContext)
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null)
    const [presetToDelete, setPresetToDelete] = useState<Preset | null>(null)
    const [editingPreset, setEditingPreset] = useState<Preset | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [carepaths, setCarepaths] = useState<any[]>([])
    const [selectedCarepathId, setSelectedCarepathId] = useState<string>('')

    useEffect(() => {
        const fetchCarepaths = async () => {
            try {
                const response = await exh.data.documents.findAll('carepaths')
                setCarepaths(response as any)
            } catch (error) {
                console.error('Failed to fetch carepaths:', error)
            }
        }

        fetchCarepaths()
    }, [])

    if (!context) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                Preset context not found.
            </div>
        )
    }

    const { preset, setPreset } = context

    const getCarepathName = (id: string) => {
        const carepath = carepaths.find((cp) => cp.id === id)
        return carepath ? carepath.data.carepathName : 'Unknown Carepath'
    }

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

    const handleSave = async (savedPreset?: Preset) => {
        if (!savedPreset) {
            closeForm()
            return
        }

        try {
            if (savedPreset.id) {
                await exh.data.documents.update('wearable-preset', savedPreset.id, savedPreset)
            } else {
                const created = await exh.data.documents.create('wearable-preset', savedPreset)
                savedPreset.id = created.id
            }

            setPreset((prev) => {
                const existing = prev ?? []
                const exists = existing.some((p) => p.id === savedPreset.id)
                return exists
                    ? existing.map((p) => (p.id === savedPreset.id ? savedPreset : p))
                    : [...existing, savedPreset]
            })

            closeForm()
        } catch (error) {
            console.error('Failed to save preset:', error)
        }
    }

    const filteredPresets = selectedCarepathId
        ? preset?.filter((p) => p.carepathId === selectedCarepathId)
        : preset

    const renderPresetList = () => (
        <>
            <div className="flex justify-between items-center px-2 mb-4">
                <button
                    onClick={handleAddNew}
                    className="text-base text-blue-600 hover:underline"
                >
                    Add Template
                </button>
                <select
                    value={selectedCarepathId}
                    onChange={(e) => setSelectedCarepathId(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                    <option value="">All Carepaths</option>
                    {carepaths.map((cp) => (
                        <option key={cp.id} value={cp.id}>
                            {cp.data.carepathName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
                {filteredPresets?.map((presetItem) => (
                    <div
                        key={presetItem.id}
                        onClick={() => setSelectedPreset(presetItem)}
                        className={`flex items-center justify-between py-4 border-t border-gray-300 px-2 hover:bg-gray-100 cursor-pointer ${
                            selectedPreset?.id === presetItem.id ? 'bg-gray-100' : ''
                        }`}
                    >
                        <div>
                            <div className="text-xl font-medium">{presetItem.name}</div>
                            <div className="text-sm text-gray-600">
                                Carepath: {getCarepathName(presetItem.carepathId)}
                            </div>
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
                                <FontAwesomeIcon icon={faPencil} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setPresetToDelete(presetItem)
                                }}
                                className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
                                aria-label="Delete"
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )

    return (
        <div data-testid="preset-dashboard" className="text-gray-800">
            {editingPreset ? (
                <EditPresetPage
                    presetToEdit={editingPreset}
                    onCancel={closeForm}
                    onSaveComplete={handleSave}
                    mode="edit"
                />
            ) : isAdding ? (
                <EditPresetPage
                    presetToEdit={null}
                    onCancel={closeForm}
                    onSaveComplete={handleSave}
                    mode="add"
                />
            ) : selectedPreset ? (
                <EditPresetPage
                    presetToEdit={selectedPreset}
                    onCancel={closeForm}
                    onSaveComplete={handleSave}
                    mode="view"
                />
            ) : preset?.length ? (
                renderPresetList()
            ) : (
                <div className="h-[70vh] overflow-y-auto text-center text-gray-500 p-4">
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
            )}

            {presetToDelete && (
                <DeletePreset
                    preset={presetToDelete}
                    presets={preset as Preset[]}
                    setPreset={setPreset}
                    onCancel={() => setPresetToDelete(null)}
                    onComplete={() => setPresetToDelete(null)}
                />
            )}
        </div>
    )
}

export default PresetDashboard
