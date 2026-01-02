/**
 * Premium Card Component
 * borderRadius: 18, NO visible borders, Soft shadow only
 * UX: Generous whitespace, clean separation without harsh lines
 */

import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { spacing, borderRadius, shadows } from "../../theme/spacing";

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    padding?: number;
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    padding = spacing.cardPadding,
}) => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    padding,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.lg, // 18px premium radius
        ...shadows.md, // Soft shadow only
    },
});

