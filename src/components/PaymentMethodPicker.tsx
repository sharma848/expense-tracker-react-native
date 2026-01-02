/**
 * Revolut/Monzo-inspired Payment Method Picker - Card Selector
 * UX: Card-based selection, elevated design
 * Design: Dark mode favored, colored cards, bold iconography
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PaymentMethod } from '../types';
import { useTheme } from '../hooks/useTheme';
import { typography } from '../theme/typography';
import { spacing, borderRadius, shadows } from '../theme/spacing';

interface PaymentMethodPickerProps {
  paymentMethods: PaymentMethod[];
  selectedId?: string;
  onSelect: (method: PaymentMethod) => void;
  placeholder?: string;
}

export const PaymentMethodPicker: React.FC<PaymentMethodPickerProps> = ({
  paymentMethods,
  selectedId,
  onSelect,
  placeholder = 'Select Payment Method',
}) => {
  const { colors } = useTheme();

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'Cash':
        return 'cash';
      case 'Card':
        return 'credit-card';
      case 'Bank':
        return 'bank';
      default:
        return 'wallet';
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {paymentMethods.map((method) => {
        const isSelected = selectedId === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.card,
              {
                backgroundColor: isSelected
                  ? colors.primary
                  : colors.surface,
                borderColor: isSelected ? colors.primary : colors.border,
                borderWidth: isSelected ? 2 : 1,
              },
              colors.cardElevation,
            ]}
            onPress={() => onSelect(method)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={getMethodIcon(method.type) as any}
              size={32}
              color={isSelected ? '#FFFFFF' : colors.primary}
            />
            <Text
              style={[
                styles.cardName,
                {
                  color: isSelected ? '#FFFFFF' : colors.text,
                },
              ]}
            >
              {method.name}
            </Text>
            {method.bankName && (
              <Text
                style={[
                  styles.cardBank,
                  {
                    color: isSelected ? 'rgba(255,255,255,0.8)' : colors.textSecondary,
                  },
                ]}
              >
                {method.bankName}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md, // More vertical padding
    gap: spacing.md,
  },
  card: {
    width: 150, // Slightly wider for better proportion
    padding: spacing.lg + spacing.sm, // More padding
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130, // Taller for better visual weight
  },
  cardName: {
    ...typography.bodyBold,
    marginTop: spacing.lg, // More space from icon
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
  cardBank: {
    ...typography.caption,
    marginTop: spacing.xs + 2,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
  },
});

