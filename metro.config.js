// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Reduce the number of files being watched
// This helps with "too many open files" error
config.watchFolders = [__dirname];
config.resolver.blockList = [
  // Block watching node_modules except for specific packages
  /node_modules\/.*\/node_modules\/react-native\/.*/,
];

module.exports = config;

