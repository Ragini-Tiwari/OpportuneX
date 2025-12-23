import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (user, token) => {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                set({ user, token, isAuthenticated: true });
            },

            logout: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                set({ user: null, token: null, isAuthenticated: false });
            },

            updateUser: (userData) => {
                set((state) => ({
                    user: { ...state.user, ...userData },
                }));
            },
        }),
        {
            name: "auth-storage",
        }
    )
);

export default useAuthStore;
