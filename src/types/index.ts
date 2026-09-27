export type MoodScore = 1 | 2 | 3 | 4 | 5;

export interface MoodConfig {
  score: MoodScore;
  label: string;
  emoji: string;
  color: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface EntryTag {
  id: string;
  entry_id: string;
  tag_name: string;
  mood_score: MoodScore;
}

export interface Entry {
  id: string;
  user_id: string;
  title?: string; // e.g., "Kahvaltı", "Sahil Yürüyüşü", "Kitap Kulübü"
  location?: string; // e.g., "Ev", "Sahil", "Cafe", "Espresso Lab - Moda"
  image_url?: string;
  note_text: string;
  timestamp: string; // e.g., "08:30"
  entry_date: string; // e.g., "2026-10-12"
  created_at: string;
  tags?: EntryTag[];
}

export type NavigationTab = 'timeline' | 'calendar' | 'capture' | 'analytics' | 'profile';

export interface CreateEntryDTO {
  title?: string;
  location?: string;
  image_url?: string;
  note_text: string;
  timestamp: string;
  entry_date: string;
  tag_name?: string;
  mood_score?: MoodScore;
}

export interface WeeklyStats {
  totalEntries: number;
  averageMood: number;
  topTag: string;
  moodCounts: Record<MoodScore, number>;
  dailyBreakdown: Array<{ day: string; date: string; mood: number; count: number }>;
}
