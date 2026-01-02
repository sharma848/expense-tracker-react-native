/**
 * Settings Screen
 * Manage payment methods and logout
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useExpenseStore } from '../../store/expenseStore';
import { useThemeStore, ThemePreference } from '../../store/themeStore';
import { PaymentMethod, PaymentMethodType } from '../../types';
/**
 * Premium Settings Screen
 * UX: Simple list layout, grouped sections, logout button at bottom (danger color)
 * Design: Clean separation, no borders, generous spacing
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const SettingsScreen: React.FC = () => {
  const { colors, themePreference } = useTheme();
  const insets = useSafeAreaInsets();
  const { logout, username } = useAuthStore();
  const { paymentMethods, loadData, addPaymentMethod, deletePaymentMethod } = useExpenseStore();
  const { setThemePreference, loadThemePreference } = useThemeStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMethodType, setNewMethodType] = useState<PaymentMethodType>('Card');
  const [newMethodName, setNewMethodName] = useState('');
  const [newBankName, setNewBankName] = useState('');

  useEffect(() => {
    loadData();
    loadThemePreference(); // Ensure theme preference is loaded
  }, [loadData, loadThemePreference]);

  const handleAddPaymentMethod = async () => {
    if (!newMethodName.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    if (newMethodType === 'Bank' && !newBankName.trim()) {
      Alert.alert('Error', 'Please enter a bank name');
      return;
    }

    try {
      await addPaymentMethod({
        type: newMethodType,
        name: newMethodName.trim(),
        bankName: newMethodType === 'Bank' ? newBankName.trim() : undefined,
      });

      Alert.alert('Success', 'Payment method added successfully');
      setShowAddModal(false);
      setNewMethodName('');
      setNewBankName('');
      setNewMethodType('Card');
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method');
    }
  };

  const handleDeletePaymentMethod = (method: PaymentMethod) => {
    if (method.type === 'Cash') {
      Alert.alert('Error', 'Cannot delete Cash payment method');
      return;
    }

    Alert.alert(
      'Delete Payment Method',
      `Are you sure you want to delete "${method.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePaymentMethod(method.id);
              Alert.alert('Success', 'Payment method deleted');
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to delete payment method';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top, 60) }
      ]}
    >
      {/* Account section */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <MaterialCommunityIcons name="account" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        </View>
        <View style={styles.accountRow}>
          <View style={styles.accountLeft}>
            <MaterialCommunityIcons name="account-circle" size={18} color={colors.textSecondary} />
            <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>Username</Text>
          </View>
          <Text style={[styles.accountValue, { color: colors.text }]}>{username || 'user'}</Text>
        </View>
      </Card>

      {/* Appearance/Theme section */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <MaterialCommunityIcons name="theme-light-dark" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        </View>
        
        <View style={[styles.themeOption, { borderBottomWidth: 1, borderBottomColor: colors.borderLight }]}>
          <View style={styles.themeOptionLeft}>
            <MaterialCommunityIcons name="weather-sunny" size={18} color={colors.textSecondary} />
            <Text style={[styles.themeOptionLabel, { color: colors.text }]}>Light</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.radioButton,
              themePreference === 'light' && { backgroundColor: colors.primary },
              themePreference !== 'light' && { borderColor: colors.border, borderWidth: 2 },
            ]}
            onPress={() => setThemePreference('light')}
            activeOpacity={0.7}
          >
            {themePreference === 'light' && (
              <View style={[styles.radioButtonInner, { backgroundColor: '#FFFFFF' }]} />
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.themeOption, { borderBottomWidth: 1, borderBottomColor: colors.borderLight }]}>
          <View style={styles.themeOptionLeft}>
            <MaterialCommunityIcons name="weather-night" size={18} color={colors.textSecondary} />
            <Text style={[styles.themeOptionLabel, { color: colors.text }]}>Dark</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.radioButton,
              themePreference === 'dark' && { backgroundColor: colors.primary },
              themePreference !== 'dark' && { borderColor: colors.border, borderWidth: 2 },
            ]}
            onPress={() => setThemePreference('dark')}
            activeOpacity={0.7}
          >
            {themePreference === 'dark' && (
              <View style={[styles.radioButtonInner, { backgroundColor: '#FFFFFF' }]} />
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.themeOption, { borderBottomWidth: 0 }]}>
          <View style={styles.themeOptionLeft}>
            <MaterialCommunityIcons name="cellphone-settings" size={18} color={colors.textSecondary} />
            <View>
              <Text style={[styles.themeOptionLabel, { color: colors.text }]}>System</Text>
              <Text style={[styles.themeOptionSubtext, { color: colors.textSecondary }]}>
                Follow device
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.radioButton,
              themePreference === 'system' && { backgroundColor: colors.primary },
              themePreference !== 'system' && { borderColor: colors.border, borderWidth: 2 },
            ]}
            onPress={() => setThemePreference('system')}
            activeOpacity={0.7}
          >
            {themePreference === 'system' && (
              <View style={[styles.radioButtonInner, { backgroundColor: '#FFFFFF' }]} />
            )}
          </TouchableOpacity>
        </View>
      </Card>

      {/* Payment Methods section */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderRow}>
            <MaterialCommunityIcons name="credit-card-multiple" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Methods</Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowAddModal(true)}
          >
            <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {paymentMethods.map((method, index) => {
          const getMethodIcon = (type: string) => {
            switch (type) {
              case 'Cash': return 'cash';
              case 'Card': return 'credit-card';
              case 'Bank': return 'bank';
              default: return 'wallet';
            }
          };
          
          return (
            <View
              key={method.id}
              style={[
                styles.paymentMethodItem,
                index < paymentMethods.length - 1 && { marginBottom: spacing.lg + spacing.sm },
              ]}
            >
              <View style={styles.paymentMethodInfo}>
                <View style={styles.paymentMethodHeader}>
                  <MaterialCommunityIcons 
                    name={getMethodIcon(method.type) as any} 
                    size={20} 
                    color={colors.primary} 
                  />
                  <Text style={[styles.paymentMethodName, { color: colors.text }]}>{method.name}</Text>
                </View>
                {method.bankName && (
                  <Text style={[styles.paymentMethodBank, { color: colors.textSecondary }]}>
                    {method.bankName}
                  </Text>
                )}
                <View style={[styles.paymentMethodTypeBadge, { backgroundColor: colors.surfaceSecondary }]}>
                  <Text style={[styles.paymentMethodType, { color: colors.textSecondary }]}>
                    {method.type}
                  </Text>
                </View>
              </View>
              {method.type !== 'Cash' && (
                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: colors.error + '20' }]}
                  onPress={() => handleDeletePaymentMethod(method)}
                >
                  <MaterialCommunityIcons name="delete-outline" size={16} color={colors.error} />
                  <Text style={[styles.deleteButtonText, { color: colors.error }]}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </Card>

      {/* Logout button at bottom (danger color) */}
      <View style={styles.logoutSection}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          fullWidth
        />
      </View>

      <AddPaymentMethodModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewMethodName('');
          setNewBankName('');
          setNewMethodType('Card');
        }}
        methodType={newMethodType}
        onMethodTypeChange={setNewMethodType}
        methodName={newMethodName}
        onMethodNameChange={setNewMethodName}
        bankName={newBankName}
        onBankNameChange={setNewBankName}
        onAdd={handleAddPaymentMethod}
      />
    </ScrollView>
  );
};

