import {describe, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Layout from '.'


describe('logout', () => {
    const logoutMock = vi.fn()

    beforeEach(async () => {
        render(
            <Layout
                Logout={logoutMock}
            />
        )
    })
    it('should go back to login page', async () => {
        await userEvent.click(screen.getByTestId('logout-button'))

        expect(logoutMock).toHaveBeenCalledTimes(1)
    })
})