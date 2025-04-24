import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import SidebarNavList from '../SidebarNavList'

// Mock the SidebarNavItem component
vi.mock('../SidebarNavItem', () => ({
    default: ({ to, icon, label, testId, collapsed }: any) => (
        <div data-testid={testId} data-to={to} data-collapsed={collapsed}>
            {icon}
            {label}
        </div>
    ),
}))

// Mock the icons
vi.mock('@mui/icons-material/MonitorHeart', () => ({
    default: () => <span data-testid="monitor-icon">MonitorIcon</span>,
}))

vi.mock('react-icons/md', () => ({
    MdDisplaySettings: () => (
        <span data-testid="settings-icon">SettingsIcon</span>
    ),
}))

vi.mock('react-icons/lia', () => ({
    LiaNotesMedicalSolid: () => <span data-testid="notes-icon">NotesIcon</span>,
}))

// Properly mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = (await importOriginal()) as any
    return {
        ...actual,
    }
})

describe('SidebarNavList Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('renders all navigation items when collapsed', () => {
        const { BrowserRouter } = require('react-router-dom')
        render(
            <BrowserRouter>
                <SidebarNavList collapsed={true} />
            </BrowserRouter>
        )

        // Check if all nav items are rendered
        expect(screen.getByTestId('monitor-link')).toBeDefined()
        expect(screen.getByTestId('configuration-link')).toBeDefined()
        expect(screen.getByTestId('presets-link')).toBeDefined()

        // Check if all items have collapsed=true
        expect(
            screen.getByTestId('monitor-link').getAttribute('data-collapsed')
        ).toBe('true')
        expect(
            screen
                .getByTestId('configuration-link')
                .getAttribute('data-collapsed')
        ).toBe('true')
        expect(
            screen.getByTestId('presets-link').getAttribute('data-collapsed')
        ).toBe('true')

        // Check if the correct paths are set
        expect(screen.getByTestId('monitor-link').getAttribute('data-to')).toBe(
            '/'
        )
        expect(
            screen.getByTestId('configuration-link').getAttribute('data-to')
        ).toBe('/configuration')
        expect(screen.getByTestId('presets-link').getAttribute('data-to')).toBe(
            '/presets'
        )
    })

    test('renders all navigation items when expanded', () => {
        const { BrowserRouter } = require('react-router-dom')
        render(
            <BrowserRouter>
                <SidebarNavList collapsed={false} />
            </BrowserRouter>
        )

        // Check if all nav items are rendered
        expect(screen.getByTestId('monitor-link')).toBeDefined()
        expect(screen.getByTestId('configuration-link')).toBeDefined()
        expect(screen.getByTestId('presets-link')).toBeDefined()

        // Check if all items have collapsed=false
        expect(
            screen.getByTestId('monitor-link').getAttribute('data-collapsed')
        ).toBe('false')
        expect(
            screen
                .getByTestId('configuration-link')
                .getAttribute('data-collapsed')
        ).toBe('false')
        expect(
            screen.getByTestId('presets-link').getAttribute('data-collapsed')
        ).toBe('false')
    })
})
