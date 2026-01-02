/**
 * Revolut/Monzo-inspired Theme
 * Dark mode favored, vibrant accents, elevated cards
 */

export const lightColors = {
    // Backgrounds - Light mode (secondary)
    background: "#F5F7FA",
    surface: "#FFFFFF",
    surfaceSecondary: "#F0F4F8",
    inputBackground: "#F8FAFC",

    // Text - Dark on light cards only
    text: "#1A1F36",
    textSecondary: "#6B7280",
    textTertiary: "#9CA3AF",

    // Borders
    border: "#E5E7EB",
    borderLight: "#F3F4F6",

    // Primary - Vibrant blue (Revolut-inspired)
    primary: "#0075FF",
    primaryDark: "#0051CC",
    primaryLight: "#3399FF",
    primaryGradient: ["#0075FF", "#0051CC"],

    // Category Colors - Bold, vibrant accents
    category: {
        Food: "#FF6B35",
        Travel: "#0075FF",
        Shopping: "#FF3B5C",
        Bills: "#9D4EDD",
        Custom: "#6B7280",
    },

    // Status Colors
    success: "#00D68F",
    error: "#FF3B5C",
    warning: "#FFB800",
    info: "#0075FF",

    // Shadows - Elevated cards
    shadow: "rgba(0, 0, 0, 0.1)",
    shadowStrong: "rgba(0, 0, 0, 0.15)",
    cardElevation: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },

    // Card
    card: "#FFFFFF",
    cardShadow: "rgba(0, 0, 0, 0.08)",
};

export const darkColors = {
    // Backgrounds - Dark mode favored (Revolut/Monzo style)
    background: "#0A0E27",
    surface: "#141B2D",
    surfaceSecondary: "#1E2742",
    inputBackground: "#1E2742",

    // Text - Light on dark
    text: "#FFFFFF",
    textSecondary: "#94A3B8",
    textTertiary: "#64748B",

    // Borders
    border: "#1E2742",
    borderLight: "#2A3441",

    // Primary - Bright blue for dark mode
    primary: "#3399FF",
    primaryDark: "#0075FF",
    primaryLight: "#5CB3FF",
    primaryGradient: ["#3399FF", "#0075FF"],

    // Category Colors - Vibrant, high contrast
    category: {
        Food: "#FF6B35",
        Travel: "#3399FF",
        Shopping: "#FF3B5C",
        Bills: "#B794F6",
        Custom: "#94A3B8",
    },

    // Status Colors
    success: "#00D68F",
    error: "#FF3B5C",
    warning: "#FFB800",
    info: "#3399FF",

    // Shadows - Stronger elevation in dark
    shadow: "rgba(0, 0, 0, 0.4)",
    shadowStrong: "rgba(0, 0, 0, 0.6)",
    cardElevation: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },

    // Card
    card: "#141B2D",
    cardShadow: "rgba(0, 0, 0, 0.3)",
};

export type ColorScheme = typeof lightColors;
