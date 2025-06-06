import { VitalName } from '../../types/Vital'

interface VitalsSelectorProps {
    selected: VitalName[]
    onChange: (updated: VitalName[]) => void
    isReadOnly?: boolean
}

// 1. Label mapping for display purposes
const VITAL_LABELS: Record<VitalName, string> = {
    [VitalName.HeartRate]: 'Heart Rate',
    [VitalName.SystolicBloodPressure]: 'Systolic Blood Pressure',
    [VitalName.DiastolicBloodPressure]: 'Diastolic Blood Pressure',
    [VitalName.Activity]: 'Activity',
    [VitalName.OxygenSaturation]: 'Oxygen Saturation',
    [VitalName.RespiratoryRate]: 'Respiration Rate',
    [VitalName.Temperature]: 'Temperature',
}

// 2. Dynamically generate ALL_VITALS
const ALL_VITALS: { label: string; name: VitalName }[] = Object.values(
    VitalName
).map((name) => ({
    name,
    label: VITAL_LABELS[name],
}))

const VitalsSelector = ({
    selected,
    onChange,
    isReadOnly = false,
}: VitalsSelectorProps) => {
    const toggleVital = (name: VitalName) => {
        if (isReadOnly) return
        onChange(
            selected.includes(name)
                ? selected.filter((n) => n !== name)
                : [...selected, name]
        )
    }

    return (
        <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Vitals</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_VITALS.map(({ name, label }) => {
                    const id = `vital-${name}`
                    return (
                        <div key={name} className="flex items-center space-x-2">
                            <input
                                id={id}
                                type="checkbox"
                                checked={selected.includes(name)}
                                onChange={() => toggleVital(name)}
                                disabled={isReadOnly}
                                className="form-checkbox h-5 w-5 text-green-600 disabled:opacity-50"
                            />
                            <label
                                htmlFor={id}
                                className={`text-sm ${
                                    isReadOnly
                                        ? 'text-gray-500'
                                        : 'cursor-pointer'
                                }`}
                            >
                                {label}
                            </label>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default VitalsSelector
