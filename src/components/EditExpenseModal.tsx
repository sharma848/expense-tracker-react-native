/**
 * Edit Expense Modal Component
 * Modal for editing existing expenses
 */

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Modal,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Expense, PaymentMethod, ExpenseCategory } from "../types";
import { useExpenseStore } from "../store/expenseStore";
import { PaymentMethodPicker } from "./PaymentMethodPicker";
import { CategoryIconGrid } from "./CategoryIconGrid";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { DateCalendar } from "./DateCalendar";
import { useTheme } from "../hooks/useTheme";
import { typography } from "../theme/typography";
import { spacing, borderRadius } from "../theme/spacing";
import { getCurrency } from "../utils/currency";
import dayjs from "dayjs";

interface EditExpenseModalProps {
    visible: boolean;
    expense: Expense | null;
    onClose: () => void;
    onSave: () => void;
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
    visible,
    expense,
    onClose,
    onSave,
}) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const { paymentMethods, updateExpense, customCategories } = useExpenseStore();
    const currency = getCurrency();

    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState<ExpenseCategory>("Food");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));

    // Initialize form when expense changes
    useEffect(() => {
        if (expense) {
            setAmount(expense.amount.toString());
            setCategory(expense.category);
            setDescription(expense.description || "");
            setDate(expense.date);
            
            const paymentMethod = paymentMethods.find(
                (pm) => pm.id === expense.paymentMethodId
            );
            setSelectedPaymentMethod(paymentMethod || null);
        }
    }, [expense, paymentMethods]);

    // Ensure category is valid when custom categories are loaded
    useEffect(() => {
        const defaultCategories = ["Food", "Travel", "Shopping", "Bills"];
        const allCategories = [
            ...defaultCategories,
            ...customCategories.map((c) => c.name),
        ];
        if (category && !allCategories.includes(category)) {
            setCategory("Food");
        }
    }, [customCategories]);

    const handleSave = async () => {
        if (!expense) return;

        // Validation
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            Alert.alert("Error", "Please enter a valid amount");
            return;
        }

        if (!selectedPaymentMethod) {
            Alert.alert("Error", "Please select a payment method");
            return;
        }

        if (!category || category.trim() === "") {
            Alert.alert("Error", "Please select a category");
            return;
        }

        try {
            await updateExpense(expense.id, {
                amount: parseFloat(amount),
                category: category.trim(),
                paymentMethodId: selectedPaymentMethod.id,
                description: description.trim() || undefined,
                date,
            });

            Alert.alert("Success", "Expense updated successfully", [
                {
                    text: "OK",
                    onPress: () => {
                        onSave();
                        onClose();
                    },
                },
            ]);
        } catch (error) {
            console.error("Error updating expense:", error);
            Alert.alert("Error", "Failed to update expense. Please try again.");
        }
    };

    if (!expense) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Edit Expense
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={[styles.closeButton, { color: colors.textSecondary }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={[
                            styles.content,
                            { paddingBottom: Math.max(insets.bottom, spacing.xxl) }
                        ]}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Amount Section */}
                        <View style={styles.amountSection}>
                            <Card style={[styles.amountCard, { backgroundColor: colors.surface }]}>
                                <Text
                                    style={[
                                        styles.amountLabel,
                                        { color: colors.textSecondary },
                                    ]}
                                >
                                    Amount
                                </Text>
                                <View style={styles.amountInputContainer}>
                                    <View style={styles.currencyWrapper}>
                                        <Text
                                            style={[
                                                styles.currencySymbol,
                                                { color: colors.text },
                                            ]}
                                        >
                                            {currency.symbol}
                                        </Text>
                                    </View>
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={[
                                                styles.amountInput,
                                                { color: colors.text },
                                            ]}
                                            placeholder="0.00"
                                            placeholderTextColor={colors.textSecondary}
                                            value={amount}
                                            onChangeText={setAmount}
                                            keyboardType="decimal-pad"
                                        />
                                    </View>
                                </View>
                            </Card>
                        </View>

                        {/* Category */}
                        <Card style={styles.sectionCard}>
                            <Text style={[styles.sectionLabel, { color: colors.text }]}>
                                Category
                            </Text>
                            <CategoryIconGrid
                                selectedCategory={category}
                                onSelectCategory={(selectedCategory) => {
                                    if (selectedCategory && selectedCategory.trim() !== "") {
                                        setCategory(selectedCategory.trim());
                                    }
                                }}
                            />
                        </Card>

                        {/* Payment Method */}
                        <View style={styles.sectionCard}>
                            <Text style={[styles.sectionLabel, { color: colors.text }]}>
                                Payment Method
                            </Text>
                            <PaymentMethodPicker
                                paymentMethods={paymentMethods}
                                selectedId={selectedPaymentMethod?.id}
                                onSelect={setSelectedPaymentMethod}
                            />
                        </View>

                        {/* Description */}
                        <Card style={styles.sectionCard}>
                            <Input
                                label="Description (Optional)"
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Add a note..."
                                multiline
                            />
                        </Card>

                        {/* Date Calendar */}
                        <Card style={styles.sectionCard}>
                            <Text style={[styles.sectionLabel, { color: colors.text }]}>
                                Date
                            </Text>
                            <DateCalendar
                                selectedDate={date}
                                onDateSelect={setDate}
                            />
                        </Card>

                        {/* Save Button */}
                        <View style={styles.buttonContainer}>
                            <Button title="Save Changes" onPress={handleSave} fullWidth />
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        flex: 1,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        marginTop: 60,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: spacing.screenPadding,
        paddingTop: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(100, 116, 139, 0.1)",
    },
    title: {
        ...typography.headline,
        fontSize: 20,
        fontWeight: "700",
    },
    closeButton: {
        ...typography.body,
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: spacing.screenPadding,
    },
    amountSection: {
        alignItems: "center",
        marginBottom: spacing.lg,
        marginTop: spacing.sm,
    },
    amountCard: {
        width: "100%",
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        paddingVertical: spacing.xl,
        alignItems: "center",
        minHeight: 120,
    },
    amountLabel: {
        ...typography.subhead,
        marginBottom: spacing.md,
        textTransform: "uppercase",
        letterSpacing: 1,
        fontSize: 11,
        fontWeight: "900",
        width: "100%",
        textAlign: "center",
    },
    amountInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 50,
    },
    currencyWrapper: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginRight: spacing.sm,
    },
    currencySymbol: {
        ...typography.display,
        fontSize: 40,
        fontWeight: "700",
        opacity: 0.9,
        lineHeight: 50,
        includeFontPadding: false,
    },
    inputWrapper: {
        height: 50,
        justifyContent: "center",
        minWidth: 150,
    },
    amountInput: {
        ...typography.display,
        fontSize: 44,
        fontWeight: "700",
        textAlign: "left",
        padding: 0,
        margin: 0,
        letterSpacing: -0.5,
        includeFontPadding: false,
        lineHeight: 50,
        height: 50,
    },
    sectionCard: {
        marginBottom: spacing.xl,
    },
    sectionLabel: {
        ...typography.bodyBold,
        marginBottom: spacing.lg + spacing.sm,
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    buttonContainer: {
        marginTop: spacing.xxl,
        marginBottom: spacing.lg,
    },
});

