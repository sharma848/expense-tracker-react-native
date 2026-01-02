/**
 * Main App Entry Point
 * Initializes the app and sets up navigation
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useExpenseStore } from './src/store/expenseStore';
import { initializeDefaultPaymentMethods } from './src/services/storage';
import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App() {
  const { loadData } = useExpenseStore();

  useEffect(() => {
    // Initialize default payment methods and load data on app start
    initializeDefaultPaymentMethods().catch((error) => {
      console.error('Error initializing payment methods:', error);
    });
    loadData().catch((error) => {
      console.error('Error loading data:', error);
    });
  }, [loadData]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <StatusBar style="auto" />
        <AppNavigator />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

