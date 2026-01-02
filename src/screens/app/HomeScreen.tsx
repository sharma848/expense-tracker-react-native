/**
 * Home Screen
 * Displays expenses grouped by date with filtering options
 */

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useExpenseStore } from "../../store/expenseStore";
import { ExpenseCardPremium } from "../../components/ExpenseCardPremium";
import { BalanceCard } from "../../components/BalanceCard";
import { EditExpenseModal } from "../../components/EditExpenseModal";
import { ExpenseFilters, PaymentMethod, Expense } from "../../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    formatDate,
    groupExpensesByDate,
    calculateTotal,
} from "../../utils/date";
import { formatCurrency, getCurrency } from "../../utils/currency";
import { useTheme } from "../../hooks/useTheme";
import { typography } from "../../theme/typography";
import { spacing, borderRadius, shadows } from "../../theme/spacing";

const HomeScreen: React.FC = () => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const {
        expenses,
        paymentMethods,
        filters,
        loadData,
        setFilters,
        clearFilters,
        getFilteredExpenses,
        deleteExpense,
    } = useExpenseStore();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [tempFilters, setTempFilters] = useState<ExpenseFilters>(filters);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredExpenses = getFilteredExpenses();
    const groupedExpenses = groupExpensesByDate(filteredExpenses);
    const dates = Object.keys(groupedExpenses).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    const dailyTotal = calculateTotal(filteredExpenses);
    const monthlyTotal = calculateTotal(
        filteredExpenses.filter((e) => {
            const expenseDate = new Date(e.date);
            const now = new Date();
            return (
                expenseDate.getMonth() === now.getMonth() &&
                expenseDate.getFullYear() === now.getFullYear()
            );
        })
    );

    const applyFilters = () => {
        setFilters(tempFilters);
        setShowFilterModal(false);
    };

    const resetFilters = () => {
        setTempFilters({});
        clearFilters();
        setShowFilterModal(false);
    };

    const hasActiveFilters = Object.keys(filters).length > 0;

    const currency = getCurrency();

    const handleEditExpense = (expense: Expense) => {
        setEditingExpense(expense);
        setShowEditModal(true);
    };

    const handleDeleteExpense = (expenseId: string) => {
        Alert.alert(
            "Delete Expense",
            "Are you sure you want to delete this expense?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteExpense(expenseId);
                        } catch (error) {
                            console.error("Error deleting expense:", error);
                            Alert.alert("Error", "Failed to delete expense. Please try again.");
                        }
                    },
                },
            ]
        );
    };

    const handleSaveExpense = () => {
        loadData(); // Refresh the list
    };

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            {/* Fixed Header - Rotating Balance Card */}
            <View
                style={[
                    styles.headerContainer,
                    {
                        paddingTop: Math.max(insets.top, 60),
                    },
                ]}
            >
                <BalanceCard balance={monthlyTotal} label="This Month" />

                {/* Filter button */}
                {hasActiveFilters && (
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            { backgroundColor: colors.surface },
                            colors.cardElevation,
                        ]}
                        onPress={() => setShowFilterModal(true)}
                    >
                        <MaterialCommunityIcons
                            name="filter-variant"
                            size={20}
                            color={colors.primary}
                        />
                        <Text
                            style={[
                                styles.filterText,
                                { color: colors.primary },
                            ]}
                        >
                            Filters
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Expense list: Cards grouped by date, no borders */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {dates.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text
                            style={[styles.emptyText, { color: colors.text }]}
                        >
                            No expenses found
                        </Text>
                        <Text
                            style={[
                                styles.emptySubtext,
                                { color: colors.textSecondary },
                            ]}
                        >
                            {hasActiveFilters
                                ? "Try adjusting your filters"
                                : "Add your first expense to get started"}
                        </Text>
                    </View>
                ) : (
                    dates.map((date) => {
                        const dayExpenses = groupedExpenses[date];
                        const dayTotal = calculateTotal(dayExpenses);
                        return (
                            <View key={date} style={styles.dateGroup}>
                                {/* Minimalist date header */}
                                <View style={styles.dateHeader}>
                                    <Text
                                        style={[
                                            styles.dateText,
                                            { color: colors.textSecondary },
                                        ]}
                                    >
                                        {formatDate(date)}
                                    </Text>
                                    <View
                                        style={[
                                            styles.dateTotalBadge,
                                            {
                                                backgroundColor:
                                                    colors.primary + "15",
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.dateTotal,
                                                { color: colors.primary },
                                            ]}
                                        >
                                            {formatCurrency(dayTotal)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Expense cards */}
                                {dayExpenses.map((expense) => {
                                    const paymentMethod = paymentMethods.find(
                                        (pm) =>
                                            pm.id === expense.paymentMethodId
                                    );
                                    return (
                                        <ExpenseCardPremium
                                            key={expense.id}
                                            expense={expense}
                                            paymentMethod={paymentMethod}
                                            onEdit={handleEditExpense}
                                            onDelete={handleDeleteExpense}
                                        />
                                    );
                                })}
                            </View>
                        );
                    })
                )}
            </ScrollView>

            <FilterModal
                visible={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                filters={tempFilters}
                onFiltersChange={setTempFilters}
                onApply={applyFilters}
                onReset={resetFilters}
                paymentMethods={paymentMethods}
            />

            <EditExpenseModal
                visible={showEditModal}
                expense={editingExpense}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingExpense(null);
                }}
                onSave={handleSaveExpense}
            />
        </View>
    );
};

