import { describe, it, expect, vi, Mock } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PatientList from './PatientList'
import exh from '../../Auth'

vi.mock('../../Auth', () => {
    return {
        default: {
            data: {
                documents: {
                    findAll: vi.fn(),
                },
            },
        },
    }
})

describe('Patient list form', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    it('renders the patient list form', async () => {
        ;(exh.data.documents.findAll as Mock).mockResolvedValue([
            {
                id: 'test',
                data: {
                    name: 'John Doe',
                    gender: 'M',
                    email: 'john.doe@example.com',
                    language: 'EN',
                    phoneNumber: '',
                    coupledWearables: [
                        {
                            id: 'wid',
                            wearableId: 'wid',
                            productName: 'CareBuddy',
                            status: 'active',
                            enrolledGroups: ['caregroupid'],
                        },
                    ],
                },
                status: true,
            },
        ])

        render(<PatientList selectedDate="2025-04-17" />)
        await waitFor(() => {
            expect(screen.getByTestId('patient-list')).toBeInTheDocument()
        })
    })

    it('should render nothing', async () => {
        ;(exh.data.documents.findAll as Mock).mockResolvedValue(null)
        render(<PatientList selectedDate="2025-04-17" />)
        await waitFor(() => {
            expect(screen.queryByTestId('patient-list')).not.toBeInTheDocument()
        })
    })

    it('should render the patient is not active', async () => {
        ;(exh.data.documents.findAll as Mock).mockResolvedValue([
            {
                id: 'test',
                data: {
                    name: 'John Doe',
                    gender: 'M',
                    email: 'john.doe@example.com',
                    language: 'EN',
                    phoneNumber: '',
                    coupledWearables: [
                        {
                            id: 'wid',
                            wearableId: 'wid',
                            productName: 'CareBuddy',
                            status: 'active',
                            enrolledGroups: ['caregroupid'],
                        },
                    ],
                },
                status: false,
            },
        ])
        render(<PatientList selectedDate="2025-04-17" />)
        await waitFor(() => {
            expect(screen.getByTestId('patient-list')).toBeInTheDocument()
            expect(screen.getByTestId('patient-status')).toHaveClass(
                'bg-gray-500'
            )
        })
    })
})
