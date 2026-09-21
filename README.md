# Snapline 📸✨

Snapline, kullanıcıların gün içindeki anlarını (sabah kahvesi, sahil yürüyüşü, önemli toplantılar vb.) saat damgası, fotoğraf ve 1 cümlelik kısa notlarla zahmetsizce kaydedebileceği minimalist bir mobil günlük (journal) uygulamasıdır.

![Snapline Preview](https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80)

---

## 🛠️ TEKNİK YIĞIN (TECH STACK)
- **Frontend**: React Native (Expo SDK 51, TypeScript)
- **Backend & Database**: Supabase (Auth, PostgreSQL, Storage, Row Level Security - RLS)
- **Design & UI**: Minimalist Slate Dark & Light theme, glassmorphic cards, custom mood pickers & vertical timeline spine.

---

## 📱 EKRANLAR VE ÖZELLİKLER

1. **Günün Akışı (Timeline Screen)**
   - Dikey zaman çizelgesi, otomatik saat ikonları ve fotoğraf kartları.
   - Arama çubuğu ve anlık etiket filtreleri (`#Kahve`, `#Yürüyüş`, `#Okuma` vb.).
   - Fotoğrafları tam ekran inceleme modalı ve anı silme aksiyonu.

2. **Hızlı Anı Ekle (Capture Screen)**
   - Kamera (`expo-camera`) ve galeri (`expo-image-picker`) entegrasyonu.
   - Anlık saat ve tarih damgası tag'i.
   - 1-cümlelik kısa not girişi (180 karakter sınırı ve sayaç).
   - 5 kademeli dinamik ruh hali seçici (😫 😔 😐 😊 🤩).

3. **Haftalık Özet (Analytics Screen)**
   - Haftalık ruh hali eğrisi (7 günlük dinamik bar grafiği).
   - En çok kaydedilen anılar ve etiket istatistikleri yüzdelik dökümü.
   - Haftalık içgörü tavsiye kartı.

4. **Profil & Ayarlar (Profile & Settings Screen)**
   - Kullanıcı profili, anı istatistikleri ve aktif gün serisi.
   - Karanlık / Aydınlık tema geçişi (Dark / Light mode).
   - Anıları JSON formatında dışa aktarma (yedekleme).
   - Supabase bağlantı durumu göstergesi ve Oturumu Kapatma.

---

## 🗄️ SUPABASE VERİTABANI ŞEMASI

Veritabanını Supabase projenizde kurmak için `supabase/schema.sql` dosyasındaki SQL sorgularını **Supabase Dashboard -> SQL Editor** alanında çalıştırmanız yeterlidir.

### Tablolar:
1. `profiles`: `id` (UUID references `auth.users`), `username`, `avatar_url`, `created_at`
2. `entries`: `id` (UUID), `user_id` (UUID references `profiles.id`), `image_url`, `note_text`, `timestamp`, `entry_date`, `created_at`
3. `entry_tags`: `id` (UUID), `entry_id` (UUID references `entries.id`), `tag_name`, `mood_score` (1-5)

> 🔒 **Güvenlik**: Tüm tablolarda **Row Level Security (RLS)** aktif olup, kullanıcılar yalnızca kendilerine ait verileri görebilir ve düzenleyebilir.

---

## 🚀 KURULUM VE ÇALIŞTIRMA

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Ortam değişkenlerini yapılandırın (Opsiyonel - Tanımlanmadığında uygulama Otomatik Demo Modunda çalışır):
   `.env.example` dosyasını `.env` olarak kopyalayın:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Uygulamayı başlatın:
   ```bash
   npm start
   ```

---

## 📄 LİSANS
MIT License © Arif Çınar
