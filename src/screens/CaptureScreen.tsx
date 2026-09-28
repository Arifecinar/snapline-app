import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors, MOODS } from '../theme/colors';
import { NavigationTab, MoodScore } from '../types';
import { createEntry } from '../services/entryService';

interface CaptureScreenProps {
  isDarkMode: boolean;
  onNavigate: (tab: NavigationTab) => void;
  onEntryCreated: () => void;
}

// Türkçe tarih ve saat formatlama yardımcıları
const TR_MONTHS = [
  'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
  'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'
];

function getNowTime(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function getNowDateDisplay(): string {
  const now = new Date();
  return `${now.getDate()} ${TR_MONTHS[now.getMonth()]} ${now.getFullYear()}`;
}

function getNowDateISO(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

const QUICK_TAGS = ['Kahve', 'Yürüyüş', 'Kitap', 'Yemek', 'Doğa', 'Spor', 'Seyahat', 'İş', 'Sosyal'];
const EMPTY_IMAGE = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80';

export const CaptureScreen: React.FC<CaptureScreenProps> = ({
  isDarkMode,
  onNavigate,
  onEntryCreated,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  // Gerçek zamanlı saat — her dakika güncellenir
  const [nowTime, setNowTime] = useState(getNowTime());
  const [nowDate] = useState(getNowDateDisplay());
  const [nowDateISO] = useState(getNowDateISO());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setNowTime(getNowTime());
    }, 30_000); // 30 saniyede bir güncelle
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Form state — temiz başlangıç
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [locationText, setLocationText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [moodScore, setMoodScore] = useState<MoodScore>(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [gridActive, setGridActive] = useState(true);

  // ─── Fotoğraf seçimi ───────────────────────────────────────
  const handlePickGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri izni vermeniz gerekmektedir.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleLaunchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf çekmek için kamera izni vermeniz gerekmektedir.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ─── Etiket ───────────────────────────────────────────────
  const addTag = (t: string) => {
    const clean = t.trim().replace(/^#/, '').toLowerCase();
    if (clean && !tags.includes(clean)) {
      setTags(prev => [...prev, clean]);
    }
    setTagInput('');
  };

  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t));

  // ─── Kaydet ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!noteText.trim() && !imageUri) {
      Alert.alert('Eksik', 'Lütfen en az bir not yazın veya fotoğraf ekleyin.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { useEntryStore } = require('../store/entryStore');
      const created = await useEntryStore.getState().addEntry({
        title: title.trim() || undefined,
        location: locationText.trim() || undefined,
        note_text: noteText.trim() || 'Fotoğraflı anı 📷',
        image_url: imageUri || EMPTY_IMAGE,
        timestamp: nowTime,
        entry_date: nowDateISO,
        tag_name: tags[0] || undefined,
        mood_score: moodScore,
      });

      if (created) {
        setTitle('');
        setNoteText('');
        setLocationText('');
        setImageUri(null);
        setTags([]);
        onEntryCreated();
        onNavigate('timeline');
      } else {
        Alert.alert('Hata', 'Anı kaydedilirken bir sorun oluştu.');
      }
    } catch {
      Alert.alert('Hata', 'Anı kaydedilirken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewUri = imageUri || EMPTY_IMAGE;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: '#0D0D0D' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── KAMERA / FOTOĞRAF VİZÖRÜ ─────────────────────── */}
        <View style={styles.cameraViewport}>
          <Image source={{ uri: previewUri }} style={styles.cameraImage} resizeMode="cover" />

          {/* Izgara overlay */}
          {gridActive && (
            <View style={styles.gridOverlay}>
              <View style={[styles.gridLineH, { top: '33%' as any }]} />
              <View style={[styles.gridLineH, { top: '66%' as any }]} />
              <View style={[styles.gridLineV, { left: '33%' as any }]} />
              <View style={[styles.gridLineV, { left: '66%' as any }]} />
            </View>
          )}

          {/* Köşe çerçeve */}
          <View style={styles.focusFrame} pointerEvents="none">
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>

          {/* Üst kontroller */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setFlashActive(p => !p)}
            >
              <Ionicons
                name={flashActive ? 'flash' : 'flash-off-outline'}
                size={18}
                color={flashActive ? '#F59E0B' : '#FFF'}
              />
            </TouchableOpacity>

            {/* Canlı saat */}
            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>{nowTime}</Text>
            </View>

            <View style={styles.topBarRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleLaunchCamera}>
                <Ionicons name="camera-reverse-outline" size={18} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setGridActive(p => !p)}>
                <Ionicons
                  name={gridActive ? 'grid' : 'grid-outline'}
                  size={18}
                  color={gridActive ? '#A8C4D0' : '#FFF'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Alt: Deklanşör + galeri */}
          <View style={styles.shutterRow}>
            {/* Galeri butonu sol */}
            <TouchableOpacity style={styles.galleryBtn} onPress={handlePickGallery} activeOpacity={0.8}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.galleryThumb} />
              ) : (
                <Ionicons name="images-outline" size={18} color="#FFF" />
              )}
            </TouchableOpacity>

            {/* Deklanşör */}
            <TouchableOpacity
              style={styles.shutterButton}
              onPress={handleLaunchCamera}
              activeOpacity={0.85}
            >
              <View style={styles.shutterInner} />
            </TouchableOpacity>

            {/* Fotoğraf varsa sil */}
            <TouchableOpacity
              style={styles.removeImgBtn}
              onPress={() => imageUri ? setImageUri(null) : null}
              activeOpacity={0.8}
            >
              {imageUri ? (
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              ) : (
                <View style={{ width: 36 }} />
              )}
            </TouchableOpacity>
          </View>

          {/* Sol alt: Tarih rozeti */}
          <View style={styles.dateBadge}>
            <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.7)" />
            <Text style={styles.dateBadgeText}>{nowDate}</Text>
          </View>
        </View>

        {/* ── ALT FORM KARTI ───────────────────────────────── */}
        <View style={[styles.bottomSheet, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.sheetHandle} />

          {/* Başlık (İsteğe bağlı) */}
          <TextInput
            style={[styles.titleInput, { color: theme.textPrimary, borderBottomColor: theme.cardBorder }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Başlık ekle... (isteğe bağlı)"
            placeholderTextColor={theme.textMuted}
            returnKeyType="next"
            maxLength={60}
          />

          {/* Not */}
          <TextInput
            style={[styles.noteInput, { color: theme.textPrimary }]}
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Bu anıyı özel kılan neydi?"
            placeholderTextColor={theme.textMuted}
            multiline
            maxLength={300}
          />
          <Text style={[styles.charCount, { color: theme.textMuted }]}>{noteText.length}/300</Text>

          {/* Ruh Hali Seçici */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Ruh halin nasıl?</Text>
          <View style={styles.moodRow}>
            {MOODS.map(m => {
              const active = moodScore === m.score;
              return (
                <TouchableOpacity
                  key={m.score}
                  style={[
                    styles.moodBtn,
                    { backgroundColor: active ? m.color + '22' : theme.surfaceSecondary },
                    active && { borderWidth: 1.5, borderColor: m.color },
                  ]}
                  onPress={() => setMoodScore(m.score)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={[styles.moodLabel, { color: active ? m.color : theme.textMuted }]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Konum */}
          <View style={[styles.locationRow, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder }]}>
            <Ionicons name="location-outline" size={16} color={theme.textMuted} />
            <TextInput
              style={[styles.locationInput, { color: theme.textPrimary }]}
              value={locationText}
              onChangeText={setLocationText}
              placeholder="Konum ekle..."
              placeholderTextColor={theme.textMuted}
              returnKeyType="done"
              maxLength={80}
            />
            {locationText.length > 0 && (
              <TouchableOpacity onPress={() => setLocationText('')}>
                <Ionicons name="close-circle" size={16} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Etiketler */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Etiketler</Text>

          {/* Hızlı etiket chip'leri */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickTagsRow}
          >
            {QUICK_TAGS.map(qt => {
              const added = tags.includes(qt.toLowerCase());
              return (
                <TouchableOpacity
                  key={qt}
                  style={[
                    styles.quickTagChip,
                    {
                      backgroundColor: added ? theme.accent : theme.surfaceSecondary,
                      borderColor: added ? theme.accent : theme.cardBorder,
                    },
                  ]}
                  onPress={() => added ? removeTag(qt.toLowerCase()) : addTag(qt)}
                >
                  <Text style={[styles.quickTagText, { color: added ? '#FFF' : theme.textSecondary }]}>
                    {added ? '✓ ' : ''}#{qt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Aktif etiketler + özel etiket girişi */}
          <View style={styles.activeTags}>
            {tags.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[styles.activeTagBadge, { backgroundColor: theme.accentSoft }]}
                onPress={() => removeTag(tag)}
              >
                <Text style={[styles.activeTagText, { color: theme.accent }]}>#{tag}</Text>
                <Ionicons name="close" size={11} color={theme.accent} style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            ))}

            <View style={[styles.tagInputWrap, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder }]}>
              <TextInput
                style={[styles.tagInputField, { color: theme.textPrimary }]}
                value={tagInput}
                onChangeText={setTagInput}
                placeholder="#özel..."
                placeholderTextColor={theme.textMuted}
                onSubmitEditing={() => addTag(tagInput)}
                returnKeyType="done"
                maxLength={30}
              />
            </View>
          </View>

          {/* Kaydet butonu */}
          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: theme.accent },
              isSubmitting && { opacity: 0.7 },
            ]}
            onPress={handleSave}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={18} color="#FFF" />
                <Text style={styles.saveBtnText}>Anıyı Kaydet</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // ── Kamera vizörü ──────────────────────────────────────
  cameraViewport: {
    height: 320,
    backgroundColor: '#111',
    position: 'relative',
    overflow: 'hidden',
  },
  cameraImage: { width: '100%', height: '100%' },
  gridOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  gridLineH: {
    position: 'absolute', left: 0, right: 0, height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  gridLineV: {
    position: 'absolute', top: 0, bottom: 0, width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  focusFrame: {
    position: 'absolute',
    top: '18%', left: '16%', width: '68%', height: '50%',
  },
  corner: { position: 'absolute', width: 18, height: 18, borderColor: '#FFF' },
  tl: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 },
  tr: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 },
  br: { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 },

  topBar: {
    position: 'absolute', top: 12, left: 14, right: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10,
  },
  iconBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center',
  },
  timeBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  timeBadgeText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  topBarRight: { flexDirection: 'row', gap: 8 },

  shutterRow: {
    position: 'absolute', bottom: 14, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 28, zIndex: 10,
  },
  galleryBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  galleryThumb: { width: 38, height: 38 },
  shutterButton: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 3, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center',
  },
  shutterInner: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF' },
  removeImgBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center',
  },
  dateBadge: {
    position: 'absolute', bottom: 14, left: 16,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  dateBadgeText: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600' },

  // ── Alt form karti ─────────────────────────────────────
  bottomSheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    marginTop: -20, padding: 20, paddingBottom: 36, zIndex: 20,
  },
  sheetHandle: {
    width: 38, height: 4, borderRadius: 2, backgroundColor: '#DDD5CD',
    alignSelf: 'center', marginBottom: 14,
  },
  titleInput: {
    fontSize: 18, fontWeight: '700',
    paddingBottom: 8, borderBottomWidth: 1, marginBottom: 10,
  },
  noteInput: {
    fontSize: 14, lineHeight: 20, fontWeight: '400', minHeight: 52,
    textAlignVertical: 'top',
  },
  charCount: { fontSize: 10, textAlign: 'right', marginBottom: 14 },
  sectionLabel: { fontSize: 11, fontWeight: '700', marginBottom: 8, letterSpacing: 0.3 },

  moodRow: {
    flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginBottom: 16,
  },
  moodBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  moodEmoji: { fontSize: 20, marginBottom: 2 },
  moodLabel: { fontSize: 9, fontWeight: '700' },

  locationRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, height: 40, marginBottom: 16,
  },
  locationInput: { flex: 1, fontSize: 13, fontWeight: '500' },

  quickTagsRow: { flexDirection: 'row', gap: 6, paddingBottom: 8, marginBottom: 8 },
  quickTagChip: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1,
  },
  quickTagText: { fontSize: 11, fontWeight: '600' },

  activeTags: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20, alignItems: 'center',
  },
  activeTagBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  activeTagText: { fontSize: 11, fontWeight: '700' },
  tagInputWrap: {
    borderRadius: 10, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, minWidth: 70,
  },
  tagInputField: { fontSize: 11, minWidth: 60 },

  saveBtn: {
    flexDirection: 'row', gap: 8, height: 50, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#4E7185', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
