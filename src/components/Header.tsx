import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Snapline',
  subtitle,
  isDarkMode = true,
  onToggleTheme,
  rightAction,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderBottomColor: theme.cardBorder }]}>
      <View style={styles.leftSection}>
        <View style={[styles.logoBadge, { backgroundColor: theme.accentSoft }]}>
          <Ionicons name="sparkles" size={18} color={theme.accent} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text> : null}
        </View>
      </View>

      <View style={styles.rightSection}>
        {rightAction}
        {onToggleTheme && (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
            onPress={onToggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={theme.accent}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
