import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Mock, vi } from 'vitest'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../contexts/AuthProvider'
import '@testing-library/jest-dom'

// Mock useAuth
vi.mock('../contexts/AuthProvider', () => ({
    useAuth: vi.fn(),
}))

// Mock Navigate component
const mockNavigate = vi.fn()
vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router')
    return {
        ...actual,
        Navigate: (props: { to: string; replace?: boolean }) => {
            mockNavigate(props)
            return null
        },
    }
})

describe('ProtectedRoute', () => {
    beforeEach(() => {
        mockNavigate.mockClear()
    })

    it('renders children when user is authenticated', () => {
        ;(useAuth as Mock).mockReturnValue({
            user: { id: 1, name: 'Test User' },
        })

        const { getByText } = render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        )

        expect(getByText('Protected Content')).toBeInTheDocument()
        expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('redirects to /login when user is not authenticated', () => {
        ;(useAuth as Mock).mockReturnValue({ user: null }) // Mock no user

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        )

        // Check that Navigate was called with the right props
        expect(mockNavigate).toHaveBeenCalledWith(
            expect.objectContaining({
                to: '/login',
                replace: true,
            })
        )
    })
})
