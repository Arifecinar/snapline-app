import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  ScrollView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Entry, NavigationTab } from '../types';
import { TimelineCard } from '../components/TimelineCard';
import { deleteEntry } from '../services/entryService';

interface TimelineScreenProps {
  entries: Entry[];
  isDarkMode: boolean;
  onRefresh: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onEntryDeleted: (id: string) => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({
  entries,
  isDarkMode,
  onRefresh,
  onNavigate,
  onEntryDeleted,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const TR_MONTHS = [
    'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
    'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'
  ];

  const todayDate = new Date();
  const [selectedDateObj, setSelectedDateObj] = useState(todayDate);

  const formatDateDisplay = useCallback((d: Date) =>
    `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`,
  []);

  const selectedDate = formatDateDisplay(selectedDateObj);

  const goToPrevDay = () => {
    setSelectedDateObj(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const goToNextDay = () => {
    setSelectedDateObj(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showTimeCapsule, setShowTimeCapsule] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const handleDelete = async (id: string) => {
    await deleteEntry(id);
    onEntryDeleted(id);
  };

  // Collect all unique tags from entries
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    entries.forEach(e => {
      e.tags?.forEach(t => tagsSet.add(t.tag_name.toLowerCase()));
      if (e.location) tagsSet.add(e.location.toLowerCase());
    });
    return Array.from(tagsSet);
  }, [entries]);

  // "Geçmişte Bugün" — bugünden farklı tarihe ait en eski anıyı göster
  const timeCapsuleMemory = useMemo(() => {
    const todayISO = new Date().toISOString().split('T')[0];
    // Önce farklı tarihli anı ara (en eski)
    const past = [...entries]
      .sort((a, b) => a.entry_date.localeCompare(b.entry_date))
      .find(e => e.entry_date < todayISO);
    return past || null;
  }, [entries]);

  // timeCapsule tarih gösterimi
  const timeCapsuleDateDisplay = useMemo(() => {
    if (!timeCapsuleMemory) return '';
    const TR_M = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
    const parts = timeCapsuleMemory.entry_date.split('-');
    if (parts.length !== 3) return timeCapsuleMemory.entry_date;
    return `${parseInt(parts[2], 10)} ${TR_M[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
  }, [timeCapsuleMemory]);

  // Filter entries based on search and selected tag
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        e.note_text.toLowerCase().includes(q) ||
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q)) ||
        e.tags?.some(t => t.tag_name.toLowerCase().includes(q));

      const matchesTag =
        !selectedTag ||
        e.tags?.some(t => t.tag_name.toLowerCase() === selectedTag.toLowerCase()) ||
        (e.location && e.location.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    });
  }, [entries, searchQuery, selectedTag]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header Row matching mockup */}
      <View style={styles.topHeader}>
        <View>
          <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Günün İzleri</Text>
          <Text style={[styles.screenSubtitle, { color: theme.textMuted }]}>ve tarih seçici</Text>
        </View>

        <View style={styles.topHeaderActions}>
          {/* Search Toggle Icon */}
          <TouchableOpacity
            style={[
              styles.iconCircleBtn,
              { backgroundColor: showSearch ? theme.accent : theme.cardBackground, borderColor: theme.cardBorder },
            ]}
            onPress={() => setShowSearch(prev => !prev)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showSearch ? 'close' : 'search'}
              size={15}
              color={showSearch ? '#FFFFFF' : theme.textPrimary}
            />
          </TouchableOpacity>

          {/* Date Dropdown Pill */}
          <TouchableOpacity
            style={[styles.dateDropdownPill, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.dateDropdownText, { color: theme.textPrimary }]}>{selectedDate}</Text>
            <Ionicons name="chevron-down" size={13} color={theme.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Switcher Row (< 12 Ekim 2026 >) */}
      <View style={styles.dateSwitcherRow}>
        <TouchableOpacity
          style={styles.chevronBtn}
          onPress={goToPrevDay}
          activeOpacity={0.6}
        >
          <Ionicons name="chevron-back" size={16} color={theme.textMuted} />
        </TouchableOpacity>

        <Text style={[styles.currentDateText, { color: theme.textPrimary }]}>{selectedDate}</Text>

        <TouchableOpacity
          style={styles.chevronBtn}
          onPress={goToNextDay}
          activeOpacity={0.6}
        >
          <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Expandable Search Input & Tag Filter */}
      {showSearch && (
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder }]}>
            <Ionicons name="search-outline" size={16} color={theme.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              placeholder="Anılarda veya konumlarda ara..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={theme.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}

      {/* Tag Chips Row */}
      {allTags.length > 0 && (
        <View style={styles.tagsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagScroll}>
            <TouchableOpacity
              style={[
                styles.tagChip,
                {
                  backgroundColor: !selectedTag ? theme.accent : theme.surfaceSecondary,
                  borderColor: !selectedTag ? theme.accent : theme.cardBorder,
                },
              ]}
              onPress={() => setSelectedTag(null)}
            >
              <Text style={[styles.tagChipText, { color: !selectedTag ? '#FFFFFF' : theme.textSecondary }]}>
                Tümü ({entries.length})
              </Text>
            </TouchableOpacity>

            {allTags.map(tag => {
              const isSelected = selectedTag === tag;
              return (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: isSelected ? theme.accent : theme.surfaceSecondary,
                      borderColor: isSelected ? theme.accent : theme.cardBorder,
                    },
                  ]}
                  onPress={() => setSelectedTag(isSelected ? null : tag)}
                >
                  <Text style={[styles.tagChipText, { color: isSelected ? '#FFFFFF' : theme.textSecondary }]}>
                    #{tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* "GEÇMİŞTE BUGÜN" (ZAMAN KAPSÜLÜ) CARD */}
      {showTimeCapsule && timeCapsuleMemory && !selectedTag && !searchQuery && (
        <View style={[styles.timeCapsuleCard, { backgroundColor: '#F4ECE1', borderColor: '#E8DCCF' }]}>
          <View style={styles.timeCapsuleHeader}>
            <View style={styles.timeCapsuleTitleRow}>
              <Ionicons name="time" size={15} color="#8A6B4F" />
              <Text style={styles.timeCapsuleLabel}>GEÇMİŞTE BUGÜN • 1 AY ÖNCE</Text>
            </View>
            <TouchableOpacity onPress={() => setShowTimeCapsule(false)}>
              <Ionicons name="close" size={16} color="#8A6B4F" />
            </TouchableOpacity>
          </View>

          <View style={styles.timeCapsuleBody}>
            {timeCapsuleMemory.image_url ? (
              <Image source={{ uri: timeCapsuleMemory.image_url }} style={styles.timeCapsuleThumb} />
            ) : null}
            <View style={styles.timeCapsuleInfo}>
              <Text style={styles.timeCapsuleText} numberOfLines={2}>
                "{timeCapsuleMemory.note_text}"
              </Text>
              <Text style={styles.timeCapsuleMeta}>
                {timeCapsuleDateDisplay} • {timeCapsuleMemory.location || 'Özel Anı'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Timeline Stream */}
      <FlatList
        data={filteredEntries}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <TimelineCard
            entry={item}
            isDarkMode={isDarkMode}
            onDelete={handleDelete}
            isLast={index === filteredEntries.length - 1}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.accent}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconBox, { backgroundColor: theme.accentSoft }]}>
              <Ionicons name="search-outline" size={28} color={theme.accent} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Eşleşen anı bulunamadı</Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              Farklı bir arama terimi veya etiket seçmeyi deneyebilirsiniz.
            </Text>
          </View>
        }
      />

      {/* Floating Action Button at bottom right */}
      <TouchableOpacity
        style={[styles.fabButton, { backgroundColor: theme.accent }]}
        onPress={() => onNavigate('capture')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    position: 'relative',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : (RNStatusBar.currentHeight || 16) + 12,
    paddingBottom: 6,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  topHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircleBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDropdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  dateDropdownText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dateSwitcherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 4,
  },
  chevronBtn: {
    padding: 6,
  },
  currentDateText: {
    fontSize: 13,
    fontWeight: '700',
  },
  searchSection: {
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
  },
  tagsContainer: {
    marginBottom: 10,
  },
  tagScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timeCapsuleCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  timeCapsuleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeCapsuleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeCapsuleLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A6B4F',
    letterSpacing: 0.5,
  },
  timeCapsuleBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeCapsuleThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  timeCapsuleInfo: {
    flex: 1,
  },
  timeCapsuleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#382B20',
    lineHeight: 16,
  },
  timeCapsuleMeta: {
    fontSize: 10,
    color: '#8A7563',
    marginTop: 2,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
});
