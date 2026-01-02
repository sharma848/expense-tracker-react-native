/**
 * Date utility functions using dayjs
 */

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Expense } from '../types';

// Extend dayjs with plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * Format date for display
 */
export const formatDate = (date: string | Date, format: string = 'MMM DD, YYYY'): string => {
  return dayjs(date).format(format);
};

/**
 * Get start and end of month
 */
export const getMonthRange = (date: string | Date = new Date()) => {
  const d = dayjs(date);
  return {
    start: d.startOf('month').toISOString(),
    end: d.endOf('month').toISOString(),
  };
};

/**
 * Get previous month range
 */
export const getPreviousMonthRange = (date: string | Date = new Date()) => {
  const d = dayjs(date).subtract(1, 'month');
  return {
    start: d.startOf('month').toISOString(),
    end: d.endOf('month').toISOString(),
  };
};

/**
 * Check if date is in range (inclusive)
 */
export const isDateInRange = (date: string, startDate: string, endDate: string): boolean => {
  const d = dayjs(date);
  const start = dayjs(startDate).startOf('day');
  const end = dayjs(endDate).endOf('day');
  // Check if date is within the range (inclusive of start and end)
  return d.isSameOrAfter(start) && d.isSameOrBefore(end);
};

/**
 * Group expenses by date
 */
export const groupExpensesByDate = (expenses: Expense[]): Record<string, Expense[]> => {
  return expenses.reduce((acc, expense) => {
    const dateKey = dayjs(expense.date).format('YYYY-MM-DD');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);
};

/**
 * Calculate total for expenses
 */
export const calculateTotal = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

/**
 * Filter expenses by date range
 */
export const filterExpensesByDateRange = (
  expenses: Expense[],
  startDate?: string,
  endDate?: string
): Expense[] => {
  if (!startDate && !endDate) return expenses;
  
  return expenses.filter((expense) => {
    if (startDate && endDate) {
      return isDateInRange(expense.date, startDate, endDate);
    }
    if (startDate) {
      return dayjs(expense.date).isAfter(dayjs(startDate).subtract(1, 'day'));
    }
    if (endDate) {
      return dayjs(expense.date).isBefore(dayjs(endDate).add(1, 'day'));
    }
    return true;
  });
};

