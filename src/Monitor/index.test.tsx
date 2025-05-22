import { describe, it, vi, vitest } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import PatientListForm from './index'
import dayjs from 'dayjs'
import { PatientProvider } from '../contexts/PatientProvider'

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

describe('Monitor page', () => {
    it('renders without crashing', () => {
        render(
            <PatientProvider>
                <PatientListForm
                    setSelectedDate={vitest.fn()}
                    selectedDate={dayjs()}
                />
            </PatientProvider>
        )
    })
})
