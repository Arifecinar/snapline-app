export const Colors = {
  dark: {
    background: '#0B0F19',
    cardBackground: 'rgba(23, 31, 49, 0.85)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    surface: '#171F31',
    surfaceSecondary: '#212D45',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    accent: '#14B8A6', // Teal
    accentGradient: ['#14B8A6', '#06B6D4'] as const,
    accentSoft: 'rgba(20, 184, 166, 0.15)',
    secondaryAccent: '#6366F1', // Indigo
    gold: '#F59E0B',
    danger: '#EF4444',
    timelineLine: 'rgba(20, 184, 166, 0.3)',
    tabBarBackground: '#0F172A',
    inputBackground: '#1E293B',
  },
  light: {
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    cardBorder: 'rgba(226, 232, 240, 0.8)',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    accent: '#0D9488',
    accentGradient: ['#0D9488', '#0284C7'] as const,
    accentSoft: 'rgba(13, 148, 136, 0.1)',
    secondaryAccent: '#4F46E5',
    gold: '#D97706',
    danger: '#DC2626',
    timelineLine: 'rgba(13, 148, 136, 0.25)',
    tabBarBackground: '#FFFFFF',
    inputBackground: '#F1F5F9',
  }
};

export const MOODS = [
  { score: 1 as const, label: 'Kötü', emoji: '😫', color: '#EF4444' },
  { score: 2 as const, label: 'Düşük', emoji: '😔', color: '#F97316' },
  { score: 3 as const, label: 'Sakin', emoji: '😐', color: '#EAB308' },
  { score: 4 as const, label: 'İyi', emoji: '😊', color: '#10B981' },
  { score: 5 as const, label: 'Harika', emoji: '🤩', color: '#14B8A6' },
];
