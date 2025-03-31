import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginPage from './index'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthProvider'

// mock the Extra Horizon SDK before importing the client
vi.mock('@extrahorizon/javascript-sdk', async (importOriginal) => {
    const actual = (await importOriginal()) as object
    return {
        ...actual, // Preserve original exports
        createOAuth2Client: vi.fn(() => ({
            auth: {
                authenticate: vi.fn(),
            },
            users: {
                requestPasswordReset: vi.fn(),
            },
        })),
        FieldFormatError: class FieldFormatError extends Error {},
    }
})

describe('Login page', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </MemoryRouter>
        )
    })

    it('Should render the logo', () => {
        const image = screen.getByTestId('login-logo')

        expect(image).toBeInTheDocument()
    })

    it('Should render the login form', () => {
        const form = screen.getByTestId('login-form')

        expect(form).toBeInTheDocument()
    })
})
