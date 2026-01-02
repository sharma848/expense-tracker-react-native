/**
 * Analytics Screen
 * Shows monthly comparison with charts and statistics
 */

/**
 * Premium Analytics Screen
 * UX: Month comparison card with % indicator, charts in rounded cards
 * Design: Minimal labels, strong visuals, generous whitespace
 */

import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useExpenseStore } from "../../store/expenseStore";
import { MonthComparisonChart } from "../../components/MonthComparisonChart";
import { formatCurrency } from "../../utils/currency";
import { useTheme } from "../../hooks/useTheme";
import { typography } from "../../theme/typography";
import { spacing, borderRadius } from "../../theme/spacing";
import { Card } from "../../components/ui/Card";

const AnalyticsScreen: React.FC = () => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const {
        loadData,
        getMonthlyComparison,
        getAllCategories,
        customCategories,
    } = useExpenseStore();
    const comparison = getMonthlyComparison();
    const categories = getAllCategories();

    useEffect(() => {
        loadData();
    }, [loadData]);

    const isIncrease = comparison.percentageChange > 0;
    const changeColor = isIncrease ? colors.error : colors.success;

    // Extended color palette for categories (ensures unique colors)
    // These colors work well in both light and dark modes
    const categoryColorPalette = [
        "#FF9500", // Orange
        "#34C759", // Green
        "#AF52DE", // Purple
        "#FF2D55", // Pink
        "#5AC8FA", // Light Blue
        "#FFCC00", // Yellow
        "#FF3B30", // Red
        "#5856D6", // Indigo
        "#00C7BE", // Teal
        "#FF6B9D", // Rose
        "#32D74B", // Bright Green
        "#64D2FF", // Sky Blue
        "#FF9F0A", // Amber
        "#BF5AF2", // Violet
        "#FF453A", // Coral
    ];

    // Get unique color for each category using hash-based assignment
    const getCategoryColor = (category: string, index: number): string => {
        // Check if it's a default category with predefined color
        if (category in colors.category) {
            return colors.category[category as keyof typeof colors.category];
        }

        // Check if custom category has a color
        const custom = customCategories.find((c) => c.name === category);
        if (custom?.color) {
            return custom.color;
        }

        // Use hash-based color assignment for consistent unique colors
        // This ensures the same category always gets the same color
        let hash = 0;
        for (let i = 0; i < category.length; i++) {
            hash = category.charCodeAt(i) + ((hash << 5) - hash);
        }
        const paletteIndex = Math.abs(hash) % categoryColorPalette.length;
        return categoryColorPalette[paletteIndex];
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={[
                styles.content,
                { paddingTop: Math.max(insets.top, 60) },
            ]}
        >
            {/* Month comparison card: Current vs Previous month, % indicator with arrow */}
            <Card style={styles.comparisonCard}>
                <Text
                    style={[
                        styles.comparisonLabel,
                        { color: colors.textSecondary },
                    ]}
                >
                    Monthly Comparison
                </Text>
                <View style={styles.comparisonRow}>
                    <View style={styles.comparisonItem}>
                        <Text
                            style={[
                                styles.comparisonValue,
                                { color: colors.text },
                            ]}
                            numberOfLines={1}
                            adjustsFontSizeToFit={true}
                            minimumFontScale={0.7}
                        >
                            {formatCurrency(comparison.currentMonth.total)}
                        </Text>
                        <Text
                            style={[
                                styles.comparisonSubtext,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Current Month
                        </Text>
                    </View>
                    <View style={styles.comparisonDivider} />
                    <View style={styles.comparisonItem}>
                        <Text
                            style={[
                                styles.comparisonValue,
                                { color: colors.text },
                            ]}
                            numberOfLines={1}
                            adjustsFontSizeToFit={true}
                            minimumFontScale={0.7}
                        >
                            {formatCurrency(comparison.previousMonth.total)}
                        </Text>
                        <Text
                            style={[
                                styles.comparisonSubtext,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Previous Month
                        </Text>
                    </View>
                </View>
                {/* % indicator with arrow */}
                <View style={styles.changeIndicator}>
                    <Text style={[styles.changeArrow, { color: changeColor }]}>
                        {isIncrease ? "↑" : "↓"}
                    </Text>
                    <Text
                        style={[
                            styles.changePercentage,
                            { color: changeColor },
                        ]}
                    >
                        {Math.abs(comparison.percentageChange).toFixed(1)}%
                    </Text>
                </View>
            </Card>

            {/* Charts inside rounded cards */}
            <Card style={styles.chartCard}>
                <MonthComparisonChart comparison={comparison} />
            </Card>

            {/* Category breakdown - minimal labels, strong visuals */}
            <Card style={styles.categoryCard}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Category Breakdown
                </Text>
                <View style={styles.categoryGrid}>
                    {categories.map((category, index) => {
                        const current =
                            comparison.currentMonth.byCategory[category] || 0;
                        const previous =
                            comparison.previousMonth.byCategory[category] || 0;
                        const change =
                            previous === 0
                                ? current > 0
                                    ? 100
                                    : 0
                                : ((current - previous) / previous) * 100;
                        const categoryIncrease = change > 0;
                        const categoryColor = getCategoryColor(category, index);

                        return (
                            <View key={category} style={styles.categoryItem}>
                                <View style={styles.categoryLeft}>
                                    <View
                                        style={[
                                            styles.categoryDot,
                                            { backgroundColor: categoryColor },
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            styles.categoryName,
                                            { color: colors.text },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {category}
                                    </Text>
                                </View>
                                <View style={styles.categoryRight}>
                                    <Text
                                        style={[
                                            styles.categoryAmount,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {formatCurrency(current)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.categoryChange,
                                            {
                                                color: categoryIncrease
                                                    ? colors.error
                                                    : colors.success,
                                            },
                                        ]}
                                    >
                                        {categoryIncrease ? "↑" : "↓"}{" "}
                                        {Math.abs(change).toFixed(1)}%
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.screenPadding,
        paddingBottom: spacing.xxl,
    },
    // Month comparison card
    comparisonCard: {
        marginBottom: spacing.xl, // More space after comparison
        width: "100%", // Ensure full width
    },
    chartCard: {
        marginBottom: spacing.xl, // Match spacing with comparison card
        overflow: "visible", // Allow rotated chart labels to be visible
    },
    comparisonLabel: {
        ...typography.subhead,
        marginBottom: spacing.xl, // More space before values
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 1,
        fontWeight: "600",
    },
    comparisonRow: {
        flexDirection: "row",
        marginBottom: spacing.xl, // More space before change indicator
        paddingVertical: spacing.md,
        alignItems: "flex-start", // Align to top to prevent breaking
    },
    comparisonItem: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: spacing.xs,
        minWidth: 0, // Allow flex shrinking
    },
    comparisonDivider: {
        width: 1,
        backgroundColor: "rgba(100, 116, 139, 0.25)", // Slightly more visible
        marginHorizontal: spacing.md,
    },
    comparisonValue: {
        ...typography.display,
        fontSize: 32, // Slightly smaller to prevent overflow
        marginBottom: spacing.sm, // More space before label
        fontWeight: "700",
        letterSpacing: -0.5,
        textAlign: "center",
        includeFontPadding: false,
    },
    comparisonSubtext: {
        ...typography.caption,
        fontSize: 12,
        opacity: 0.8,
    },
    changeIndicator: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing.lg,
        paddingTop: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: "rgba(100, 116, 139, 0.15)", // Subtle divider
    },
    changeArrow: {
        fontSize: 28, // Larger arrow
        marginRight: spacing.md, // More space
        fontWeight: "700",
    },
    changePercentage: {
        ...typography.headline,
        fontSize: 32, // Larger percentage
        fontWeight: "700",
    },
    // Category breakdown
    categoryCard: {
        marginTop: spacing.xl, // More space from chart
    },
    sectionTitle: {
        ...typography.title,
        marginBottom: spacing.xl, // More space before items
        fontSize: 18,
        fontWeight: "700",
    },
    categoryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        marginHorizontal: -spacing.xs,
    },
    categoryItem: {
        flexDirection: "column",
        alignItems: "flex-start",
        padding: spacing.md,
        margin: spacing.xs,
        borderRadius: borderRadius.md,
        backgroundColor: "transparent",
        minWidth: 140,
        maxWidth: "48%",
        flex: 1,
    },
    categoryLeft: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.sm,
        width: "100%",
    },
    categoryDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: spacing.sm,
        flexShrink: 0,
    },
    categoryName: {
        ...typography.bodyBold,
        fontSize: 14,
        fontWeight: "600",
        flex: 1,
    },
    categoryRight: {
        alignItems: "flex-start",
        width: "100%",
    },
    categoryAmount: {
        ...typography.bodyBold,
        marginBottom: spacing.xs,
        fontSize: 16,
        fontWeight: "700",
    },
    categoryChange: {
        ...typography.caption,
        fontWeight: "600",
        fontSize: 12,
    },
});

export default AnalyticsScreen;
