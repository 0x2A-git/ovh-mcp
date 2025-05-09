/** @type {import('jest').Config} */
import tsconfig from './tsconfig.json' with { type: 'json' }
const config = {
    testEnvironment: 'node',
    collectCoverageFrom: ['src/**/*.ts'],

    coveragePathIgnorePatterns: [
        'node_modules',
        '.d.ts',
        '.type.ts',
        'index.ts',
        '.schema.ts',
        'ovh-client.ts',
        'logger.ts',
    ],

    collectCoverage: true,
    clearMocks: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',

    // ESM support:
    extensionsToTreatAsEsm: ['.ts'],
    roots: ['<rootDir>'],
    rootDir: './',
    moduleDirectories: [tsconfig.compilerOptions.baseUrl, 'node_modules'],
    modulePaths: [tsconfig.compilerOptions.baseUrl],
    transform: {
        '^.+\\.m?[tj]sx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
}

export default config
