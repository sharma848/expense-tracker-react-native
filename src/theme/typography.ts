/**
 * Typography system with clear hierarchy
 * Finance-focused, readable fonts
 */

export const typography = {
    // Display - Large titles
    display: {
        fontSize: 34,
        fontWeight: '700' as const,
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    
    // Headline - Section titles
    headline: {
        fontSize: 28,
        fontWeight: '700' as const,
        lineHeight: 34,
        letterSpacing: -0.3,
    },
    
    // Title - Card titles, important text
    title: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 24,
        letterSpacing: 0,
    },
    
    // Body - Main content
    body: {
        fontSize: 17,
        fontWeight: '400' as const,
        lineHeight: 22,
        letterSpacing: 0,
    },
    
    // Body Bold - Emphasized content
    bodyBold: {
        fontSize: 17,
        fontWeight: '600' as const,
        lineHeight: 22,
        letterSpacing: 0,
    },
    
    // Callout - Secondary information
    callout: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 21,
        letterSpacing: 0,
    },
    
    // Subhead - Labels, captions
    subhead: {
        fontSize: 15,
        fontWeight: '400' as const,
        lineHeight: 20,
        letterSpacing: 0,
    },
    
    // Footnote - Small text, hints
    footnote: {
        fontSize: 13,
        fontWeight: '400' as const,
        lineHeight: 18,
        letterSpacing: 0,
    },
    
    // Caption - Smallest text
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
        letterSpacing: 0,
    },
    
    // Amount - Large numbers for money
    amount: {
        fontSize: 28,
        fontWeight: '700' as const,
        lineHeight: 34,
        letterSpacing: 0.3,
    },
    
    // Amount Small - Smaller money amounts
    amountSmall: {
        fontSize: 20,
        fontWeight: '700' as const,
        lineHeight: 24,
        letterSpacing: 0.2,
    },
};

