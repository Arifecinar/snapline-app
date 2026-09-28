import { create } from 'zustand';
import { Entry, CreateEntryDTO } from '../types';
import { fetchEntries, createEntry as createEntryApi, deleteEntry as deleteEntryApi } from '../services/entryService';

interface EntryState {
  entries: Entry[];
  loading: boolean;
  error: string | null;
  loadEntries: () => Promise<void>;
  addEntry: (dto: CreateEntryDTO) => Promise<Entry | null>;
  removeEntry: (id: string) => Promise<boolean>;
}

export const useEntryStore = create<EntryState>((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  loadEntries: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchEntries();
      set({ entries: data, loading: false });
    } catch (err: any) {
      console.error('Error loading entries:', err);
      set({ error: err.message || 'Anılar yüklenemedi', loading: false });
    }
  },

  addEntry: async (dto: CreateEntryDTO) => {
    try {
      const newEntry = await createEntryApi(dto);
      set((state) => ({
        entries: [newEntry, ...state.entries],
      }));
      return newEntry;
    } catch (err: any) {
      console.error('Error adding entry:', err);
      set({ error: err.message || 'Anı eklenemedi' });
      return null;
    }
  },

  removeEntry: async (id: string) => {
    try {
      await deleteEntryApi(id);
      set((state) => ({
        entries: state.entries.filter((item) => item.id !== id),
      }));
      return true;
    } catch (err: any) {
      console.error('Error deleting entry:', err);
      set({ error: err.message || 'Anı silinemedi' });
      return false;
    }
  },
}));
