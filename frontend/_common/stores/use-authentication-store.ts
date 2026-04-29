import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthenticationState {
  currentUser: Entity.User | null;
  activeSession: Entity.SupabaseSession | null;
  isAuthenticating: boolean;
  authenticationError: string | null;
}

interface AuthenticationActions {
  setCurrentUser: (user: Entity.User | null) => void;
  setActiveSession: (session: Entity.SupabaseSession | null) => void;
  setIsAuthenticating: (isAuthenticating: boolean) => void;
  setAuthenticationError: (error: string | null) => void;
  clearAuthentication: () => void;
}

type AuthenticationStore = AuthenticationState & AuthenticationActions;

const initialAuthenticationState: AuthenticationState = {
  currentUser: null,
  activeSession: null,
  isAuthenticating: false,
  authenticationError: null,
};

export const useAuthenticationStore = create<AuthenticationStore>()(
  persist(
    (set) => ({
      ...initialAuthenticationState,

      setCurrentUser: (user) => set({ currentUser: user }),

      setActiveSession: (session) => set({ activeSession: session }),

      setIsAuthenticating: (isAuthenticating) => set({ isAuthenticating }),

      setAuthenticationError: (error) => set({ authenticationError: error }),

      clearAuthentication: () => set(initialAuthenticationState),
    }),
    {
      name: 'authentication-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        activeSession: state.activeSession,
      }),
    }
  )
);
