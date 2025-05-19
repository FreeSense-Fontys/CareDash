import { describe, it, expect, vi, Mock } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PatientList from './PatientList'
import { PatientProvider } from '../../contexts/PatientProvider'
import exh from '../../Auth'

const mockPatients = [
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
        carepaths: [{ name: 'COPD' }],
        status: true,
    },
    {
        id: 'test2',
        data: {
            name: 'Hannah Rinus',
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
        carepaths: [{ name: 'COPD' }],
        status: true,
    },
    {
        id: 'test3',
        data: {
            name: 'John Doe',
            gender: 'F',
            email: 'annelies.coos@example.com',
            language: 'EN',
            phoneNumber: '',
            coupledWearables: [
                {
                    id: 'wid',
                    wearableId: 'wid',
                    productName: 'CareBuddy',
                    status: 'inactive',
                    enrolledGroups: ['caregroupid'],
                },
            ],
        },
        carepaths: [{ name: 'COPD' }],
        status: false,
    },
]

// Mock the PatientProvider
vi.mock('../../contexts/PatientProvider', () => ({
    PatientProvider: ({ children }: { children: React.ReactNode }) => children,
    usePatient: () => ({
        patients: mockPatients,
        setPatients: vi.fn(),
        setIsWearableSelected: vi.fn(),
        selectedWearableId: null,
        isWearableSelected: false,
        setSelectedWearableId: vi.fn(),
        setSelectedPatient: vi.fn(),
        wearables: [],
        setWearables: vi.fn(),
        hasChecked: false,
        setHasChecked: vi.fn(),
    }),
}))

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
        render(
            <PatientList
                selectedDate="2025-04-17"
                searchQuery=""
                filterCarepath=""
                filterOrder=""
            />
        )
        await waitFor(() => {
            expect(screen.getByTestId('patient-list')).toBeInTheDocument()
        })
    })

    it('should render nothing when no patients in API response', async () => {
        ;(exh.data.documents.findAll as Mock).mockResolvedValue(null)

        render(
            <PatientList
                selectedDate="2025-04-17"
                searchQuery="no patients"
                filterCarepath=""
                filterOrder=""
            />
        )

        await waitFor(() => {
            // Instead of checking for absence of patient-list, check for "No patients found" message
            expect(screen.getByTestId('patient-list')).toHaveTextContent(
                'No patients found matching your search.'
            )
        })
    })

    it('should render the patient is not active', async () => {
        render(
            <PatientList
                selectedDate="2025-04-17"
                searchQuery="john"
                filterCarepath=""
                filterOrder=""
            />
        )

        await waitFor(() => {
            expect(screen.getByTestId('patient-list')).toBeInTheDocument()

            // Use getAllByTestId and check the first one (or a specific one if you need to)
            const statusIndicators = screen.getAllByTestId('patient-status')
            expect(statusIndicators[0]).toHaveClass(
                'w-3 h-3 bg-gray-500 rounded-full'
            )
        })
    })

    it('filters patients by search query', async () => {
        render(
            <PatientProvider>
                <PatientList
                    selectedDate="2025-05-08"
                    searchQuery="ann"
                    filterCarepath=""
                    filterOrder=""
                />
            </PatientProvider>
        )

        await waitFor(() => {
            const list = screen.getByTestId('patient-list')
            expect(list).toBeInTheDocument()

            // Check if the container has the patient names using within
            expect(list).toHaveTextContent('Annelies Coos')
            expect(list).toHaveTextContent('Hannah Rinus')

            // Verify that both patients are displayed
            const patientItems = screen.getAllByTestId('patient-status')
            expect(patientItems).toHaveLength(2)
        })
    })

    it('shows no results message when search query has no matches', async () => {
        render(
            <PatientProvider>
                <PatientList
                    selectedDate="2025-05-08"
                    searchQuery="blob"
                    filterCarepath=""
                    filterOrder=""
                />
            </PatientProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('patient-list')).toHaveTextContent(
                'No patients found matching your search.'
            )
        })
    })

    it('highlights matched search query in patient name', async () => {
        render(
            <PatientProvider>
                <PatientList
                    selectedDate="2025-05-08"
                    searchQuery="ann"
                    filterCarepath=""
                    filterOrder=""
                />
            </PatientProvider>
        )

        await waitFor(() => {
            const highlighted = screen.getByText('Ann', {
                exact: true,
            })
            expect(highlighted).toHaveClass('bg-blue-200 font-bold')
        })
    })

    it('filters patients by carepath', async () => {
        render(
            <PatientProvider>
                <PatientList
                    selectedDate="2025-05-08"
                    filterCarepath="COPD"
                    searchQuery=""
                    filterOrder=""
                />
            </PatientProvider>
        )

        await waitFor(() => {
            const list = screen.getByTestId('patient-list')
            expect(list).toBeInTheDocument()
            expect(screen.getByText('Annelies Coos'))
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
