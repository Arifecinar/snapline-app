import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthState {
  session: any | null;
  user: any | null;
  isAuthenticated: boolean;
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      isAuthenticated: false,
      setSession: (session) => set({ session, isAuthenticated: !!session }),
      setUser: (user) => set({ user }),
      logout: () => set({ session: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
