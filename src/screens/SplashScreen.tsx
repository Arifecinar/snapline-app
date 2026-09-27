import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, StatusBar } from 'react-native';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const pulseAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Entrance Animation (Fade & Scale in)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle pulsing animation for prompt text
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto dismiss after 2.5 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, pulseAnim, onDismiss]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.98}
      onPress={onDismiss}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0B121E" />
      <View style={styles.background}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Main Splash Image */}
          <Image
            source={require('../../assets/splash.png')}
            style={styles.splashImage}
            resizeMode="contain"
          />

          {/* App Title & Tagline */}
          <Text style={styles.appTitle}>Snapline</Text>
          <Text style={styles.tagline}>Anılarını Çizgiye Dök</Text>
        </Animated.View>

        {/* Bottom prompt indicator */}
        <Animated.View style={[styles.bottomPrompt, { opacity: pulseAnim }]}>
          <Text style={styles.promptText}>Yükleniyor...</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B121E',
  },
  background: {
    flex: 1,
    backgroundColor: '#0B121E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  splashImage: {
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  bottomPrompt: {
    position: 'absolute',
    bottom: 50,
  },
  promptText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 0.8,
  },
});

