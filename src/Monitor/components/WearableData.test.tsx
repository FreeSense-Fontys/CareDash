import { describe, it, expect, Mock, vi } from 'vitest'
import { act, render, waitFor, screen } from '@testing-library/react'
import WearableData from './WearableData'
import '@testing-library/jest-dom'
import exh from '../../Auth'

vi.mock('../../Auth', () => {
    return {
        default: {
            tasks: {
                api: {
                    get: vi.fn().mockResolvedValue([
                        {
                            id: 'wid',
                            vitals: [
                                {
                                    name: 'HR',
                                    series: [{ value: 70 }],
                                },
                                {
                                    name: 'SBP',
                                    series: [{ value: 120 }],
                                },
                            ],
                        },
                    ]),
                },
            },
        },
    }
})

const mockPatients = [
    {
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
]

const mockSelectedDate = '2025-04-17'

const mockPatientIndex = 0

describe('WearableData', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it('should set wearable data', async () => {
        ;(exh.tasks.api.get as Mock).mockResolvedValue({
            id: 'wid',
            vitals: [
                {
                    name: 'HR',
                    series: [{ value: 70 }],
                },
                {
                    name: 'SBP',
                    series: [{ value: 120 }],
                },
                {
                    name: 'DBP',
                    series: [{ value: 70 }],
                },
                {
                    name: 'SPO2',
                    series: [{ value: 120 }],
                },
                {
                    name: 'RR',
                    series: [{ value: 70 }],
                },
                {
                    name: 'T',
                    series: [{ value: 120.4132 }],
                },
            ],
        })

        await act(async () => {
            render(
                <WearableData
                    patients={mockPatients}
                    selectedDate={mockSelectedDate}
                    indexPatient={mockPatientIndex}
                />
            )
        })

        expect(exh.tasks.api.get).toHaveBeenCalledWith(
            'get-observations-by-day',
            '?wearableId=wid&date=2025-04-17',
            {}
        )
    })

    it('should render the checkbox', async () => {
        await act(async () => {
            await waitFor(() => {
                render(
                    <WearableData
                        patients={mockPatients}
                        selectedDate={mockSelectedDate}
                        indexPatient={mockPatientIndex}
                    />
                )
            })
        })

        const checkboxes = screen.queryByTestId('checkbox')
        expect(checkboxes).toBeInTheDocument()
    })

    it('should handle case with empty wearables array', async () => {
        // Mock the API to return an empty array instead of null/undefined
        ;(exh.tasks.api.get as Mock).mockResolvedValue([
            {
                id: 'wid',
                vitals: [],
            },
        ])

        await act(async () => {
            render(
                <WearableData
                    patients={mockPatients}
                    selectedDate={mockSelectedDate}
                    indexPatient={mockPatientIndex}
                />
            )
        })

        // Check if the component handles empty vitals correctly
        const checkboxes = screen.queryByTestId('checkbox')
        expect(checkboxes).toBeInTheDocument() // Should still show checkbox even with no vitals
    })

    it("should only render one decimal place for 'T'", async () => {
        ;(exh.tasks.api.get as Mock).mockResolvedValue({
            id: 'wid',
            vitals: [
                {
                    name: 'T',
                    series: [{ value: 120.4132 }],
                },
            ],
        })

        await act(async () => {
            await waitFor(() => {
                render(
                    <WearableData
                        patients={mockPatients}
                        selectedDate={mockSelectedDate}
                        indexPatient={mockPatientIndex}
                    />
                )
            })
        })

        const decimalText = await screen.findByText('120.4')
        expect(decimalText).toBeInTheDocument()
    })

    it('should render nothing', async () => {
        ;(exh.tasks.api.get as Mock).mockResolvedValue({})

        await act(() => {
            render(
                <WearableData
                    patients={[]}
                    selectedDate={mockSelectedDate}
                    indexPatient={mockPatientIndex}
                />
            )
        })

        const checkboxes = document.querySelectorAll('input[type="checkbox"]')
        expect(checkboxes.length).toBe(0)
    })
})
