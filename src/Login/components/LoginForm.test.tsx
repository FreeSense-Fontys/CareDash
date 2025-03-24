import { expect, test, describe, vi, Mock } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import LoginForm from './LoginForm'
import { FieldFormatError } from '@extrahorizon/javascript-sdk'
import exh from '../../Auth'

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

test('login_succes_test', async () => {
    const setAccessTokenMock = vi.fn()
    const setRefreshTokenMock = vi.fn()

    render(
        <LoginForm
            setAccessToken={setAccessTokenMock}
            setRefreshToken={setRefreshTokenMock}
        />
    )
})

describe('forgot password success', () => {
    // using fake timers to speed up test for checking the button state
    beforeEach(async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true })
        // render the login form and navigate to forgot password
        render(<LoginForm setAccessToken={vi.fn()} setRefreshToken={vi.fn()} />)
        await userEvent.click(screen.getByTestId('forgot-password'))
    })

    afterEach(() => {
        vi.resetAllMocks()
        vi.useRealTimers()
    })

    // test for successful forgot password
    it('successful forgot password', async () => {
        // mock a successful requestPasswordReset call
        const resetPasswordButton = screen.getByTestId('reset-password-button')
        await userEvent.type(
            screen.getByTestId('email'),
            'correct-email@test.com'
        )
        await userEvent.click(resetPasswordButton)

        // check if the email is sent and the button is disabled
        expect(
            screen.getByText('Password reset email sent')
        ).toBeInTheDocument()
        expect(resetPasswordButton).toBeDisabled()
        expect(exh.users.requestPasswordReset).toHaveBeenCalledWith(
            'correct-email@test.com'
        )
        expect(resetPasswordButton).toHaveTextContent(/Try again in \d+s/i)

        // check if the button is enabled after 10 seconds
        await act(() => {
            vi.advanceTimersByTime(10000)
            vi.runOnlyPendingTimers()
        })
        vi.useRealTimers()
        expect(resetPasswordButton).not.toBeDisabled()
        expect(resetPasswordButton).toHaveTextContent(/Reset password/i)
    })
})

// test for failed forgot password
describe('forgot password fail', () => {
    // renders login form and navigates to forgot password before each test
    beforeEach(async () => {
        render(<LoginForm setAccessToken={vi.fn()} setRefreshToken={vi.fn()} />)
        await userEvent.click(screen.getByTestId('forgot-password'))
    })

    afterEach(() => {
        vi.resetAllMocks()
    })

    // test for empty email input field
    it('empty email', async () => {
        const resetPasswordButton = screen.getByTestId('reset-password-button')
        await userEvent.click(resetPasswordButton)

        expect(screen.getByTestId('email')).toHaveAttribute(
            'placeholder',
            'Email is required'
        )
        expect(screen.getByTestId('email-empty-icon')).toBeInTheDocument()
    })

    // test for invalid email format
    it('invalid email', async () => {
        ;(exh.users.requestPasswordReset as Mock).mockRejectedValue(
            new FieldFormatError({
                message: 'Invalid email format',
                name: 'INVALID_EMAIL',
            })
        )
        const emailInput = screen.getByTestId('email')
        const resetPasswordButton = screen.getByTestId('reset-password-button')

        await userEvent.type(emailInput, 'invalid-email@gmail')
        await userEvent.click(resetPasswordButton)

        expect(exh.users.requestPasswordReset).toHaveBeenCalledWith(
            'invalid-email@gmail'
        )
        expect(screen.getByText('Invalid email')).toBeInTheDocument()
    })
})

// test for 'back to login' button
describe('swapping to login', () => {
    beforeEach(async () => {
        const setAccessTokenMock = vi.fn()
        const setRefreshTokenMock = vi.fn()

        render(
            <LoginForm
                setAccessToken={setAccessTokenMock}
                setRefreshToken={setRefreshTokenMock}
            />
        )
        await userEvent.click(screen.getByTestId('forgot-password'))
    })
    it('should swap to login', async () => {
        await userEvent.click(screen.getByTestId('back-to-login'))
        const loginButton = screen.getByTestId('login-button')

        expect(screen.getByTestId('password')).toBeInTheDocument()
        expect(loginButton).toBeInTheDocument()
    })
})
