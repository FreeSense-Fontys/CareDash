import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Layout from './Layout'
import Configuration from './Configuration'
import Presets from './Presets'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
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
