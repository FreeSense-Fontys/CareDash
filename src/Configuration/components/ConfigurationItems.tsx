import { useEffect, useState } from 'react'
import EditConfigurationPage from './EditConfiguration'
import { rqlBuilder } from '@extrahorizon/javascript-sdk'
import exh from '../../Auth'
import { Alert } from '../../types/Alert'
import { PatientResponse } from '../../types/PatientResponse'
import { usePatient } from '../../contexts/PatientProvider'
import CreateSchedule from './CreateSchedule'

interface ConfigurationItemsProps {
    activeCarepath: string
    currentPatient: PatientResponse
}

const ConfigurationItems = ({
    activeCarepath,
    currentPatient,
}: ConfigurationItemsProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [wearableSchedule, setWearableSchedule] = useState<any>(null)
    const [refetch, setRefetch] = useState(false)
    const { selectedWearableId } = usePatient()
    const [carepaths, setCarepaths] = useState<any>([])

    useEffect(() => {
        const fetchCarepaths = async () => {
            const carepathData = await exh.data.documents.findAll('carepaths')
            setCarepaths(carepathData)
        }
        fetchCarepaths()
    }, [])

    const handleEditConfiguration = () => {
        setIsEditing(true)
    }

    useEffect(() => {
        setWearableSchedule(null) // Reset schedule when wearable changes
        const fetchWearableSchedule = async () => {
            const wearableSchedule = await exh.data.documents.find(
                'wearable-schedule',
                {
                    rql: rqlBuilder()
                        .eq('data.wearableId', selectedWearableId ?? '')
                        .build(),
                }
            )
            if (wearableSchedule.data.length > 0) {
                setWearableSchedule(wearableSchedule.data)
            }
        }
        fetchWearableSchedule()
    }, [selectedWearableId, refetch])

    useEffect(() => {
        const fetchAlerts = async () => {
            const alerts = await exh.data.documents.find('alert', {
                rql: rqlBuilder()
                    .eq('data.wearableId', selectedWearableId ?? '')
                    .build(),
            })
            setAlerts(alerts.data)
            setIsEditing(false) // Reset editing state after fetching alerts
        }
        fetchAlerts()
    }, [selectedWearableId, refetch])

    // Show edit page if in editing mode
    if (isEditing) {
        return (
            <EditConfigurationPage
                activeCarepath={activeCarepath}
                alerts={alerts}
                onCancel={async () => {
                    setRefetch((prev) => !prev) // Trigger refetch of alerts
                }}
                wearableSchedule={wearableSchedule}
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
    if (!wearableSchedule) {
        return (
            <div className="">
                <CreateSchedule
                    carepaths={carepaths}
                    onCancel={async () => {
                        setRefetch((prev) => !prev)
                    }}
                />
            </div>
        )
    }

    const vitalsToDisplay =
        (wearableSchedule && wearableSchedule[0].data?.schedule[0]?.what) || []
    const [vitalLeft, vitalRight] = splitIntoTwoColumns(vitalsToDisplay)

    const [alertLeft, alertRight] = splitIntoTwoColumns(
        alerts.map((alert) => {
            const message = `${alert.data.vital} ${
                alert.data.alertType === 'Above' ? '>' : '<'
            } ${alert.data.threshold}`
            return message
        })
    )

    return (
        <div>
            <div className="h-[59vh] overflow-y-auto">
                {/* Vitals Section */}
                <div className="grid grid-cols-4 gap-4 mb-6">
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
                                    Measurements taken every{' '}
                                    {
                                        wearableSchedule[0]?.data.schedule[0]
                                            ?.tInterval
                                    }{' '}
                                    minutes
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
