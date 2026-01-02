/**
 * Add Expense Screen
 * Form to add new expenses with category, amount, payment method, etc.
 */

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useExpenseStore } from "../../store/expenseStore";
import { PaymentMethodPicker } from "../../components/PaymentMethodPicker";
import { CategoryIconGrid } from "../../components/CategoryIconGrid";
import { ExpenseCategory, PaymentMethod } from "../../types";
import { getCurrency } from "../../utils/currency";
import { useTheme } from "../../hooks/useTheme";
import { typography } from "../../theme/typography";
import { spacing, borderRadius } from "../../theme/spacing";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DateCalendar } from "../../components/DateCalendar";
import dayjs from "dayjs";

const AddExpenseScreen: React.FC = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { paymentMethods, addExpense, loadData, customCategories } =
        useExpenseStore();
    const currency = getCurrency();
    const { colors } = useTheme();

    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState<ExpenseCategory>("Food");
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState<PaymentMethod | null>(null);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));

    useEffect(() => {
        loadData();
        // Set default payment method to Cash if available
        const cashMethod = paymentMethods.find((m) => m.type === "Cash");
        if (cashMethod) {
            setSelectedPaymentMethod(cashMethod);
        }
    }, [loadData]);

    // Ensure category is valid when custom categories are loaded
    useEffect(() => {
        // If current category is not in available categories, reset to Food
        const defaultCategories = ["Food", "Travel", "Shopping", "Bills"];
        const allCategories = [
            ...defaultCategories,
            ...customCategories.map((c) => c.name),
        ];
        if (category && !allCategories.includes(category)) {
            setCategory("Food");
        }
    }, [customCategories]);

    const handleSubmit = async () => {
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
            // Ensure category is valid before saving
            const categoryToSave =
                category && category.trim() !== "" ? category.trim() : "Food"; // Fallback to Food if category is empty

            console.log("Saving expense with category:", categoryToSave); // Debug log

            await addExpense({
                amount: parseFloat(amount),
                category: categoryToSave,
                paymentMethodId: selectedPaymentMethod.id,
                description: description.trim() || undefined,
                date,
            });

            Alert.alert("Success", "Expense added successfully", [
                {
                    text: "OK",
                    onPress: () => {
                        // Reset form
                        setAmount("");
                        setDescription("");
                        setCategory("Food");
                        setDate(dayjs().format("YYYY-MM-DD"));
                        // Navigate to home
                        navigation.navigate("Home" as never);
                    },
                },
            ]);
        } catch (error) {
            console.error("Error adding expense:", error);
            Alert.alert("Error", "Failed to add expense. Please try again.");
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.content,
                    { 
                        paddingTop: Math.max(insets.top + 20, 80),
                        paddingBottom: Math.max(insets.bottom, spacing.xxl)
                    }
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Centered numeric input - BIG and prominent */}
                <View style={styles.amountSection}>
                    <View
                        style={[
                            styles.amountCard,
                            { backgroundColor: colors.surface },
                            colors.cardElevation,
                        ]}
                    >
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
                                    autoFocus
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Category selection as icon grid */}
                <Card style={styles.sectionCard}>
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>
                        Category
                    </Text>
                    <CategoryIconGrid
                        selectedCategory={category}
                        onSelectCategory={(selectedCategory) => {
                            // Ensure category is properly set with validation
                            if (
                                selectedCategory &&
                                selectedCategory.trim() !== ""
                            ) {
                                setCategory(selectedCategory.trim());
                            }
                        }}
                    />
                </Card>

                {/* Payment method cards */}
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

                {/* Description - optional */}
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

                {/* Save Expense button - integrated into scroll */}
                <View style={styles.buttonContainer}>
                    <Button title="Save Expense" onPress={handleSubmit} fullWidth />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: spacing.screenPadding,
    },
    // Centered amount section - reduced size
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
        minHeight: 120, // Reduced from 200
        overflow: "visible",
    },
    amountLabel: {
        ...typography.subhead,
        marginBottom: spacing.md,
        textTransform: "uppercase",
        letterSpacing: 1,
        fontSize: 11,
        fontWeight: "900", // Extra bold
        width: "100%",
        textAlign: "center",
    },
    amountInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 50, // Fixed height for consistent alignment
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
    // Section cards
    sectionCard: {
        marginBottom: spacing.xl, // More space between sections
    },
    sectionLabel: {
        ...typography.bodyBold,
        marginBottom: spacing.lg + spacing.sm, // More space before content
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    // Button container - premium styling
    buttonContainer: {
        marginTop: spacing.xxl,
        marginBottom: spacing.lg,
    },
});

export default AddExpenseScreen;
