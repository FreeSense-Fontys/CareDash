import { Preset } from '../../types/Preset'
import PresetForm from './PresetForm'

interface EditPresetPageProps {
    presetToEdit: Preset | null
    mode: 'view' | 'edit' | 'add'
    onCancel: () => void
    onSaveComplete: (updatedPreset?: Preset) => void
}

const EditPresetPage = ({
    presetToEdit,
    mode,
    onCancel,
    onSaveComplete,
}: EditPresetPageProps) => {
    return (
        <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-md space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 capitalize">{mode} Preset</h2>
            <PresetForm
                presetToEdit={presetToEdit ?? undefined}
                mode={mode}
                onCancel={onCancel}
                onSaveComplete={onSaveComplete}
            />
        </div>
    )
}


export default EditPresetPage
