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
                    findFirst: vi.fn(),
                },
            },
        },
    }
})

describe('Patient list', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    it('renders the patient list', async () => {
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

    it('filters patients by search query', async () => {
        ;(exh.data.documents.findAll as Mock).mockResolvedValue([
            {
                id: 'test1',
                data: {
                    name: 'Annelies Coos',
                    gender: 'F',
                    email: 'annelies.coos@example.com',
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
            {
                id: 'test2',
                data: {
                    name: 'Hanna Rinus',
                    gender: 'F',
                    email: 'hanna.rinus@example.com',
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

        render(<PatientList selectedDate="2025-05-08" searchQuery="ann" />)

        await waitFor(() => {
            const list = screen.getByTestId('patient-list')
            expect(list).toBeInTheDocument()
            expect(screen.getByTestId('patient-name-test1')).toHaveTextContent(
                'Annelies Coos'
            )
            expect(screen.getByTestId('patient-name-test2')).toHaveTextContent(
                'Hanna Rinus'
            )
        })
    })

    it('shows no results message when search query has no matches', async () => {
        ;(exh.data.documents.findAll as Mock).mockResolvedValue([
            {
                id: 'test1',
                data: {
                    name: 'Annelies Coos',
                    gender: 'F',
                    email: 'annelies.coos@example.com',
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

        render(<PatientList selectedDate="2025-05-08" searchQuery="john" />)

        await waitFor(() => {
            expect(screen.getByTestId('patient-list')).toHaveTextContent(
                'No patients found matching your search.'
            )
        })
    })

    it('highlights matched search query in patient name', async () => {
        ;(exh.data.documents.findAll as Mock).mockResolvedValue([
            {
                id: 'test1',
                data: {
                    name: 'Annelies Coos',
                    gender: 'F',
                    email: 'annelies.coos@example.com',
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

        render(<PatientList selectedDate="2025-05-08" searchQuery="ann" />)

        await waitFor(() => {
            const highlighted = screen.getByText('Ann', { exact: false })
            expect(highlighted).toHaveClass('bg-blue-200')
        })
    })

    it('filters patients by carepath', async () => {
        ;(exh.data.documents.findAll as Mock).mockResolvedValue([
            {
                id: 'test1',
                data: {
                    name: 'Annelies Coos',
                    gender: 'F',
                    email: 'annelies.coos@example.com',
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

        render(
            <PatientList
                selectedDate="2025-05-08"
                filterCarepath="COPD"
                searchQuery=""
                filterOrder="Alphabetical"
            />
        )

        await waitFor(() => {
            const list = screen.getByTestId('patient-list')
            expect(list).toBeInTheDocument()
            expect(screen.getByTestId('patient-name-test1')).toHaveTextContent(
                'Annelies Coos'
            )
        })
    })

    it('filters out patients by carepath', async () => {
        ;(exh.data.documents.findAll as Mock).mockResolvedValue([
            {
                id: 'test1',
                data: {
                    name: 'Annelies Coos',
                    gender: 'F',
                    email: 'annelies.coos@example.com',
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

        render(
            <PatientList
                selectedDate="2025-05-08"
                filterCarepath="Lime"
                searchQuery=""
                filterOrder="Alphabetical"
            />
        )

        await waitFor(() => {
            const list = screen.getByTestId('patient-list')
            expect(list).toBeInTheDocument()
            expect(
                screen.queryByTestId('patient-name-test1')
            ).not.toBeInTheDocument()
        })
    })
})
