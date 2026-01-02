/**
 * AsyncStorage abstraction layer for data persistence
 * Handles all read/write operations to local storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, PaymentMethod, AuthState, AppData, CustomCategory } from '../types';

const STORAGE_KEYS = {
  AUTH_STATE: '@expense_tracker:auth_state',
  EXPENSES: '@expense_tracker:expenses',
  PAYMENT_METHODS: '@expense_tracker:payment_methods',
  CUSTOM_CATEGORIES: '@expense_tracker:custom_categories',
  THEME_PREFERENCE: '@expense_tracker:theme_preference',
} as const;

/**
 * Authentication Storage
 */
export const authStorage = {
  async getAuthState(): Promise<AuthState | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_STATE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading auth state:', error);
      return null;
    }
  },

  async saveAuthState(authState: AuthState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_STATE, JSON.stringify(authState));
    } catch (error) {
      console.error('Error saving auth state:', error);
      throw error;
    }
  },

  async clearAuthState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
    } catch (error) {
      console.error('Error clearing auth state:', error);
      throw error;
    }
  },
};

/**
 * Expenses Storage
 */
export const expenseStorage = {
  async getExpenses(): Promise<Expense[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading expenses:', error);
      return [];
    }
  },

  async saveExpenses(expenses: Expense[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
      throw error;
    }
  },

  async addExpense(expense: Expense): Promise<void> {
    const expenses = await this.getExpenses();
    expenses.push(expense);
    await this.saveExpenses(expenses);
  },

  async updateExpense(id: string, updates: Partial<Expense>): Promise<void> {
    const expenses = await this.getExpenses();
    const index = expenses.findIndex((e) => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updates };
      await this.saveExpenses(expenses);
    }
  },

  async deleteExpense(id: string): Promise<void> {
    const expenses = await this.getExpenses();
    const filtered = expenses.filter((e) => e.id !== id);
    await this.saveExpenses(filtered);
  },
};

/**
 * Payment Methods Storage
 */
export const paymentMethodStorage = {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading payment methods:', error);
      return [];
    }
  },

  async savePaymentMethods(paymentMethods: PaymentMethod[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(paymentMethods));
    } catch (error) {
      console.error('Error saving payment methods:', error);
      throw error;
    }
  },

  async addPaymentMethod(paymentMethod: PaymentMethod): Promise<void> {
    const methods = await this.getPaymentMethods();
    methods.push(paymentMethod);
    await this.savePaymentMethods(methods);
  },

  async updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): Promise<void> {
    const methods = await this.getPaymentMethods();
    const index = methods.findIndex((m) => m.id === id);
    if (index !== -1) {
      methods[index] = { ...methods[index], ...updates };
      await this.savePaymentMethods(methods);
    }
  },

  async deletePaymentMethod(id: string): Promise<void> {
    const methods = await this.getPaymentMethods();
    const filtered = methods.filter((m) => m.id !== id);
    await this.savePaymentMethods(filtered);
  },
};

/**
 * Initialize default payment methods (Cash is always available)
 */
export const initializeDefaultPaymentMethods = async (): Promise<void> => {
  const methods = await paymentMethodStorage.getPaymentMethods();
  const hasCash = methods.some((m) => m.type === 'Cash');
  
  if (!hasCash) {
    const cashMethod: PaymentMethod = {
      id: 'cash-default',
      type: 'Cash',
      name: 'Cash',
      createdAt: new Date().toISOString(),
    };
    await paymentMethodStorage.addPaymentMethod(cashMethod);
  }
};

/**
 * Custom Categories Storage
 */
export const customCategoryStorage = {
  async getCustomCategories(): Promise<CustomCategory[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading custom categories:', error);
      return [];
    }
  },

  async saveCustomCategories(categories: CustomCategory[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving custom categories:', error);
      throw error;
    }
  },

  async addCustomCategory(category: CustomCategory): Promise<void> {
    const categories = await this.getCustomCategories();
    categories.push(category);
    await this.saveCustomCategories(categories);
  },

  async updateCustomCategory(id: string, updates: Partial<CustomCategory>): Promise<void> {
    const categories = await this.getCustomCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      await this.saveCustomCategories(categories);
    }
  },

  async deleteCustomCategory(id: string): Promise<void> {
    const categories = await this.getCustomCategories();
    const filtered = categories.filter((c) => c.id !== id);
    await this.saveCustomCategories(filtered);
  },
};

/**
 * Theme Preference Storage
 */
export const themeStorage = {
  async getThemePreference(): Promise<'light' | 'dark' | 'system' | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading theme preference:', error);
      return null;
    }
  },

  async saveThemePreference(preference: 'light' | 'dark' | 'system'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, JSON.stringify(preference));
    } catch (error) {
      console.error('Error saving theme preference:', error);
      throw error;
    }
  },
};

/**
 * Get all app data at once
 */
export const getAllAppData = async (): Promise<AppData> => {
  const [expenses, paymentMethods, customCategories] = await Promise.all([
    expenseStorage.getExpenses(),
    paymentMethodStorage.getPaymentMethods(),
    customCategoryStorage.getCustomCategories(),
  ]);

  return {
    expenses,
    paymentMethods,
    categories: ['Food', 'Travel', 'Shopping', 'Bills'],
    customCategories,
  };
};

