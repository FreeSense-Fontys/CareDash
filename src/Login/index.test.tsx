import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginPage from './index'

describe('Login page', () => {
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
