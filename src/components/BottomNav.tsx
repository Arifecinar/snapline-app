import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { NavigationTab } from '../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  isDarkMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  isDarkMode = false,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.tabBarBackground, borderTopColor: theme.cardBorder }]}>
      {/* 1. Günün Akışı (Timeline) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('timeline')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'timeline' ? 'home' : 'home-outline'}
          size={24}
          color={currentTab === 'timeline' ? theme.accent : theme.textMuted}
        />
      </TouchableOpacity>

      {/* 2. Takvim Görünümü (Calendar) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('calendar')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'calendar' ? 'calendar' : 'calendar-outline'}
          size={24}
          color={currentTab === 'calendar' ? theme.accent : theme.textMuted}
        />
      </TouchableOpacity>

      {/* 3. Center Elevated Anı Ekle '+' Button */}
      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
          style={[styles.floatingAddBtn, { backgroundColor: theme.accent }]}
          onPress={() => onTabChange('capture')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 4. Haftalık Özet (Analytics) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('analytics')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'analytics' ? 'sparkles' : 'sparkles-outline'}
          size={24}
          color={currentTab === 'analytics' ? theme.accent : theme.textMuted}
        />
      </TouchableOpacity>

      {/* 5. Profil ve Ayarlar (Profile) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabChange('profile')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'profile' ? 'person' : 'person-outline'}
          size={24}
          color={currentTab === 'profile' ? theme.accent : theme.textMuted}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  centerButtonWrapper: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingAddBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4E7185',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
});
