import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SettingsState {
  darkMode: boolean;
  lockEnabled: boolean;
  setDarkMode: (value: boolean) => void;
  setLockEnabled: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      lockEnabled: false,
      setDarkMode: (value) => set({ darkMode: value }),
      setLockEnabled: (value) => set({ lockEnabled: value }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
