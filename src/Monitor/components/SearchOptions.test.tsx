import { describe, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import PatientListForm from '..'

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

describe('Calendar', () => {
    vi.mock('../components/AddMockVitals', () => ({
        AddMockVitals: vi.fn(),
      }))

    beforeEach(async () => {
        render(<PatientListForm />)
    })

    afterEach(async () => {
        vi.clearAllMocks()
    })

    it('previous day success', async () => {
        // Check the current date is on the screen
        const currentDate = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
        const formattedDate = currentDate.replace(/ (\w{3}) /, ' $1, ');
        expect(screen.getByText(formattedDate)).toBeInTheDocument()

        // Go the the previous day
        const mockButton = screen.getByTestId('prev_day')
        await userEvent.click(mockButton)

        // Check the previous day is on the screen
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const prevDay = yesterday.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        });
        const formattedPrevDate = prevDay.replace(/ (\w{3}) /, ' $1, ');

        expect(screen.getByText(formattedPrevDate)).toBeInTheDocument()
    })

    it('next day success', async () => {
        // Check the current date is on the screen
        const currentDate = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
        const formattedDate = currentDate.replace(/ (\w{3}) /, ' $1, ');
        expect(screen.getByText(formattedDate)).toBeInTheDocument()

        // Go the the previous day
        const mockButton = screen.getByTestId('next_day')
        await userEvent.click(mockButton)

        // Check the previous day is on the screen
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextDay = tomorrow.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        });
        const formattedPrevDate = nextDay.replace(/ (\w{3}) /, ' $1, ');

        expect(screen.getByText(formattedPrevDate)).toBeInTheDocument()
    })
})
