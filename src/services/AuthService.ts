import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { useAuthStore } from '../store/authStore';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '');

export const AuthService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const session = data.session;
    if (session) {
      await SecureStore.setItemAsync('session', JSON.stringify(session));
      useAuthStore.getState().setSession(session);
      useAuthStore.getState().setUser(session.user);
    }
    return data;
  },

  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const session = data.session;
    if (session) {
      await SecureStore.setItemAsync('session', JSON.stringify(session));
      useAuthStore.getState().setSession(session);
      useAuthStore.getState().setUser(session.user);
    }
    return data;
  },

  async signOut() {
    await supabase.auth.signOut();
    await SecureStore.deleteItemAsync('session');
    useAuthStore.getState().logout();
  },

  async loadSession() {
    const raw = await SecureStore.getItemAsync('session');
    if (raw) {
      const session = JSON.parse(raw);
      useAuthStore.getState().setSession(session);
      useAuthStore.getState().setUser(session.user);
    }
  },
};
