module.exports = {
  moduleNameMapper: {
    '^crypto$': 'crypto-browserify',
    '^stream$': 'stream-browserify',
    '^path$': 'path-browserify',
    '^fs$': 'browserify-fs',
    '^os$': 'os-browserify',
    '^crypto-js$': 'crypto-js'
  },
  setupFiles: ['<rootDir>/src/setupTests.js'],
  testEnvironment: 'jsdom'
};
