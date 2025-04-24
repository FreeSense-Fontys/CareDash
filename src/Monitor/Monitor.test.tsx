import { describe, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PatientListForm from '.'
import userEvent from '@testing-library/user-event'
import AddMockVitals from './components/AddMockVitals'

vi.mock('../../Auth', () => {
    return {
        default: {
            data: {
                documents: {
                    findAll: vi.fn(),
                },
            },
        },
        tasks: {
            api: {
                get: vi.fn(),
            },
        },
        authenticate: vi.fn(),
    }
})

vi.mock('./components/AddMockVitals', async (importOriginal) => {
    const actual = (await importOriginal()) as object
    return {
        ...actual,
        default: {
            AddMockVitals: vi.fn(),
        },
    }
})

describe('Patient list form', () => {
    beforeEach(async () => {
        render(<PatientListForm />)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('mock button success', async () => {
        const mockButton = screen.getByTestId('mock_vitals')

        await userEvent.click(mockButton)

        expect(AddMockVitals.AddMockVitals).toHaveBeenCalled()
    })
})
