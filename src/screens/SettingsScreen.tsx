import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';

export default function SettingsScreen() {
  const { darkMode, lockEnabled } = useSettingsStore();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>Settings</Text>
      <Text style={{ color: darkMode ? '#ddd' : '#333' }}>
        Dark Mode: {darkMode ? 'Enabled' : 'Disabled'}
      </Text>
      <Text style={{ color: darkMode ? '#ddd' : '#333' }}>
        Lock Screen: {lockEnabled ? 'Enabled' : 'Disabled'}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
