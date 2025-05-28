import { describe, it, Mock, vi, vitest } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import PatientListForm from './index'
import dayjs from 'dayjs'
import { PatientProvider } from '../contexts/PatientProvider'
import exh from '../Auth'

// Mock any API services used by PatientListForm
vi.mock('../Auth', () => {
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

describe('Monitor page', () => {
    it('renders without crashing', () => {
        ;(exh.data.documents.findAll as Mock).mockResolvedValue(mockPatients)
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
