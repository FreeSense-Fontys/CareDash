import { useEffect, useState } from 'react'
import { Preset, PresetAlert, PresetTiming } from '../../types/Preset'
import { VitalName } from '../../types/Vital'

export function usePresetForm(
    presetToEdit: Preset | undefined,
    onSaveComplete: (p: Preset) => void,
    mode: 'view' | 'edit' | 'add'
) {
    const [name, setName] = useState('')
    const [carepathId, setCarepathId] = useState('')
    const [vitals, setVitals] = useState<VitalName[]>([])
    const [timings, setTimings] = useState<PresetTiming[]>([])
    const [alerts, setAlerts] = useState<PresetAlert[]>([])

    const isReadOnly = mode === 'view'
    const isFormValid = name.trim() !== '' && carepathId.trim() !== ''

    // Populate form if editing/viewing an existing preset
    useEffect(() => {
        if (!presetToEdit) return
        setName(presetToEdit.name)
        setCarepathId(presetToEdit.carepathId)
        setVitals(presetToEdit.vitals)
        setTimings(presetToEdit.timings)
        setAlerts(presetToEdit.alerts)
    }, [presetToEdit])

    const handleSave = () => {
        if (!isFormValid) {
            alert('Name and Carepath ID are required.')
            return
        }

        const newPreset: Preset = {
            id: presetToEdit?.id,
            name: name.trim(),
            carepathId: carepathId.trim(),
            vitals,
            timings,
            alerts,
        }

        onSaveComplete(newPreset)
    }

    // --- Timings ---
    const addTiming = () => {
        const newTiming: PresetTiming = {
            value: 0,
            timingType: 'Interval',
            time: 'Minutes',
        }
        setTimings((prev) => [...prev, newTiming])
    }

    const updateTiming = <K extends keyof PresetTiming>(
        index: number,
        key: K,
        value: PresetTiming[K]
    ) => {
        setTimings((prev) =>
            prev.map((timing, i) =>
                i === index ? { ...timing, [key]: value } : timing
            )
        )
    }

    const removeTiming = (index: number) => {
        setTimings((prev) => prev.filter((_, i) => i !== index))
    }

    // --- Alerts ---
    const addAlert = () => {
        const newAlert: PresetAlert = {
            vitals: 'HR',
            threshold: 100,
            alertType: 'Above',
        }
        setAlerts((prev) => [...prev, newAlert])
    }

    const updateAlert = <K extends keyof PresetAlert>(
        index: number,
        key: K,
        value: PresetAlert[K]
    ) => {
        setAlerts((prev) =>
            prev.map((alert, i) =>
                i === index ? { ...alert, [key]: value } : alert
            )
        )
    }

    const removeAlert = (index: number) => {
        setAlerts((prev) => prev.filter((_, i) => i !== index))
    }

    return {
        name,
        setName,
        carepathId,
        setCarepathId,
        vitals,
        setVitals,
        timings,
        alerts,
        isReadOnly,
        isFormValid,
        handleSave,
        timingHooks: { addTiming, updateTiming, removeTiming },
        alertHooks: { addAlert, updateAlert, removeAlert },
    }
}
