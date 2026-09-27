import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, StyleSheet, View, Platform, StatusBar as RNStatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';

import { useAuthStore } from './src/store/authStore';
import { useSettingsStore } from './src/store/settingsStore';
import { AuthService } from './src/services/AuthService';

import { TimelineScreen } from './src/screens/TimelineScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { CaptureScreen } from './src/screens/CaptureScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';

// Keep native splash visible while we restore auth state
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TimelineWrapper() {
  const { darkMode } = useSettingsStore();
  return (
    <TimelineScreen
      entries={[]}
      isDarkMode={darkMode}
      onRefresh={() => {}}
      onNavigate={() => {}}
      onEntryDeleted={() => {}}
    />
  );
}

function CalendarWrapper() {
  const { darkMode } = useSettingsStore();
  return (
    <CalendarScreen
      entries={[]}
      isDarkMode={darkMode}
      onNavigate={() => {}}
    />
  );
}

function CaptureWrapper() {
  const { darkMode } = useSettingsStore();
  return (
    <CaptureScreen
      isDarkMode={darkMode}
      onNavigate={() => {}}
      onEntryCreated={() => {}}
    />
  );
}

function AnalyticsWrapper() {
  const { darkMode } = useSettingsStore();
  return (
    <AnalyticsScreen
      entries={[]}
      isDarkMode={darkMode}
    />
  );
}

function ProfileWrapper() {
  const { darkMode, setDarkMode, lockEnabled, setLockEnabled } = useSettingsStore();
  return (
    <ProfileScreen
      entries={[]}
      isDarkMode={darkMode}
      onToggleTheme={() => setDarkMode(!darkMode)}
      isLockEnabled={lockEnabled}
      onToggleLock={() => setLockEnabled(!lockEnabled)}
      onLockNow={() => {}}
    />
  );
}

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Timeline" component={TimelineWrapper} />
      <Tab.Screen name="Calendar" component={CalendarWrapper} />
      <Tab.Screen name="Capture" component={CaptureWrapper} />
      <Tab.Screen name="Analytics" component={AnalyticsWrapper} />
      <Tab.Screen name="Profile" component={ProfileWrapper} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome">
        {() => <WelcomeScreen onLogin={() => {}} onRegister={() => {}} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const { darkMode } = useSettingsStore();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await AuthService.loadSession();
      setAppReady(true);
      await SplashScreen.hideAsync();
    };
    init();
  }, []);

  if (!appReady) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0B121E' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  const theme = darkMode ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      {isAuthenticated ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B121E',
  },
});
