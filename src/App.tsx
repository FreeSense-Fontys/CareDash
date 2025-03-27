import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Cookie from 'js-cookie'
import Const from './Auth/const'
import Layout from './Layout'

function App() {
    const [accessToken, setAccessToken] = useState(
        Cookie.get(Const.ACCESS_TOKEN) || ''
    )

    // add back refreshToken when needed
    const [, setRefreshToken] = useState(Cookie.get(Const.REFRESH_TOKEN) || '')

    const isLoggedIn = () => {
        return accessToken !== ''
    }

    const Logout = () => {
        Cookie.remove(Const.ACCESS_TOKEN)
        Cookie.remove(Const.REFRESH_TOKEN)
        setAccessToken('')
        setRefreshToken('')
    }

    return (
        <Routes>
            {!isLoggedIn() ? (
                <>
                    <Route
                        index
                        element={
                            <Login
                                setAccessToken={setAccessToken}
                                setRefreshToken={setRefreshToken}
                            />
                        }
                    />
                </>
            ) : (
                <Route element={<Layout Logout={Logout} />}>
                    <Route index element={<Home />} />
                </Route>
            )}
            {/* <Route path="/" element={isLoggedIn() ? <Home /> : <Login setAccessToken={setAccessToken} setRefreshToken={setRefreshToken} />} /> */}
        </Routes>
    )
}

export default App
