import { describe, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Layout from '.'
import { useAuth } from '../contexts/AuthProvider'

// Mock AuthProvider
vi.mock('../contexts/AuthProvider')

describe('logout', () => {
    beforeEach(async () => {
        render(<Layout />)
    })
    it('should go back to login page', async () => {
        const { handleLogout } = useAuth()
        const logoutButton = screen.getByTestId('logout-button')
        await userEvent.click(logoutButton)

        expect(handleLogout).toHaveBeenCalledTimes(1)
    })
})
