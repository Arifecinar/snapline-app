import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useSettingsStore } from '../store/settingsStore';
import { useAuthStore } from '../store/authStore';
import { AuthService } from '../services/AuthService';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchEntries } from '../services/entryService';

export default function SettingsScreen() {
  const { darkMode, setDarkMode, lockEnabled, setLockEnabled } = useSettingsStore();
  const { user } = useAuthStore();
  const [clearing, setClearing] = useState(false);

  const theme = darkMode ? Colors.dark : Colors.light;

  const handleExportData = async () => {
    try {
      const entries = await fetchEntries();
      const exportJson = JSON.stringify(entries, null, 2);
      await Share.share({
        title: 'Snapline Günlük Yedeği',
        message: exportJson,
      });
    } catch (e: any) {
      Alert.alert('Hata', 'Veriler dışa aktarılırken bir sorun oluştu: ' + e.message);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Oturumu Kapat',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await AuthService.signOut();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Ayarlar</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Uygulama tercihleriniz ve hesap yönetimi
          </Text>
        </View>

        {/* User Card */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.userRow}>
            <View style={[styles.avatarBadge, { backgroundColor: theme.accent }]}>
              <Text style={styles.avatarText}>
                {user?.email ? user.email.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.textPrimary }]}>
                {user?.user_metadata?.full_name || 'Snapline Kullanıcısı'}
              </Text>
              <Text style={[styles.userEmail, { color: theme.textMuted }]}>
                {user?.email || 'demo@snapline.app'}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: isSupabaseConfigured() ? '#DEF7EC' : '#FEF3C7' }]}>
              <Text style={[styles.statusText, { color: isSupabaseConfigured() ? '#03543F' : '#92400E' }]}>
                {isSupabaseConfigured() ? 'Cloud Sync' : 'Demo Mode'}
              </Text>
            </View>
          </View>
        </View>

        {/* Section: Görünüm & Tema */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>GÖRÜNÜM</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: darkMode ? '#374151' : '#F3F4F6' }]}>
                <Ionicons name={darkMode ? 'moon' : 'sunny'} size={20} color={theme.accent} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Karanlık Mod</Text>
                <Text style={[styles.settingSub, { color: theme.textMuted }]}>
                  {darkMode ? 'Slate koyu tema aktif' : 'Aydınlık tema aktif'}
                </Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(val) => setDarkMode(val)}
              trackColor={{ false: '#D1D5DB', true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Section: Güvenlik */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>GÜVENLİK</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: lockEnabled ? '#DBEAFE' : '#F3F4F6' }]}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.accent} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>PIN & Biyometrik Kilit</Text>
                <Text style={[styles.settingSub, { color: theme.textMuted }]}>
                  {lockEnabled ? 'Uygulama açılışında doğrula' : 'Devre dışı'}
                </Text>
              </View>
            </View>
            <Switch
              value={lockEnabled}
              onValueChange={(val) => setLockEnabled(val)}
              trackColor={{ false: '#D1D5DB', true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Section: Veri ve Yedekleme */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>VERİ & YEDEKLEME</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <TouchableOpacity style={styles.settingRow} onPress={handleExportData} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="download-outline" size={20} color="#0284C7" />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Anıları Dışa Aktar (JSON)</Text>
                <Text style={[styles.settingSub, { color: theme.textMuted }]}>
                  Tüm günlük verilerinizi metin olarak yedekleyin
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Section: Oturum */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>HESAP</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <TouchableOpacity style={styles.settingRow} onPress={handleSignOut} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Oturumu Kapat</Text>
                <Text style={[styles.settingSub, { color: theme.textMuted }]}>
                  Hesabınızdan güvenli şekilde çıkış yapın
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={[styles.versionText, { color: theme.textMuted }]}>
            Snapline v1.0.0 — Minimalist Daily Journal
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
