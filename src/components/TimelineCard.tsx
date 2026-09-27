import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Entry } from '../types';

interface TimelineCardProps {
  entry: Entry;
  isDarkMode?: boolean;
  onDelete?: (id: string) => void;
  isLast?: boolean;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  entry,
  isDarkMode = false,
  onDelete,
  isLast = false,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const [modalVisible, setModalVisible] = useState(false);

  // Format header title e.g. "08:30 · Kahvaltı"
  const headerTitle = entry.title
    ? `${entry.timestamp} · ${entry.title}`
    : entry.timestamp;

  return (
    <View style={styles.container}>
      {/* Left Timeline Spine */}
      <View style={styles.timelineLeft}>
        <View style={[styles.timeNode, { backgroundColor: theme.accent, borderColor: theme.background }]} />
        {!isLast && <View style={[styles.line, { backgroundColor: theme.timelineLine }]} />}
      </View>

      {/* Main Card Content */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        {/* Header Row: Time · Title & Delete */}
        <View style={styles.cardHeader}>
          <Text style={[styles.titleText, { color: theme.textPrimary }]}>{headerTitle}</Text>

          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(entry.id)}
              style={styles.deleteBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={15} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Image Display */}
        {entry.image_url ? (
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => setModalVisible(true)}
            style={styles.imageWrapper}
          >
            <Image source={{ uri: entry.image_url }} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>
        ) : null}

        {/* Note Text */}
        <Text style={[styles.noteText, { color: theme.textSecondary }]}>{entry.note_text}</Text>

        {/* Bottom Metadata: Location & Tags */}
        <View style={styles.bottomMetaRow}>
          {entry.location ? (
            <View style={styles.locationBadge}>
              <Ionicons name="location-sharp" size={12} color={theme.textMuted} />
              <Text style={[styles.locationText, { color: theme.textMuted }]}>{entry.location}</Text>
            </View>
          ) : null}

          {entry.tags && entry.tags.length > 0 && (
            <View style={styles.tagsWrapper}>
              {entry.tags.map(tag => (
                <View
                  key={tag.id}
                  style={[styles.tagPill, { backgroundColor: theme.surfaceSecondary }]}
                >
                  <Text style={[styles.tagPillText, { color: theme.textSecondary }]}>#{tag.tag_name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Image Fullscreen Modal */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalBg}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-circle" size={32} color="#FFF" />
            </TouchableOpacity>
            {entry.image_url && (
              <Image source={{ uri: entry.image_url }} style={styles.modalImage} resizeMode="contain" />
            )}
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
    marginRight: 10,
    marginTop: 4,
  },
  timeNode: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    zIndex: 2,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 2,
    marginBottom: -18,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  deleteBtn: {
    padding: 2,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    height: 135,
    backgroundColor: '#EBE5DC',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noteText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    marginBottom: 8,
  },
  bottomMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tagsWrapper: {
    flexDirection: 'row',
    gap: 6,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  modalImage: {
    width: '92%',
    height: '80%',
  },
});
