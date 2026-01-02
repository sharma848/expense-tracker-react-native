/**
 * Core data types for the Expense Tracker app
 */

export type DefaultExpenseCategory = 'Food' | 'Travel' | 'Shopping' | 'Bills';
export type ExpenseCategory = DefaultExpenseCategory | string; // string for custom categories

export interface CustomCategory {
  id: string;
  name: string;
  icon: string; // emoji icon
  color?: string; // optional custom color
  createdAt: string;
}

export type PaymentMethodType = 'Cash' | 'Card' | 'Bank';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string; // Card name or bank account nickname
  bankName?: string; // Only for Bank type
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethodId: string;
  description?: string;
  date: string; // ISO date string
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  username?: string;
}

export interface AppData {
  expenses: Expense[];
  paymentMethods: PaymentMethod[];
  categories: ExpenseCategory[];
  customCategories: CustomCategory[];
}

export interface MonthlyComparison {
  currentMonth: {
    total: number;
    byCategory: Record<ExpenseCategory, number>;
  };
  previousMonth: {
    total: number;
    byCategory: Record<ExpenseCategory, number>;
  };
  percentageChange: number;
}

export interface ExpenseFilters {
  category?: ExpenseCategory;
  paymentMethodId?: string;
  startDate?: string;
  endDate?: string;
}

