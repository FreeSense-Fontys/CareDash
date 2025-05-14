import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Layout from './Layout'
import Configuration from './Configuration'
import Presets from './Presets'
import ProtectedRoute from './components/ProtectedRoute'
import exh from './Auth'

function App() {
    const createSchema = async () => {
        // const carepathSchema = await exh.data.schemas.create({
        //     name: 'Carepaths',
        //     description: 'This list of all carepaths',
        //     defaultLimit: 20,
        //     maximumLimit: 20,
        // })
        // console.log('carepathSchema', carepathSchema)
        // const withpropts = await exh.data.properties.create('Carepaths', {
        //     name: 'carepathname',
        //     configuration: {
        //         type: 'string',
        //         minLength: 1,
        //         pattern: '^[a-zA-Z]+$',
        //     },
        // })
        // console.log('withpropts', withpropts)
        // const addCarepath = await exh.data.documents.create('Carepaths', {
        //     carepathname: 'COPD',
        // })
        // const addCarepath2 = await exh.data.documents.create('Carepaths', {
        //     carepathname: 'Diabetes',
        // })
        // const addCarepath2 = await exh.data.documents.create('Carepaths', {
        //     carepathname: 'Lyme',
        // })
        // const test2 = await exh.data.documents.find('Carepaths')
        // console.log('test', test2)
        // const disableSchema = await exh.data.schemas.disable('Carepaths')
        // const deleteSchema = await exh.data.schemas.remove('Carepaths')
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
