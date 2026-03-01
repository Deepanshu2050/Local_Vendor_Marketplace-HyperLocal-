import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    hasOnboarded: boolean;

    setAuth: (user: User, token: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setOnboarded: (onboarded: boolean) => void;
    updateUser: (updates: Partial<User>) => void;
    hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    hasOnboarded: false,

    setAuth: async (user: User, token: string) => {
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('auth_user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true, isLoading: false });
    },

    logout: async () => {
        await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
        set({ user: null, token: null, isAuthenticated: false });
    },

    setLoading: (isLoading: boolean) => set({ isLoading }),

    setOnboarded: async (hasOnboarded: boolean) => {
        await AsyncStorage.setItem('has_onboarded', JSON.stringify(hasOnboarded));
        set({ hasOnboarded });
    },

    updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
            const updatedUser = { ...currentUser, ...updates };
            AsyncStorage.setItem('auth_user', JSON.stringify(updatedUser));
            set({ user: updatedUser });
        }
    },

    hydrate: async () => {
        try {
            const [token, userJson, onboarded] = await AsyncStorage.multiGet([
                'auth_token',
                'auth_user',
                'has_onboarded',
            ]);

            const hasOnboarded = onboarded[1] ? JSON.parse(onboarded[1]) : false;

            if (token[1] && userJson[1]) {
                const user = JSON.parse(userJson[1]) as User;
                set({
                    user,
                    token: token[1],
                    isAuthenticated: true,
                    isLoading: false,
                    hasOnboarded,
                });
            } else {
                set({ isLoading: false, hasOnboarded });
            }
        } catch {
            set({ isLoading: false });
        }
    },
}));
