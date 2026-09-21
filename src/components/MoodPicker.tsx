import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MOODS, Colors } from '../theme/colors';
import { MoodScore } from '../types';

interface MoodPickerProps {
  selectedScore: MoodScore;
  onSelectMood: (score: MoodScore) => void;
  isDarkMode?: boolean;
}

export const MoodPicker: React.FC<MoodPickerProps> = ({
  selectedScore,
  onSelectMood,
  isDarkMode = true,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>Ruh Hali Seçin:</Text>
      <View style={styles.row}>
        {MOODS.map(mood => {
          const isSelected = selectedScore === mood.score;
          return (
            <TouchableOpacity
              key={mood.score}
              style={[
                styles.item,
                {
                  backgroundColor: isSelected ? theme.accentSoft : theme.surfaceSecondary,
                  borderColor: isSelected ? theme.accent : theme.cardBorder,
                },
              ]}
              onPress={() => onSelectMood(mood.score)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text
                style={[
                  styles.itemLabel,
                  { color: isSelected ? theme.accent : theme.textMuted },
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  emoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  itemLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
});
