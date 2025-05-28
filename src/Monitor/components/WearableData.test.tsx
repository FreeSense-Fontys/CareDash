import { describe, it, expect, Mock, vi } from 'vitest'
import { act, render, waitFor, screen } from '@testing-library/react'
import WearableData from './WearableData'
import '@testing-library/jest-dom'
import exh from '../../Auth'
import { PatientProvider } from '../../contexts/PatientProvider'

vi.mock('../../Auth', () => {
    return {
        default: {
            data: {
                documents: {
                    findFirst: vi.fn(),
                    findAll: vi.fn(),
                },
            },
        },
    }
})

const mockPatients = [
    {
        id: 'patientid',
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
    },
]

const mockSelectedDate = '2025-04-17'

const mockPatientIndex = 0

describe('WearableData', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should set wearable data', async () => {
        ;(exh.data.documents.findFirst as Mock).mockResolvedValue({
            id: 'wid',
            data: {
                vitals: [
                    {
                        name: 'HR',
                        value: 70,
                    },
                    {
                        name: 'SBP',
                        value: 120,
                    },
                    {
                        name: 'DBP',
                        value: 70,
                    },
                    {
                        name: 'SPO2',
                        value: 120,
                    },
                    {
                        name: 'RR',
                        value: 70,
                    },
                    {
                        name: 'T',
                        value: 120.4132,
                    },
                ],
            },
        })

        await act(async () => {
            render(
                <PatientProvider>
                    <WearableData
                        patients={mockPatients}
                        selectedDate={mockSelectedDate}
                        indexPatient={mockPatientIndex}
                    />
                </PatientProvider>
            )
        })

        expect(exh.data.documents.findFirst).toHaveBeenCalled()
    })

    it('should render the checkbox', async () => {
        await act(async () => {
            await waitFor(() => {
                render(
                    <PatientProvider>
                        <WearableData
                            patients={mockPatients}
                            selectedDate={mockSelectedDate}
                            indexPatient={mockPatientIndex}
                        />
                    </PatientProvider>
                )
            })
        })

        const checkboxes = screen.queryByTestId('checkbox')
        expect(checkboxes).toBeInTheDocument()
    })

    it('should handle case with empty wearables array', async () => {
        // Mock the API to return an empty array instead of null/undefined
        ;(exh.data.documents.findFirst as Mock).mockResolvedValue([
            {
                id: 'wid',
                vitals: [],
            },
        ])

        await act(async () => {
            render(
                <PatientProvider>
                    <WearableData
                        patients={mockPatients}
                        selectedDate={mockSelectedDate}
                        indexPatient={mockPatientIndex}
                    />
                </PatientProvider>
            )
        })

        const checkboxes = screen.queryByTestId('checkbox')
        expect(checkboxes).toBeInTheDocument() // Should still show checkbox even with no vitals
    })

    it("should only render one decimal place for 'T'", async () => {
        ;(exh.data.documents.findFirst as Mock).mockResolvedValue({
            id: 'wid',
            data: {
                vitals: [
                    {
                        name: 'HR',
                        value: 70,
                    },
                    {
                        name: 'T',
                        value: 120.4132,
                    },
                ],
            },
            updateTimestamp: '2025-04-17T00:00:00Z',
        })

        await act(async () => {
            await waitFor(() => {
                render(
                    <PatientProvider>
                        <WearableData
                            patients={mockPatients}
                            selectedDate={mockSelectedDate}
                            indexPatient={mockPatientIndex}
                        />
                    </PatientProvider>
                )
            })
        })

        const wholeNumberText = await screen.findByText('70')
        const decimalText = await screen.findByText('120.4')
        expect(decimalText).toBeInTheDocument()
        expect(wholeNumberText).toBeInTheDocument()
    })

    it('should render nothing', async () => {
        ;(exh.data.documents.findFirst as Mock).mockResolvedValue({})

        await act(() => {
            render(
                <PatientProvider>
                    <WearableData
                        patients={[]}
                        selectedDate={mockSelectedDate}
                        indexPatient={mockPatientIndex}
                    />
                </PatientProvider>
            )
        })

        const checkboxes = document.querySelectorAll('input[type="checkbox"]')
        expect(checkboxes.length).toBe(1)
    })
})
