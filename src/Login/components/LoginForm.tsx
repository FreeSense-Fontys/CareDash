import { useState } from 'react'
import Cookies from 'js-cookie'
import exh from '../../Auth'
import { MfaRequiredError } from '@extrahorizon/javascript-sdk'
import Const from '../../Auth/const'
import { IoMdInformationCircleOutline } from 'react-icons/io'

interface LoginProps {
    setAccessToken: (token: string) => void
    setRefreshToken: (token: string) => void
}

function LoginForm({ setAccessToken, setRefreshToken }: LoginProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [error, setError] = useState('')

    const handleForgotPassword = async () => {
        try {
            setIsLoading(true)
            await exh.users.requestPasswordReset(email)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    async function UserLogin() {
        try {
            setError('')
            await exh.auth
                .authenticate({
                    username: email,
                    password: password,
                })
                .then((user) => {
                    Cookies.set(Const.ACCESS_TOKEN, user.accessToken)
                    setAccessToken(user.accessToken)
                    Cookies.set(Const.REFRESH_TOKEN, user.refreshToken)
                    setRefreshToken(user.refreshToken)
                })
        } catch (error) {
            //handling the multi factor authentication
            if (error instanceof MfaRequiredError) setError('User requires MFA')
            else if (error.status === 400)
                setError('Invalid username or password')
            else setError('An unknown error occurred')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-accent w-md h-115 rounded-tl-bg rounded-br-bg text-primary">
            {/* Header */}
            {isLogin ? (
                <h1 className="text-2xl font-bold">Login to CareDash</h1>
            ) : (
                <h1 className="text-2xl font-bold">Forgot Password</h1>
            )}

            {/* Inputs */}
            <form
                onSubmit={async (e) => {
                    e.preventDefault()
                    await UserLogin()
                }}
            >
                <div className="flex flex-col items-center justify-center mt-2">
                    {error && (
                        <div className="bg-red-500 text-white w-full p-2 flex items-center">
                            <IoMdInformationCircleOutline size={25} />
                            <p className="pl-2">{error}</p>
                        </div>
                    )}
                    <div className="flex flex-col m-2 w-xs">
                        <label htmlFor="email" className="mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            autoComplete="email"
                            type="email"
                            placeholder="Email"
                            className="bg-white text-black p-4 rounded-xsm focus:outline-2"
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Conditionally render password input */}
                    {isLogin ? (
                        <div className="flex flex-col mt-2 w-xs">
                            <label htmlFor="password" className="mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                className="bg-white text-black p-4 rounded-xsm focus:outline-2"
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-left mt-2">
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault()
                                        setIsLogin(false)
                                    }}
                                    className="underline hover:cursor-pointer hover:text-neutral-300 bg-transparent border-none p-0"
                                    disabled={isLoading}
                                >
                                    Forgot password
                                </button>
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col mt-2 w-xs">
                            <p>
                                <button
                                    className="underline text-xs text-left hover:cursor-pointer hover:text-neutral-300"
                                    onClick={() => setIsLogin(true)}
                                    disabled={isLoading}
                                >
                                    Back to login
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-center mt-6 w-full">
                    {isLogin ? (
                        <button
                            className="bg-secondary hover:cursor-pointer w-xs p-4 rounded-tl-xsm rounded-br-xsm hover:scale-105 active:opacity-75"
                            type="submit"
                            disabled={isLoading}
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            className="bg-secondary hover:cursor-pointer w-xs p-4 rounded-tl-xsm rounded-br-xsm hover:scale-105 active:opacity-75"
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault()
                                handleForgotPassword()
                            }}
                            disabled={isLoading}
                        >
                            Reset Password
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default LoginForm
