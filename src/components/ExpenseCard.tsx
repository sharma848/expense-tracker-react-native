/**
 * ExpenseCard Component
 * Displays a single expense with category, amount, and payment method
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Expense, PaymentMethod } from "../types";
import { formatDate } from "../utils/date";
import { formatCurrency } from "../utils/currency";
import { useTheme } from "../hooks/useTheme";
import { typography } from "../theme/typography";
import { spacing, borderRadius, shadows } from "../theme/spacing";

interface ExpenseCardProps {
    expense: Expense;
    paymentMethod?: PaymentMethod;
    onPress?: () => void;
    onDelete?: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
    expense,
    paymentMethod,
    onPress,
    onDelete,
}) => {
    const { colors } = useTheme();
    const categoryColor = colors.category[expense.category] || colors.category.Custom;

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    <View
                        style={[
                            styles.categoryIndicator,
                            { backgroundColor: categoryColor },
                        ]}
                    />
                    <View style={styles.details}>
                        <Text style={[styles.category, { color: colors.text }]}>
                            {expense.category}
                        </Text>
                        {expense.description ? (
                            <Text 
                                style={[styles.description, { color: colors.textSecondary }]} 
                                numberOfLines={1}
                            >
                                {expense.description}
                            </Text>
                        ) : null}
                        <View style={styles.paymentMethodContainer}>
                            <View 
                                style={[
                                    styles.paymentMethodBadge, 
                                    { backgroundColor: colors.surfaceSecondary }
                                ]}
                            >
                                <Text style={[styles.paymentMethod, { color: colors.textSecondary }]}>
                                    {paymentMethod?.name || "Unknown"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.rightSection}>
                    <Text style={[styles.amount, { color: colors.text }]}>
                        {formatCurrency(expense.amount)}
                    </Text>
                    <Text style={[styles.date, { color: colors.textSecondary }]}>
                        {formatDate(expense.date, "MMM DD")}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.lg,
        padding: spacing.cardPadding,
        marginBottom: spacing.md,
        marginHorizontal: spacing.xs,
        ...shadows.md,
    },
    content: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftSection: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
    },
    categoryIndicator: {
        width: 4,
        height: 52,
        borderRadius: borderRadius.sm,
        marginRight: spacing.md,
    },
    details: {
        flex: 1,
    },
    category: {
        ...typography.bodyBold,
        marginBottom: spacing.xs,
    },
    description: {
        ...typography.subhead,
        marginBottom: spacing.xs,
    },
    paymentMethodContainer: {
        marginTop: spacing.xs,
    },
    paymentMethodBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs / 2,
        borderRadius: borderRadius.sm,
        alignSelf: 'flex-start',
    },
    paymentMethod: {
        ...typography.caption,
    },
    rightSection: {
        alignItems: "flex-end",
    },
    amount: {
        ...typography.amountSmall,
        marginBottom: spacing.sm,
    },
    date: {
        ...typography.caption,
    },
});
