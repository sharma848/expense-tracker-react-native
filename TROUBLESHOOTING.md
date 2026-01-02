# Troubleshooting Guide

## SSL Certificate Error

If you see:

```
FetchError: request to https://api.expo.dev/... failed, reason: unable to get local issuer certificate
```

**Solution:** This is common in corporate networks. Use the startup script:

```bash
./start-dev.sh
```

Or manually:

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm start
```

## "Too Many Open Files" Error

If you see:

```
Error: EMFILE: too many open files, watch
```

**Best Solution:** Install Watchman (recommended for React Native/Expo):

```bash
brew install watchman
```

Watchman is Facebook's file watching service that handles file watching much more efficiently than Node's built-in file watcher. This is the recommended solution and has been installed for you.

**Alternative Solutions:**

1. Increase the file descriptor limit:
   ```bash
   ulimit -n 4096
   npm start
   ```

2. Use the startup script which handles this automatically:
   ```bash
   ./start-dev.sh
   ```

3. The Metro config (`metro.config.js`) has been optimized to reduce the number of files being watched.

## Package Version Warnings

If Expo warns about package versions, update them:

```bash
npm install react-native@0.73.6 react-native-svg@14.1.0
```

## Quick Start (Recommended)

Use the startup script that handles all issues:

```bash
./start-dev.sh
```

## Alternative: Manual Start

If you prefer to start manually:

1. **Fix file limit:**

    ```bash
    ulimit -n 4096
    ```

2. **Start with SSL bypass:**
    ```bash
    NODE_TLS_REJECT_UNAUTHORIZED=0 npm start
    ```

## Running on Device/Simulator

Once the server starts:

-   **iOS Simulator:** Press `i` in the terminal or run `npm run ios`
-   **Android Emulator:** Press `a` in the terminal or run `npm run android`
-   **Physical Device:** Scan the QR code with Expo Go app

## Network Issues

If you're behind a corporate firewall/proxy:

1. Configure npm proxy (if needed):

    ```bash
    npm config set proxy http://proxy.company.com:8080
    npm config set https-proxy http://proxy.company.com:8080
    ```

2. Use offline mode:
    ```bash
    npx expo start --offline
    ```

## Clear Cache

If you encounter strange errors:

```bash
npm start -- --clear
```

Or:

```bash
npx expo start -c
```
