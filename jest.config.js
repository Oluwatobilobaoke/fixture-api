module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(e2e).[jt]s?(x)'], // Run both e2e and test files
  // testMatch: ['**/?(*.)+(e2e|test).[jt]s?(x)'], // Run both e2e and test files
  testTimeout: 200000,
};
