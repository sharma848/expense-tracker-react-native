/**
 * Theme hook for dark mode support
 * Supports user preference (light, dark, or system)
 */

import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { lightColors, darkColors, ColorScheme } from '../theme/colors';
import { useThemeStore } from '../store/themeStore';

export const useTheme = () => {
    const systemColorScheme = useColorScheme();
    const { themePreference, loadThemePreference, isLoading } = useThemeStore();

    // Load theme preference on mount
    useEffect(() => {
        loadThemePreference();
    }, [loadThemePreference]);

    // Determine if dark mode should be used
    const getIsDark = (): boolean => {
        if (isLoading) {
            // While loading, use system preference
            return systemColorScheme === 'dark';
        }

        switch (themePreference) {
            case 'light':
                return false;
            case 'dark':
                return true;
            case 'system':
            default:
                return systemColorScheme === 'dark';
        }
    };

    const isDark = getIsDark();
    const colors: ColorScheme = isDark ? darkColors : lightColors;
    
    return {
        colors,
        isDark,
        themePreference,
    };
};

