import { describe, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import HomePage from '.'

// Mock any API services used by PatientListForm
vi.mock('../../Auth', () => ({
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

describe('Home page', () => {
    it('should render the home page', () => {
        render(<HomePage />)
    })
})
