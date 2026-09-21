import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Entry } from '../types';
import { TagPill } from './TagPill';

interface TimelineCardProps {
  entry: Entry;
  isDarkMode?: boolean;
  onDelete?: (id: string) => void;
  isLast?: boolean;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  entry,
  isDarkMode = true,
  onDelete,
  isLast = false,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Left Timeline Spine */}
      <View style={styles.timelineLeft}>
        <View style={[styles.timeNode, { backgroundColor: theme.surface, borderColor: theme.accent }]}>
          <Ionicons name="time-outline" size={14} color={theme.accent} />
        </View>
        {!isLast && <View style={[styles.line, { backgroundColor: theme.timelineLine }]} />}
      </View>

      {/* Main Card Content */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        {/* Header Row: Time & Delete */}
        <View style={styles.cardHeader}>
          <View style={styles.timeTag}>
            <Text style={[styles.timeText, { color: theme.accent }]}>{entry.timestamp}</Text>
          </View>

          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(entry.id)}
              style={styles.deleteBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Note Text */}
        <Text style={[styles.noteText, { color: theme.textPrimary }]}>{entry.note_text}</Text>

        {/* Image Display */}
        {entry.image_url ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setModalVisible(true)}
            style={styles.imageWrapper}
          >
            <Image source={{ uri: entry.image_url }} style={styles.image} resizeMode="cover" />
            <View style={styles.expandBadge}>
              <Ionicons name="expand-outline" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>
        ) : null}

        {/* Tags Row */}
        {entry.tags && entry.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {entry.tags.map(tag => (
              <TagPill
                key={tag.id}
                label={tag.tag_name}
                moodScore={tag.mood_score}
                isDarkMode={isDarkMode}
              />
            ))}
          </View>
        )}

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
    width: 36,
    alignItems: 'center',
    marginRight: 10,
  },
  timeNode: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: -16,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  deleteBtn: {
    padding: 4,
  },
  noteText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 10,
  },
  imageWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  expandBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
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
