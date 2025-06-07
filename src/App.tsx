import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Layout from './Layout'
import Configuration from './Configuration'
import Presets from './Presets'
import ProtectedRoute from './components/ProtectedRoute'
import exh from './Auth'
import { rqlBuilder, createOAuth2Client } from '@extrahorizon/javascript-sdk'
import Credentials from './config'

function App() {
    const createSchemaCarepaths = async () => {
        await exh.data.schemas.create({
            name: 'carepaths',
            description: 'This list of all carepaths',
            defaultLimit: 20,
            maximumLimit: 20,
        })
    }

    const addPropertiesToCarepaths = async () => {
        await exh.data.properties.create('carepaths', {
            name: 'carepathName',
            configuration: {
                type: 'string',
                minLength: 1,
                pattern: '^[a-zA-Z]+$',
            },
        })
    }

    const addDataToCarepaths = async () => {
        await exh.data.documents.create('carepaths', {
            carepathName: 'COPD',
        })
        await exh.data.documents.create('carepaths', {
            carepathName: 'Diabetes',
        })
        await exh.data.documents.create('carepaths', {
            carepathName: 'Lyme',
        })
    }

    const createSchemaAlerts = async () => {
        await exh.data.schemas.create({
            name: 'alerts',
            description: 'All alerts are defined here',
            defaultLimit: 20,
            maximumLimit: 20,
        })
    }

    const addPropertiesToAlerts = async () => {
        await exh.data.properties.create('alerts', {
            name: 'vitals',
            configuration: {
                type: 'string',
            },
        })
        await exh.data.properties.create('alerts', {
            name: 'threshold',
            configuration: {
                type: 'number',
            },
        })
        await exh.data.properties.create('alerts', {
            name: 'alertType',
            configuration: {
                type: 'string',
                enum: ['Above', 'Below'],
            },
        })
        await exh.data.properties.create('alerts', {
            name: 'carepathId',
            configuration: {
                type: 'string',
            },
        })
        await exh.data.properties.create('alerts', {
            name: 'wearableId',
            configuration: {
                type: 'string',
            },
        })
    }

    const addDataToAlerts = async () => {
        await exh.data.documents.create('alerts', {
            vitals: 'HR',
            alertType: 'Above',
            threshold: 100,
            carepathId: '682ee8958bd54e0c0c0e3d02',
            wearableId: '67ea58ec53535d5d4c36cb28',
        })
    }

    const removeDocumentAlerts = async (id: string) => {
        await exh.data.documents.remove('alerts', id)
    }

    const removeSchema = async (name: string) => {
        await exh.data.schemas.disable(name)
        await exh.data.schemas.remove(name)
    }

    const printAllAlertsWithWearableId = async (wearableId: string) => {
        const allAlerts = await exh.data.documents.find('alerts', {
            rql: rqlBuilder().eq('data.wearableId', wearableId).build(),
        })
        console.log('all alerts', allAlerts)
    }

    const createSchemaAlertTriggers = async () => {
        await exh.data.schemas.create({
            name: 'alert-triggers',
            description: 'This list of all alert triggers',
            defaultLimit: 20,
            maximumLimit: 20,
        })
    }

    const addPropertiesToAlertTriggers = async () => {
        await exh.data.properties.create('alert-triggers', {
            name: 'timestamp',
            configuration: {
                type: 'string',
                format: 'date-time',
            },
        })
        await exh.data.properties.create('alert-triggers', {
            name: 'vital',
            configuration: {
                type: 'string',
            },
        })
        await exh.data.properties.create('alert-triggers', {
            name: 'wearableId',
            configuration: {
                type: 'string',
            },
        })
        await exh.data.properties.create('alert-triggers', {
            name: 'observationId',
            configuration: {
                type: 'string',
            },
        })
        await exh.data.properties.create('alert-triggers', {
            name: 'value',
            configuration: {
                type: 'number',
            },
        })
    }

    const addDataToAlertTriggers = async () => {
        console.log('Adding data to alert triggers')
        await exh.data.documents.create('alert-triggers', {
            vital: 'HR',
            wearableId: '67ea58ec53535d5d4c36cb28',
            observationId: '67eceb2c8bd54e1f9f0d68ba',
            value: 68.15192246987792,
        })
    }

    const removeDocumentAlertTriggers = async (id: string) => {
        await exh.data.documents.remove('alert-triggers', id)
    }

    const addDocumentWearableObservation = async () => {
        const exhWearables = createOAuth2Client({
            host: Credentials.EXH_HOST || '',
            clientId: Credentials.EXH_CLIENT_ID || '',
            clientSecret: Credentials.EXH_CLIENT_SECRET || '',
        })
        await exhWearables.auth.authenticate({
            username: 'wearable1@freesense-solutions.com',
            password: 'Wearable1',
        })
        await exhWearables.data.documents.create('wearable-observation', {
            vitals: [
                {
                    name: 'HR',
                    value: 65,
                    sqiStatus: 1,
                    timestamp: '2025-04-01T00:00:00.000Z',
                    id: '67ec39378bd54e176f0d601e',
                },
                {
                    name: 'SBP',
                    value: 140,
                    sqiStatus: 1,
                    timestamp: '2025-04-01T00:00:00.000Z',
                    id: '67ec39378bd54e41530d601f',
                },
                {
                    name: 'DBP',
                    value: 80,
                    sqiStatus: 1,
                    timestamp: '2025-04-01T00:00:00.000Z',
                    id: '67ec39378bd54e432a0d6020',
                },
                {
                    name: 'T',
                    value: 38,
                    sqiStatus: 1,
                    timestamp: '2025-04-01T00:00:01.000Z',
                    id: '67ec39378bd54e6fdf0d6021',
                },
            ],
            ppgFileToken: '',
            scheduleTags: ['Heart Failure', 'COPD'],
            patientId: '67ea71688bd54e5ccb0d4066',
        })
    }

        const createSchemaPreset = async () => {
        await exh.data.schemas.create({
            name: 'wearable-preset',
            description:
                'This is a basic object for the presets of the wearable',
            defaultLimit: 20,
            maximumLimit: 20,
        })
    }

    const addPropertiesToPreset = async () => {
        await exh.data.properties.create('wearable-preset', {
            name: 'name',
            configuration: {
                type: 'string',
            },
        })
        await exh.data.properties.create('wearable-preset', {
            name: 'carepathId',
            configuration: {
                type: 'string',
            },
        })
        await exh.data.properties.create('wearable-preset', {
            name: 'timings',
            configuration: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        value: { type: 'number' },
                        timingType: {
                            type: 'string',
                            enum: ['Interval'],
                        },
                        time: {
                            type: 'string',
                            enum: ['Seconds', 'Minutes', 'Hours', 'Days'],
                        },
                    },
                },
            },
        })
        await exh.data.properties.create('wearable-preset', {
            name: 'vitals',
            configuration: {
                type: 'array',
                items: {
                    type: 'string',
                    enum: ['HR', 'SBP', 'DBP', 'SPO2', 'RR', 'ACT', 'T'],
                },
            },
        })
        await exh.data.properties.create('wearable-preset', {
            name: 'alerts',
            configuration: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        vitals: {
                            type: 'string',
                            enum: [
                                'HR',
                                'SBP',
                                'DBP',
                                'SPO2',
                                'RR',
                                'ACT',
                                'T',
                            ],
                        },
                        threshold: { type: 'number' },
                        alertType: {
                            type: 'string',
                            enum: ['Above', 'Below'],
                        },
                    },
                },
            },
        })
    }

    const addDataToPreset = async () => {
        await exh.data.documents.create('wearable-preset', {
            name: 'COPD GOLD 2 Monitoring',
            carepathId: 'copd-carepath-gold2',
            vitals: ['HR', 'RR', 'SPO2'],
            timings: [
                {
                    value: 4,
                    timingType: 'Interval',
                    time: 'Hours',
                },
            ],
            alerts: [
                {
                    vitals: 'SPO2',
                    threshold: 90,
                    alertType: 'Below',
                    carepathId: 'copd-carepath-gold2',
                    wearableId: 'device-copd-gold2',
                },
                {
                    vitals: 'RR',
                    threshold: 22,
                    alertType: 'Above',
                    carepathId: 'copd-carepath-gold2',
                    wearableId: 'device-copd-gold2',
                },
            ],
        })

        await exh.data.documents.create('wearable-preset', {
            name: 'COPD GOLD 3 Monitoring',
            carepathId: 'copd-carepath-gold3',
            vitals: ['HR', 'RR', 'SPO2', 'T'],
            timings: [
                {
                    value: 2,
                    timingType: 'Interval',
                    time: 'Hours',
                },
            ],
            alerts: [
                {
                    vitals: 'SPO2',
                    threshold: 88,
                    alertType: 'Below',
                    carepathId: 'copd-carepath-gold3',
                    wearableId: 'device-copd-gold3',
                },
                {
                    vitals: 'RR',
                    threshold: 24,
                    alertType: 'Above',
                    carepathId: 'copd-carepath-gold3',
                    wearableId: 'device-copd-gold3',
                },
                {
                    vitals: 'T',
                    threshold: 37.8,
                    alertType: 'Above',
                    carepathId: 'copd-carepath-gold3',
                    wearableId: 'device-copd-gold3',
                },
            ],
        })

        await exh.data.documents.create('wearable-preset', {
            name: 'Diabetes Monitoring',
            carepathId: 'diabetes-carepath',
            vitals: ['HR', 'ACT', 'T'],
            timings: [
                {
                    value: 6,
                    timingType: 'Interval',
                    time: 'Hours',
                },
            ],
            alerts: [
                {
                    vitals: 'HR',
                    threshold: 110,
                    alertType: 'Above',
                    carepathId: 'diabetes-carepath',
                    wearableId: 'device-diabetes',
                },
                {
                    vitals: 'T',
                    threshold: 38.0,
                    alertType: 'Above',
                    carepathId: 'diabetes-carepath',
                    wearableId: 'device-diabetes',
                },
            ],
        })
    }

    const createSchema = async () => {
        // createSchemaCarepaths()
        // addPropertiesToCarepaths()
        // addDataToCarepaths()
        // removeSchema('carepaths')

        // createSchemaAlerts()
        // addPropertiesToAlerts()
        // addDataToAlerts()
        // removeDocumentAlerts('682ee7c58bd54ee0880e3cfe')
        // removeSchema('alerts')

        // printAllAlertsWithWearableId('67ea58ec53535d5d4c36cb28')

        // createSchemaAlertTriggers()
        // addPropertiesToAlertTriggers()
        // addDataToAlertTriggers()
        // removeDocumentAlertTriggers('6834376a8bd54e22dc0e3d1e')
        // removeSchema('alert-triggers')

        createSchemaPreset()
        addPropertiesToPreset()
        addDataToPreset()
        removeSchema('wearable-preset')

        addDocumentWearableObservation()
    }
    createSchema()

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
                <Route
                    index
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/configuration"
                    element={
                        <ProtectedRoute>
                            <Configuration />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/presets"
                    element={
                        <ProtectedRoute>
                            <Presets />
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    )
}

export default App
