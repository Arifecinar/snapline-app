import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from './src/theme/colors';
import { Entry, NavigationTab } from './src/types';
import { fetchEntries } from './src/services/entryService';
import { Header } from './src/components/Header';
import { BottomNav } from './src/components/BottomNav';
import { TimelineScreen } from './src/screens/TimelineScreen';
import { CaptureScreen } from './src/screens/CaptureScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('timeline');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const theme = isDarkMode ? Colors.dark : Colors.light;

  const loadData = async () => {
    try {
      const data = await fetchEntries();
      setEntries(data);
    } catch (e) {
      console.error('Failed to load entries', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const getSubTitleForTab = () => {
    switch (currentTab) {
      case 'timeline':
        return 'Günün Akışı';
      case 'capture':
        return 'Hızlı Anı Ekle';
      case 'analytics':
        return 'Haftalık Özet';
      case 'profile':
        return 'Profil & Ayarlar';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Top Header */}
      <Header
        title="Snapline"
        subtitle={getSubTitleForTab()}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <View style={styles.mainContainer}>
        {isLoading ? (
          <View style={styles.loadingCenter}>
            <ActivityIndicator size="large" color={theme.accent} />
          </View>
        ) : (
          <>
            {currentTab === 'timeline' && (
              <TimelineScreen
                entries={entries}
                isDarkMode={isDarkMode}
                onRefresh={loadData}
                onNavigate={setCurrentTab}
                onEntryDeleted={id => setEntries(prev => prev.filter(e => e.id !== id))}
              />
            )}

            {currentTab === 'capture' && (
              <CaptureScreen
                isDarkMode={isDarkMode}
                onNavigate={setCurrentTab}
                onEntryCreated={loadData}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsScreen entries={entries} isDarkMode={isDarkMode} />
            )}

            {currentTab === 'profile' && (
              <ProfileScreen
                entries={entries}
                isDarkMode={isDarkMode}
                onToggleTheme={handleToggleTheme}
              />
            )}
          </>
        )}
      </View>

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
