import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (user, token) => {
                localStorage.setItem("token", token); // Store access token for immediate use
                localStorage.setItem("user", JSON.stringify(user));
                set({ user, token, isAuthenticated: true });
            },

            logout: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                set({ user: null, token: null, isAuthenticated: false });
            },

            setToken: (token) => {
                localStorage.setItem("token", token);
                set({ token });
            },
        }),
        {
            name: "auth-storage",
        }
    )
);

export default useAuthStore;
