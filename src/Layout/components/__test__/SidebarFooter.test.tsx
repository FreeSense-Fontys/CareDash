import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import SidebarFooter from '../SidebarFooter'

// Mock the useNavigate hook
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}))

// Mock the LogoutIcon
vi.mock('@mui/icons-material/Logout', () => ({
    default: () => <span data-testid="logout-icon">LogoutIcon</span>,
}))

describe('SidebarFooter Component', () => {
    const mockUser = { lastName: 'Smith' }
    const mockHandleLogout = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('renders correctly when collapsed', () => {
        render(
            <SidebarFooter
                collapsed={true}
                user={mockUser}
                handleLogout={mockHandleLogout}
            />
        )

        // User info should not be visible when collapsed
        expect(screen.queryByText('Good morning,')).toBeNull()
        expect(screen.queryByText('Dr. Smith')).toBeNull()

        // Logout button should be visible but without text
        const logoutButton = screen.getByTestId('logout-button')
        expect(logoutButton).toBeDefined()
        expect(logoutButton.className).toContain('w-12')
        expect(logoutButton.className).toContain('h-12')
        expect(screen.queryByText('Logout')).toBeNull()
        expect(screen.getByTestId('logout-icon')).toBeDefined()
    })

    test('renders correctly when expanded', () => {
        render(
            <SidebarFooter
                collapsed={false}
                user={mockUser}
                handleLogout={mockHandleLogout}
            />
        )

        // User info should be visible when expanded
        expect(screen.getByText('Good morning,')).toBeDefined()
        expect(screen.getByText('Dr. Smith')).toBeDefined()

        // Logout button should show text
        const logoutButton = screen.getByTestId('logout-button')
        expect(logoutButton).toBeDefined()
        expect(screen.getByText('Logout')).toBeDefined()
        expect(screen.getByTestId('logout-icon')).toBeDefined()
    })

    test('calls handleLogout and navigates when logout button is clicked', () => {
        render(
            <SidebarFooter
                collapsed={false}
                user={mockUser}
                handleLogout={mockHandleLogout}
            />
        )

        const logoutButton = screen.getByTestId('logout-button')
        fireEvent.click(logoutButton)

        // Should call the handleLogout function
        expect(mockHandleLogout).toHaveBeenCalledTimes(1)

        // Should navigate to login page
        expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    test('handles null user gracefully', () => {
        render(
            <SidebarFooter
                collapsed={false}
                user={null}
                handleLogout={mockHandleLogout}
            />
        )

        // Should still render without errors
        expect(screen.getByText('Good morning,')).toBeDefined()
        // Should show "Dr. " without a last name
        expect(screen.getByText('Dr.')).toBeDefined()
    })
})
