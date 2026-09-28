import * as SecureStore from 'expo-secure-store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export const AuthService = {
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      return this.signInDemo(email || 'demo@snapline.app');
    }
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
    if (!isSupabaseConfigured()) {
      return this.signInDemo(email || 'demo@snapline.app');
    }
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

  async signInDemo(email = 'demo@snapline.app') {
    const demoSession = {
      access_token: 'demo-access-token',
      user: {
        id: 'user-demo',
        email,
        user_metadata: { full_name: 'Demo Kullanıcı' },
      },
    };
    await SecureStore.setItemAsync('session', JSON.stringify(demoSession));
    useAuthStore.getState().setSession(demoSession);
    useAuthStore.getState().setUser(demoSession.user);
    return { session: demoSession, user: demoSession.user };
  },

  async signOut() {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out error', e);
      }
    }
    await SecureStore.deleteItemAsync('session');
    useAuthStore.getState().logout();
  },

  async loadSession() {
    try {
      const raw = await SecureStore.getItemAsync('session');
      if (raw) {
        const session = JSON.parse(raw);
        useAuthStore.getState().setSession(session);
        useAuthStore.getState().setUser(session.user);
      }
    } catch (e) {
      console.warn('Session load failed', e);
    }
  },
};
