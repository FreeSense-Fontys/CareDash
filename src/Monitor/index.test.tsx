import { describe, it, vitest } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import PatientListForm from './index'
import dayjs from 'dayjs'
import { PatientProvider } from '../contexts/PatientProvider'

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
