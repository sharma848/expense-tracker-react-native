/**
 * Custom hook for color scheme (dark mode support)
 * Uses system preferences by default
 */

import { useColorScheme as useRNColorScheme } from 'react-native';

export const useColorScheme = () => {
  const systemColorScheme = useRNColorScheme();
  return systemColorScheme || 'light';
};

export const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#E5E5EA',
    primary: '#007AFF',
    error: '#FF3B30',
    success: '#34C759',
    card: '#FFFFFF',
  },
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    primary: '#0A84FF',
    error: '#FF453A',
    success: '#32D74B',
    card: '#1C1C1E',
  },
};

