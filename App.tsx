import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, ActivityIndicator, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';

import { useAuthStore } from './src/store/authStore';
import { useSettingsStore } from './src/store/settingsStore';
import { useEntryStore } from './src/store/entryStore';
import { AuthService } from './src/services/AuthService';

import { TimelineScreen } from './src/screens/TimelineScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { CaptureScreen } from './src/screens/CaptureScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { LockScreen } from './src/components/LockScreen';
import { BottomNav } from './src/components/BottomNav';
import { NavigationTab } from './src/types';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const { darkMode, setDarkMode, lockEnabled, setLockEnabled } = useSettingsStore();
  const { entries, loadEntries, removeEntry } = useEntryStore();

  const [appReady, setAppReady] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const init = async () => {
      await AuthService.loadSession();
      await loadEntries();
      if (useSettingsStore.getState().lockEnabled) {
        setIsLocked(true);
      }
      setAppReady(true);
      await SplashScreen.hideAsync();
    };
    init();
  }, []);

  const handleRefreshEntries = useCallback(async () => {
    await loadEntries();
  }, [loadEntries]);

  if (!appReady) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0B121E' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  // Lock screen check
  if (isAuthenticated && lockEnabled && isLocked) {
    return (
      <LockScreen
        onUnlock={() => setIsLocked(false)}
        isDarkMode={darkMode}
      />
    );
  }

  const theme = darkMode ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      {isAuthenticated ? (
        <Tab.Navigator
          tabBar={(props) => {
            const routeName = props.state.routes[props.state.index].name.toLowerCase();
            const currentTab: NavigationTab = routeName === 'settings' ? 'profile' : (routeName as NavigationTab);
            return (
              <BottomNav
                currentTab={currentTab}
                onTabChange={(tab) => {
                  const capitalized = tab.charAt(0).toUpperCase() + tab.slice(1);
                  props.navigation.navigate(capitalized);
                }}
                isDarkMode={darkMode}
              />
            );
          }}
          screenOptions={{ headerShown: false }}
        >
          <Tab.Screen name="Timeline">
            {({ navigation }) => (
              <TimelineScreen
                entries={entries}
                isDarkMode={darkMode}
                onRefresh={handleRefreshEntries}
                onNavigate={(tab) => navigation.navigate(tab.charAt(0).toUpperCase() + tab.slice(1))}
                onEntryDeleted={removeEntry}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Calendar">
            {({ navigation }) => (
              <CalendarScreen
                entries={entries}
                isDarkMode={darkMode}
                onNavigate={(tab) => navigation.navigate(tab.charAt(0).toUpperCase() + tab.slice(1))}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Capture">
            {({ navigation }) => (
              <CaptureScreen
                isDarkMode={darkMode}
                onNavigate={(tab) => navigation.navigate(tab.charAt(0).toUpperCase() + tab.slice(1))}
                onEntryCreated={handleRefreshEntries}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Analytics">
            {() => (
              <AnalyticsScreen
                entries={entries}
                isDarkMode={darkMode}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Profile">
            {() => (
              <ProfileScreen
                entries={entries}
                isDarkMode={darkMode}
                onToggleTheme={() => setDarkMode(!darkMode)}
                isLockEnabled={lockEnabled}
                onToggleLock={() => setLockEnabled(!lockEnabled)}
                onLockNow={() => setIsLocked(true)}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
});
