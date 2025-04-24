import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach, Mock } from 'vitest'
import SidebarNavItem from '../SidebarNavItem'
import { MemoryRouter, useLocation } from 'react-router-dom'

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
    const actual: any = await importOriginal()
    return {
        ...(actual as object),
        useLocation: vi.fn(() => ({
            pathname: '/test-path',
        })),
        MemoryRouter: actual.MemoryRouter,
    }
})

describe('SidebarNavItem Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const defaultProps = {
        to: '/test-path',
        icon: <span data-testid="test-icon">Icon</span>,
        label: 'Test Label',
        testId: 'test-nav-item',
        collapsed: true,
    }

    test('renders correctly when collapsed', () => {
        render(
            <MemoryRouter>
                <SidebarNavItem {...defaultProps} />
            </MemoryRouter>
        )

        const navItem = screen.getByTestId('test-nav-item')
        expect(navItem).toBeInTheDocument()
        expect(navItem).toHaveClass('justify-center')
        expect(navItem).toHaveClass('w-full')
        expect(screen.getByTestId('test-icon')).toBeInTheDocument()
        expect(screen.queryByText('Test Label')).toBeNull()
    })

    test('renders correctly when expanded', () => {
        render(
            <MemoryRouter>
                <SidebarNavItem {...defaultProps} collapsed={false} />
            </MemoryRouter>
        )

        const navItem = screen.getByTestId('test-nav-item')
        expect(navItem).toBeInTheDocument()
        expect(navItem).toHaveClass('justify-center')
        expect(navItem).toHaveClass('w-full')
        expect(screen.getByTestId('test-icon')).toBeInTheDocument()
        expect(screen.getByText('Test Label')).toBeInTheDocument()
    })

    test('does not have active styling when path does not match', () => {
        // Override mocked useLocation for this specific test
        ;(useLocation as unknown as Mock).mockReturnValue({
            pathname: '/different-path',
        })

        render(
            <MemoryRouter>
                <SidebarNavItem {...defaultProps} />
            </MemoryRouter>
        )

        const navItem = screen.getByTestId('test-nav-item')
        expect(navItem).not.toHaveClass('bg-accent')
    })
})
