import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  isDarkMode = true,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const tabs: Array<{ id: NavigationTab; label: string; icon: keyof typeof Ionicons.glyphMap; iconActive: keyof typeof Ionicons.glyphMap }> = [
    { id: 'timeline', label: 'Akış', icon: 'time-outline', iconActive: 'time' },
    { id: 'capture', label: 'Anı Ekle', icon: 'camera-outline', iconActive: 'camera' },
    { id: 'analytics', label: 'Özet', icon: 'stats-chart-outline', iconActive: 'stats-chart' },
    { id: 'profile', label: 'Profil', icon: 'person-outline', iconActive: 'person' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.tabBarBackground, borderTopColor: theme.cardBorder }]}>
      {tabs.map(tab => {
        const isActive = currentTab === tab.id;
        const isCapture = tab.id === 'capture';

        if (isCapture) {
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.captureButtonWrapper}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.captureCircle, { backgroundColor: theme.accent }]}>
                <Ionicons name="add" size={28} color="#FFF" />
              </View>
              <Text style={[styles.tabLabel, { color: theme.accent, marginTop: 2 }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={22}
              color={isActive ? theme.accent : theme.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? theme.accent : theme.textMuted, fontWeight: isActive ? '700' : '500' },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 72,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  captureButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  captureCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});
