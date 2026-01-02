/**
 * Revolut/Monzo-inspired Rotating Balance Card
 * UX: Top card showing balance, elevated design
 * Design: Gradient background, rotating animation, premium feel
 */

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { typography } from "../theme/typography";
import { spacing, borderRadius, shadows } from "../theme/spacing";
import { formatCurrency } from "../utils/currency";

interface BalanceCardProps {
    balance: number;
    label?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
    balance,
    label = "This Month",
}) => {
    const { colors } = useTheme();
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Subtle fade-in animation on mount (removed aggressive rotation)
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    const fadeInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <Animated.View
            style={[
                styles.cardContainer,
                {
                    opacity: fadeInterpolate,
                },
            ]}
        >
            <LinearGradient
                colors={colors.primaryGradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.card, shadows.lg]}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.cardIcon}>
                        <MaterialCommunityIcons
                            name="wallet"
                            size={24}
                            color="#FFFFFF"
                        />
                    </View>
                    <Text style={styles.cardLabel}>{label}</Text>
                </View>

                <View style={styles.balanceContainer}>
                    <Text
                        style={styles.balanceAmount}
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                        minimumFontScale={0.7}
                    >
                        {formatCurrency(balance)}
                    </Text>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: spacing.xl,
    },
    card: {
        borderRadius: borderRadius.xl,
        padding: spacing.xl + spacing.md, // Increased padding for better breathing room
        minHeight: 240, // Increased height to prevent truncation
        justifyContent: "space-between",
        overflow: "visible", // Changed to visible to prevent clipping
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.lg, // Reduced to give more space to balance
    },
    cardIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255, 255, 255, 0.25)", // Slightly more visible
        justifyContent: "center",
        alignItems: "center",
    },
    cardLabel: {
        ...typography.subhead,
        color: "#FFFFFF",
        opacity: 0.95, // Better contrast
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    balanceContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: spacing.lg, // Increased vertical padding
        minHeight: 100, // Increased minimum height to prevent top truncation
        width: "100%", // Ensure full width
        paddingHorizontal: spacing.sm, // Horizontal padding to prevent edge cutting
        flex: 1, // Take available space
    },
    balanceAmount: {
        ...typography.display,
        fontSize: 48, // Larger for better hierarchy
        fontWeight: "700",
        color: "#FFFFFF",
        letterSpacing: -1.5, // Tighter letter spacing for large numbers
        textAlign: "center",
        flexShrink: 1, // Allow text to shrink if needed
        includeFontPadding: false, // Remove extra font padding that can cause clipping
        lineHeight: 56, // Explicit line height to prevent top clipping
    },
});
