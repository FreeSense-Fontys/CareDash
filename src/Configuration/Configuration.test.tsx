import { describe, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ConfigurationPage from '.'

describe('Configuration page', () => {
    it('should render the configuration page', () => {
        render(<ConfigurationPage />)
        expect(screen.getByText('Configuration Page')).toBeInTheDocument()
    })
})
