import { useState } from 'react'
import Cookies from 'js-cookie'
import exh from '../../Auth'
import {
    FieldFormatError,
    InvalidGrantError,
    InvalidRequestError,
    EmailUnknownError,
} from '@extrahorizon/javascript-sdk'
import Const from '../../Auth/const'
import { GoAlertFill } from 'react-icons/go'
import { toast, ToastContainer, Bounce } from 'react-toastify'

interface LoginProps {
    setAccessToken: (token: string) => void
    setRefreshToken: (token: string) => void
}

function LoginForm({ setAccessToken, setRefreshToken }: LoginProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    // Add this near your other state declarations
    const [resetCooldown, setResetCooldown] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isLogin, setIsLogin] = useState(true)

    // errors for input validation
    const [inputErrors, setInputErrors] = useState({
        email: '',
        password: '',
    })

    // general input change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof typeof formData
        const value = e.target.value
        setFormData({ ...formData, [name]: value })

        // removes input error when input changes
        if (inputErrors[name]) {
            setInputErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }))
        }
    }

    // validates the inputs; returns true if valid, false otherwise
    const validateInputs = () => {
        const validationErrors = {
            email: '',
            password: '',
        }

        // sets error message for empty fields
        for (const key in formData) {
            if (!isLogin) {
                if (key === 'password') continue
            }
            if (!formData[key as keyof typeof formData]) {
                validationErrors[key as keyof typeof validationErrors] = `${
                    key.charAt(0).toUpperCase() + key.slice(1)
                } is required`
            }
        }

        // if there are errors, set the errors and return false
        if (
            Object.keys(validationErrors).some(
                (key) =>
                    validationErrors[key as keyof typeof validationErrors] !==
                    ''
            )
        ) {
            setInputErrors(validationErrors)
            return false
        }
        return true
    }

    // handles form submission: validates inputs and, if inputs valid, logs in user or sends password reset email
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (validateInputs()) {
            if (isLogin) {
                await UserLogin()
            } else {
                await handleForgotPassword()
            }
        }
    }

    // handles forgot password: validates inputs and, if inputs valid, sends password reset email
    const handleForgotPassword = async () => {
        if (validateInputs()) {
            try {
                setIsLoading(true)
                setInputErrors({
                    email: '',
                    password: '',
                })
                await exh.users.requestPasswordReset(formData.email)
                toast.success('Password reset email sent')
            } catch (error) {
                if (error instanceof FieldFormatError)
                    toast.error('Invalid email format')
                // want to emulate success in case of malicious intent (email enumeration)
                if (error instanceof EmailUnknownError)
                    toast.success('Password reset email sent')
            } finally {
                setIsLoading(false)
                // set cooldown period (10 seconds) of reset password button
                const cooldownTime = 10
                setResetCooldown(cooldownTime)

                // start countdown timer
                const countdownInterval = setInterval(() => {
                    setResetCooldown((prevTime) => {
                        if (prevTime <= 1) {
                            clearInterval(countdownInterval)
                            return 0
                        }
                        return prevTime - 1
                    })
                }, 1000)
            }
        }
    }

    // logs in user
    async function UserLogin() {
        try {
            setIsLoading(true)
            const user = await exh.auth.authenticate({
                username: formData.email,
                password: formData.password,
            })
            Cookies.set(Const.ACCESS_TOKEN, user.accessToken, {
                path: '/',
                sameSite: 'Lax', // or 'Strict'
            })
            setAccessToken(user.accessToken)
            Cookies.set(Const.REFRESH_TOKEN, user.refreshToken, {
                path: '/',
                sameSite: 'Lax', // or 'Strict'
            })
            setRefreshToken(user.refreshToken)
        } catch (error) {
            if (error instanceof InvalidGrantError)
                toast.error('Email or password is incorrect')
            else if (error instanceof InvalidRequestError)
                toast.error('Invalid format')
            else {
                toast.error('An unknown error has occurred')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className="flex flex-col items-center justify-center bg-accent w-md h-115 rounded-tl-bg rounded-br-bg text-primary"
            data-testid="login-form"
        >
            {/* Header */}
            <ToastContainer
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
            {isLogin ? (
                <h1 className="text-2xl font-bold">Login to CareDash</h1>
            ) : (
                <h1 className="text-2xl font-bold">Forgot Password</h1>
            )}

            {/* Inputs */}
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center justify-center mt-2">
                    {/* Email input */}
                    <div className="flex flex-col m-2 w-xs">
                        <label htmlFor="email" className="mb-2">
                            <div className="flex flex-row">
                                Email
                                {inputErrors.email !== '' && (
                                    <p
                                        className="text-red-500 pl-2"
                                        data-testid="email-empty-icon"
                                    >
                                        <GoAlertFill size={20} />
                                    </p>
                                )}
                            </div>
                        </label>
                        <input
                            value={formData.email}
                            id="email"
                            autoComplete="email"
                            type="email"
                            name="email"
                            data-testid="email"
                            placeholder={
                                inputErrors.email ? inputErrors.email : 'Email'
                            }
                            className="bg-white text-black p-4 rounded-xsm focus:outline-2"
                            onChange={(e) => handleChange(e)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Conditionally render password input */}
                    {isLogin ? (
                        <div className="flex flex-col mt-2 w-xs">
                            <label htmlFor="password" className="mb-2">
                                <div className="flex flex-row">
                                    Password
                                    {inputErrors.password !== '' && (
                                        <p className="text-red-500 pl-2">
                                            <GoAlertFill size={20} />
                                        </p>
                                    )}
                                </div>
                            </label>
                            <input
                                value={formData.password}
                                data-testid="password"
                                id="password"
                                name="password"
                                type="password"
                                placeholder={
                                    inputErrors.password
                                        ? inputErrors.password
                                        : 'Password'
                                }
                                className="bg-white text-black p-4 rounded-xsm focus:outline-2"
                                onChange={(e) => handleChange(e)}
                                disabled={isLoading}
                            />

                            {/* Forgot Password button */}
                            <p className="text-xs text-left mt-2">
                                <button
                                    data-testid="forgot-password"
                                    onClick={async (e) => {
                                        e.preventDefault()
                                        setInputErrors({
                                            email: '',
                                            password: '',
                                        })
                                        setIsLogin(false)
                                    }}
                                    type="button"
                                    className="underline hover:cursor-pointer hover:text-neutral-300 bg-transparent border-none p-0"
                                    disabled={isLoading}
                                >
                                    Forgot password
                                </button>
                            </p>
                        </div>
                    ) : (
                        // Back to login button
                        <div className="flex flex-col mt-2 w-xs">
                            <p>
                                <button
                                    className="underline text-xs text-left hover:cursor-pointer hover:text-neutral-300"
                                    onClick={() => {
                                        setInputErrors({
                                            email: '',
                                            password: '',
                                        })
                                        setIsLogin(true)
                                    }}
                                    type="button"
                                    data-testid="back-to-login"
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
                            data-testid="login-button"
                        >
                            Login
                        </button>
                    ) : (
                        // Reset password button
                        <button
                            className="bg-secondary hover:cursor-pointer w-xs p-4 rounded-tl-xsm rounded-br-xsm hover:scale-105 active:opacity-75 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100"
                            type="submit"
                            data-testid="reset-password-button"
                            disabled={isLoading || resetCooldown > 0}
                        >
                            {resetCooldown > 0
                                ? `Try again in ${resetCooldown}s`
                                : 'Reset Password'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default LoginForm
