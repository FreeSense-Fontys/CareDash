import { expect, describe, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import LoginForm from './LoginForm'
// import {
//     EmailUnknownError,
//     FieldFormatError,
//     InvalidGrantError,
//     InvalidRequestError,
// } from '@extrahorizon/javascript-sdk'
// import exh from '../../Auth'
import { MemoryRouter } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider'

// mock the Extra Horizon SDK before importing the client
// vi.mock('@extrahorizon/javascript-sdk', async (importOriginal) => {
//     const actual = (await importOriginal()) as object
//     return {
//         ...actual, // Preserve original exports
//         createOAuth2Client: vi.fn(() => ({
//             auth: {
//                 authenticate: vi.fn(),
//             },
//             users: {
//                 requestPasswordReset: vi.fn(),
//             },
//         })),
//         FieldFormatError: class FieldFormatError extends Error {},
//     }
// })

vi.mock('react-router-dom', () => {
    const navigate = vi.fn()
    return {
        ...vi.importActual('react-router-dom'),
        useNavigate: () => navigate,
        MemoryRouter: ({ children }: { children: React.ReactNode }) => (
            <div>{children}</div>
        ),
    }
})

// Mock AuthProvider
vi.mock('../../contexts/AuthProvider')

describe('login success', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        )
    })

    it('login successfully', async () => {
        const { handleLogin } = useAuth()

        const loginButton = screen.getByTestId('login-button')
        const emailInput = screen.getByTestId('email')
        const passwordInput = screen.getByTestId('password')

        await userEvent.type(emailInput, 'correct-email@gmail.com')
        await userEvent.type(passwordInput, 'correct-password')

        await userEvent.click(loginButton)

        expect(handleLogin).toHaveBeenCalledWith(
            'correct-email@gmail.com',
            'correct-password'
        )
    })
})

describe('login fail', () => {
    beforeEach(() => {
        render(<LoginForm />)
    })

    it('empty inputs', async () => {
        const loginButton = screen.getByTestId('login-button')
        const emailInput = screen.getByTestId('email')
        const passwordInput = screen.getByTestId('password')
        await userEvent.click(loginButton)

        expect(screen.getByTestId('email')).toHaveAttribute(
            'placeholder',
            'Email is required'
        )
        expect(screen.getByTestId('password')).toHaveAttribute(
            'placeholder',
            'Password is required'
        )

        await userEvent.type(emailInput, 'test')
        await userEvent.type(passwordInput, 'test')

        expect(emailInput).not.toHaveAttribute(
            'placeholder',
            'Email is required'
        )
        expect(passwordInput).not.toHaveAttribute(
            'placeholder',
            'Password is required'
        )
    })

    it('incorrect email', async () => {
        const { handleLogin } = useAuth()
        const loginButton = screen.getByTestId('login-button')
        const emailInput = screen.getByTestId('email')
        const passwordInput = screen.getByTestId('password')

        await userEvent.type(emailInput, 'incorrect-email@gmail.com')
        await userEvent.type(passwordInput, 'incorrect-password')
        await userEvent.click(loginButton)

        expect(handleLogin).toHaveBeenCalledWith(
            'incorrect-email@gmail.com',
            'incorrect-password'
        )
        expect(
            screen.getByText('Email or password is incorrect')
        ).toBeInTheDocument()
    })

    it('incorrect password', async () => {
        const { handleLogin } = useAuth()
        const loginButton = screen.getByTestId('login-button')
        const emailInput = screen.getByTestId('email')
        const passwordInput = screen.getByTestId('password')

        await userEvent.type(emailInput, 'correct-email@gmail.com')
        await userEvent.type(passwordInput, 'incorrect-password')
        await userEvent.click(loginButton)

        expect(handleLogin).toHaveBeenCalledWith(
            'correct-email@gmail.com',
            'incorrect-password'
        )
        expect(
            screen.getByText('Email or password is incorrect')
        ).toBeInTheDocument()
    })

    it('invalid email format', async () => {
        const { handleLogin } = useAuth()
        const loginButton = screen.getByTestId('login-button')
        const emailInput = screen.getByTestId('email')
        const passwordInput = screen.getByTestId('password')

        await userEvent.type(emailInput, 'correct-email@gmail')
        await userEvent.type(passwordInput, 'correct-password')
        await userEvent.click(loginButton)

        expect(handleLogin).toHaveBeenCalledWith(
            'correct-email@gmail',
            'correct-password'
        )
        expect(screen.getByText('Invalid format')).toBeInTheDocument()
    })

    it('unknown error', async () => {
        const loginButton = screen.getByTestId('login-button')
        const emailInput = screen.getByTestId('email')
        const passwordInput = screen.getByTestId('password')

        await userEvent.type(emailInput, 'unknown-error@test.com')
        await userEvent.type(passwordInput, 'correct-password')
        await userEvent.click(loginButton)

        expect(
            screen.getByText('An unknown error has occurred')
        ).toBeInTheDocument()
    })
})

describe('forgot password success', () => {
    // using fake timers to speed up test for checking the button state
    beforeEach(async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true })
        // render the login form and navigate to forgot password
        render(<LoginForm />)
        await userEvent.click(screen.getByTestId('forgot-password'))
    })

    afterEach(() => {
        vi.resetAllMocks()
        vi.useRealTimers()
    })

    // test for successful forgot password
    it('successful forgot password', async () => {
        const { handleForgotPassword } = useAuth()

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
        expect(handleForgotPassword).toHaveBeenCalledWith(
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
        render(<LoginForm />)
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
        const { handleForgotPassword } = useAuth()
        const emailInput = screen.getByTestId('email')
        const resetPasswordButton = screen.getByTestId('reset-password-button')

        await userEvent.type(emailInput, 'invalid-email@gmail')

        await userEvent.click(resetPasswordButton)

        expect(handleForgotPassword).toHaveBeenCalledWith('invalid-email@gmail')
        expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument()
    })

    it('unknown email error', async () => {
        const loginButton = screen.getByTestId('reset-password-button')
        const emailInput = screen.getByTestId('email')

        await userEvent.type(emailInput, 'unknown-email@gmail.com')
        await userEvent.click(loginButton)

        expect(
            screen.getByText('Password reset email sent')
        ).toBeInTheDocument()
    })
})

// test for 'back to login' button
describe('swapping to login', () => {
    beforeEach(async () => {
        render(<LoginForm />)
        await userEvent.click(screen.getByTestId('forgot-password'))
    })

    it('should swap to login', async () => {
        await userEvent.click(screen.getByTestId('back-to-login'))
        const loginButton = screen.getByTestId('login-button')

        expect(screen.getByTestId('password')).toBeInTheDocument()
        expect(loginButton).toBeInTheDocument()
    })
})
