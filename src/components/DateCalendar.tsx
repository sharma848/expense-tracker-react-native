/**
 * Date Calendar Component
 * Displays a month calendar for date selection
 */

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { typography } from "../theme/typography";
import { spacing, borderRadius } from "../theme/spacing";
import dayjs from "dayjs";

interface DateCalendarProps {
    selectedDate: string; // YYYY-MM-DD format
    onDateSelect: (date: string) => void;
}

export const DateCalendar: React.FC<DateCalendarProps> = ({
    selectedDate,
    onDateSelect,
}) => {
    const { colors } = useTheme();
    const [currentMonth, setCurrentMonth] = useState(dayjs(selectedDate));

    // Update current month when selectedDate changes externally
    useEffect(() => {
        setCurrentMonth(dayjs(selectedDate));
    }, [selectedDate]);

    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const daysInMonth = endOfMonth.date();
    const startDayOfWeek = startOfMonth.day(); // 0 = Sunday, 6 = Saturday

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Generate calendar days
    const calendarDays: (number | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const handleDateSelect = (day: number) => {
        const newDate = currentMonth.date(day);
        onDateSelect(newDate.format("YYYY-MM-DD"));
    };

    const goToPreviousMonth = () => {
        setCurrentMonth((prev) => dayjs(prev).subtract(1, "month"));
    };

    const goToNextMonth = () => {
        setCurrentMonth((prev) => dayjs(prev).add(1, "month"));
    };

    const goToToday = () => {
        const today = dayjs();
        setCurrentMonth(today);
        onDateSelect(today.format("YYYY-MM-DD"));
    };

    const selectedDay = dayjs(selectedDate).date();
    const selectedMonth = dayjs(selectedDate).month();
    const selectedYear = dayjs(selectedDate).year();
    const isCurrentMonth = currentMonth.month() === selectedMonth && currentMonth.year() === selectedYear;

    return (
        <View style={styles.container}>
            {/* Month Navigation */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={goToPreviousMonth}
                    style={[styles.navButton, { backgroundColor: colors.surfaceSecondary }]}
                >
                    <Text style={[styles.navButtonText, { color: colors.text }]}>‹</Text>
                </TouchableOpacity>
                
                <View style={styles.monthYearContainer}>
                    <Text style={[styles.monthYear, { color: colors.text }]}>
                        {currentMonth.format("MMMM YYYY")}
                    </Text>
                </View>
                
                <TouchableOpacity
                    onPress={goToNextMonth}
                    style={[styles.navButton, { backgroundColor: colors.surfaceSecondary }]}
                >
                    <Text style={[styles.navButtonText, { color: colors.text }]}>›</Text>
                </TouchableOpacity>
            </View>

            {/* Today Button */}
            <TouchableOpacity
                onPress={goToToday}
                style={[styles.todayButton, { backgroundColor: colors.surfaceSecondary }]}
            >
                <Text style={[styles.todayButtonText, { color: colors.primary }]}>
                    Today
                </Text>
            </TouchableOpacity>

            {/* Week Day Headers */}
            <View style={styles.weekDaysContainer}>
                {weekDays.map((day) => (
                    <View key={day} style={styles.weekDayHeader}>
                        <Text style={[styles.weekDayText, { color: colors.textSecondary }]}>
                            {day}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
                {calendarDays.map((day, index) => {
                    if (day === null) {
                        return <View key={`empty-${index}`} style={styles.dayCell} />;
                    }

                    const isSelected =
                        isCurrentMonth &&
                        day === selectedDay;
                    const isToday =
                        day === dayjs().date() &&
                        currentMonth.month() === dayjs().month() &&
                        currentMonth.year() === dayjs().year();

                    return (
                        <TouchableOpacity
                            key={`day-${day}`}
                            style={[
                                styles.dayCell,
                                isSelected && [
                                    styles.selectedDay,
                                    { backgroundColor: colors.primary },
                                ],
                                isToday && !isSelected && [
                                    styles.todayDay,
                                    { borderColor: colors.primary },
                                ],
                            ]}
                            onPress={() => handleDateSelect(day)}
                        >
                            <Text
                                style={[
                                    styles.dayText,
                                    { color: colors.text },
                                    isSelected && styles.selectedDayText,
                                    isToday && !isSelected && { color: colors.primary },
                                ]}
                            >
                                {day}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.md,
        paddingHorizontal: spacing.xs,
    },
    navButton: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md,
        justifyContent: "center",
        alignItems: "center",
    },
    navButtonText: {
        fontSize: 24,
        fontWeight: "600",
        lineHeight: 28,
    },
    monthYearContainer: {
        flex: 1,
        alignItems: "center",
    },
    monthYear: {
        ...typography.title,
        fontSize: 18,
        fontWeight: "700",
    },
    todayButton: {
        alignSelf: "flex-end",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
    todayButtonText: {
        ...typography.subhead,
        fontSize: 12,
        fontWeight: "600",
    },
    weekDaysContainer: {
        flexDirection: "row",
        marginBottom: spacing.sm,
    },
    weekDayHeader: {
        flex: 1,
        alignItems: "center",
        paddingVertical: spacing.xs,
    },
    weekDayText: {
        ...typography.caption,
        fontSize: 11,
        fontWeight: "600",
        textTransform: "uppercase",
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dayCell: {
        width: "14.28%", // 7 days per week
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: spacing.xs,
    },
    dayText: {
        ...typography.body,
        fontSize: 15,
        fontWeight: "500",
    },
    selectedDay: {
        borderRadius: borderRadius.full,
    },
    selectedDayText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
    todayDay: {
        borderRadius: borderRadius.full,
        borderWidth: 2,
    },
});

