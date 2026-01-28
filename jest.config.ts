import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },

  // 🔥 ISSO RESOLVE O PROBLEMA
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  testMatch: ['**/tests/**/*.test.ts'],
};

export default config;