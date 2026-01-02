/**
 * Authentication store using Zustand
 * Manages login state and authentication flow
 */

import { create } from "zustand";
import { AuthState } from "../types";
import { authStorage } from "../services/storage";

interface AuthStore extends AuthState {
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuthState: () => Promise<void>;
    isLoading: boolean;
}

const STATIC_CREDENTIALS = {
    username: "user",
    password: "user",
};

export const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: false,
    username: undefined,
    isLoading: true,

    checkAuthState: async () => {
        try {
            const authState = await authStorage.getAuthState();
            if (authState?.isAuthenticated) {
                set({
                    isAuthenticated: true,
                    username: authState.username,
                    isLoading: false,
                });
            } else {
                set({
                    isAuthenticated: false,
                    username: undefined,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error("Error checking auth state:", error);
            set({
                isAuthenticated: false,
                username: undefined,
                isLoading: false,
            });
        }
    },

    login: async (username: string, password: string) => {
        // Static credentials validation
        if (
            username === STATIC_CREDENTIALS.username &&
            password === STATIC_CREDENTIALS.password
        ) {
            const authState: AuthState = {
                isAuthenticated: true,
                username,
            };
            await authStorage.saveAuthState(authState);
            set({
                isAuthenticated: true,
                username,
                isLoading: false,
            });
            return true;
        }
        return false;
    },

    logout: async () => {
        await authStorage.clearAuthState();
        set({
            isAuthenticated: false,
            username: undefined,
            isLoading: false,
        });
    },
}));
