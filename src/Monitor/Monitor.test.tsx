import { describe, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PatientListForm from '.'
import userEvent from '@testing-library/user-event'
import AddMockVitals from './components/AddMockVitals'

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

describe('Patient list form', () => {
    vi.mock('../components/AddMockVitals', () => ({
        AddMockVitals: vi.fn(),
    }))

    beforeEach(async () => {
        render(<PatientListForm />)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('mock button success', async () => {
        const mockButton = screen.getByTestId('mock_vitals')

        await userEvent.click(mockButton)

        vi.mock('./components/AddMockVitals')
        expect(AddMockVitals.AddMockVitals).toHaveBeenCalled()
    })
})
