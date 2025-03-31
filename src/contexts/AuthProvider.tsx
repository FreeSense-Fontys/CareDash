import exh from '../Auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { TokenDataOauth2, UserData } from '@extrahorizon/javascript-sdk'
import Cookies from 'js-cookie'
import Consts from '../Auth/const'

interface AuthContextType {
    user: UserData | undefined
    loading: boolean
    handleLogin: (
        email: string,
        password: string
    ) => Promise<TokenDataOauth2 | undefined>
    handleLogout: () => Promise<void>
    handleForgotPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // getting refresh token from cookies
        const refreshToken = Cookies.get(Consts.REFRESH_TOKEN)

        const fetchUser = async () => {
            try {
                // if refresh token is available, authenticate with it
                if (refreshToken) {
                    await exh.auth.authenticate({
                        refreshToken: refreshToken,
                    })
                }
                // getting current user
                const currentUser = await exh.users.me()
                if (currentUser) {
                    setUser(currentUser)
                }
            } catch {
                setUser(undefined)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    const handleLogin = async (email: string, password: string) => {
        const user = await exh.auth.authenticate({
            username: email,
            password: password,
        })
        Cookies.set(Consts.ACCESS_TOKEN, user.accessToken)
        Cookies.set(Consts.REFRESH_TOKEN, user.refreshToken)

        const currentUser = await exh.users.me()
        if (currentUser) {
            setUser(currentUser)
        }

        return user
    }

    const handleLogout = async () => {
        await exh.auth.logout()
        Cookies.remove(Consts.ACCESS_TOKEN)
        Cookies.remove(Consts.REFRESH_TOKEN)
        setUser(undefined)
    }

    const handleForgotPassword = async (email: string) => {
        await exh.users.requestPasswordReset({
            email,
        })
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                handleLogin,
                handleLogout,
                handleForgotPassword,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
