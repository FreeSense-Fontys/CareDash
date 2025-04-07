import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthProvider'
import '@testing-library/jest-dom'
import { Mock, vi } from 'vitest'
import Cookies from 'js-cookie'
import exh from '../Auth'
import Consts from '../Auth/const'

// Mock dependencies
vi.mock('../Auth', () => ({
    default: {
        auth: {
            authenticate: vi.fn().mockResolvedValue({
                accessToken: 'access123',
                refreshToken: 'refresh123',
            }),
            logout: vi.fn().mockResolvedValue(undefined),
        },
        users: {
            me: vi
                .fn()
                .mockResolvedValue({ id: '123', email: 'test@example.com' }),
            requestPasswordReset: vi.fn().mockResolvedValue({}),
        },
    },
}))

vi.mock('js-cookie', () => ({
    default: {
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn(),
    },
}))

// Test component that uses the hook
const TestComponent = () => {
    const auth = useAuth()

    return (
        <div>
            <button
                data-testid="login-button"
                onClick={() => auth.handleLogin('test@example.com', 'password')}
            >
                Login
            </button>
            <button data-testid="logout-button" onClick={auth.handleLogout}>
                Logout
            </button>
            <button
                data-testid="forgot-password-button"
                onClick={() => auth.handleForgotPassword('test@example.com')}
            >
                Forgot Password
            </button>
            <div data-testid="user-info">
                {auth.user ? 'Logged In' : 'Not Logged In'}
            </div>
            <div data-testid="loading-state">
                {auth.loading ? 'Loading' : 'Not Loading'}
            </div>
        </div>
    )
}

describe('AuthProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('logout', () => {
        it('should call logout methods and clear cookies', async () => {
            // Initialize default mocks
            ;(Cookies.get as Mock).mockReturnValue(null)

            // Render the component
            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            )

            // Wait for the loading state to change
            await waitFor(() => {
                expect(screen.getByTestId('loading-state')).toHaveTextContent(
                    'Not Loading'
                )
            })

            // Now we can interact with the buttons
            const logoutButton = screen.getByTestId('logout-button')
            await userEvent.click(logoutButton)

            expect(exh.auth.logout).toHaveBeenCalledTimes(1)
            expect(Cookies.remove).toHaveBeenCalledWith(Consts.ACCESS_TOKEN)
            expect(Cookies.remove).toHaveBeenCalledWith(Consts.REFRESH_TOKEN)
        })
    })

    describe('login', () => {
        it('should authenticate the user and set cookies', async () => {
            const mockUser = { id: '123', email: 'test@example.com' }
            const mockTokenData = {
                accessToken: 'access123',
                refreshToken: 'refresh123',
            }

            ;(exh.auth.authenticate as Mock).mockResolvedValue(mockTokenData)
            ;(exh.users.me as Mock).mockResolvedValue(mockUser)

            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            )

            // Wait for the loading state to change
            await waitFor(() => {
                expect(screen.getByTestId('loading-state')).toHaveTextContent(
                    'Not Loading'
                )
            })

            const loginButton = screen.getByTestId('login-button')
            await userEvent.click(loginButton)

            expect(exh.auth.authenticate).toHaveBeenCalledWith({
                username: 'test@example.com',
                password: 'password',
            })
            expect(Cookies.set).toHaveBeenCalledWith(
                Consts.ACCESS_TOKEN,
                'access123'
            )
            expect(Cookies.set).toHaveBeenCalledWith(
                Consts.REFRESH_TOKEN,
                'refresh123'
            )
            expect(exh.users.me).toHaveBeenCalled()
        })
    })

    describe('forgotPassword', () => {
        it('should request password reset', async () => {
            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            )

            // Wait for the loading state to change
            await waitFor(() => {
                expect(screen.getByTestId('loading-state')).toHaveTextContent(
                    'Not Loading'
                )
            })

            const forgotPasswordButton = screen.getByTestId(
                'forgot-password-button'
            )
            await userEvent.click(forgotPasswordButton)

            expect(exh.users.requestPasswordReset).toHaveBeenCalledWith({
                email: 'test@example.com',
            })
        })
    })

    describe('initialization', () => {
        it('should attempt to authenticate with refresh token if available', async () => {
            ;(Cookies.get as Mock).mockReturnValue('refresh123')
            const mockUser = { id: '123', email: 'test@example.com' }
            ;(exh.users.me as Mock).mockResolvedValue(mockUser)

            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            )

            await waitFor(() => {
                expect(exh.auth.authenticate).toHaveBeenCalledWith({
                    refreshToken: 'refresh123',
                })
            })

            expect(exh.users.me).toHaveBeenCalled()
        })
    })
})

