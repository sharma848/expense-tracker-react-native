/**
 * Premium Button Component
 * Fully rounded, solid primary color, 52px height
 * UX: Large touch target for thumb-friendly interaction
 */

import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { typography } from "../../theme/typography";
import { spacing, borderRadius } from "../../theme/spacing";

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "danger" | "secondary";
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = "primary",
    disabled = false,
    loading = false,
    fullWidth = false,
}) => {
    const { colors } = useTheme();

    const getBackgroundColor = () => {
        if (disabled) return colors.textTertiary;
        if (variant === "danger") return colors.error;
        if (variant === "secondary") return colors.surfaceSecondary;
        return colors.primary;
    };

    const getTextColor = () => {
        if (variant === "secondary") return colors.text;
        return "#FFFFFF";
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    width: fullWidth ? "100%" : undefined,
                },
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.buttonText, { color: getTextColor() }]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: spacing.touchTarget,
        borderRadius: borderRadius.full,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.xl,
    },
    buttonText: {
        ...typography.bodyBold,
        fontSize: 16,
    },
});

