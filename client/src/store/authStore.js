import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMe } from '../api/auth.api';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setToken: (token) => set({ token }),

            login: (user, token) => set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false
            }),

            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false
            }),

            checkAuth: async () => {
                try {
                    const token = get().token;
                    if (!token) {
                        set({ isLoading: false });
                        return;
                    }
                    const { data } = await getMe();
                    set({ user: data.data.user, isAuthenticated: true, isLoading: false });
                } catch {
                    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
                }
            },

            updateUser: (userData) => set((state) => ({
                user: { ...state.user, ...userData }
            }))
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token })
        }
    )
);