// Add these tests to your existing test file

describe('useAuth hook', () => {
    it('should throw error if used outside of AuthProvider', () => {
        // Create a component that uses useAuth without AuthProvider
        const InvalidComponent = () => {
            useAuth()
            return null
        }

        // Expect the render to throw an error
        expect(() => {
            render(<InvalidComponent />)
        }).toThrow('useAuth must be used within an AuthProvider')
    })
})

describe('handleLogin', () => {
    it('should return the user token data', async () => {
        const mockUser = { id: '123', email: 'test@example.com' }
        const mockTokenData = {
            accessToken: 'access123',
            refreshToken: 'refresh123',
        }

        ;(exh.auth.authenticate as Mock).mockResolvedValue(mockTokenData)
        ;(exh.users.me as Mock).mockResolvedValue(mockUser)

        // Create a component that captures the return value of handleLogin
        let loginResult:
            | { accessToken: string; refreshToken: string }
            | undefined
        const LoginReturnComponent = () => {
            const auth = useAuth()

            const handleLoginClick = async () => {
                loginResult = await auth.handleLogin(
                    'test@example.com',
                    'password'
                )
            }

            return (
                <button
                    data-testid="login-return-button"
                    onClick={handleLoginClick}
                >
                    Login and Capture Result
                </button>
            )
        }

        render(
            <AuthProvider>
                <LoginReturnComponent />
            </AuthProvider>
        )

        // Wait for loading to complete
        await waitFor(() => {
            expect(
                screen.queryByTestId('loading-state')
            ).not.toBeInTheDocument()
        })

        // Click the login button
        const loginButton = screen.getByTestId('login-return-button')
        await userEvent.click(loginButton)

        // Wait for the async login to complete
        await waitFor(() => {
            expect(loginResult).toBeDefined()
        })

        // Verify the return value
        expect(loginResult).toEqual(mockTokenData)
    })

    it('should handle failed authentication gracefully', async () => {
        // Mock a failed authentication
        const authError = new Error('Authentication failed')
        ;(exh.auth.authenticate as Mock).mockRejectedValue(authError)

        // Create a component that captures any error from handleLogin
        let loginError:
            | { accessToken: string; refreshToken: string }
            | undefined
        const LoginErrorComponent = () => {
            const auth = useAuth()

            const handleLoginWithError = async () => {
                try {
                    await auth.handleLogin('wrong@example.com', 'wrongpassword')
                } catch (error) {
                    loginError = error as {
                        accessToken: string
                        refreshToken: string
                    }
                }
            }

            return (
                <button
                    data-testid="login-error-button"
                    onClick={handleLoginWithError}
                >
                    Login with Error
                </button>
            )
        }

        render(
            <AuthProvider>
                <LoginErrorComponent />
            </AuthProvider>
        )

        // Wait for loading to complete
        await waitFor(() => {
            expect(
                screen.queryByTestId('loading-state')
            ).not.toBeInTheDocument()
        })

        // Click the login button
        const loginErrorButton = screen.getByTestId('login-error-button')
        await userEvent.click(loginErrorButton)

        // Wait for the async login to complete
        await waitFor(() => {
            expect(loginError).toBeDefined()
        })

        // Verify the error was passed through
        expect(loginError).toEqual(authError)
    })
})
