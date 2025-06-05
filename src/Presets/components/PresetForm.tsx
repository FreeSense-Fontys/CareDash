import { Preset } from '../../types/Preset'
import { usePresetForm } from '../hooks/usePresetForm'
import AlertsSection from './AlertsSection'
import TimingsSection from './TimingsSection'
import VitalsSelector from './VitalsSection'

interface PresetFormProps {
    presetToEdit?: Preset
    mode: 'view' | 'edit' | 'add'
    onCancel: () => void
    onSaveComplete: () => void
}

const PresetForm = ({
    presetToEdit,
    mode,
    onCancel,
    onSaveComplete,
}: PresetFormProps) => {
    const {
        name,
        carepathId,
        vitals,
        timings,
        alerts,
        setName,
        setCarepathId,
        isReadOnly,
        isFormValid,
        handleSave,
        setVitals,
        ...handlers
    } = usePresetForm(presetToEdit, onSaveComplete, mode)

    return (
        <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-1 font-medium text-lg text-gray-700">
                        Name*
                    </label>
                    <input
                        disabled={isReadOnly}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter preset name"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-lg text-gray-700">
                        Carepath ID*
                    </label>
                    <input
                        disabled={isReadOnly}
                        type="text"
                        value={carepathId}
                        onChange={(e) => setCarepathId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter carepath ID"
                    />
                </div>
            </div>

            <VitalsSelector
                selected={vitals}
                onChange={setVitals}
                isReadOnly={isReadOnly}
            />

            <TimingsSection
                timings={timings}
                isReadOnly={isReadOnly}
                {...handlers.timingHooks}
            />

            <AlertsSection
                alerts={alerts}
                carepathId={carepathId}
                isReadOnly={isReadOnly}
                {...handlers.alertHooks}
            />

            <div className="flex justify-end gap-4 pt-4">
                <button
                    onClick={onCancel}
                    type="button"
                    className="px-6 py-2 text-lg rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100"
                >
                    Cancel
                </button>
                {mode !== 'view' && (
                    <button
                        onClick={handleSave}
                        type="button"
                        disabled={!isFormValid}
                        className={`px-6 py-2 text-lg rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition ${
                            !isFormValid && 'opacity-50 cursor-not-allowed'
                        }`}
                    >
                        Save
                    </button>
                )}
            </div>
        </form>
    )
}

export default PresetForm
