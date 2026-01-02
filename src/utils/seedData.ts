/**
 * Seed data utility for testing
 * Can be used to populate the app with sample data
 */

import { Expense, PaymentMethod } from '../types';
import { expenseStorage, paymentMethodStorage } from '../services/storage';
import dayjs from 'dayjs';

/**
 * Generate sample expenses for testing
 */
export const generateSeedExpenses = (): Expense[] => {
  const now = dayjs();
  const expenses: Expense[] = [];

  // Current month expenses
  for (let i = 0; i < 15; i++) {
    const date = now.subtract(i, 'day');
    expenses.push({
      id: `expense-${i}`,
      amount: Math.random() * 100 + 10,
      category: ['Food', 'Travel', 'Shopping', 'Bills', 'Custom'][Math.floor(Math.random() * 5)] as any,
      paymentMethodId: 'cash-default',
      description: `Sample expense ${i + 1}`,
      date: date.toISOString(),
      createdAt: date.toISOString(),
    });
  }

  // Previous month expenses
  for (let i = 0; i < 10; i++) {
    const date = now.subtract(1, 'month').subtract(i, 'day');
    expenses.push({
      id: `expense-prev-${i}`,
      amount: Math.random() * 100 + 10,
      category: ['Food', 'Travel', 'Shopping', 'Bills', 'Custom'][Math.floor(Math.random() * 5)] as any,
      paymentMethodId: 'cash-default',
      description: `Previous month expense ${i + 1}`,
      date: date.toISOString(),
      createdAt: date.toISOString(),
    });
  }

  return expenses;
};

/**
 * Generate sample payment methods
 */
export const generateSeedPaymentMethods = (): PaymentMethod[] => {
  return [
    {
      id: 'cash-default',
      type: 'Cash',
      name: 'Cash',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'card-1',
      type: 'Card',
      name: 'Visa Credit',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'card-2',
      type: 'Card',
      name: 'Mastercard',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'bank-1',
      type: 'Bank',
      name: 'Checking',
      bankName: 'Chase',
      createdAt: new Date().toISOString(),
    },
  ];
};

/**
 * Seed the app with sample data (for development/testing)
 * WARNING: This will overwrite existing data
 */
export const seedAppData = async (): Promise<void> => {
  try {
    const expenses = generateSeedExpenses();
    const paymentMethods = generateSeedPaymentMethods();

    await expenseStorage.saveExpenses(expenses);
    await paymentMethodStorage.savePaymentMethods(paymentMethods);

    console.log('Seed data loaded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};

