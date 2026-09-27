export const Colors = {
  dark: {
    background: '#0F1722',
    cardBackground: '#172232',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    surface: '#172232',
    surfaceSecondary: '#213045',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    accent: '#5E88A1', // Slate blue
    accentGradient: ['#4E7185', '#6D96AE'] as const,
    accentSoft: 'rgba(94, 136, 161, 0.2)',
    secondaryAccent: '#D2AB80',
    peach: '#C28254',
    gold: '#F59E0B',
    danger: '#EF4444',
    timelineLine: '#2E3F57',
    tabBarBackground: '#111B28',
    inputBackground: '#1B283A',
  },
  light: {
    background: '#F7F4F0', // Warm ivory cream
    cardBackground: '#FFFFFF',
    cardBorder: '#EDE6DE',
    surface: '#FFFFFF',
    surfaceSecondary: '#F2EDE6',
    textPrimary: '#1E2B33',
    textSecondary: '#5C6E7C',
    textMuted: '#8D9EA9',
    accent: '#4E7185', // Editorial slate blue
    accentGradient: ['#4E7185', '#6B8E9F'] as const,
    accentSoft: '#E3ECEF',
    secondaryAccent: '#BA926D',
    peach: '#F6D6BA', // Peach calendar highlight badge
    gold: '#D97706',
    danger: '#DC2626',
    timelineLine: '#E2DAD2',
    tabBarBackground: '#FAF7F4',
    inputBackground: '#F3EFE9',
  }
};

export const MOODS = [
  { score: 1 as const, label: 'Kötü', emoji: '😫', color: '#EF4444' },
  { score: 2 as const, label: 'Düşük', emoji: '😔', color: '#F97316' },
  { score: 3 as const, label: 'Sakin', emoji: '😐', color: '#EAB308' },
  { score: 4 as const, label: 'İyi', emoji: '😊', color: '#10B981' },
  { score: 5 as const, label: 'Harika', emoji: '🤩', color: '#14B8A6' },
];
