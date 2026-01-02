/**
 * Currency utility for country-specific currency detection and formatting
 */

import * as Localization from "expo-localization";

export interface CurrencyInfo {
    code: string;
    symbol: string;
    name: string;
}

// Currency mapping by country code
const CURRENCY_MAP: Record<string, CurrencyInfo> = {
    IN: { code: "INR", symbol: "₹", name: "Indian Rupee" },
    US: { code: "USD", symbol: "$", name: "US Dollar" },
    GB: { code: "GBP", symbol: "£", name: "British Pound" },
    EU: { code: "EUR", symbol: "€", name: "Euro" },
    JP: { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    CN: { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
    AU: { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    CA: { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    // Add more as needed
};

// Default currency (INR - Indian Rupee)
const DEFAULT_CURRENCY: CurrencyInfo = {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
};

/**
 * Get currency - Always returns INR (Indian Rupee)
 * Fixed to INR regardless of device locale
 */
export const getCurrency = (): CurrencyInfo => {
    // Always return INR - app is designed for Indian Rupee
    // This ensures rupee symbol (₹) is always displayed
    return DEFAULT_CURRENCY;
};

/**
 * Format amount with currency symbol
 */
export const formatCurrency = (
    amount: number,
    currency?: CurrencyInfo
): string => {
    const curr = currency || getCurrency();

    // Handle NaN, undefined, or null
    const safeAmount = isNaN(amount) || amount === null || amount === undefined ? 0 : amount;

    // Format number with appropriate decimal places
    const formattedAmount = safeAmount.toFixed(2);

    // Return formatted string with currency symbol
    return `${curr.symbol}${formattedAmount}`;
};

/**
 * Format amount without symbol (just the number)
 */
export const formatAmount = (amount: number): string => {
    return amount.toFixed(2);
};
