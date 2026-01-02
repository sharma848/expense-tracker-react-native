/**
 * MonthComparisonChart Component
 * Displays monthly comparison using react-native-chart-kit
 * Shows date-wise comparison (10-day periods) between current and previous month
 */

import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { MonthlyComparison, Expense } from "../types";
import { formatCurrency } from "../utils/currency";
import { useTheme } from "../hooks/useTheme";
import { typography } from "../theme/typography";
import { spacing, borderRadius } from "../theme/spacing";
import { useExpenseStore } from "../store/expenseStore";
import { getMonthRange, getPreviousMonthRange, filterExpensesByDateRange } from "../utils/date";
import dayjs from "dayjs";

interface MonthComparisonChartProps {
    comparison: MonthlyComparison;
}

const screenWidth = Dimensions.get("window").width;

export const MonthComparisonChart: React.FC<MonthComparisonChartProps> = ({
    comparison,
}) => {
    const { colors, isDark } = useTheme();
    const { expenses } = useExpenseStore();

    // Get date ranges for current and previous month
    const currentMonthRange = getMonthRange();
    const previousMonthRange = getPreviousMonthRange();

    // Group expenses by 10-day periods
    const dateRangeData = useMemo(() => {
        const ranges = [
            { label: "1-10", startDay: 1, endDay: 10 },
            { label: "11-20", startDay: 11, endDay: 20 },
            { label: "21-31", startDay: 21, endDay: 31 },
        ];

        return ranges.map((range) => {
            // Current month data
            const currentMonthStart = dayjs(currentMonthRange.start);
            const currentStart = currentMonthStart.date(range.startDay).startOf('day');
            const currentEnd = currentMonthStart
                .date(Math.min(range.endDay, currentMonthStart.daysInMonth()))
                .endOf('day');

            const currentExpenses = filterExpensesByDateRange(
                expenses,
                currentStart.toISOString(),
                currentEnd.toISOString()
            );
            const currentTotal = currentExpenses.reduce((sum, e) => sum + e.amount, 0);

            // Previous month data
            const previousMonthStart = dayjs(previousMonthRange.start);
            const previousStart = previousMonthStart.date(range.startDay).startOf('day');
            const previousEnd = previousMonthStart
                .date(Math.min(range.endDay, previousMonthStart.daysInMonth()))
                .endOf('day');

            const previousExpenses = filterExpensesByDateRange(
                expenses,
                previousStart.toISOString(),
                previousEnd.toISOString()
            );
            const previousTotal = previousExpenses.reduce((sum, e) => sum + e.amount, 0);

            return {
                label: range.label,
                current: currentTotal,
                previous: previousTotal,
            };
        });
    }, [expenses, currentMonthRange, previousMonthRange]);

    // Enhanced chart configuration with better colors and styling
    const currentMonthColor = isDark ? colors.primary : "#0075FF";
    const previousMonthColor = isDark ? "#64748B" : "#94A3B8";

    const chartConfig = {
        backgroundColor: "transparent",
        backgroundGradientFrom: colors.surface,
        backgroundGradientTo: colors.surface,
        decimalPlaces: 0,
        color: (opacity = 1) => {
            const rgb = isDark ? "148, 163, 184" : "107, 114, 128";
            return `rgba(${rgb}, ${opacity * 0.3})`;
        },
        labelColor: (opacity = 1) => {
            const rgb = isDark ? "255, 255, 255" : "26, 31, 54";
            return `rgba(${rgb}, ${opacity})`;
        },
        style: {
            borderRadius: borderRadius.lg,
        },
        barPercentage: 0.7,
        groupGap: 2,
        propsForBackgroundLines: {
            strokeDasharray: "4,4",
            stroke: colors.border,
            strokeWidth: 1,
            strokeOpacity: 0.5,
        },
        propsForLabels: {
            fontSize: 11,
            fontWeight: "600" as const,
        },
    };

    // Helper function to convert hex to rgba
    const hexToRgba = (hex: string, opacity: number = 1): string => {
        const cleanHex = hex.replace("#", "");
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    // Prepare bar chart data with better labels
    const chartData = {
        labels: dateRangeData.map((r) => `Days ${r.label}`),
        datasets: [
            {
                data: dateRangeData.map((r) => r.current),
                color: (opacity = 1) => hexToRgba(currentMonthColor, opacity),
            },
            {
                data: dateRangeData.map((r) => r.previous),
                color: (opacity = 1) => hexToRgba(previousMonthColor, opacity),
            },
        ],
    };

    const chartWidth = screenWidth - spacing.screenPadding * 2 - spacing.cardPadding * 2;

    const isIncrease = comparison.percentageChange > 0;
    const changeColor = isIncrease ? colors.error : colors.success;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Monthly Comparison
                </Text>
                <View style={styles.summary}>
                    <View style={styles.summaryItem}>
                        <Text
                            style={[
                                styles.summaryLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Current Month
                        </Text>
                        <Text
                            style={[
                                styles.summaryValue,
                                { color: colors.text },
                            ]}
                        >
                            {formatCurrency(comparison.currentMonth.total)}
                        </Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text
                            style={[
                                styles.summaryLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Previous Month
                        </Text>
                        <Text
                            style={[
                                styles.summaryValue,
                                { color: colors.text },
                            ]}
                        >
                            {formatCurrency(comparison.previousMonth.total)}
                        </Text>
                    </View>
                </View>
                <View style={styles.changeContainer}>
                    <Text
                        style={[
                            styles.changeLabel,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Change:
                    </Text>
                    <Text style={[styles.changeValue, { color: changeColor }]}>
                        {isIncrease ? "↑" : "↓"}{" "}
                        {Math.abs(comparison.percentageChange).toFixed(1)}%
                    </Text>
                </View>
            </View>

            <View style={styles.chartContainer}>
                {dateRangeData.some((r) => r.current > 0 || r.previous > 0) ? (
                    <>
                        <View style={styles.chartWrapper}>
                            <BarChart
                                data={chartData}
                                width={chartWidth}
                                height={240}
                                chartConfig={chartConfig}
                                verticalLabelRotation={0}
                                showValuesOnTopOfBars={false}
                                fromZero
                                yAxisLabel=""
                                yAxisSuffix=""
                                style={styles.chart}
                                withInnerLines={true}
                                segments={4}
                                formatYLabel={(value) => {
                                    const num = parseFloat(value);
                                    if (num >= 1000) {
                                        return `$${(num / 1000).toFixed(1)}k`;
                                    }
                                    return `$${num}`;
                                }}
                            />
                        </View>
                        <View style={styles.legend}>
                            <View style={styles.legendItem}>
                                <View
                                    style={[
                                        styles.legendColor,
                                        { backgroundColor: currentMonthColor },
                                    ]}
                                />
                                <Text
                                    style={[styles.legendText, { color: colors.text }]}
                                >
                                    Current Month
                                </Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View
                                    style={[
                                        styles.legendColor,
                                        { backgroundColor: previousMonthColor },
                                    ]}
                                />
                                <Text
                                    style={[styles.legendText, { color: colors.text }]}
                                >
                                    Previous Month
                                </Text>
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={styles.emptyChart}>
                        <Text
                            style={[
                                styles.emptyChartText,
                                { color: colors.textSecondary },
                            ]}
                        >
                            No data available
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%", // Full width within parent Card
    },
    header: {
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.title,
        marginBottom: spacing.lg,
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: -0.5,
    },
    summary: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: spacing.lg,
        paddingVertical: spacing.md,
    },
    summaryItem: {
        alignItems: "center",
        flex: 1,
    },
    summaryLabel: {
        ...typography.caption,
        marginBottom: spacing.xs,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        opacity: 0.8,
    },
    summaryValue: {
        ...typography.title,
        fontSize: 18,
        fontWeight: "700",
    },
    changeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: "rgba(100, 116, 139, 0.15)",
    },
    changeLabel: {
        ...typography.subhead,
        marginRight: spacing.sm,
        fontSize: 13,
        opacity: 0.8,
    },
    changeValue: {
        ...typography.title,
        fontSize: 18,
        fontWeight: "700",
    },
    chartContainer: {
        alignItems: "center",
        width: "100%",
        paddingBottom: spacing.md,
    },
    chartWrapper: {
        backgroundColor: "transparent",
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
    },
    chart: {
        borderRadius: borderRadius.lg,
    },
    emptyChart: {
        justifyContent: "center",
        alignItems: "center",
        height: 220,
        borderRadius: borderRadius.lg,
        backgroundColor: "transparent",
    },
    emptyChartText: {
        ...typography.caption,
        fontSize: 12,
    },
    legend: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: spacing.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        width: "100%",
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: spacing.lg,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
        backgroundColor: "transparent",
        minWidth: 0,
    },
    legendColor: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: spacing.sm,
        flexShrink: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    legendText: {
        ...typography.subhead,
        fontSize: 13,
        fontWeight: "600",
        flexShrink: 1,
    },
});
