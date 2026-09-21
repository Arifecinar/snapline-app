import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, MOODS } from '../theme/colors';
import { Entry, MoodScore } from '../types';
import { calculateWeeklyStats } from '../services/entryService';

interface AnalyticsScreenProps {
  entries: Entry[];
  isDarkMode: boolean;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ entries, isDarkMode }) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const stats = calculateWeeklyStats(entries);

  // Map average mood to emoji
  const roundedMood = Math.min(5, Math.max(1, Math.round(stats.averageMood))) as MoodScore;
  const moodConfig = MOODS.find(m => m.score === roundedMood) || MOODS[3];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Title Header */}
        <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Haftalık Özet</Text>

        {/* Top Summary Row */}
        <View style={styles.statsRow}>
          {/* Average Mood Card */}
          <View style={[styles.statCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Ortalama Ruh Hali</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.moodEmoji}>{moodConfig.emoji}</Text>
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>{stats.averageMood}</Text>
            </View>
            <Text style={[styles.statFootnote, { color: theme.accent }]}>{moodConfig.label} Seviyede</Text>
          </View>

          {/* Total Moments Card */}
          <View style={[styles.statCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Kaydedilen Anılar</Text>
            <View style={styles.statValueRow}>
              <Ionicons name="sparkles" size={26} color={theme.accent} />
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>{stats.totalEntries}</Text>
            </View>
            <Text style={[styles.statFootnote, { color: theme.textSecondary }]}>Bu Hafta</Text>
          </View>
        </View>

        {/* Mood Trend Bar Visualization */}
        <View style={[styles.chartCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderTitle}>
              <Ionicons name="trending-up" size={20} color={theme.accent} />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Ruh Hali Eğrisi</Text>
            </View>
            <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>Son 7 Gün</Text>
          </View>

          {/* Visual Graph Bars */}
          <View style={styles.chartContainer}>
            {stats.dailyBreakdown.map((item) => {
              // Bar height proportional to mood score (1 to 5 -> 20% to 100%)
              const barHeightPercent = (item.mood / 5) * 100;
              const moodItem = MOODS.find(m => m.score === item.mood) || MOODS[2];

              return (
                <View key={item.day} style={styles.barColumn}>
                  <Text style={styles.barEmoji}>{moodItem.emoji}</Text>
                  <View style={[styles.barTrack, { backgroundColor: theme.surfaceSecondary }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${barHeightPercent}%`,
                          backgroundColor: moodItem.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, { color: theme.textSecondary }]}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Top Tags & Frequency Statistics */}
        <View style={[styles.chartCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeaderTitle}>
            <Ionicons name="pricetags" size={20} color={theme.accent} />
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>En Çok Kaydedilenler</Text>
          </View>

          <View style={styles.breakdownList}>
            {Object.entries(stats.moodCounts).map(([score, count]) => {
              const mood = MOODS.find(m => m.score === Number(score)) || MOODS[2];
              const percentage = stats.totalEntries > 0 ? Math.round((count / stats.totalEntries) * 100) : 0;

              return (
                <View key={score} style={styles.breakdownItem}>
                  <View style={styles.breakdownInfo}>
                    <Text style={styles.breakdownEmoji}>{mood.emoji}</Text>
                    <Text style={[styles.breakdownLabel, { color: theme.textPrimary }]}>{mood.label}</Text>
                  </View>
                  <View style={styles.breakdownBarRow}>
                    <View style={[styles.progressTrack, { backgroundColor: theme.surfaceSecondary }]}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${percentage}%`, backgroundColor: mood.color },
                        ]}
                      />
                    </View>
                    <Text style={[styles.breakdownCount, { color: theme.textSecondary }]}>
                      {count} anı (%{percentage})
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Insight Card */}
        <View style={[styles.insightCard, { backgroundColor: theme.accentSoft, borderColor: theme.accent }]}>
          <Ionicons name="bulb-outline" size={24} color={theme.accent} />
          <View style={styles.insightTextWrapper}>
            <Text style={[styles.insightTitle, { color: theme.accent }]}>Haftanın İçgörüsü</Text>
            <Text style={[styles.insightDesc, { color: theme.textPrimary }]}>
              Bu hafta en çok <Text style={{ fontWeight: '700' }}>#{stats.topTag}</Text> etiketli anılar kaydettiniz. Sabah rutinleriniz ruh halinize olumlu yansıyor!
            </Text>
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
    padding: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  moodEmoji: {
    fontSize: 28,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  statFootnote: {
    fontSize: 12,
    fontWeight: '700',
  },
  chartCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barEmoji: {
    fontSize: 14,
    marginBottom: 6,
  },
  barTrack: {
    width: 14,
    height: 80,
    borderRadius: 7,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  breakdownList: {
    marginTop: 12,
    gap: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 80,
  },
  breakdownEmoji: {
    fontSize: 18,
  },
  breakdownLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  breakdownBarRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  breakdownCount: {
    fontSize: 11,
    fontWeight: '600',
    width: 76,
    textAlign: 'right',
  },
  insightCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    alignItems: 'center',
  },
  insightTextWrapper: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  insightDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});
