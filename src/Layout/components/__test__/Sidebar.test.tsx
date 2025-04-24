import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import Sidebar from '../Sidebar'

// Mock the child components
vi.mock('../SidebarLogo', () => ({
    default: ({ collapsed }: { collapsed: boolean }) => (
        <div data-testid="sidebar-logo" data-collapsed={collapsed}>
            Logo
        </div>
    ),
}))

vi.mock('../SidebarNavList', () => ({
    default: ({ collapsed }: { collapsed: boolean }) => (
        <div data-testid="sidebar-nav-list" data-collapsed={collapsed}>
            Nav List
        </div>
    ),
}))

vi.mock('../SidebarFooter', () => ({
    default: ({
        collapsed,
        user,
        handleLogout,
    }: {
        collapsed: boolean
        user: any
        handleLogout: () => void
    }) => (
        <div data-testid="sidebar-footer" data-collapsed={collapsed}>
            Footer
        </div>
    ),
}))

// Mock the useAuth hook
vi.mock('../../../contexts/AuthProvider', () => ({
    useAuth: () => ({
        user: { lastName: 'Smith' },
        handleLogout: vi.fn(),
    }),
}))

// Properly mock react-router-dom using importOriginal
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = (await importOriginal()) as any
    return {
        ...actual,
        Outlet: () => <div data-testid="outlet">Outlet Content</div>,
    }
})

describe('Sidebar Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const renderSidebar = () => {
        const { BrowserRouter } = require('react-router-dom')
        return render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        )
    }

    test('renders correctly with initial collapsed state', () => {
        renderSidebar()

        // Check if the sidebar is rendered
        const sidebarElement = screen
            .getByTestId('sidebar-logo')
            .closest('div[class*="flex flex-col bg-secondary"]')
        expect(sidebarElement).toBeDefined()

        // Check if it has the collapsed width class
        expect(sidebarElement?.className).toContain('w-20')

        // Check if child components are rendered with collapsed=true
        expect(
            screen.getByTestId('sidebar-logo').getAttribute('data-collapsed')
        ).toBe('true')
        expect(
            screen
                .getByTestId('sidebar-nav-list')
                .getAttribute('data-collapsed')
        ).toBe('true')
        expect(
            screen.getByTestId('sidebar-footer').getAttribute('data-collapsed')
        ).toBe('true')
    })

    test('expands on mouse enter and collapses on mouse leave', () => {
        renderSidebar()

        const sidebarElement = screen
            .getByTestId('sidebar-logo')
            .closest('div[class*="flex flex-col bg-secondary"]')
        expect(sidebarElement).toBeDefined()

        // Initially collapsed
        expect(sidebarElement?.className).toContain('w-20')

        // Simulate mouse enter
        fireEvent.mouseEnter(sidebarElement!)

        // Should be expanded
        expect(sidebarElement?.className).toContain('w-1/5')
        expect(
            screen.getByTestId('sidebar-logo').getAttribute('data-collapsed')
        ).toBe('false')
        expect(
            screen
                .getByTestId('sidebar-nav-list')
                .getAttribute('data-collapsed')
        ).toBe('false')
        expect(
            screen.getByTestId('sidebar-footer').getAttribute('data-collapsed')
        ).toBe('false')

        // Simulate mouse leave
        fireEvent.mouseLeave(sidebarElement!)

        // Should be collapsed again
        expect(sidebarElement?.className).toContain('w-20')
        expect(
            screen.getByTestId('sidebar-logo').getAttribute('data-collapsed')
        ).toBe('true')
        expect(
            screen
                .getByTestId('sidebar-nav-list')
                .getAttribute('data-collapsed')
        ).toBe('true')
        expect(
            screen.getByTestId('sidebar-footer').getAttribute('data-collapsed')
        ).toBe('true')
    })
})
