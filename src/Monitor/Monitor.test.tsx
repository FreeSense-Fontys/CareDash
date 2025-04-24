import { describe, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import PatientListForm from '.'

vi.mock('../Auth', () => {
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
    }
})

describe('Patient list form', () => {
    beforeEach(async () => {
        render(<PatientListForm />)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('test', () => {
        expect(true).toBe(true)
    })
})
