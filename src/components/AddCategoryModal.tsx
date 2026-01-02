/**
 * Add Category Modal
 * UX: Modal for adding custom categories with icon selection and name input
 * Design: Premium finance design, clean icon picker, smooth animations
 */

import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import { typography } from "../theme/typography";
import { spacing, borderRadius, shadows } from "../theme/spacing";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface AddCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (name: string, icon: string) => Promise<void>;
}

// Popular emoji icons for categories
const categoryIcons = [
    "🍔", "🍕", "☕", "🍰", "🥗", // Food
    "✈️", "🚗", "🚇", "🏨", "🎫", // Travel
    "🛍️", "👕", "👠", "💄", "📱", // Shopping
    "💳", "🏦", "⚡", "💧", "📺", // Bills
    "🏥", "💊", "🎓", "🎮", "🎬", // Health, Education, Entertainment
    "🏋️", "🎨", "📚", "🎵", "🐾", // Fitness, Hobbies, Pets
    "🎁", "💐", "🎪", "🏖️", "⛰️", // Gifts, Events, Vacation
    "🚚", "📦", "🛵", "🚲", "🚕", // Delivery & Transportation
    "🍽️", "🍻", "🍷", "🥂", "🍾", // Dining & Drinks
    "💻", "📷", "🎧", "🎤", "🎸", // Tech & Music
    "🧘", "🏃", "🚴", "🏊", "⚽", // Sports & Activities
    "🌮", "🍣", "🍜", "🥘", "🍲", // More Food
    "🎯", "🎲", "🃏", "🎰", "🎪", // Games & Entertainment
    "🌿", "🌱", "🌳", "🌻", "🌺", // Nature & Plants
    "🔧", "🛠️", "⚙️", "🔩", "🪚", // Tools & Maintenance
];

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
    visible,
    onClose,
    onAdd,
}) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [categoryName, setCategoryName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState<string>("");

    const handleAdd = async () => {
        if (!categoryName.trim()) {
            Alert.alert("Error", "Please enter a category name");
            return;
        }

        if (!selectedIcon) {
            Alert.alert("Error", "Please select an icon");
            return;
        }

        try {
            await onAdd(categoryName.trim(), selectedIcon);
            // Reset form
            setCategoryName("");
            setSelectedIcon("");
            onClose();
        } catch (error) {
            Alert.alert("Error", "Failed to add category. Please try again.");
        }
    };

    const handleClose = () => {
        setCategoryName("");
        setSelectedIcon("");
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={0}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={handleClose}
                />
                <View
                    style={[
                        styles.modalContent,
                        {
                            backgroundColor: colors.surface,
                            paddingTop: spacing.lg,
                            paddingBottom: Math.max(insets.bottom, spacing.md),
                        },
                    ]}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            Add New Category
                        </Text>

                        {/* Category Name Input */}
                        <Card style={styles.inputCard}>
                            <Input
                                label="Category Name"
                                value={categoryName}
                                onChangeText={setCategoryName}
                                placeholder="e.g., Entertainment, Health"
                                autoCapitalize="words"
                            />
                        </Card>

                        {/* Icon Selection */}
                        <Card style={styles.iconCard}>
                            <Text style={[styles.iconLabel, { color: colors.text }]}>
                                Select Icon
                            </Text>
                            <ScrollView
                                style={styles.iconGrid}
                                contentContainerStyle={styles.iconGridContent}
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={styles.iconRow}>
                                    {categoryIcons.map((icon, index) => {
                                        const isSelected = selectedIcon === icon;
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                style={[
                                                    styles.iconOption,
                                                    {
                                                        backgroundColor: isSelected
                                                            ? colors.primary
                                                            : colors.surfaceSecondary,
                                                        borderWidth: isSelected ? 2 : 0,
                                                        borderColor: colors.primary,
                                                    },
                                                ]}
                                                onPress={() => setSelectedIcon(icon)}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={styles.iconText}>{icon}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </ScrollView>
                        </Card>

                        {/* Selected Icon Preview */}
                        {selectedIcon && (
                            <Card style={styles.previewCard}>
                                <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
                                    Preview
                                </Text>
                                <View style={styles.previewContent}>
                                    <View
                                        style={[
                                            styles.previewIconCircle,
                                            { backgroundColor: colors.primary + "20" },
                                        ]}
                                    >
                                        <Text style={styles.previewIcon}>{selectedIcon}</Text>
                                    </View>
                                    <Text
                                        style={[
                                            styles.previewName,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {categoryName || "Category Name"}
                                    </Text>
                                </View>
                            </Card>
                        )}
                    </ScrollView>

                    {/* Fixed Actions at Bottom - Always Visible */}
                    <View 
                        style={[
                            styles.actions,
                            {
                                backgroundColor: colors.surface,
                                borderTopWidth: 1,
                                borderTopColor: colors.borderLight,
                                paddingTop: spacing.md,
                                paddingBottom: Math.max(insets.bottom, spacing.md),
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={[
                                styles.cancelButton,
                                { backgroundColor: colors.surfaceSecondary }
                            ]}
                            onPress={handleClose}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.addButton,
                                {
                                    backgroundColor: (!categoryName.trim() || !selectedIcon)
                                        ? colors.textTertiary
                                        : colors.primary,
                                }
                            ]}
                            onPress={handleAdd}
                            disabled={!categoryName.trim() || !selectedIcon}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.addButtonText}>
                                Add Category
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        paddingHorizontal: spacing.lg,
        maxHeight: "85%",
        marginTop: "auto",
    },
    scrollContent: {
        paddingBottom: spacing.md,
    },
    modalTitle: {
        ...typography.headline,
        marginBottom: spacing.lg,
    },
    inputCard: {
        marginBottom: spacing.lg,
    },
    iconCard: {
        marginBottom: spacing.lg,
    },
    iconLabel: {
        ...typography.bodyBold,
        marginBottom: spacing.md,
    },
    iconGrid: {
        maxHeight: 200,
    },
    iconGridContent: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
    },
    iconRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -spacing.xs,
    },
    iconOption: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        justifyContent: "center",
        alignItems: "center",
        margin: spacing.xs,
    },
    iconText: {
        fontSize: 24,
    },
    previewCard: {
        marginBottom: spacing.lg,
        padding: spacing.md,
    },
    previewLabel: {
        ...typography.subhead,
        marginBottom: spacing.sm,
    },
    previewContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    previewIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: spacing.md,
    },
    previewIcon: {
        fontSize: 24,
    },
    previewName: {
        ...typography.bodyBold,
    },
    actions: {
        flexDirection: "row",
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 52,
    },
    cancelButtonText: {
        ...typography.bodyBold,
        fontSize: 15,
        fontWeight: "600",
    },
    addButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 52,
    },
    addButtonText: {
        ...typography.bodyBold,
        fontSize: 15,
        fontWeight: "600",
        color: "#FFFFFF",
    },
});

