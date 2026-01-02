# Expense Tracker - React Native App

A cross-platform mobile expense tracking application built with React Native, Expo, and TypeScript.

## Features

- **Authentication**: Simple static login (username: `user`, password: `user`)
- **Expense Management**: Add, view, and manage daily expenses
- **Payment Methods**: Create and manage custom cards and bank accounts
- **Filtering**: Filter expenses by category, payment method, and date range
- **Analytics**: Monthly comparison dashboard with charts
- **Offline Support**: All data stored locally using AsyncStorage
- **Dark Mode Ready**: UI supports system theme preferences

## Tech Stack

- React Native with TypeScript
- Expo SDK ~50.0.0
- React Navigation (Stack & Bottom Tabs)
- Zustand for state management
- AsyncStorage for local persistence
- dayjs for date handling
- react-native-chart-kit for charts
- react-native-svg for chart rendering

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthGuard.tsx
│   ├── ExpenseCard.tsx
│   ├── MonthComparisonChart.tsx
│   └── PaymentMethodPicker.tsx
├── navigation/          # Navigation setup
│   └── AppNavigator.tsx
├── screens/             # Screen components
│   ├── auth/
│   │   └── LoginScreen.tsx
│   └── app/
│       ├── HomeScreen.tsx
│       ├── AddExpenseScreen.tsx
│       ├── AnalyticsScreen.tsx
│       └── SettingsScreen.tsx
├── services/            # Data layer
│   └── storage.ts       # AsyncStorage abstraction
├── store/               # State management
│   ├── authStore.ts
│   └── expenseStore.ts
├── types/               # TypeScript types
│   └── index.ts
└── utils/               # Utility functions
    └── date.ts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## Login Credentials

- **Username**: `user`
- **Password**: `user`

## Data Models

### Expense
- `id`: string
- `amount`: number
- `category`: 'Food' | 'Travel' | 'Shopping' | 'Bills' | 'Custom'
- `paymentMethodId`: string
- `description?`: string
- `date`: string (ISO date)
- `createdAt`: string

### PaymentMethod
- `id`: string
- `type`: 'Cash' | 'Card' | 'Bank'
- `name`: string
- `bankName?`: string (for Bank type)
- `createdAt`: string

## Features in Detail

### Expense Management
- Add expenses with amount, category, payment method, description, and date
- View expenses grouped by date
- Filter by category, payment method, or date range
- View daily and monthly totals

### Payment Methods
- Cash is always available (cannot be deleted)
- Add custom cards (name only)
- Add bank accounts (bank name + account nickname)
- Manage payment methods in Settings

### Analytics
- Compare current month vs previous month
- Category-wise breakdown
- Visual charts showing spending patterns
- Percentage change indicators

## Storage

All data is stored locally using AsyncStorage:
- Authentication state
- Expenses
- Payment methods

Data persists across app restarts and works fully offline.

## Future Enhancements

- Real authentication backend
- Cloud sync
- Export to CSV/PDF
- Recurring expenses
- Budget tracking
- Receipt photo attachments
- Multi-currency support

## License

MIT

