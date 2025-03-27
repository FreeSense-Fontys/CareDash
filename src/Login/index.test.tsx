import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginPage from './index'

describe('Login page', () => {

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

    const mockSetAccessToken = vi.fn()
    const mockSetRefreshToken = vi.fn()

    beforeEach(() => {
        render(
            <LoginPage
                setAccessToken={mockSetAccessToken}
                setRefreshToken={mockSetRefreshToken}
            />
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
