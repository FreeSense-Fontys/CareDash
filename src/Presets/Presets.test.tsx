import { describe, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PresetsPage from '.'

describe('Presets page', () => {
    it('should render the presets page', () => {
        render(<PresetsPage />)
        expect(screen.getByText('Presets Page')).toBeInTheDocument()
    })
})
