import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { MoodScore, NavigationTab } from '../types';
import { MoodPicker } from '../components/MoodPicker';
import { createEntry } from '../services/entryService';

interface CaptureScreenProps {
  isDarkMode: boolean;
  onNavigate: (tab: NavigationTab) => void;
  onEntryCreated: () => void;
}

const SAMPLE_TAGS = ['Kahve', 'Yürüyüş', 'Okuma', 'Kodlama', 'Toplantı', 'Spor', 'Doğa'];

export const CaptureScreen: React.FC<CaptureScreenProps> = ({
  isDarkMode,
  onNavigate,
  onEntryCreated,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const dateFormatted = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [moodScore, setMoodScore] = useState<MoodScore>(4);
  const [tagName, setTagName] = useState('Kahve');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pick Image from Gallery
  const handlePickGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf eklemek için galeri izni vermeniz gerekmektedir.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Launch Camera
  const handleLaunchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Anı yakalamak için kamera izni vermeniz gerekmektedir.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Submit Entry
  const handleSubmit = async () => {
    if (!noteText.trim() && !imageUri) {
      Alert.alert('Eksik Bilgi', 'Lütfen en azından kısa bir not yazın veya bir fotoğraf ekleyin.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createEntry({
        note_text: noteText.trim() || 'Fotoğraflı anı 📸',
        image_url: imageUri || undefined,
        timestamp: timeFormatted,
        entry_date: now.toISOString().split('T')[0],
        tag_name: tagName.trim() || undefined,
        mood_score: moodScore,
      });

      onEntryCreated();
      onNavigate('timeline');
    } catch (e) {
      Alert.alert('Hata', 'Anı kaydedilirken bir sorun oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        {/* Header Title */}
        <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Hızlı Anı Ekle</Text>
        
        {/* Real-time Timestamp Badge */}
        <View style={[styles.timeBadge, { backgroundColor: theme.accentSoft, borderColor: theme.accent }]}>
          <Ionicons name="time" size={16} color={theme.accent} />
          <Text style={[styles.timeBadgeText, { color: theme.accent }]}>
            {timeFormatted} • {dateFormatted}
          </Text>
        </View>

        {/* Media Selector Box */}
        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
            <TouchableOpacity
              style={styles.removeImageBtn}
              onPress={() => setImageUri(null)}
            >
              <Ionicons name="trash" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.pickerBox, { backgroundColor: theme.surfaceSecondary, borderColor: theme.cardBorder }]}>
            <Ionicons name="camera-outline" size={40} color={theme.accent} />
            <Text style={[styles.pickerTitle, { color: theme.textPrimary }]}>Bir fotoğraf ekleyin</Text>
            <Text style={[styles.pickerSubtitle, { color: theme.textMuted }]}>
              Kameranızla çekin veya galerinizden seçin
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.mediaOptionBtn, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
                onPress={handleLaunchCamera}
              >
                <Ionicons name="camera" size={18} color={theme.accent} />
                <Text style={[styles.mediaOptionText, { color: theme.textPrimary }]}>Kamera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mediaOptionBtn, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
                onPress={handlePickGallery}
              >
                <Ionicons name="images" size={18} color={theme.accent} />
                <Text style={[styles.mediaOptionText, { color: theme.textPrimary }]}>Galeri</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Note Text Input */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Notunuz (1 Cümle):</Text>
          <View style={[styles.textAreaWrapper, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder }]}>
            <TextInput
              style={[styles.textArea, { color: theme.textPrimary }]}
              placeholder="Bu anı özel kılan nedir? (örn. Harika bir kahve molası...)"
              placeholderTextColor={theme.textMuted}
              multiline
              numberOfLines={3}
              maxLength={180}
              value={noteText}
              onChangeText={setNoteText}
            />
            <Text style={[styles.charCount, { color: theme.textMuted }]}>
              {noteText.length}/180
            </Text>
          </View>
        </View>

        {/* Mood Selector */}
        <MoodPicker
          selectedScore={moodScore}
          onSelectMood={setMoodScore}
          isDarkMode={isDarkMode}
        />

        {/* Tag Selection */}
        <View style={styles.tagSection}>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Etiket Ekle:</Text>
          <TextInput
            style={[styles.tagInput, { backgroundColor: theme.inputBackground, color: theme.textPrimary, borderColor: theme.cardBorder }]}
            placeholder="Etiket adı yazın..."
            placeholderTextColor={theme.textMuted}
            value={tagName}
            onChangeText={setTagName}
          />
          <View style={styles.sampleTagsRow}>
            {SAMPLE_TAGS.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.sampleTagChip,
                  {
                    backgroundColor: tagName === tag ? theme.accent : theme.surfaceSecondary,
                    borderColor: tagName === tag ? theme.accent : theme.cardBorder,
                  },
                ]}
                onPress={() => setTagName(tag)}
              >
                <Text style={[styles.sampleTagText, { color: tagName === tag ? '#FFF' : theme.textSecondary }]}>
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.accent }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              <Text style={styles.submitButtonText}>Anıyı Kaydet</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    gap: 6,
  },
  timeBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pickerBox: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  pickerSubtitle: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  mediaOptionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 200,
    marginBottom: 20,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  textAreaWrapper: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  textArea: {
    fontSize: 15,
    lineHeight: 22,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
  },
  tagSection: {
    marginBottom: 24,
  },
  tagInput: {
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 10,
  },
  sampleTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sampleTagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  sampleTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
