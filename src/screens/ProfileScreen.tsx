import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { Entry } from '../types';

interface ProfileScreenProps {
  entries: Entry[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  entries,
  isDarkMode,
  onToggleTheme,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const [username, setUsername] = useState('Arif Çınar');
  const [avatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');

  const supabaseActive = isSupabaseConfigured();

  const handleExportData = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    Alert.alert(
      'Veriler Dışa Aktarıldı',
      `Toplam ${entries.length} anı başarıyla dışa aktarılmaya hazır.\n\nJSON Boyutu: ${dataStr.length} karakter.`
    );
  };

  const handleLogout = async () => {
    if (supabaseActive) {
      await supabase.auth.signOut();
    }
    Alert.alert('Çıkış Yapıldı', 'Güvenli bir şekilde çıkış yaptınız.');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Profile Card Header */}
        <View style={[styles.profileCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <Text style={[styles.username, { color: theme.textPrimary }]}>{username}</Text>
          <Text style={[styles.userHandle, { color: theme.textMuted }]}>@arifecinar • Snapline Premium</Text>

          {/* User Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.gridItem}>
              <Text style={[styles.gridValue, { color: theme.accent }]}>{entries.length}</Text>
              <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>Toplam Anı</Text>
            </View>
            <View style={[styles.gridDivider, { backgroundColor: theme.cardBorder }]} />
            <View style={styles.gridItem}>
              <Text style={[styles.gridValue, { color: theme.accent }]}>7 Gün</Text>
              <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>Aktif Seri</Text>
            </View>
          </View>
        </View>

        {/* Backend & Cloud Status */}
        <View style={[styles.statusCard, { backgroundColor: theme.surfaceSecondary, borderColor: theme.cardBorder }]}>
          <View style={styles.statusLeft}>
            <Ionicons
              name={supabaseActive ? 'cloud-done' : 'cloud-offline'}
              size={22}
              color={supabaseActive ? theme.accent : theme.gold}
            />
            <View>
              <Text style={[styles.statusTitle, { color: theme.textPrimary }]}>
                {supabaseActive ? 'Supabase Bağlı' : 'Yerel Depolama (Demo)'}
              </Text>
              <Text style={[styles.statusSub, { color: theme.textMuted }]}>
                {supabaseActive ? 'Anılarınız bulutta senkronize ediliyor.' : 'Veriler cihazınızda güvenle saklanıyor.'}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>UYGULAMA AYARLARI</Text>

        {/* Theme Toggle Option */}
        <View style={[styles.optionRow, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.optionLeft}>
            <View style={[styles.iconBox, { backgroundColor: theme.accentSoft }]}>
              <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={18} color={theme.accent} />
            </View>
            <Text style={[styles.optionLabel, { color: theme.textPrimary }]}>Karanlık Tema</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={onToggleTheme}
            trackColor={{ false: '#CBD5E1', true: theme.accent }}
            thumbColor="#FFF"
          />
        </View>

        {/* Export Data Option */}
        <TouchableOpacity
          style={[styles.optionRow, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
          onPress={handleExportData}
          activeOpacity={0.7}
        >
          <View style={styles.optionLeft}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
              <Ionicons name="download-outline" size={18} color="#6366F1" />
            </View>
            <Text style={[styles.optionLabel, { color: theme.textPrimary }]}>Anıları Dışa Aktar (Yedekle)</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </TouchableOpacity>

        {/* Security & RLS Details */}
        <TouchableOpacity
          style={[styles.optionRow, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
          onPress={() => Alert.alert('Gizlilik & Güvenlik', 'Snapline veritabanında Row Level Security (RLS) ile anılarınız tamamen size özel şifrelenir.')}
          activeOpacity={0.7}
        >
          <View style={styles.optionLeft}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#10B981" />
            </View>
            <Text style={[styles.optionLabel, { color: theme.textPrimary }]}>Veri Güvenliği & RLS</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.danger} />
          <Text style={[styles.logoutBtnText, { color: theme.danger }]}>Oturumu Kapat</Text>
        </TouchableOpacity>

        {/* Footer Version */}
        <Text style={[styles.footerText, { color: theme.textMuted }]}>
          Snapline v1.0.0 • React Native & Supabase
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: '800',
  },
  userHandle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
  },
  gridValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  gridDivider: {
    width: 1,
    height: '80%',
  },
  statusCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 24,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusSub: {
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 16,
    gap: 8,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 24,
  },
});
