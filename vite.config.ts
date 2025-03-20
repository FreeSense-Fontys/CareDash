/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tailwindcss(), tsconfigPaths()],
    server: {
        port: 3000,
    },
    test: {
        environment: 'jsdom',
        include: ['src/**/*.test.tsx'],
        globals: true,
        coverage: {
            provider: 'v8', // or 'istanbul'
            reporter: ['text', 'lcov'],
            include: ['src/**/*.tsx'], // Specify which folders to cover
            exclude: ['src/**/*.test.tsx', 'src/**/*.ts', 'src/App.{tsx, ts}', 'src/main.{tsx, ts}'], // Specify which folders to exclude
            thresholds: {
                statements: 80,
                branches: 80,
                functions: 80,
                lines: 80,
            },
        },
    }
})