/**
 * Filter Modal Component
 */
const FilterModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    filters: ExpenseFilters;
    onFiltersChange: (filters: ExpenseFilters) => void;
    onApply: () => void;
    onReset: () => void;
    paymentMethods: PaymentMethod[];
}> = ({
    visible,
    onClose,
    filters,
    onFiltersChange,
    onApply,
    onReset,
    paymentMethods,
}) => {
    const { colors } = useTheme();
    const { getAllCategories } = useExpenseStore();
    const categories = getAllCategories();

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View
                    style={[
                        styles.modalContent,
                        { backgroundColor: colors.surface },
                    ]}
                >
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                        Filter Expenses
                    </Text>

                    <View style={styles.filterSection}>
                        <Text
                            style={[styles.filterLabel, { color: colors.text }]}
                        >
                            Category
                        </Text>
                        <View style={styles.filterOptions}>
                            {categories.map((cat) => {
                                const isActive = filters.category === cat;
                                return (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[
                                            styles.filterOption,
                                            {
                                                backgroundColor: isActive
                                                    ? colors.category[
                                                          cat as keyof typeof colors.category
                                                      ] || colors.primary
                                                    : colors.surfaceSecondary,
                                            },
                                        ]}
                                        onPress={() =>
                                            onFiltersChange({
                                                ...filters,
                                                category:
                                                    filters.category === cat
                                                        ? undefined
                                                        : (cat as any),
                                            })
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.filterOptionText,
                                                {
                                                    color: isActive
                                                        ? "#FFFFFF"
                                                        : colors.text,
                                                },
                                            ]}
                                        >
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.filterSection}>
                        <Text
                            style={[styles.filterLabel, { color: colors.text }]}
                        >
                            Payment Method
                        </Text>
                        <ScrollView style={styles.paymentMethodList}>
                            {paymentMethods.map((pm) => {
                                const isActive =
                                    filters.paymentMethodId === pm.id;
                                return (
                                    <TouchableOpacity
                                        key={pm.id}
                                        style={[
                                            styles.filterOption,
                                            {
                                                backgroundColor: isActive
                                                    ? colors.primary
                                                    : colors.surfaceSecondary,
                                            },
                                        ]}
                                        onPress={() =>
                                            onFiltersChange({
                                                ...filters,
                                                paymentMethodId:
                                                    filters.paymentMethodId ===
                                                    pm.id
                                                        ? undefined
                                                        : pm.id,
                                            })
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.filterOptionText,
                                                {
                                                    color: isActive
                                                        ? "#FFFFFF"
                                                        : colors.text,
                                                },
                                            ]}
                                        >
                                            {pm.name}{" "}
                                            {pm.bankName
                                                ? `(${pm.bankName})`
                                                : ""}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={[
                                styles.modalButtonSecondary,
                                { backgroundColor: colors.surfaceSecondary },
                            ]}
                            onPress={onReset}
                        >
                            <Text
                                style={[
                                    styles.modalButtonTextSecondary,
                                    { color: colors.text },
                                ]}
                            >
                                Reset
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.modalButtonPrimary,
                                { backgroundColor: colors.primary },
                            ]}
                            onPress={onApply}
                        >
                            <Text style={styles.modalButtonTextPrimary}>
                                Apply
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.modalClose}
                        onPress={onClose}
                    >
                        <Text
                            style={[
                                styles.modalCloseText,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Close
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacing.screenPadding,
        paddingTop: 60,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        ...shadows.sm,
    },
    title: {
        ...typography.headline,
    },
    filterButtonContainer: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
    },
    currencyIndicator: {
        ...typography.caption,
        marginTop: spacing.xs,
        fontWeight: "500",
    },
    clearFilters: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginHorizontal: spacing.screenPadding,
        marginTop: spacing.sm,
        borderRadius: borderRadius.md,
    },
    clearFiltersText: {
        ...typography.subhead,
        fontWeight: "600",
    },
    // Top summary card container - Fixed at top
    headerContainer: {
        paddingHorizontal: spacing.screenPadding,
        paddingBottom: spacing.lg,
        width: "100%", // Ensure full width
        backgroundColor: "transparent", // Will inherit from parent
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-end",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        gap: spacing.sm,
        marginTop: spacing.lg,
        minHeight: 40, // Better touch target
    },
    filterText: {
        ...typography.bodyBold,
        fontSize: 13,
        fontWeight: "600",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    // Date groups - elegant minimal design
    dateGroup: {
        marginTop: spacing.xl,
        paddingHorizontal: spacing.screenPadding,
    },
    dateHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.md,
        paddingVertical: spacing.xs,
    },
    dateText: {
        ...typography.body,
        fontSize: 13,
        fontWeight: "500",
        letterSpacing: 0.3,
    },
    dateTotalBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    dateTotal: {
        ...typography.bodyBold,
        fontSize: 13,
        fontWeight: "700",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
        paddingHorizontal: spacing.screenPadding,
    },
    emptyText: {
        ...typography.title,
        marginBottom: spacing.sm,
        textAlign: "center",
    },
    emptySubtext: {
        ...typography.subhead,
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.lg,
        maxHeight: "80%",
    },
    modalTitle: {
        ...typography.headline,
        marginBottom: spacing.lg,
    },
    filterSection: {
        marginBottom: spacing.lg,
    },
    filterLabel: {
        ...typography.bodyBold,
        marginBottom: spacing.md,
    },
    filterOptions: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
    },
    filterOption: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        marginRight: spacing.sm,
        marginBottom: spacing.sm,
        minHeight: spacing.touchTargetSmall,
        justifyContent: "center",
    },
    filterOptionText: {
        ...typography.subhead,
        fontWeight: "600",
    },
    paymentMethodList: {
        maxHeight: 150,
    },
    modalActions: {
        flexDirection: "row",
        gap: spacing.md,
        marginTop: spacing.lg,
    },
    modalButtonPrimary: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: "center",
        minHeight: spacing.touchTarget,
        justifyContent: "center",
    },
    modalButtonSecondary: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: "center",
        minHeight: spacing.touchTarget,
        justifyContent: "center",
    },
    modalButtonTextPrimary: {
        ...typography.bodyBold,
        color: "#FFFFFF",
    },
    modalButtonTextSecondary: {
        ...typography.bodyBold,
    },
    modalClose: {
        marginTop: spacing.md,
        paddingVertical: spacing.md,
        alignItems: "center",
        minHeight: spacing.touchTargetSmall,
        justifyContent: "center",
    },
    modalCloseText: {
        ...typography.body,
    },
});

export default HomeScreen;
