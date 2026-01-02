/**
 * Expense management store using Zustand
 * Manages expenses, payment methods, and app data
 */

import { create } from "zustand";
import {
    Expense,
    PaymentMethod,
    ExpenseFilters,
    MonthlyComparison,
    ExpenseCategory,
    CustomCategory,
} from "../types";
import {
    expenseStorage,
    paymentMethodStorage,
    customCategoryStorage,
    initializeDefaultPaymentMethods,
} from "../services/storage";
import {
    filterExpensesByDateRange,
    getMonthRange,
    getPreviousMonthRange,
    calculateTotal,
} from "../utils/date";

interface ExpenseStore {
    expenses: Expense[];
    paymentMethods: PaymentMethod[];
    customCategories: CustomCategory[];
    filters: ExpenseFilters;
    isLoading: boolean;

    // Actions
    loadData: () => Promise<void>;
    addExpense: (expense: Omit<Expense, "id" | "createdAt">) => Promise<void>;
    updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    setFilters: (filters: ExpenseFilters) => void;
    clearFilters: () => void;

    // Payment Methods
    addPaymentMethod: (
        method: Omit<PaymentMethod, "id" | "createdAt">
    ) => Promise<void>;
    updatePaymentMethod: (
        id: string,
        updates: Partial<PaymentMethod>
    ) => Promise<void>;
    deletePaymentMethod: (id: string) => Promise<void>;

    // Custom Categories
    addCustomCategory: (
        category: Omit<CustomCategory, "id" | "createdAt">
    ) => Promise<void>;
    updateCustomCategory: (
        id: string,
        updates: Partial<CustomCategory>
    ) => Promise<void>;
    deleteCustomCategory: (id: string) => Promise<void>;

    // Computed
    getFilteredExpenses: () => Expense[];
    getMonthlyComparison: () => MonthlyComparison;
    getAllCategories: () => ExpenseCategory[];
}

const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
    expenses: [],
    paymentMethods: [],
    customCategories: [],
    filters: {},
    isLoading: true,

    loadData: async () => {
        try {
            await initializeDefaultPaymentMethods();
            const [expenses, paymentMethods, customCategories] = await Promise.all([
                expenseStorage.getExpenses(),
                paymentMethodStorage.getPaymentMethods(),
                customCategoryStorage.getCustomCategories(),
            ]);
            set({ expenses, paymentMethods, customCategories, isLoading: false });
        } catch (error) {
            console.error("Error loading data:", error);
            set({ isLoading: false });
        }
    },

    addExpense: async (expenseData) => {
        const expense: Expense = {
            ...expenseData,
            id: generateId(),
            createdAt: new Date().toISOString(),
        };
        await expenseStorage.addExpense(expense);
        const expenses = await expenseStorage.getExpenses();
        set({ expenses });
    },

    updateExpense: async (id, updates) => {
        await expenseStorage.updateExpense(id, updates);
        const expenses = await expenseStorage.getExpenses();
        set({ expenses });
    },

    deleteExpense: async (id) => {
        await expenseStorage.deleteExpense(id);
        const expenses = await expenseStorage.getExpenses();
        set({ expenses });
    },

    setFilters: (filters) => {
        set({ filters });
    },

    clearFilters: () => {
        set({ filters: {} });
    },

    addPaymentMethod: async (methodData) => {
        const method: PaymentMethod = {
            ...methodData,
            id: generateId(),
            createdAt: new Date().toISOString(),
        };
        await paymentMethodStorage.addPaymentMethod(method);
        const paymentMethods = await paymentMethodStorage.getPaymentMethods();
        set({ paymentMethods });
    },

    updatePaymentMethod: async (id, updates) => {
        await paymentMethodStorage.updatePaymentMethod(id, updates);
        const paymentMethods = await paymentMethodStorage.getPaymentMethods();
        set({ paymentMethods });
    },

    deletePaymentMethod: async (id) => {
        // Prevent deleting Cash method
        const method = get().paymentMethods.find((m) => m.id === id);
        if (method?.type === "Cash") {
            throw new Error("Cannot delete Cash payment method");
        }
        await paymentMethodStorage.deletePaymentMethod(id);
        const paymentMethods = await paymentMethodStorage.getPaymentMethods();
        set({ paymentMethods });
    },

    addCustomCategory: async (categoryData) => {
        const category: CustomCategory = {
            ...categoryData,
            id: generateId(),
            createdAt: new Date().toISOString(),
        };
        await customCategoryStorage.addCustomCategory(category);
        const customCategories = await customCategoryStorage.getCustomCategories();
        set({ customCategories });
    },

    updateCustomCategory: async (id, updates) => {
        await customCategoryStorage.updateCustomCategory(id, updates);
        const customCategories = await customCategoryStorage.getCustomCategories();
        set({ customCategories });
    },

    deleteCustomCategory: async (id) => {
        await customCategoryStorage.deleteCustomCategory(id);
        const customCategories = await customCategoryStorage.getCustomCategories();
        set({ customCategories });
    },

    getAllCategories: () => {
        const { customCategories } = get();
        const defaultCategories: ExpenseCategory[] = ["Food", "Travel", "Shopping", "Bills"];
        const customCategoryNames = customCategories.map((c) => c.name);
        return [...defaultCategories, ...customCategoryNames];
    },

    getFilteredExpenses: () => {
        const { expenses, filters } = get();
        let filtered = [...expenses];

        // Filter by category
        if (filters.category) {
            filtered = filtered.filter((e) => e.category === filters.category);
        }

        // Filter by payment method
        if (filters.paymentMethodId) {
            filtered = filtered.filter(
                (e) => e.paymentMethodId === filters.paymentMethodId
            );
        }

        // Filter by date range
        if (filters.startDate || filters.endDate) {
            filtered = filterExpensesByDateRange(
                filtered,
                filters.startDate,
                filters.endDate
            );
        }

        // Sort by date (newest first)
        return filtered.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    },

    getMonthlyComparison: () => {
        const { expenses } = get();
        const currentMonthRange = getMonthRange();
        const previousMonthRange = getPreviousMonthRange();

        const currentMonthExpenses = filterExpensesByDateRange(
            expenses,
            currentMonthRange.start,
            currentMonthRange.end
        );
        const previousMonthExpenses = filterExpensesByDateRange(
            expenses,
            previousMonthRange.start,
            previousMonthRange.end
        );

        const currentTotal = calculateTotal(currentMonthExpenses);
        const previousTotal = calculateTotal(previousMonthExpenses);

        // Calculate by category
        const categories = get().getAllCategories();
        const currentByCategory = categories.reduce((acc, cat) => {
            acc[cat] = calculateTotal(
                currentMonthExpenses.filter((e) => e.category === cat)
            );
            return acc;
        }, {} as Record<ExpenseCategory, number>);

        const previousByCategory = categories.reduce((acc, cat) => {
            acc[cat] = calculateTotal(
                previousMonthExpenses.filter((e) => e.category === cat)
            );
            return acc;
        }, {} as Record<ExpenseCategory, number>);

        // Calculate percentage change
        const percentageChange =
            previousTotal === 0
                ? currentTotal > 0
                    ? 100
                    : 0
                : ((currentTotal - previousTotal) / previousTotal) * 100;

        return {
            currentMonth: {
                total: currentTotal,
                byCategory: currentByCategory,
            },
            previousMonth: {
                total: previousTotal,
                byCategory: previousByCategory,
            },
            percentageChange,
        };
    },
}));
