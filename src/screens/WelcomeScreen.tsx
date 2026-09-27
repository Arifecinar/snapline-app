import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin, onRegister }) => {
  return (
    <View style={styles.container}>
      {/* Illustration Area */}
      <View style={styles.illustrationWrapper}>
        <Svg width={220} height={200} viewBox="0 0 220 200">
          {/* Desk Surface */}
          <Rect x="20" y="160" width="180" height="8" rx="4" fill="#E8DEC8" />

          {/* Open Sketchbook/Journal */}
          <Rect x="40" y="115" width="55" height="45" rx="3" fill="#FFFFFF" stroke="#D3C7B5" strokeWidth="2" />
          <Path d="M 45 125 L 85 125" stroke="#E2DACD" strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M 45 135 L 75 135" stroke="#E2DACD" strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M 45 145 L 80 145" stroke="#E2DACD" strokeWidth="1.5" strokeLinecap="round" />
          {/* Sketch of a person in journal */}
          <Circle cx="67" cy="133" r="5" fill="#C2D2DC" />

          {/* Pen / Pencil in hand */}
          <Path d="M 88 130 L 100 120" stroke="#7A6855" strokeWidth="2.5" strokeLinecap="round" />

          {/* Person Torso / Yellow Mustard Sweater */}
          <Path
            d="M 100 115 C 100 95, 155 95, 155 115 L 160 160 L 95 160 Z"
            fill="#F4B740"
          />

          {/* Person Arm leaning on desk */}
          <Path
            d="M 112 115 C 108 130, 92 135, 88 132"
            stroke="#F4B740"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Hand */}
          <Circle cx="88" cy="132" r="5" fill="#FADBC8" />

          {/* Neck */}
          <Rect x="122" y="82" width="12" height="14" fill="#FADBC8" rx="2" />

          {/* Head & Face */}
          <Circle cx="128" cy="74" r="14" fill="#FADBC8" />

          {/* Dark Hair Tied */}
          <Path
            d="M 114 74 C 114 56, 142 56, 142 74 C 142 76, 138 78, 134 76 C 130 70, 120 70, 116 76 Z"
            fill="#2C3E50"
          />
          {/* Hair Bun / Ponytail */}
          <Circle cx="140" cy="65" r="7" fill="#2C3E50" />

          {/* Small Plant or Mug on Desk */}
          <Rect x="170" y="145" width="12" height="15" rx="2" fill="#517688" />
          <Circle cx="176" cy="140" r="5" fill="#8FAFA1" />
        </Svg>
      </View>

      {/* Main Titles */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Snapline'a</Text>
        <Text style={styles.mainTitle}>Hoş Geldiniz</Text>
        <Text style={styles.subtitle}>Günlük tutmanın en sade ve görsel yolu.</Text>
      </View>

      {/* Bottom Action Buttons */}
      <View style={styles.buttonSection}>
        {/* Giriş Yap Button */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={onLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.loginBtnText}>Giriş Yap</Text>
        </TouchableOpacity>

        {/* Kaydol Button */}
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={onRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.registerBtnText}>Kaydol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4F0',
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 44,
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#222E35',
    letterSpacing: -0.5,
    lineHeight: 32,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#768794',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
  buttonSection: {
    gap: 12,
    width: '100%',
  },
  loginBtn: {
    backgroundColor: '#517688',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#517688',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  registerBtn: {
    backgroundColor: '#E4ECF0',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerBtnText: {
    color: '#517688',
    fontSize: 15,
    fontWeight: '700',
  },
});
