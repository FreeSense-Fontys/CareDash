import { describe, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HomePage from '.'

// Mock any API services used by PatientListForm
vi.mock('../Auth', () => ({
    default: {
        data: {
            documents: {
                findAll: vi.fn().mockResolvedValue([]),
            },
        },
        tasks: {
            api: {
                get: vi.fn().mockResolvedValue({}),
            },
        },
    },
}))

vi.mock('../Monitor/index', () => ({
    default: () => <div data-testid="patient-list-form">Patient List Form</div>,
}))

describe('Home page', () => {
    it('should render the home page', () => {
        render(<HomePage />)
        const patientListForm = screen.getByTestId('patient-list-form')
        expect(patientListForm).toBeInTheDocument()
    })
})
