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

// Fix for zustand import.meta issue on web
// Force Metro to use the react-native export condition which uses CommonJS
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // For zustand, explicitly resolve to the CommonJS version (index.js)
  // This avoids the ESM version that uses import.meta
  if (moduleName === 'zustand' || moduleName.startsWith('zustand/')) {
    try {
      const path = require('path');
      const fs = require('fs');
      
      // Get the zustand package directory
      const zustandPath = require.resolve('zustand/package.json', {
        paths: [context.originModulePath || __dirname],
      });
      const zustandDir = path.dirname(zustandPath);
      
      // For main zustand import, use index.js (CommonJS)
      if (moduleName === 'zustand') {
        const indexJs = path.join(zustandDir, 'index.js');
        if (fs.existsSync(indexJs)) {
          return {
            filePath: indexJs,
            type: 'sourceFile',
          };
        }
      }
      
      // For subpath imports like zustand/middleware, try to resolve normally first
      // but fall back to CommonJS if it resolves to ESM
      const resolved = require.resolve(moduleName, {
        paths: [context.originModulePath || __dirname],
      });
      
      // If it resolved to an ESM file (.mjs or /esm/), try to find CommonJS alternative
      if (resolved.includes('.mjs') || resolved.includes('/esm/')) {
        // Try to find the corresponding .js file
        const jsPath = resolved.replace('.mjs', '.js').replace('/esm/', '/');
        if (fs.existsSync(jsPath)) {
          return {
            filePath: jsPath,
            type: 'sourceFile',
          };
        }
      }
      
      return {
        filePath: resolved,
        type: 'sourceFile',
      };
    } catch (error) {
      // Fall through to default resolution
    }
  }
  
  // Default resolution for all other modules
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

