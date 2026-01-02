/**
 * Main navigation structure
 * Separates Auth stack from App stack with bottom tabs
 */

import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../hooks/useTheme";

// Screens
import LoginScreen from "../screens/auth/LoginScreen";
import HomeScreen from "../screens/app/HomeScreen";
import AddExpenseScreen from "../screens/app/AddExpenseScreen";
import AnalyticsScreen from "../screens/app/AnalyticsScreen";
import SettingsScreen from "../screens/app/SettingsScreen";

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Bottom Tab Navigator for main app
 */
const AppTabs = () => {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarShowLabel: true, // Show labels below icons
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 4,
                    marginBottom: 0,
                },
                tabBarIconStyle: {
                    marginTop: 8,
                },
                tabBarStyle: {
                    borderTopWidth: 0,
                    paddingBottom: Math.max(insets.bottom, 8),
                    paddingTop: 8,
                    height: 70 + Math.max(insets.bottom, 0),
                    backgroundColor: colors.surface,
                    elevation: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="home" color={color} focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="AddExpense"
                component={AddExpenseScreen}
                options={{
                    tabBarLabel: "Add",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="plus" color={color} focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Analytics"
                component={AnalyticsScreen}
                options={{
                    tabBarLabel: "Analytics",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="chart" color={color} focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            name="settings"
                            color={color}
                            focused={focused}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

/**
 * Premium Tab Icon Component
 * UX: Icons with text labels below
 * Design: Clean, modern icons with proper sizing and visual feedback
 */
const TabIcon: React.FC<{ name: string; color: string; focused: boolean }> = ({
    name,
    color,
    focused,
}) => {
    // Professional finance-focused icons from Ionicons
    const iconMap: Record<string, { name: keyof typeof Ionicons.glyphMap; size: number }> = {
        home: { name: focused ? "wallet" : "wallet-outline", size: 24 }, // Wallet for expenses
        plus: { name: focused ? "add-circle" : "add-circle-outline", size: 26 }, // Add expense
        chart: { name: focused ? "bar-chart" : "bar-chart-outline", size: 24 }, // Analytics
        settings: { name: focused ? "settings" : "settings-outline", size: 24 }, // Settings
    };

    const iconConfig = iconMap[name] || { name: "ellipse-outline" as keyof typeof Ionicons.glyphMap, size: 24 };

    return (
        <Ionicons
            name={iconConfig.name}
            size={iconConfig.size}
            color={color}
        />
    );
};

/**
 * Main App Navigator
 */
export const AppNavigator: React.FC = () => {
    const { isAuthenticated, checkAuthState } = useAuthStore();

    useEffect(() => {
        checkAuthState();
    }, [checkAuthState]);

    return (
        <NavigationContainer>
            {isAuthenticated ? (
                <AppStack.Navigator screenOptions={{ headerShown: false }}>
                    <AppStack.Screen name="AppTabs" component={AppTabs} />
                </AppStack.Navigator>
            ) : (
                <AuthStack.Navigator screenOptions={{ headerShown: false }}>
                    <AuthStack.Screen name="Login" component={LoginScreen} />
                </AuthStack.Navigator>
            )}
        </NavigationContainer>
    );
};