/**
 * Add Payment Method Modal
 */
const AddPaymentMethodModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  methodType: PaymentMethodType;
  onMethodTypeChange: (type: PaymentMethodType) => void;
  methodName: string;
  onMethodNameChange: (name: string) => void;
  bankName: string;
  onBankNameChange: (name: string) => void;
  onAdd: () => void;
}> = ({
  visible,
  onClose,
  methodType,
  onMethodTypeChange,
  methodName,
  onMethodNameChange,
  bankName,
  onBankNameChange,
  onAdd,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View 
          style={[
            styles.modalContent, 
            { 
              backgroundColor: colors.surface,
              paddingBottom: Math.max(insets.bottom, spacing.xl),
            }
          ]}
        >
          {/* Scrollable content */}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalScrollContent}
            style={styles.modalScrollView}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Payment Method</Text>

            <Text style={[styles.modalLabel, { color: colors.text }]}>Type</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: methodType === 'Card' 
                      ? colors.primary 
                      : colors.surfaceSecondary,
                  },
                ]}
                onPress={() => onMethodTypeChange('Card')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    {
                      color: methodType === 'Card' ? '#FFFFFF' : colors.text,
                    },
                  ]}
                >
                  Card
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: methodType === 'Bank' 
                      ? colors.primary 
                      : colors.surfaceSecondary,
                  },
                ]}
                onPress={() => onMethodTypeChange('Bank')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    {
                      color: methodType === 'Bank' ? '#FFFFFF' : colors.text,
                    },
                  ]}
                >
                  Bank
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalLabel, { color: colors.text }]}>
              {methodType === 'Card' ? 'Card Name' : 'Account Nickname'} *
            </Text>
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text 
              }]}
              placeholder={methodType === 'Card' ? 'e.g., Visa, Mastercard' : 'e.g., Checking, Savings'}
              placeholderTextColor={colors.textSecondary}
              value={methodName}
              onChangeText={onMethodNameChange}
            />

            {methodType === 'Bank' && (
              <>
                <Text style={[styles.modalLabel, { color: colors.text }]}>Bank Name *</Text>
                <TextInput
                  style={[styles.modalInput, { 
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border,
                    color: colors.text 
                  }]}
                  placeholder="e.g., Chase, Bank of America"
                  placeholderTextColor={colors.textSecondary}
                  value={bankName}
                  onChangeText={onBankNameChange}
                />
              </>
            )}
          </ScrollView>

          {/* Fixed buttons at bottom - always visible */}
          <View 
            style={[
              styles.modalActions,
              { 
                paddingBottom: Math.max(insets.bottom, spacing.sm),
                backgroundColor: colors.surface,
                borderTopColor: colors.borderLight,
              }
            ]}
          >
            <TouchableOpacity 
              style={[styles.modalButtonSecondary, { backgroundColor: colors.surfaceSecondary }]} 
              onPress={onClose}
            >
              <Text style={[styles.modalButtonTextSecondary, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButtonPrimary, { backgroundColor: colors.primary }]} 
              onPress={onAdd}
            >
              <Text style={styles.modalButtonTextPrimary}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  // Section cards
  sectionCard: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl, // More space before items
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm, // Space between icon and title
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 17,
    fontWeight: '700',
  },
  // Account row
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  accountLabel: {
    ...typography.subhead,
    fontSize: 13,
  },
  accountValue: {
    ...typography.bodyBold,
    fontSize: 15,
    fontWeight: '600',
  },
  // Theme options
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  themeOptionLabel: {
    ...typography.body,
    fontSize: 15,
  },
  themeOptionSubtext: {
    ...typography.caption,
    fontSize: 12,
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  // Add button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    minHeight: spacing.touchTargetSmall,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  addButtonText: {
    ...typography.subhead,
    fontWeight: '600',
    color: '#FFFFFF',
    fontSize: 13,
  },
  // Payment method items - no borders, spacing creates separation
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs + 2,
  },
  paymentMethodName: {
    ...typography.bodyBold,
    fontSize: 15,
    fontWeight: '600',
  },
  paymentMethodBank: {
    ...typography.subhead,
    marginBottom: spacing.xs + 2,
    fontSize: 13,
    marginLeft: 28, // Align with name (icon width + gap)
  },
  paymentMethodTypeBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginLeft: 28, // Align with name
  },
  paymentMethodType: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    minHeight: spacing.touchTargetSmall,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  deleteButtonText: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 12,
  },
  // Logout section at bottom
  logoutSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.screenPadding,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '85%',
    paddingTop: spacing.lg,
  },
  modalScrollView: {
    flexGrow: 0,
  },
  modalScrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  modalTitle: {
    ...typography.headline,
    marginBottom: spacing.lg,
  },
  modalLabel: {
    ...typography.bodyBold,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minHeight: spacing.touchTarget,
    justifyContent: 'center',
  },
  typeButtonText: {
    ...typography.body,
    fontWeight: '600',
  },
  modalInput: {
    height: spacing.touchTarget,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    ...typography.body,
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'transparent', // Will be set dynamically
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minHeight: spacing.touchTarget,
    justifyContent: 'center',
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minHeight: spacing.touchTarget,
    justifyContent: 'center',
  },
  modalButtonTextPrimary: {
    ...typography.bodyBold,
    color: '#FFFFFF',
  },
  modalButtonTextSecondary: {
    ...typography.bodyBold,
  },
});

export default SettingsScreen;

