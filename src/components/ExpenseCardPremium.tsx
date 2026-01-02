/**
 * Premium Expense Card Component
 * UX: Category icon in soft colored circle, description + payment method, amount bold
 * Design: No borders, clean separation with whitespace
 */

import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Expense, PaymentMethod } from "../types";
import { formatDate } from "../utils/date";
import { formatCurrency } from "../utils/currency";
import { useTheme } from "../hooks/useTheme";
import { typography } from "../theme/typography";
import { spacing, borderRadius } from "../theme/spacing";
import { useExpenseStore } from "../store/expenseStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = 80;

interface ExpenseCardPremiumProps {
    expense: Expense;
    paymentMethod?: PaymentMethod;
    onEdit?: (expense: Expense) => void;
    onDelete?: (expenseId: string) => void;
}

export const ExpenseCardPremium: React.FC<ExpenseCardPremiumProps> = ({
    expense,
    paymentMethod,
    onEdit,
    onDelete,
}) => {
    const { colors } = useTheme();
    const { customCategories } = useExpenseStore();

    // Default category icons
    const defaultCategoryIcons: Record<string, string> = {
        Food: "🍔",
        Travel: "✈️",
        Shopping: "🛍️",
        Bills: "💳",
    };

    // Get category icon
    const getCategoryIcon = (): string => {
        if (defaultCategoryIcons[expense.category]) {
            return defaultCategoryIcons[expense.category];
        }
        const custom = customCategories.find((c) => c.name === expense.category);
        return custom?.icon || "📝";
    };

    // Get category color
    const getCategoryColor = (): string => {
        if (expense.category in colors.category) {
            return colors.category[expense.category as keyof typeof colors.category];
        }
        const custom = customCategories.find((c) => c.name === expense.category);
        return custom?.color || colors.primary;
    };

    const categoryColor = getCategoryColor();
    const categoryIcon = getCategoryIcon();
    const swipeableRef = useRef<Swipeable>(null);
    const [isSwipeActive, setIsSwipeActive] = useState(false);

    const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>) => {
        if (!onDelete) return null;

        const scale = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
        });

        return (
            <View style={styles.leftActionContainer}>
                <Animated.View
                    style={[
                        styles.leftAction,
                        {
                            backgroundColor: colors.error,
                            transform: [{ scale }],
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                            swipeableRef.current?.close();
                            onDelete(expense.id);
                        }}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name="delete"
                            size={24}
                            color="#FFFFFF"
                        />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    };

    const handleCardPress = () => {
        // Only open edit if swipe is not active
        if (!isSwipeActive && onEdit) {
            onEdit(expense);
        }
    };

    const cardContent = (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCardPress}
            style={[
                styles.card,
                { backgroundColor: colors.surface },
                colors.cardElevation,
                onDelete && styles.cardWithSwipe, // Add gap when swipeable
            ]}
        >
            <View style={styles.content}>
                {/* Left: Colored category badge */}
                <View
                    style={[
                        styles.categoryBadge,
                        { backgroundColor: categoryColor },
                    ]}
                >
                    <Text style={styles.icon}>{categoryIcon}</Text>
                </View>

                {/* Center: Description + payment method */}
                <View style={styles.centerSection}>
                    <Text style={[styles.category, { color: colors.text }]} numberOfLines={1}>
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
                    <Text style={[styles.paymentMethod, { color: colors.textTertiary }]}>
                        {paymentMethod?.name || "Unknown"}
                    </Text>
                </View>

                {/* Right: Amount */}
                <View style={styles.rightSection}>
                    <Text style={[styles.amount, { color: colors.text }]}>
                        {formatCurrency(expense.amount)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (onDelete) {
        return (
            <Swipeable
                ref={swipeableRef}
                renderLeftActions={renderLeftActions}
                leftThreshold={SWIPE_THRESHOLD}
                overshootLeft={false}
                onSwipeableWillOpen={() => setIsSwipeActive(true)}
                onSwipeableWillClose={() => setIsSwipeActive(false)}
                onSwipeableOpen={() => setIsSwipeActive(true)}
                onSwipeableClose={() => setIsSwipeActive(false)}
            >
                {cardContent}
            </Swipeable>
        );
    }

    return cardContent;
};

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.md,
        padding: spacing.lg + spacing.sm, // More padding for better spacing
        marginBottom: spacing.md,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
    },
    categoryBadge: {
        width: 52, // Slightly larger for better visual weight
        height: 52,
        borderRadius: borderRadius.md,
        justifyContent: "center",
        alignItems: "center",
        marginRight: spacing.lg + spacing.sm, // More space from badge
    },
    icon: {
        fontSize: 26, // Slightly larger icon
    },
    centerSection: {
        flex: 1,
        marginRight: spacing.lg,
    },
    category: {
        ...typography.bodyBold,
        marginBottom: spacing.xs + 2, // Slightly more space
        fontSize: 15, // Slightly larger for hierarchy
        fontWeight: '700',
    },
    description: {
        ...typography.body,
        marginBottom: spacing.xs,
        fontSize: 13,
        lineHeight: 18,
    },
    paymentMethod: {
        ...typography.caption,
        fontSize: 11,
        marginTop: 2,
    },
    rightSection: {
        alignItems: "flex-end",
        minWidth: 90, // Ensure amount doesn't get cramped
    },
    amount: {
        ...typography.amountSmall,
        fontWeight: '700',
        fontSize: 17, // Larger for better hierarchy
        letterSpacing: -0.5,
    },
    leftActionContainer: {
        width: SWIPE_THRESHOLD,
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: spacing.md, // Match card's marginBottom
    },
    leftAction: {
        flex: 1,
        width: SWIPE_THRESHOLD,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: borderRadius.md,
        marginRight: spacing.md, // Gap between delete button and card
    },
    cardWithSwipe: {
        marginRight: 0, // Remove any margin from card
    },
    deleteButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: spacing.md,
    },
    deleteButtonText: {
        ...typography.bodyBold,
        color: "#FFFFFF",
        fontSize: 12,
        marginTop: spacing.xs,
        fontWeight: "600",
    },
});

