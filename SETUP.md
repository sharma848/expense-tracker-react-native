# Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on your device/simulator:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## First Time Setup

### Prerequisites
- Node.js 16+ installed
- Expo CLI (installed globally or via npx)
- iOS Simulator (Mac only) or Android Emulator

### Installation Steps

1. **Clone/Navigate to project directory**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Expo:**
   ```bash
   npm start
   ```

4. **Run on platform:**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## Login

Use these credentials to login:
- **Username:** `user`
- **Password:** `user`

## Testing with Sample Data

To populate the app with sample data for testing, you can uncomment the seed data call in `App.tsx`:

```typescript
// In App.tsx, add this in useEffect:
import { seedAppData } from './src/utils/seedData';
// seedAppData(); // Uncomment to load sample data
```

## Troubleshooting

### Module not found errors
- Run `npm install` again
- Clear cache: `npm start -- --clear`

### TypeScript errors
- Ensure TypeScript is installed: `npm install -D typescript`
- Check `tsconfig.json` is properly configured

### Expo errors
- Clear Expo cache: `expo start -c`
- Reinstall node_modules: `rm -rf node_modules && npm install`

## Project Structure

```
apps/
├── src/
│   ├── components/     # Reusable UI components
│   ├── navigation/     # Navigation setup
│   ├── screens/        # Screen components
│   ├── services/       # Data layer (storage)
│   ├── store/          # State management (Zustand)
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── App.tsx             # Main app entry
├── index.js            # Expo entry point
└── package.json        # Dependencies
```

## Development Notes

- All data is stored locally using AsyncStorage
- No backend required - fully offline
- State managed with Zustand
- Navigation handled by React Navigation

