import { VitalName } from '../../types/Vital'

interface VitalsSelectorProps {
  selected: VitalName[]
  onChange: (updated: VitalName[]) => void
  isReadOnly?: boolean
}

const ALL_VITALS: { label: string; name: VitalName }[] = [
  { label: 'Heart Rate', name: VitalName.HeartRate },
  { label: 'Systolic Blood Pressure', name: VitalName.SystolicBloodPressure }, 
  { label: 'Diastolic Blood Preasure', name: VitalName.DiastolicBloodPressure},
  { label: 'Activity', name: VitalName.Activity },
  { label: 'Oxygen Saturation', name: VitalName.OxygenSaturation },
  { label: 'Respiration Rate', name: VitalName.RespiratoryRate },
  { label: 'Temperature', name: VitalName.Temperature },
]

const VitalsSelector = ({ selected, onChange, isReadOnly = false }: VitalsSelectorProps) => {
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
                  isReadOnly ? 'text-gray-500' : 'cursor-pointer'
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