/**
 * Premium Input Component
 * Filled style (NOT outlined), rounded, subtle background
 * UX: Modern filled input design, no harsh borders
 */

import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { typography } from "../../theme/typography";
import { spacing, borderRadius } from "../../theme/spacing";

interface InputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    label?: string;
    keyboardType?: "default" | "numeric" | "decimal-pad" | "email-address";
    secureTextEntry?: boolean;
    multiline?: boolean;
    error?: string;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    containerStyle?: object;
    inputStyle?: object;
    editable?: boolean;
    onSubmitEditing?: () => void;
}

export const Input: React.FC<InputProps> = ({
    value,
    onChangeText,
    placeholder,
    label,
    keyboardType = "default",
    secureTextEntry = false,
    multiline = false,
    error,
    autoCapitalize = "none",
    containerStyle,
    inputStyle,
    editable = true,
    onSubmitEditing,
}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, { color: colors.text }]}>
                    {label}
                </Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    multiline && styles.inputMultiline,
                    {
                        backgroundColor: colors.inputBackground,
                        color: colors.text,
                        borderColor: error ? colors.error : "transparent",
                    },
                    inputStyle,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                multiline={multiline}
                autoCapitalize={autoCapitalize}
                editable={editable}
                onSubmitEditing={onSubmitEditing}
            />
            {error && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.bodyBold,
        marginBottom: spacing.sm,
    },
    input: {
        height: 52,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.lg,
        ...typography.body,
        fontSize: 16,
        borderWidth: 0, // No visible borders - filled style
    },
    inputMultiline: {
        height: 100,
        paddingTop: spacing.lg,
        textAlignVertical: "top",
    },
    errorText: {
        ...typography.caption,
        marginTop: spacing.xs,
    },
});

