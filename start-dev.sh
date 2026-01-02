#!/bin/bash
# Development startup script with SSL certificate workaround and file limit fix

cd "$(dirname "$0")"

# Increase file descriptor limit (fixes "too many open files" error on macOS)
ulimit -n 4096

# Set environment variable to bypass SSL certificate validation
# (Only use this in development, not production)
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Use Metro's watchFolders to limit what's being watched
# This reduces the number of files Metro needs to watch
export EXPO_NO_METRO_LAZY=1

# Start Expo
# Use --offline to avoid API calls if you have network issues
npx expo start

