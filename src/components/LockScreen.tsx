import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';

interface LockScreenProps {
  onUnlock: () => void;
  correctPin?: string;
  isDarkMode?: boolean;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  onUnlock,
  correctPin = '1234',
  isDarkMode = false,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [biometricType, setBiometricType] = useState<string>('Biometrik');

  const checkAndPromptBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Parmak İzi');
        }

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Snapline Günlüğünü Aç',
          fallbackLabel: 'PIN Kodu Kullan',
          cancelLabel: 'İptal',
          disableDeviceFallback: false,
        });

        if (result.success) {
          onUnlock();
        }
      }
    } catch (e) {
      console.warn('Biometric auth error', e);
    }
  };

  useEffect(() => {
    checkAndPromptBiometrics();
  }, []);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMessage('');

      if (newPin.length === 4) {
        if (newPin === correctPin) {
          onUnlock();
        } else {
          setErrorMessage('Hatalı PIN kodu, tekrar deneyin');
          setTimeout(() => {
            setPin('');
          }, 400);
        }
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setErrorMessage('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Top Logo and Title */}
        <View style={styles.headerSection}>
          <View style={styles.logoBadge}>
            <Svg width={48} height={48} viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="44"
                stroke={theme.accent}
                strokeWidth="5"
                fill="none"
              />
              <Path
                d="M 64 34 C 64 26, 36 24, 36 38 C 36 50, 64 48, 64 62 C 64 74, 36 74, 36 66"
                stroke={theme.accent}
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
              />
            </Svg>
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Snapline Kilitli</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Günlüğünüze erişmek için PIN kodunuzu girin
          </Text>
        </View>

        {/* PIN Dots (● ● ○ ○) */}
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3].map(index => {
            const isFilled = pin.length > index;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isFilled ? theme.accent : 'transparent',
                    borderColor: theme.accent,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Error message */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : (
          <View style={{ height: 18 }} />
        )}

        {/* Keypad */}
        <View style={styles.keypad}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
          ].map((row, rowIdx) => (
            <View key={rowIdx} style={styles.keypadRow}>
              {row.map(num => (
                <TouchableOpacity
                  key={num}
                  style={[styles.keyBtn, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
                  onPress={() => handleKeyPress(num)}
                  activeOpacity={0.65}
                >
                  <Text style={[styles.keyText, { color: theme.textPrimary }]}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Bottom row: Biometric / 0 / Delete */}
          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={[styles.keyBtn, styles.specialKeyBtn]}
              onPress={checkAndPromptBiometrics}
              activeOpacity={0.7}
            >
              <Ionicons name="finger-print" size={26} color={theme.accent} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.keyBtn, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
              onPress={() => handleKeyPress('0')}
              activeOpacity={0.65}
            >
              <Text style={[styles.keyText, { color: theme.textPrimary }]}>0</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.keyBtn, styles.specialKeyBtn]}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Ionicons name="backspace-outline" size={24} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Biometric trigger caption */}
        <TouchableOpacity onPress={checkAndPromptBiometrics} style={styles.biometricLink}>
          <Text style={[styles.biometricLinkText, { color: theme.accent }]}>
            {biometricType} ile Doğrula
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  keypad: {
    width: '100%',
    maxWidth: 280,
    gap: 14,
    marginTop: 10,
    marginBottom: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  keyBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  specialKeyBtn: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '600',
  },
  biometricLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  biometricLinkText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
