# iOS "No Usable Data Found" Error - Fix Guide

## What Was Fixed

1. **Added Gesture Handler Import** - React Navigation requires `react-native-gesture-handler` to be imported at the very top of `index.js` before anything else. This is critical for iOS.

2. **Added Error Boundary** - Added error handling to catch and display any runtime errors that might prevent the app from loading.

3. **Improved Error Handling** - Added try-catch blocks for async operations in App.tsx.

## Steps to Fix

### 1. Clear Cache and Restart

The server has been restarted with cleared cache. If you need to do it manually:

```bash
cd /Users/b0227983/Documents/Personal/apps
NODE_TLS_REJECT_UNAUTHORIZED=0 npx expo start --clear
```

### 2. On iOS Simulator/Device

1. **Close the app completely** if it's already open
2. **Shake the device** (or press `Cmd + D` in simulator) to open developer menu
3. **Select "Reload"** to reload the JavaScript bundle
4. Or **close Expo Go and reopen it**, then scan the QR code again

### 3. Check Metro Bundler

Make sure the Metro bundler is running and you can see:

-   "Metro waiting on http://localhost:8081"
-   No error messages in the terminal

### 4. Network Issues

If you're using a physical device:

-   Make sure your phone and computer are on the **same Wi-Fi network**
-   Try using **tunnel mode**: Press `s` in the Expo terminal and select "tunnel"
-   Or use the **LAN** option if tunnel doesn't work

### 5. Rebuild if Needed

If the issue persists:

```bash
# Stop the server (Ctrl+C)
# Clear everything
rm -rf node_modules/.cache
rm -rf .expo

# Restart
NODE_TLS_REJECT_UNAUTHORIZED=0 npm start -- --clear
```

### 6. Check for Errors

Look at the Metro bundler output in the terminal. Any red error messages will help identify the issue.

## Common Causes

1. **Gesture Handler Not Imported** ✅ Fixed
2. **Metro bundler not accessible** - Check network/firewall
3. **Cache issues** - Clear cache (done)
4. **Code errors** - Check Metro bundler logs
5. **Network connectivity** - Ensure same Wi-Fi network

## Verification

After restarting, you should see:

-   Metro bundler running without errors
-   QR code displayed
-   Option to press `i` for iOS

Then on your iOS device/simulator:

-   App should load the Login screen
-   No "no usable data found" error

## Still Having Issues?

1. Check the Metro bundler terminal output for specific error messages
2. Try reloading the app (shake device → Reload)
3. Try tunnel mode if on physical device
4. Check that all dependencies are installed: `npm install`
