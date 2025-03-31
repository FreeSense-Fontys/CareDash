import { createContext } from 'react'
import { vi } from 'vitest'
import {
    InvalidGrantError,
    EmailUnknownError,
    InvalidRequestError,
    FieldFormatError,
} from '@extrahorizon/javascript-sdk'

const handleLoginMock = vi.fn().mockImplementation(async (email, password) => {
    if (
        email === 'incorrect-email@gmail.com' ||
        password === 'incorrect-password'
    ) {
        throw new InvalidGrantError({
            message: 'Invalid email or password',
            name: 'INVALID_GRANT',
        })
    }
    if (email === 'correct-email@gmail') {
        throw new InvalidRequestError({
            message: 'Invalid format',
            name: 'INVALID_REQUEST',
        })
    }
    if (email === 'unknown-error@gmail.com') {
        throw new Error('Unknown error')
    }
    return { accessToken: 'token', refreshToken: 'refresh' }
})

const handleForgotPasswordMock = vi.fn().mockImplementation(async (email) => {
    if (email === 'invalid-email@gmail') {
        throw new FieldFormatError({
            message: 'Invalid email format',
            name: 'INVALID_EMAIL',
        })
    }
    if (email === 'unknown-email@gmail.com') {
        throw new EmailUnknownError({
            message: 'Email unknown',
            name: 'EMAIL_UNKNOWN',
        })
    }
})

// Match your actual AuthContextType
export const mockAuthValues = {
    handleLogin: handleLoginMock,
    handleForgotPassword: handleForgotPasswordMock,
    handleLogout: vi.fn().mockResolvedValue(undefined),
    user: undefined,
    loading: false,
}

export const AuthContext = createContext(mockAuthValues)

export const useAuth = () => {
    return mockAuthValues
}
