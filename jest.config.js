const { defaults } = require('jest-config');

module.exports = {
  testEnvironment:'node',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'js', 'jsx'],
  modulePaths: ['<rootDir>'],
};