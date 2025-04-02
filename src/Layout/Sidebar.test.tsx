import { describe, vi, it, expect } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Layout from '.'
import { useAuth } from '../contexts/AuthProvider'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

// Mock AuthProvider
vi.mock('../contexts/AuthProvider', () => ({
    useAuth: vi.fn().mockReturnValue({
        user: { firstName: 'John', lastName: 'Doe' },
        handleLogout: vi.fn(),
    }),
}))

// Need to mock the Outlet if Layout uses it
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        Outlet: () => <div data-testid="outlet-mock">Outlet Content</div>,
    }
})

describe('logout', () => {
    beforeEach(async () => {
        render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        )
    })

    it('should go back to login page', async () => {
        const { handleLogout } = useAuth()
        const logoutButton = screen.getByTestId('logout-button')
        await userEvent.click(logoutButton)

        expect(handleLogout).toHaveBeenCalledTimes(1)
    })
})

describe('navigation', () => {
    it("should show current user that's logged in", async () => {
        render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        )

        const { user } = useAuth()
        expect(screen.getByText(`Good morning,`)).toBeInTheDocument()
        expect(screen.getByText(`Dr. ${user?.lastName}`)).toBeInTheDocument()
    })

    it('should activate the correct link when clicked', async () => {
        cleanup()

        render(
            <MemoryRouter initialEntries={['/']}>
                <Layout />
            </MemoryRouter>
        )

        // verify monitor link has active styling initially
        const monitorLink = screen.getByTestId('monitor-link')
        expect(monitorLink.className).toContain('bg-accent')

        // click configuration link
        const configLink = screen.getByTestId('configuration-link')
        await userEvent.click(configLink)

        // verify configuration link has active styling
        expect(configLink.className).toContain('bg-accent')

        // click presets link
        const presetsLink = screen.getByTestId('presets-link')
        await userEvent.click(presetsLink)

        // verify presets link has active styling
        expect(presetsLink.className).toContain('bg-accent')
    })
})
