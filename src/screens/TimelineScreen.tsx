import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Collect all unique tags
  const allTags = Array.from(
    new Set(
      entries.flatMap(e => e.tags?.map(t => t.tag_name) || [])
    )
  );

  // Filter entries based on selected tag and search query
  const filteredEntries = entries.filter(e => {
    const matchesTag = !selectedTag || e.tags?.some(t => t.tag_name === selectedTag);
    const matchesSearch =
      !searchQuery ||
      e.note_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tags?.some(t => t.tag_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Info */}
      <View style={styles.topHeader}>
        <View>
          <Text style={[styles.dateTitle, { color: theme.textPrimary }]}>Günün İzleri</Text>
          <Text style={[styles.dateSubtitle, { color: theme.textSecondary }]}>
            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.newBtn, { backgroundColor: theme.accent }]}
          onPress={() => onNavigate('capture')}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={18} color="#FFF" />
          <Text style={styles.newBtnText}>Anı Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={[styles.searchBar, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder }]}>
        <Ionicons name="search-outline" size={18} color={theme.textMuted} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.textPrimary }]}
          placeholder="Anılarda veya etiketlerde ara..."
          placeholderTextColor={theme.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Tag Chips */}
      {allTags.length > 0 && (
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: !selectedTag ? theme.accent : theme.surfaceSecondary,
                borderColor: !selectedTag ? theme.accent : theme.cardBorder,
              },
            ]}
            onPress={() => setSelectedTag(null)}
          >
            <Text style={[styles.filterChipText, { color: !selectedTag ? '#FFF' : theme.textSecondary }]}>
              Tümü ({entries.length})
            </Text>
          </TouchableOpacity>

          {allTags.map(tag => {
            const isSelected = selectedTag === tag;
            return (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? theme.accent : theme.surfaceSecondary,
                    borderColor: isSelected ? theme.accent : theme.cardBorder,
                  },
                ]}
                onPress={() => setSelectedTag(isSelected ? null : tag)}
              >
                <Text style={[styles.filterChipText, { color: isSelected ? '#FFF' : theme.textSecondary }]}>
                  #{tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Timeline Feed */}
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
              <Ionicons name="journal-outline" size={36} color={theme.accent} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Henüz anı bulunmuyor</Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              Gününüzü unutulmaz kılmak için ilk anınızı şimdi yakalayın.
            </Text>
            <TouchableOpacity
              style={[styles.createFirstBtn, { backgroundColor: theme.accent }]}
              onPress={() => onNavigate('capture')}
            >
              <Text style={styles.createFirstBtnText}>Anı Ekle</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  dateTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  dateSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  createFirstBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createFirstBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
