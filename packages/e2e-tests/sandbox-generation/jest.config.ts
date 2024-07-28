/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  testPathIgnorePatterns: ['/node_modules/', 'utils.ts'],
};
