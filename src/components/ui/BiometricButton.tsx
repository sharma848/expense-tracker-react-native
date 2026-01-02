/**
 * Biometric Authentication Button
 * UX: Face ID/Touch ID button for quick authentication
 * Design: Premium icon button with subtle background
 */

import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { spacing, borderRadius } from "../../theme/spacing";

interface BiometricButtonProps {
    onPress: () => void;
    type: "face" | "fingerprint" | "none";
}

export const BiometricButton: React.FC<BiometricButtonProps> = ({
    onPress,
    type,
}) => {
    const { colors } = useTheme();

    // Icon based on biometric type
    const getIcon = () => {
        if (type === "face") return "👤"; // Face ID icon
        if (type === "fingerprint") return "👆"; // Touch ID icon
        return "🔐"; // Fallback
    };

    const getLabel = () => {
        if (type === "face") return "Face ID";
        if (type === "fingerprint") return "Touch ID";
        return "Biometric";
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: colors.surfaceSecondary,
                    borderColor: colors.borderLight,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>{getIcon()}</Text>
            </View>
            <Text style={[styles.label, { color: colors.text }]}>
                {getLabel()}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        minHeight: 52,
    },
    iconContainer: {
        marginRight: spacing.sm,
    },
    icon: {
        fontSize: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
    },
});
