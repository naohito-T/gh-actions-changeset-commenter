import { Config } from '@jest/types';

/**
 * @todo monorepo構成のswc（見た方はチャレンジしてもいいよ）
 */
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    customExportConditions: ['browser', 'node'],
  },
  verbose: true,
  /** @workaround swc */
  // transform: {
  //   '^.+\\.ts$': '@swc-node/jest',
  // },
  moduleFileExtensions: ['ts', 'js'],
  moduleDirectories: ['node_modules'],
  testMatch: ['<rootDir>/**/*.test.ts'],
  testPathIgnorePatterns: ['/dist/', '/node_modules/'],
  coverageProvider: 'v8',
  coverageDirectory: './coverage',
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/../src/$1',
    '~/(.*)$': '<rootDir>/../$1',
  },
};

export default config;
