import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import DetailPage, {
    dangerousTemperature,
    dangerousHeartRate,
    dangerousBPM,
    dangerousLowBPM,
    missingData,
} from '.'
import exh from '../Auth'
import { usePatient } from '../contexts/PatientProvider'

// Mock dependencies
vi.mock('../Auth', () => ({
    default: {
        tasks: {
            api: {
                get: vi.fn(),
            },
        },
    },
}))

vi.mock('../contexts/PatientProvider', () => ({
    usePatient: vi.fn(),
}))

vi.mock('./Components/vital-graph', () => ({
    default: ({ chartData }) => (
        <div data-testid="vital-graph">{chartData.datasets[0].label}</div>
    ),
}))

vi.mock('chart.js/auto', () => ({
    default: {
        register: vi.fn(),
    },
}))

describe('DetailPage', () => {
    const mockPatient = {
        name: 'John Doe',
        gender: 'Male',
        carePath: 'General',
        bmi: '24.5',
        birthDate: '1980-01-01',
        skinType: 'Normal',
    }

    const mockVitalsData = {
        vitals: [
            {
                name: 'SBP',
                series: [
                    { timestamp: '2023-01-01T10:00:00Z', value: 120 },
                    { timestamp: '2023-01-01T11:00:00Z', value: 125 },
                ],
            },
            {
                name: 'DBP',
                series: [
                    { timestamp: '2023-01-01T10:00:00Z', value: 80 },
                    { timestamp: '2023-01-01T11:00:00Z', value: 85 },
                ],
            },
            {
                name: 'HR',
                series: [
                    { timestamp: '2023-01-01T10:00:00Z', value: 72 },
                    { timestamp: '2023-01-01T11:00:00Z', value: 75 },
                ],
            },
        ],
    }

    beforeEach(() => {
        vi.clearAllMocks()

        // Default mock implementation
        vi.mocked(usePatient).mockReturnValue({
            selectedPatient: mockPatient,
            selectedWearableId: 'wearable-123',
        })

        vi.mocked(exh.tasks.api.get).mockResolvedValue(mockVitalsData)
    })

    test('renders loading state initially', () => {
        render(<DetailPage currentDate="2023-01-01" />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('renders patient information', async () => {
        render(<DetailPage currentDate="2023-01-01" />)

        await waitFor(() => {
            expect(screen.getByText('Patient: John Doe')).toBeInTheDocument()
            expect(screen.getByText('Sex: Male')).toBeInTheDocument()
            expect(screen.getByText('Care Path: General')).toBeInTheDocument()
            expect(screen.getByText('BMI: 24.5')).toBeInTheDocument()
            expect(screen.getByText('DOB: 1980-01-01')).toBeInTheDocument()
            expect(screen.getByText('Skin Type: Normal')).toBeInTheDocument()
        })
    })

    test('renders vital graphs when data is available', async () => {
        render(<DetailPage currentDate="2023-01-01" />)

        await waitFor(() => {
            // Should have 2 vital graphs (Blood Pressure and HR)
            const vitalGraphs = screen.getAllByTestId('vital-graph')
            expect(vitalGraphs).toHaveLength(2)

            // Check the labels of the graphs
            expect(vitalGraphs[0].textContent).toContain(
                'Systolic Blood Pressure'
            )
            expect(vitalGraphs[1].textContent).toContain('HR')
        })
    })

    test('handles case when no wearable ID is selected', async () => {
        vi.mocked(usePatient).mockReturnValue({
            selectedPatient: mockPatient,
            selectedWearableId: undefined,
        })

        render(<DetailPage currentDate="2023-01-01" />)

        await waitFor(() => {
            expect(screen.queryByTestId('vital-graph')).not.toBeInTheDocument()
            expect(exh.tasks.api.get).not.toHaveBeenCalled()
        })
    })

    test('handles case when API returns no data', async () => {
        vi.mocked(exh.tasks.api.get).mockResolvedValue(null)

        render(<DetailPage currentDate="2023-01-01" />)

        await waitFor(() => {
            expect(screen.getByText('No data available')).toBeInTheDocument()
        })
    })

    test('handles case when API returns no vitals', async () => {
        vi.mocked(exh.tasks.api.get).mockResolvedValue({ vitals: [] })

        render(<DetailPage currentDate="2023-01-01" />)

        await waitFor(() => {
            expect(screen.getByText('No data available')).toBeInTheDocument()
        })
    })

    test('handles case when no blood pressure data is available', async () => {
        vi.mocked(exh.tasks.api.get).mockResolvedValue({
            vitals: [
                {
                    name: 'HR',
                    series: [
                        { timestamp: '2023-01-01T10:00:00Z', value: 72 },
                        { timestamp: '2023-01-01T11:00:00Z', value: 75 },
                    ],
                },
            ],
        })

        render(<DetailPage currentDate="2023-01-01" />)

        await waitFor(() => {
            const vitalGraphs = screen.getAllByTestId('vital-graph')
            expect(vitalGraphs).toHaveLength(1)
            expect(vitalGraphs[0].textContent).toContain('HR')
        })
    })
})

describe('Vital threshold utility functions', () => {
    const createMockContext = (
        value1: number,
        value2: number,
        skip1 = false,
        skip2 = false
    ) => ({
        p0: { parsed: { y: value1 }, skip: skip1 },
        p1: { parsed: { y: value2 }, skip: skip2 },
    })

    describe('dangerousTemperature', () => {
        test('returns danger color when temperature ≥ 40°C', () => {
            const ctx = createMockContext(40, 38)
            expect(dangerousTemperature(ctx, 'red')).toBe('red')

            const ctx2 = createMockContext(38, 40)
            expect(dangerousTemperature(ctx2, 'red')).toBe('red')
        })

        test('returns danger color when temperature ≤ 34°C', () => {
            const ctx = createMockContext(34, 36)
            expect(dangerousTemperature(ctx, 'red')).toBe('red')

            const ctx2 = createMockContext(36, 33)
            expect(dangerousTemperature(ctx2, 'red')).toBe('red')
        })

        test('returns undefined for normal temperature', () => {
            const ctx = createMockContext(36, 37)
            expect(dangerousTemperature(ctx, 'red')).toBeUndefined()
        })
    })

    describe('dangerousHeartRate', () => {
        test('returns danger color when heart rate ≥ 90 bpm', () => {
            const ctx = createMockContext(90, 85)
            expect(dangerousHeartRate(ctx, 'red')).toBe('red')

            const ctx2 = createMockContext(85, 95)
            expect(dangerousHeartRate(ctx2, 'red')).toBe('red')
        })

        test('returns danger color when heart rate ≤ 40 bpm', () => {
            const ctx = createMockContext(40, 45)
            expect(dangerousHeartRate(ctx, 'red')).toBe('red')

            const ctx2 = createMockContext(45, 38)
            expect(dangerousHeartRate(ctx2, 'red')).toBe('red')
        })

        test('returns undefined for normal heart rate', () => {
            const ctx = createMockContext(60, 70)
            expect(dangerousHeartRate(ctx, 'red')).toBeUndefined()
        })
    })

    describe('dangerousBPM', () => {
        test('returns danger color when SBP ≥ 140 mmHg', () => {
            const ctx = createMockContext(140, 135)
            expect(dangerousBPM(ctx, 'red')).toBe('red')

            const ctx2 = createMockContext(135, 145)
            expect(dangerousBPM(ctx2, 'red')).toBe('red')
        })

        test('returns danger color when SBP ≤ 90 mmHg', () => {
            const ctx = createMockContext(90, 95)
            expect(dangerousBPM(ctx, 'red')).toBe('red')

            const ctx2 = createMockContext(95, 85)
            expect(dangerousBPM(ctx2, 'red')).toBe('red')
        })

        test('returns undefined for normal SBP', () => {
            const ctx = createMockContext(110, 120)
            expect(dangerousBPM(ctx, 'red')).toBeUndefined()
        })
    })

    describe('dangerousLowBPM', () => {
        test('returns danger color when DBP ≤ 82 mmHg', () => {
            const ctx = createMockContext(82, 85)
            expect(dangerousLowBPM(ctx, 'red')).toBe('red')

            const ctx2 = createMockContext(85, 80)
            expect(dangerousLowBPM(ctx2, 'red')).toBe('red')
        })

        test('returns undefined for normal DBP', () => {
            const ctx = createMockContext(85, 88)
            expect(dangerousLowBPM(ctx, 'red')).toBeUndefined()
        })
    })

    describe('missingData', () => {
        test('returns specified style for missing data points', () => {
            const ctx = createMockContext(120, 125, true, false)
            expect(missingData(ctx, 'gray')).toBe('gray')

            const ctx2 = createMockContext(120, 125, false, true)
            expect(missingData(ctx2, 'gray')).toBe('gray')
        })

        test('returns undefined when both data points exist', () => {
            const ctx = createMockContext(120, 125, false, false)
            expect(missingData(ctx, 'gray')).toBeUndefined()
        })
    })
})
