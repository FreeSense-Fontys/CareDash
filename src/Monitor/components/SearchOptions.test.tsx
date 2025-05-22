import { describe, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import SearchOptions from './SearchOptions'
import dayjs, { Dayjs } from 'dayjs'

// Mock any API services used by PatientListForm
vi.mock('../../Auth', () => ({
    default: {
        data: {
            documents: {
                findAll: vi.fn(),
            },
        },
        tasks: {
            api: {
                get: vi.fn(),
            },
        },
    },
}))

describe('Calendar', () => {
    const mockSelectedDate = dayjs()
    const mockSetOpen = vi.fn()
    const handlePrevDay = vi.fn()
    const handleNextDay = vi.fn()
    beforeEach(async () => {
        render(
            <SearchOptions
                selectedDate={mockSelectedDate}
                searchQuery=""
                setSearchQuery={vi.fn()}
                filterCarepath=""
                setFilterCarepath={vi.fn()}
                filterOrder=""
                setFilterOrder={vi.fn()}
                setSelectedDate={vi.fn()}
                open={true}
                setOpen={mockSetOpen}
                handlePrevDay={handlePrevDay}
                handleNextDay={handleNextDay}
            />
        )
    })

    afterEach(async () => {
        vi.clearAllMocks()
    })

    it('previous day success', async () => {
        // Check the current date is on the screen
        const currentDate = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        const formattedDate = currentDate.replace(/ (\w{3}) /, ' $1, ')
        expect(screen.getByText(formattedDate)).toBeInTheDocument()

        // Go to the previous day
        const mockButton = screen.getByTestId('prev_day')
        await waitFor(async () => {
            await userEvent.click(mockButton)
        })

        await expect(handlePrevDay).toHaveBeenCalled()
    })

    it('next day success', async () => {
        // Check the current date is on the screen
        const currentDate = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        const formattedDate = currentDate.replace(/ (\w{3}) /, ' $1, ')
        expect(screen.getByText(formattedDate)).toBeInTheDocument()

        // Go to the next day
        const mockButton = screen.getByTestId('next_day')
        await userEvent.click(mockButton)

        expect(handleNextDay).toHaveBeenCalled()
    })
})

// Mock the MUI DatePicker component
vi.mock('@mui/x-date-pickers/DesktopDatePicker', () => ({
    DesktopDatePicker: ({
        onChange,
        onClose,
    }: {
        onChange: (date: Dayjs) => void
        onClose: () => void
    }) => (
        <div data-testid="mock-date-picker">
            <button
                data-testid="change-date-button"
                onClick={() => onChange(dayjs('2025-05-01'))}
            >
                Change Date
            </button>
            <button data-testid="cancel-button" onClick={() => onClose()}>
                Cancel
            </button>
        </div>
    ),
}))

// Mock the LocalizationProvider
vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
    LocalizationProvider: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}))

describe('SearchOptions', () => {
    it('should open date picker when date button is clicked', () => {
        // Mock props
        const mockSelectedDate = dayjs('2025-04-24')
        const mockSetOpen = vi.fn()

        const { getByText } = render(
            <SearchOptions
                selectedDate={mockSelectedDate}
                searchQuery=""
                setSearchQuery={vi.fn()}
                filterCarepath=""
                setFilterCarepath={vi.fn()}
                filterOrder=""
                setFilterOrder={vi.fn()}
                setSelectedDate={vi.fn()}
                open={true}
                setOpen={mockSetOpen}
                handlePrevDay={vi.fn()}
                handleNextDay={vi.fn()}
            />
        )

        // Find the date display button by its text (the formatted date)
        const dateButton = getByText(mockSelectedDate.format('DD MMM, YYYY'))

        // Click the button to open the date picker
        dateButton.click()

        // Verify setOpen was called with true
        expect(mockSetOpen).toHaveBeenCalledWith(true)
    })

    it('should handle date change correctly', async () => {
        // Mock props
        const mockSelectedDate = dayjs('2025-04-24')
        const mockSetSelectedDate = vi.fn()
        const mockSetOpen = vi.fn()

        const { getByTestId } = render(
            <SearchOptions
                selectedDate={mockSelectedDate}
                searchQuery=""
                setSearchQuery={vi.fn()}
                filterCarepath=""
                setFilterCarepath={vi.fn()}
                filterOrder=""
                setFilterOrder={vi.fn()}
                setSelectedDate={mockSetSelectedDate}
                open={true}
                setOpen={mockSetOpen}
                handlePrevDay={vi.fn()}
                handleNextDay={vi.fn()}
            />
        )

        // Find and click the date change button in our mocked component
        const changeDateButton = getByTestId('change-date-button')
        changeDateButton.click()

        // Verify setSelectedDate was called with the new value
        expect(mockSetSelectedDate).toHaveBeenCalledWith(dayjs('2025-05-01'))

        // Verify setOpen was called to close the picker
        expect(mockSetOpen).toHaveBeenCalledWith(false)
    })

    it('should handle closing without changing date', () => {
        // Mock props
        const mockSelectedDate = dayjs('2025-04-24')
        const mockSetSelectedDate = vi.fn()
        const mockSetOpen = vi.fn()

        const { getByTestId } = render(
            <SearchOptions
                selectedDate={mockSelectedDate}
                searchQuery=""
                setSearchQuery={vi.fn()}
                filterCarepath=""
                setFilterCarepath={vi.fn()}
                filterOrder=""
                setFilterOrder={vi.fn()}
                setSelectedDate={mockSetSelectedDate}
                open={true}
                setOpen={mockSetOpen}
                handlePrevDay={vi.fn()}
                handleNextDay={vi.fn()}
            />
        )

        // Find and click the cancel button
        const cancelButton = getByTestId('cancel-button')
        cancelButton.click()

        // Verify setSelectedDate was NOT called
        expect(mockSetSelectedDate).not.toHaveBeenCalled()

        // Verify setOpen was called to close the picker
        expect(mockSetOpen).toHaveBeenCalledWith(false)
    })

    it('should display the carepath options correctly', () => {
        // Mock props
        const mockSelectedDate = dayjs('2025-04-24')
        const mockSetOpen = vi.fn()
        const mockSetFilterCarepath = vi.fn()

        render(
            <SearchOptions
                selectedDate={mockSelectedDate}
                setSelectedDate={vi.fn()}
                open={false}
                setOpen={mockSetOpen}
                handlePrevDay={vi.fn()}
                handleNextDay={vi.fn()}
                searchQuery=""
                setSearchQuery={vi.fn()}
                filterCarepath="Carepath 1"
                setFilterCarepath={mockSetFilterCarepath}
                filterOrder="asc"
                setFilterOrder={vi.fn()}
            />
        )
    })
})
