import type { Config } from 'jest';

const config: Config = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
        'src/**/*.{ts,js}',
        '!src/**/*.spec.ts',
        '!src/**/*.interface.ts',
        '!src/**/*.schema.ts',
        '!src/**/*.dto.ts',
        '!src/**/*.module.ts',
        '!src/main.ts',
        '!src/repl.ts',
    ],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/'],
    moduleNameMapper: {
        '^@api/(.*)$': '<rootDir>/src/$1',
        '^@repo/shared$': '<rootDir>/../../packages/shared/src',
    },
    transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    testTimeout: 10000,
};

export default config;
