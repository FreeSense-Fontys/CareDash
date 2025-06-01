import { useEffect, useState } from 'react'
import EditConfigurationPage from './EditConfiguration'
import { Patient, rqlBuilder } from '@extrahorizon/javascript-sdk'
import exh from '../../Auth'

interface ConfigData {
    vitals: string[]
    timing: string
    alerts: string[]
}

// Mock configuration data for different carepaths
const mockConfigurations: Record<string, ConfigData> = {
    COPD: {
        vitals: [
            'Peak Flow Rate (L/min)',
            'Oxygen Saturation (%)',
            'Heart Rate (bpm)',
            'Blood Pressure (mmHg)',
            'Respiratory Rate (breaths/min)',
            'Temperature (°C)',
        ],
        timing: 'Daily measurements at 8:00 AM and 6:00 PM',
        alerts: [
            'Peak flow < 80% of personal best',
            'Oxygen saturation < 90%',
            'Heart rate > 100 bpm at rest',
            'Respiratory rate > 20 breaths/min',
            'Temperature > 38°C or < 36C',
            'Respiratory rate > 20 breaths/min',
        ],
    },
    Diabetes: {
        vitals: [
            'Blood Glucose (mg/dL)',
            'Blood Pressure (mmHg)',
            'Weight (kg)',
            'Heart Rate (bpm)',
            'Temperature (°C)',
            'HbA1c (%) - Monthly',
        ],
        timing: 'Blood glucose: Before meals and bedtime. Other vitals: Daily at 7 AM',
        alerts: [
            'Blood glucose < 70 mg/dL or > 250 mg/dL',
            'Blood pressure > 140/90 mmHg',
            'Weight change > 2kg in 24 hours',
            'Heart rate > 100 bpm at rest',
            'Temperature > 38°C',
        ],
    },
}

interface Alert {
    id?: string
    data: {
        vital: string
        alertType: 'Above' | 'Below'
        threshold: number
        wearableId: string
        patientId: string
        carepathId: string
    }
}

interface ConfigurationItemsProps {
    activeCarepath: string
    currentPatient: Patient
}

const ConfigurationItems = ({
    activeCarepath,
    currentPatient,
}: ConfigurationItemsProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [alerts, setAlerts] = useState<Alert[]>([])

    const currentConfig = activeCarepath
        ? mockConfigurations[activeCarepath]
        : null

    const handleEditConfiguration = () => {
        setIsEditing(true)
    }

    useEffect(() => {
        const fetchAlerts = async () => {
            const alerts = await exh.data.documents.find('alert', {
                rql: rqlBuilder()
                    .eq('data.patientId', currentPatient.id ?? '')
                    .build(),
            })
            setAlerts(alerts.data)
        }
        fetchAlerts()
    }, [currentPatient])

    // Show edit page if in editing mode
    if (isEditing && currentConfig) {
        return (
            <EditConfigurationPage
                activeCarepath={activeCarepath}
                currentConfig={currentConfig}
                alerts={alerts}
                onCancel={() => setIsEditing(false)}
                patient={currentPatient}
            />
        )
    }

    // Helper function to split array into columns
    const splitIntoTwoColumns = (items: string[]) => {
        const left: string[] = []
        const right: string[] = []
        items.forEach((item, idx) => {
            if (idx % 2 === 0) {
                left.push(item) // Even indices go left
            } else {
                right.push(item) // Odd indices go right
            }
        })
        return [left, right]
    }

    // Show message if no configuration found for the carepath
    if (!currentConfig) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>No configuration found for {activeCarepath}</p>
                <p className="text-sm mt-2">
                    No configuration data. Please configure it.
                </p>
            </div>
        )
    }

    const maxItems = 6
    const [vitalLeft, vitalRight] = splitIntoTwoColumns(
        currentConfig.vitals.slice(0, maxItems)
    )
    const [alertLeft, alertRight] = splitIntoTwoColumns(
        alerts
            .map((alert) => {
                const message = `${alert.data.vital} ${
                    alert.data.alertType === 'Above' ? '>' : '<'
                } ${alert.data.threshold}`
                return message
            })
            .slice(0, maxItems)
    )

    return (
        <div>
            <div className="h-[59vh] overflow-y-auto">
                {/* Vitals Section */}
                <div className="grid grid-cols-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Vitals
                    </h2>
                    <div className="col-span-3 flex gap-6">
                        {[vitalLeft, vitalRight].map((column, columnIndex) => (
                            <div key={columnIndex} className="flex-1 space-y-2">
                                {column.map((vital, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start p-2 bg-blue-50 border-l-4 border-blue-500 rounded"
                                    >
                                        <p className="text-grey-700">{vital}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timing Section */}
                <div className="grid grid-cols-4 gap-4 border-t pt-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Timing
                    </h2>
                    <div className="col-span-3 flex gap-6">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-start p-2 bg-gray-100 border-l-4 border-gray-500 rounded">
                                <p className="text-grey-700">
                                    {currentConfig.timing}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alerts Section */}
                <div className="grid grid-cols-4 gap-4 border-t pt-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Alerts
                    </h2>
                    <div className="col-span-3 flex gap-6">
                        {[alertLeft, alertRight].map((column, columnIndex) => (
                            <div key={columnIndex} className="flex-1 space-y-2">
                                {column.map((alert, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start p-2 bg-red-50 border-l-4 border-red-400 rounded"
                                    >
                                        <p className="text-red-700 ">{alert}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                {/* Edit Button */}
                <div className="flex justify-end">
                    <button
                        className="bg-secondary text-white text-lg px-7 py-2 rounded mr-5 hover:bg-accent"
                        onClick={handleEditConfiguration}
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfigurationItems
