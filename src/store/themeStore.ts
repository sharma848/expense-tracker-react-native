/**
 * Theme preference store using Zustand
 * Manages user's theme preference (light, dark, or system)
 */

import { create } from "zustand";
import { themeStorage } from "../services/storage";

export type ThemePreference = "light" | "dark" | "system";

interface ThemeStore {
    themePreference: ThemePreference;
    isLoading: boolean;
    loadThemePreference: () => Promise<void>;
    setThemePreference: (preference: ThemePreference) => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set) => ({
    themePreference: "system",
    isLoading: true,

    loadThemePreference: async () => {
        try {
            const preference = await themeStorage.getThemePreference();
            set({
                themePreference: preference || "system",
                isLoading: false,
            });
        } catch (error) {
            console.error("Error loading theme preference:", error);
            set({
                themePreference: "system",
                isLoading: false,
            });
        }
    },

    setThemePreference: async (preference: ThemePreference) => {
        try {
            await themeStorage.saveThemePreference(preference);
            set({ themePreference: preference });
        } catch (error) {
            console.error("Error saving theme preference:", error);
        }
    },
}));

