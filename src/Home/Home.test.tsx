import { describe, it } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import HomePage from '.'

describe('Home page', () => {
    it('should render the home page', () => {
        render(<HomePage />)
    })
})
