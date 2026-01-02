/**
 * Premium Category Icon Grid
 * UX: Visual icon grid for category selection, soft colored circles
 * Design: Generous spacing, no borders, clean selection state
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ExpenseCategory } from "../types";
import { useTheme } from "../hooks/useTheme";
import { spacing, borderRadius } from "../theme/spacing";
import { typography } from "../theme/typography";
import { useExpenseStore } from "../store/expenseStore";
import { AddCategoryModal } from "./AddCategoryModal";

interface CategoryIconGridProps {
    selectedCategory: ExpenseCategory;
    onSelectCategory: (category: ExpenseCategory) => void;
}

const defaultCategories: ExpenseCategory[] = ["Food", "Travel", "Shopping", "Bills"];

const defaultCategoryIcons: Record<string, string> = {
    Food: "🍔",
    Travel: "✈️",
    Shopping: "🛍️",
    Bills: "💳",
};

export const CategoryIconGrid: React.FC<CategoryIconGridProps> = ({
    selectedCategory,
    onSelectCategory,
}) => {
    const { colors } = useTheme();
    const { customCategories, addCustomCategory, loadData } = useExpenseStore();
    const [showAddModal, setShowAddModal] = useState(false);

    // Get all categories (default + custom)
    const allCategories = [
        ...defaultCategories,
        ...customCategories.map((c) => c.name),
    ];

    // Get icon for a category
    const getCategoryIcon = (category: ExpenseCategory): string => {
        // Check default categories
        if (defaultCategoryIcons[category]) {
            return defaultCategoryIcons[category];
        }
        // Check custom categories
        const custom = customCategories.find((c) => c.name === category);
        return custom?.icon || "📝";
    };

    // Get color for a category
    const getCategoryColor = (category: ExpenseCategory): string => {
        // Default categories
        if (category in colors.category) {
            return colors.category[category as keyof typeof colors.category];
        }
        // Custom categories - use primary color or custom color if set
        const custom = customCategories.find((c) => c.name === category);
        return custom?.color || colors.primary;
    };

    const handleAddCategory = async (name: string, icon: string) => {
        await addCustomCategory({ name, icon });
        await loadData(); // Reload to get updated categories
        // Auto-select the newly added category
        onSelectCategory(name);
    };

    return (
        <>
            <View style={styles.container}>
                {/* Default and Custom Categories */}
                {allCategories.map((category, index) => {
                    const isSelected = selectedCategory === category;
                    const categoryColor = getCategoryColor(category);
                    const icon = getCategoryIcon(category);

                    return (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryItem,
                                index % 5 !== 4 && styles.categoryItemSpacing,
                            ]}
                            onPress={() => {
                                // Ensure category is properly passed
                                onSelectCategory(category);
                            }}
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.iconCircle,
                                    {
                                        backgroundColor: isSelected
                                            ? categoryColor
                                            : categoryColor + "20", // 20% opacity when not selected
                                    },
                                ]}
                            >
                                <Text style={styles.icon}>{icon}</Text>
                            </View>
                            <Text
                                style={[
                                    styles.categoryLabel,
                                    {
                                        color: isSelected
                                            ? colors.text
                                            : colors.textSecondary,
                                        fontWeight: isSelected ? "600" : "400",
                                    },
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    );
                })}

                {/* Add Category Button */}
                <TouchableOpacity
                    style={[
                        styles.categoryItem,
                        styles.addButton,
                        (allCategories.length % 5 !== 4) && styles.categoryItemSpacing,
                    ]}
                    onPress={() => setShowAddModal(true)}
                    activeOpacity={0.7}
                >
                    <View
                        style={[
                            styles.iconCircle,
                            styles.addButtonCircle,
                            {
                                backgroundColor: colors.surfaceSecondary,
                                borderWidth: 2,
                                borderColor: colors.primary,
                                borderStyle: "dashed",
                            },
                        ]}
                    >
                        <Text style={[styles.addIcon, { color: colors.primary }]}>
                            +
                        </Text>
                    </View>
                    <Text
                        style={[
                            styles.categoryLabel,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Add
                    </Text>
                </TouchableOpacity>
            </View>

            <AddCategoryModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddCategory}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: spacing.md,
        // UX Best Practice: Negative margin technique for consistent spacing
        marginHorizontal: -spacing.sm, // Offset item margins for clean edges
    },
    categoryItem: {
        // UX Best Practice: 5 items per row with proper spacing
        // Each item gets equal space with margins for breathing room
        width: "18.4%", // (100% - 4 gaps) / 5, accounting for margins
        alignItems: "center",
        marginBottom: spacing.lg, // Vertical spacing between rows (16px)
        marginHorizontal: spacing.sm, // Horizontal spacing (8px on each side = 16px gap between icons)
        // This creates proper 16px spacing between icon circles (UX best practice)
    },
    categoryItemSpacing: {
        // Spacing handled by marginHorizontal above
    },
    iconCircle: {
        width: 56, // Reduced from 64 to 56 (12.5% smaller)
        height: 56,
        borderRadius: 28, // Half of width/height for perfect circle
        justifyContent: "center",
        alignItems: "center",
        marginBottom: spacing.sm, // Space between icon and label (8px)
    },
    icon: {
        fontSize: 28, // Reduced from 32 to 28 to match smaller circle
    },
    categoryLabel: {
        ...typography.caption,
        textAlign: "center",
    },
    addButton: {
        // Same styling as categoryItem
    },
    addButtonCircle: {
        // Dashed border handled inline
    },
    addIcon: {
        fontSize: 32,
        fontWeight: "300",
    },
});

