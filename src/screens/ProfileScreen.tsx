import React from 'react';
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
import { Entry } from '../types';

interface ProfileScreenProps {
  entries: Entry[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isLockEnabled: boolean;
  onToggleLock: () => void;
  onLockNow: () => void;
  onOpenWelcome?: () => void;
  onOpenSplash?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  entries,
  isDarkMode,
  onToggleTheme,
  isLockEnabled,
  onToggleLock,
  onLockNow,
  onOpenWelcome,
  onOpenSplash,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const userAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';
  const userName = 'Arif Çınar';
  const userHandle = 'snapline.app/@arif';

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Header Title */}
        <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Ayarlar</Text>

        {/* User Card */}
        <View style={[styles.userCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.textPrimary }]}>{userName}</Text>
            <Text style={[styles.userHandle, { color: theme.textMuted }]}>{userHandle}</Text>
          </View>
        </View>

        {/* Grouped Settings Cards matching Mockup */}
        <View style={styles.settingsGroup}>
          {/* 1. HESAP */}
          <TouchableOpacity
            style={[styles.settingsCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
            onPress={() => Alert.alert('Hesap', 'Hesap detayları ve profil düzenleme.')}
            activeOpacity={0.7}
          >
            <View style={styles.settingsCardContent}>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Hesap</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>

          {/* 2. GÜVENLİK & KİLİT (Biyometrik / PIN) */}
          <View
            style={[styles.settingsCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
          >
            <View style={styles.settingsCardContent}>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Uygulama Kilidi</Text>
              <Text style={[styles.cardSubtext, { color: theme.textMuted }]}>
                {isLockEnabled ? 'Biyometrik / PIN koruması açık' : 'Kilit devre dışı'}
              </Text>
            </View>
            <Switch
              value={isLockEnabled}
              onValueChange={onToggleLock}
              trackColor={{ false: '#D4CDC5', true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* If Lock is enabled, show 'Şimdi Kilitle' quick action */}
          {isLockEnabled && (
            <TouchableOpacity
              style={[styles.quickLockBtn, { backgroundColor: theme.surfaceSecondary }]}
              onPress={onLockNow}
              activeOpacity={0.7}
            >
              <Ionicons name="lock-closed-outline" size={16} color={theme.accent} />
              <Text style={[styles.quickLockText, { color: theme.accent }]}>
                Uygulamayı Şimdi Kilitle
              </Text>
            </TouchableOpacity>
          )}

          {/* 3. VERİLER (Bulut Yedekleme Açık) */}
          <TouchableOpacity
            style={[styles.settingsCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
            onPress={() => Alert.alert('Veriler', `Bulut yedekleme aktif. Toplam ${entries.length} anı senkronize edildi.`)}
            activeOpacity={0.7}
          >
            <View style={styles.settingsCardContent}>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Veriler</Text>
              <Text style={[styles.cardSubtext, { color: theme.textMuted }]}>Bulut Yedekleme Açık</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>

          {/* 4. UYGULAMA (Tema) */}
          <TouchableOpacity
            style={[styles.settingsCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
            onPress={onToggleTheme}
            activeOpacity={0.7}
          >
            <View style={styles.settingsCardContent}>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Uygulama</Text>
              <Text style={[styles.cardSubtext, { color: theme.textMuted }]}>
                Tema ({isDarkMode ? 'Karanlık Mod' : 'Aydınlık Mod'})
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>

          {/* 5. HAKKINDA */}
          <TouchableOpacity
            style={[styles.settingsCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
            onPress={() => Alert.alert('Hakkında', 'Snapline v1.0.0\nGünlük tutmanın en sade ve görsel yolu.')}
            activeOpacity={0.7}
          >
            <View style={styles.settingsCardContent}>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Hakkında</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Demo Navigators to review Splash & Welcome screens */}
        <View style={styles.previewSection}>
          <Text style={[styles.previewSectionTitle, { color: theme.textMuted }]}>
            EKRAN ÖNİZLEMELERİ
          </Text>

          <View style={styles.previewBtnRow}>
            {onOpenSplash && (
              <TouchableOpacity
                style={[styles.previewBtn, { backgroundColor: theme.surfaceSecondary }]}
                onPress={onOpenSplash}
                activeOpacity={0.8}
              >
                <Ionicons name="sparkles-outline" size={15} color={theme.accent} />
                <Text style={[styles.previewBtnText, { color: theme.textPrimary }]}>
                  Splash Ekranı
                </Text>
              </TouchableOpacity>
            )}

            {onOpenWelcome && (
              <TouchableOpacity
                style={[styles.previewBtn, { backgroundColor: theme.surfaceSecondary }]}
                onPress={onOpenWelcome}
                activeOpacity={0.8}
              >
                <Ionicons name="enter-outline" size={15} color={theme.accent} />
                <Text style={[styles.previewBtnText, { color: theme.textPrimary }]}>
                  Karşılama Ekranı
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EBE5DC',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  userHandle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  settingsGroup: {
    gap: 10,
    marginBottom: 20,
  },
  settingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  settingsCardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardSubtext: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 16,
  },
  quickLockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    marginTop: -2,
    marginBottom: 4,
  },
  quickLockText: {
    fontSize: 12,
    fontWeight: '700',
  },
  previewSection: {
    marginTop: 8,
  },
  previewSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  previewBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  previewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  previewBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
