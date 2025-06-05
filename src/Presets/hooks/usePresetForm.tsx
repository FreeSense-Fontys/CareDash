import { useEffect, useState } from 'react'
import { Preset } from '../../types/Preset'
import { VitalName } from '../../types/Vital'
import { Timing, TimingType } from '../../types/Timing'
import { Alert } from '../../types/Alert'

export function usePresetForm(
    presetToEdit: Preset | undefined,
    onSaveComplete: (p: Preset) => void,
    mode: 'view' | 'edit' | 'add'
) {
    const [name, setName] = useState('')
    const [carepathId, setCarepathId] = useState('')
    const [vitals, setvitalsState] = useState<VitalName[]>([])
    const [timings, setTimings] = useState<Timing[]>([])
    const [alerts, setAlerts] = useState<Alert[]>([])

    useEffect(() => {
        if (presetToEdit) {
            setName(presetToEdit.name)
            setCarepathId(presetToEdit.carepathId)
            setvitalsState(presetToEdit.vitals)
            setTimings(presetToEdit.timings)
            setAlerts(presetToEdit.alerts)
        }
    }, [presetToEdit])

    const isReadOnly = mode === 'view'
    const isFormValid = name.trim() !== '' && carepathId.trim() !== ''

    function handleSave() {
        if (!isFormValid) {
            alert('Name and Carepath ID are required.')
            return
        }

        const updatedPreset: Preset = {
            id: presetToEdit?.id || `preset-${Date.now()}`,
            name: name.trim(),
            carepathId: carepathId.trim(),
            vitals,
            timings,
            alerts,
        }

        onSaveComplete(updatedPreset)
    }

    // --- Vitals ---
    const setVitals = (newVitals: VitalName[]) => {
        setvitalsState(newVitals)
    }

    // --- Timings ---
    const addTiming = () => {
        setTimings([
            ...timings,
            {
                id: crypto.randomUUID(),
                type: TimingType.Interval,
                value: 0,
                time: undefined,
            },
        ])
    }

    const updateTiming = (idx: number, key: keyof Timing, value: any) => {
        const updated = [...timings]
        updated[idx] = { ...updated[idx], [key]: value }
        setTimings(updated)
    }

    const removeTiming = (idx: number) => {
        const updated = [...timings]
        updated.splice(idx, 1)
        setTimings(updated)
    }

    // --- Alerts ---
    const addAlert = () => {
        setAlerts([
            ...alerts,
            {
                id: crypto.randomUUID(),
                data: {
                    vital: VitalName.HeartRate,
                    alertType: 'Above',
                    threshold: 100,
                    wearableId: '',
                    carepathId: carepathId || '',
                },
            },
        ])
    }

    const updateAlert = (idx: number, key: keyof Alert['data'], value: any) => {
        const updated = [...alerts]
        updated[idx] = {
            ...updated[idx],
            data: {
                ...updated[idx].data,
                [key]: value,
            },
        }
        setAlerts(updated)
    }

    const removeAlert = (idx: number) => {
        const updated = [...alerts]
        updated.splice(idx, 1)
        setAlerts(updated)
    }

    return {
        name,
        setName,
        carepathId,
        setCarepathId,
        vitals,
        timings,
        alerts,
        isReadOnly,
        isFormValid,
        handleSave,
        setVitals,
        timingHooks: { addTiming, updateTiming, removeTiming },
        alertHooks: { addAlert, updateAlert, removeAlert },
    }
}
