import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Entry, CreateEntryDTO, WeeklyStats, MoodScore } from '../types';

const STORAGE_KEY = '@snapline_local_entries_v1';

const MOCK_INITIAL_ENTRIES: Entry[] = [
  {
    id: 'mock-1',
    user_id: 'user-demo',
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    note_text: 'Sabah kahvesi ve günlük okuma rutini. Güne sakince başlamak çok iyi geldi. ☕✨',
    timestamp: '08:30',
    entry_date: new Date().toISOString().split('T')[0],
    created_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    tags: [
      { id: 't1', entry_id: 'mock-1', tag_name: 'Kahve', mood_score: 5 },
      { id: 't2', entry_id: 'mock-1', tag_name: 'Sabah', mood_score: 5 }
    ]
  },
  {
    id: 'mock-2',
    user_id: 'user-demo',
    image_url: 'https://images.unsplash.com/photo-1476514525535-ce74f458149e?w=800&auto=format&fit=crop&q=80',
    note_text: 'Öğle arası sahil yürüyüşü. Deniz havası zihnimi tamamen boşalttı.',
    timestamp: '13:15',
    entry_date: new Date().toISOString().split('T')[0],
    created_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    tags: [
      { id: 't3', entry_id: 'mock-2', tag_name: 'Yürüyüş', mood_score: 4 },
      { id: 't4', entry_id: 'mock-2', tag_name: 'Doğa', mood_score: 4 }
    ]
  },
  {
    id: 'mock-3',
    user_id: 'user-demo',
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    note_text: 'Akşam kitap kulübü toplantısı. Yeni sürüm mimarisini tartıştık.',
    timestamp: '19:45',
    entry_date: new Date(Date.now() - 86400 * 1000 * 1).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 86400 * 1000 * 1).toISOString(),
    tags: [
      { id: 't5', entry_id: 'mock-3', tag_name: 'Kitap', mood_score: 5 }
    ]
  },
  {
    id: 'mock-4',
    user_id: 'user-demo',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    note_text: 'Eski dostlarla akşam yemeği ve sohbet. Günün yorgunluğunu unuttuk.',
    timestamp: '21:00',
    entry_date: new Date(Date.now() - 86400 * 1000 * 2).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 86400 * 1000 * 2).toISOString(),
    tags: [
      { id: 't6', entry_id: 'mock-4', tag_name: 'Sohbet', mood_score: 4 }
    ]
  }
];

export const fetchEntries = async (): Promise<Entry[]> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select(`
          *,
          entry_tags (*)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((item: any) => ({
          ...item,
          tags: item.entry_tags || [],
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local storage', e);
    }
  }

  // Fallback to AsyncStorage
  try {
    const jsonStr = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonStr) {
      return JSON.parse(jsonStr);
    }
    // Initialize with mock data if empty
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INITIAL_ENTRIES));
    return MOCK_INITIAL_ENTRIES;
  } catch (e) {
    return MOCK_INITIAL_ENTRIES;
  }
};

export const createEntry = async (dto: CreateEntryDTO): Promise<Entry> => {
  const newEntryId = `entry-${Date.now()}`;
  const now = new Date();

  const newEntry: Entry = {
    id: newEntryId,
    user_id: 'user-demo',
    image_url: dto.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    note_text: dto.note_text,
    timestamp: dto.timestamp || now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    entry_date: dto.entry_date || now.toISOString().split('T')[0],
    created_at: now.toISOString(),
    tags: dto.tag_name
      ? [
          {
            id: `tag-${Date.now()}`,
            entry_id: newEntryId,
            tag_name: dto.tag_name,
            mood_score: dto.mood_score || 4,
          },
        ]
      : [],
  };

  if (isSupabaseConfigured()) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id || 'demo-user-id';

      const { data: insertedEntry, error: entryErr } = await supabase
        .from('entries')
        .insert({
          user_id: currentUserId,
          image_url: newEntry.image_url,
          note_text: dto.note_text,
          timestamp: newEntry.timestamp,
          entry_date: newEntry.entry_date,
        })
        .select()
        .single();

      if (!entryErr && insertedEntry) {
        if (dto.tag_name) {
          await supabase.from('entry_tags').insert({
            entry_id: insertedEntry.id,
            tag_name: dto.tag_name,
            mood_score: dto.mood_score || 3,
          });
        }
        return {
          ...insertedEntry,
          tags: dto.tag_name
            ? [{ id: 't-new', entry_id: insertedEntry.id, tag_name: dto.tag_name, mood_score: dto.mood_score || 3 }]
            : [],
        };
      }
    } catch (e) {
      console.warn('Supabase create failed, saving locally', e);
    }
  }

  // Save to local storage
  const currentEntries = await fetchEntries();
  const updated = [newEntry, ...currentEntries];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
};

export const deleteEntry = async (id: string): Promise<void> => {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('entries').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete failed', e);
    }
  }
  const currentEntries = await fetchEntries();
  const updated = currentEntries.filter(item => item.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const calculateWeeklyStats = (entries: Entry[]): WeeklyStats => {
  const moodCounts: Record<MoodScore, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const tagFrequency: Record<string, number> = {};
  let moodSum = 0;
  let moodTotalCount = 0;

  entries.forEach(entry => {
    entry.tags?.forEach(tag => {
      const score = tag.mood_score || 3;
      moodCounts[score] = (moodCounts[score] || 0) + 1;
      moodSum += score;
      moodTotalCount++;

      const tagKey = tag.tag_name.trim();
      if (tagKey) {
        tagFrequency[tagKey] = (tagFrequency[tagKey] || 0) + 1;
      }
    });
  });

  const averageMood = moodTotalCount > 0 ? parseFloat((moodSum / moodTotalCount).toFixed(1)) : 4.0;
  
  let topTag = 'Kahve';
  let maxTagCount = 0;
  Object.entries(tagFrequency).forEach(([tag, count]) => {
    if (count > maxTagCount) {
      maxTagCount = count;
      topTag = tag;
    }
  });

  const daysOfWeek = ['Pzr', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const dailyBreakdown = daysOfWeek.map((day, idx) => {
    return {
      day,
      date: `G${idx + 1}`,
      mood: Math.min(5, Math.max(1, Math.round(averageMood + (idx % 2 === 0 ? 0.3 : -0.2)))),
      count: Math.floor(Math.random() * 3) + 1,
    };
  });

  return {
    totalEntries: entries.length,
    averageMood,
    topTag,
    moodCounts,
    dailyBreakdown,
  };
};
