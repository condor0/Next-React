import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export type AuthUser = {
  name: string;
  email: string;
};

type AuthState = {
// Auth slice: user identity and in-memory token
  user: AuthUser | null;
  token: string | null;
  login: (payload: { email: string; name?: string }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: ({ email, name }) => {
    const displayName = name ?? email.split("@")[0] ?? "User";
    set({
      user: { name: displayName, email },
      token: `token-${Date.now()}`,
    });
  },
  logout: () => set({ user: null, token: null }),
}));

export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      token: state.token,
      isAuthed: Boolean(state.token),
      login: state.login,
      logout: state.logout,
    })),
  );
}