import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MOODS, Colors } from '../theme/colors';
import { MoodScore } from '../types';

interface TagPillProps {
  label: string;
  moodScore?: MoodScore;
  isDarkMode?: boolean;
}

export const TagPill: React.FC<TagPillProps> = ({ label, moodScore = 3, isDarkMode = true }) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const mood = MOODS.find(m => m.score === moodScore) || MOODS[2];

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceSecondary, borderColor: theme.cardBorder }]}>
      <Text style={styles.emoji}>{mood.emoji}</Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>#{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 6,
    gap: 4,
  },
  emoji: {
    fontSize: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
