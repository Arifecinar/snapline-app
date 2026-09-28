import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Entry, NavigationTab } from '../types';

interface CalendarScreenProps {
  entries: Entry[];
  isDarkMode: boolean;
  onNavigate: (tab: NavigationTab) => void;
}

const TR_MONTHS_LONG = [
  'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
  'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'
];
const EN_MONTHS_LONG = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAYS_OF_WEEK = ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
  // 0=Pazar ... 6=Cumartesi
  return new Date(year, month, 1).getDay();
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  entries,
  isDarkMode,
  onNavigate,
}) => {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const monthName = EN_MONTHS_LONG[viewMonth];
  const totalDays = daysInMonth(viewYear, viewMonth);
  const firstDay = firstDayOfMonth(viewYear, viewMonth); // 0=Pazar
  const prevMonthDays = daysInMonth(viewYear, viewMonth - 1 < 0 ? 11 : viewMonth - 1);

  const goToPrevMonth = useCallback(() => {
    setViewMonth(prev => {
      if (prev === 0) { setViewYear(y => y - 1); return 11; }
      return prev - 1;
    });
    setSelectedDay(1);
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewMonth(prev => {
      if (prev === 11) { setViewYear(y => y + 1); return 0; }
      return prev + 1;
    });
    setSelectedDay(1);
  }, []);

  // Anı olan günleri entry_date'lerden hesapla
  const daysWithMemory = useMemo(() => {
    const set = new Set<number>();
    const yearMonthStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
    entries.forEach(e => {
      if (e.entry_date && e.entry_date.startsWith(yearMonthStr)) {
        const d = parseInt(e.entry_date.split('-')[2], 10);
        if (!isNaN(d)) set.add(d);
      }
    });
    return set;
  }, [entries, viewYear, viewMonth]);

  // Seçili güne ait anılar
  const selectedDateISO = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const selectedEntries = useMemo(() =>
    entries.filter(e => e.entry_date === selectedDateISO),
  [entries, selectedDateISO]);

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  // Takvim hücresi listesi (önceki ay gri dolgu + bu ay + sonraki ay gri dolgu)
  const cells: { day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, current: false });
  }
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ day: d, current: true });
  }
  // Toplam satır sayısını 6'ya tamamla
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false });
  }

  const selectedDateDisplay = `${selectedDay} ${TR_MONTHS_LONG[viewMonth]} ${viewYear}`;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── BAŞLIK ──────────────────────────────────────────── */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={goToPrevMonth}>
          <Ionicons name="chevron-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.monthTitle, { color: theme.textPrimary }]}>{monthName}</Text>
          <Text style={[styles.yearText, { color: theme.textMuted }]}>{viewYear}</Text>
        </View>

        <TouchableOpacity style={styles.headerIconBtn} onPress={goToNextMonth}>
          <Ionicons name="chevron-forward" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ── TAKVİM KARTI ─────────────────────────────────── */}
      <View style={[styles.calendarCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        {/* Haftanın günleri başlıkları */}
        <View style={styles.weekHeaderRow}>
          {DAYS_OF_WEEK.map(d => (
            <Text key={d} style={[styles.weekDayLabel, { color: theme.textMuted }]}>{d}</Text>
          ))}
        </View>

        {/* Günler grid */}
        <View style={styles.gridContainer}>
          {cells.map((cell, idx) => {
            const isCurrent = cell.current;
            const isSelected = isCurrent && cell.day === selectedDay;
            const hasMemory = isCurrent && daysWithMemory.has(cell.day);
            const todayFlag = isCurrent && isToday(cell.day);

            let circleStyle: any = {};
            let textColor = isCurrent ? theme.textPrimary : theme.textMuted;

            if (isSelected) {
              circleStyle = { backgroundColor: theme.accent };
              textColor = '#FFFFFF';
            } else if (hasMemory) {
              circleStyle = { backgroundColor: (theme as any).peach || '#F6D6BA' };
              textColor = '#7D4F25';
            } else if (todayFlag) {
              circleStyle = { borderWidth: 1.5, borderColor: theme.accent };
              textColor = theme.accent;
            }

            return (
              <TouchableOpacity
                key={idx}
                style={styles.dayCell}
                onPress={() => isCurrent && setSelectedDay(cell.day)}
                activeOpacity={isCurrent ? 0.7 : 1}
              >
                <View style={[styles.dayCircle, circleStyle]}>
                  <Text style={[
                    styles.dayText,
                    { color: textColor, opacity: isCurrent ? 1 : 0.3 },
                    (isSelected || todayFlag) && { fontWeight: '700' },
                  ]}>
                    {cell.day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── SEÇİLİ GÜN ANI LİSTESİ ──────────────────────── */}
      <View style={styles.detailSection}>
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
          {selectedDateDisplay}
        </Text>

        {selectedEntries.length === 0 ? (
          <View style={[styles.emptyDay, { backgroundColor: theme.surfaceSecondary }]}>
            <Ionicons name="journal-outline" size={22} color={theme.textMuted} />
            <Text style={[styles.emptyDayText, { color: theme.textMuted }]}>
              Bu güne ait anı yok
            </Text>
            <TouchableOpacity
              style={[styles.addMemoryBtn, { backgroundColor: theme.accent }]}
              onPress={() => onNavigate('capture')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={14} color="#FFF" />
              <Text style={styles.addMemoryBtnText}>Anı Ekle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          selectedEntries.map(entry => (
            <TouchableOpacity
              key={entry.id}
              style={[styles.memoryCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
              onPress={() => onNavigate('timeline')}
              activeOpacity={0.8}
            >
              <View style={styles.memoryLeft}>
                <View style={[styles.indicatorDot, { backgroundColor: (theme as any).peach || '#F6D6BA' }]} />
              </View>
              <View style={styles.memoryContent}>
                {entry.title && (
                  <Text style={[styles.memoryTitle, { color: theme.textPrimary }]}>
                    {entry.title}
                  </Text>
                )}
                <Text style={[styles.memoryNote, { color: theme.textSecondary }]} numberOfLines={2}>
                  {entry.note_text}
                </Text>
                <View style={styles.memoryMetaRow}>
                  <Ionicons name="time-outline" size={11} color={theme.textMuted} />
                  <Text style={[styles.metaText, { color: theme.textMuted }]}>{entry.timestamp}</Text>
                  {entry.location && (
                    <>
                      <Ionicons name="location-outline" size={11} color={theme.textMuted} />
                      <Text style={[styles.metaText, { color: theme.textMuted }]}>{entry.location}</Text>
                    </>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  topHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : (RNStatusBar.currentHeight || 16) + 12,
    paddingBottom: 8,
  },
  headerIconBtn: { padding: 6 },
  headerCenter: { alignItems: 'center' },
  monthTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  yearText: { fontSize: 11, fontWeight: '500', marginTop: 1 },
  calendarCard: {
    borderRadius: 20, borderWidth: 1, padding: 14, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03, shadowRadius: 6, elevation: 2,
  },
  weekHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    marginBottom: 8, paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E8E2D9',
  },
  weekDayLabel: { fontSize: 10, fontWeight: '700', width: 38, textAlign: 'center' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: `${100 / 7}%` as any, height: 38, justifyContent: 'center', alignItems: 'center', marginVertical: 1 },
  dayCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  dayText: { fontSize: 12, fontWeight: '500' },
  detailSection: { marginTop: 4, paddingBottom: 32 },
  sectionHeading: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
  emptyDay: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderRadius: 14, gap: 10,
  },
  emptyDayText: { flex: 1, fontSize: 12, fontWeight: '500' },
  addMemoryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  addMemoryBtnText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  memoryCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, borderRadius: 16, borderWidth: 1, gap: 10, marginBottom: 8,
  },
  memoryLeft: { justifyContent: 'center', alignItems: 'center' },
  indicatorDot: { width: 10, height: 10, borderRadius: 5 },
  memoryContent: { flex: 1 },
  memoryTitle: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  memoryNote: { fontSize: 12, lineHeight: 17, marginBottom: 6 },
  memoryMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 10 },
});
