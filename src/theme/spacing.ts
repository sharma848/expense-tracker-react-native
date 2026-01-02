/**
 * Premium Finance Design Spacing System
 * Based on 4px grid: 4, 8, 12, 16, 24, 32
 */

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    
    // Common patterns
    screenPadding: 24,
    cardPadding: 24,
    cardMargin: 16,
    sectionSpacing: 32,
    
    // Touch targets (premium: 52px for buttons)
    touchTarget: 52,
    touchTargetSmall: 44,
};

export const borderRadius = {
    sm: 12,
    md: 16,
    lg: 18, // Premium card radius
    xl: 24,
    full: 9999, // Fully rounded buttons
};

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 5,
    },
};

