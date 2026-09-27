import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Entry } from '../types';

interface AnalyticsScreenProps {
  entries: Entry[];
  isDarkMode: boolean;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ entries, isDarkMode }) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  // Mini photo collage for AI Insight card
  const collagePhotos = [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=300&auto=format&fit=crop&q=80',
  ];

  // SVG dimensions for the mood curve
  const svgWidth = 240;
  const svgHeight = 110;

  // Curve points representing mood trend:
  // Day 1 to Day 7: (0, 80), (40, 70), (80, 50), (120, 55), (160, 40), (200, 30), (240, 15)
  const curvePath = "M 0 85 C 30 85, 45 70, 70 55 C 95 40, 115 58, 140 48 C 165 38, 195 25, 240 10";
  const fillPath = "M 0 85 C 30 85, 45 70, 70 55 C 95 40, 115 58, 140 48 C 165 38, 195 25, 240 10 L 240 110 L 0 110 Z";

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Header Title & Subtitle */}
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Haftalık Özet</Text>
          <Text style={[styles.screenSubtitle, { color: theme.textMuted }]}>09-15 Ekim</Text>
        </View>

        {/* 1. CARD: Ruh Hali Eğrisi */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Ruh Hali Eğrisi</Text>

          <View style={styles.chartWrapper}>
            {/* Left Emoji Y-Axis */}
            <View style={styles.emojiAxis}>
              <Text style={styles.axisEmoji}>😊</Text>
              <Text style={styles.axisEmoji}>😃</Text>
              <Text style={styles.axisEmoji}>😐</Text>
              <Text style={styles.axisEmoji}>😔</Text>
              <Text style={styles.axisEmoji}>😢</Text>
            </View>

            {/* Smooth SVG Curve */}
            <View style={styles.svgContainer}>
              <Svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                <Defs>
                  <LinearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#4E7185" stopOpacity="0.35" />
                    <Stop offset="100%" stopColor="#4E7185" stopOpacity="0.02" />
                  </LinearGradient>
                </Defs>

                {/* Gradient Fill under curve */}
                <Path d={fillPath} fill="url(#moodGradient)" />

                {/* Line Curve */}
                <Path
                  d={curvePath}
                  fill="none"
                  stroke="#4E7185"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Points on curve */}
                <Circle cx="0" cy="85" r="3.5" fill="#4E7185" />
                <Circle cx="70" cy="55" r="3.5" fill="#4E7185" />
                <Circle cx="140" cy="48" r="3.5" fill="#4E7185" />
                <Circle cx="240" cy="10" r="4" fill="#4E7185" />
              </Svg>
            </View>
          </View>
        </View>

        {/* 2. CARD: En Çok Kaydedilenler (Rutinler halinde) */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>En Çok Kaydedilenler</Text>
          <Text style={[styles.cardSubtitleText, { color: theme.textMuted }]}>Rutinler halinde</Text>

          <View style={styles.routineList}>
            {/* Yürüyüş */}
            <View style={styles.routineItem}>
              <View style={styles.routineLeft}>
                <Text style={styles.routineIcon}>🚶</Text>
                <Text style={[styles.routineName, { color: theme.textPrimary }]}>Yürüyüş:</Text>
              </View>
              <Text style={[styles.routineCount, { color: theme.textPrimary }]}>5</Text>
            </View>

            {/* Kahve */}
            <View style={styles.routineItem}>
              <View style={styles.routineLeft}>
                <Text style={styles.routineIcon}>☕</Text>
                <Text style={[styles.routineName, { color: theme.textPrimary }]}>Kahve:</Text>
              </View>
              <Text style={[styles.routineCount, { color: theme.textPrimary }]}>3</Text>
            </View>

            {/* Sosyal */}
            <View style={styles.routineItem}>
              <View style={styles.routineLeft}>
                <Text style={styles.routineIcon}>💖</Text>
                <Text style={[styles.routineName, { color: theme.textPrimary }]}>Sosyal:</Text>
              </View>
              <Text style={[styles.routineCount, { color: theme.textPrimary }]}>4</Text>
            </View>
          </View>
        </View>

        {/* 3. CARD: Haftanın Notu */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Haftanın Notu</Text>
          <Text style={[styles.insightBodyText, { color: theme.textSecondary }]}>
            Bu hafta enerjiniz çok yüksekti. Özellikle sabah yürüyüşleri gününüzü güzelleştirdi!
          </Text>

          {/* Photo Collage Row */}
          <View style={styles.collageRow}>
            {collagePhotos.map((url, idx) => (
              <Image key={idx} source={{ uri: url }} style={styles.collageThumb} />
            ))}
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
  header: {
    marginBottom: 14,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  cardSubtitleText: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 10,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  emojiAxis: {
    height: 110,
    justifyContent: 'space-between',
    paddingVertical: 2,
    marginRight: 8,
  },
  axisEmoji: {
    fontSize: 14,
  },
  svgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineList: {
    gap: 8,
    marginTop: 4,
  },
  routineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  routineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routineIcon: {
    fontSize: 16,
  },
  routineName: {
    fontSize: 13,
    fontWeight: '600',
  },
  routineCount: {
    fontSize: 13,
    fontWeight: '700',
  },
  insightBodyText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    marginVertical: 8,
  },
  collageRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    justifyContent: 'space-between',
  },
  collageThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#EBE5DC',
  },
});
