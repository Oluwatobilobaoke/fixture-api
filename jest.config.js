module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(e2e).[jt]s?(x)'], // Only run e2e tests
  testTimeout: 90000,
};
