# Design System & UI/UX Specification: Gymnix

## 1. Filosofi Desain & Karakter Visual

Antarmuka **Gymnix** dirancang berdasarkan prinsip **"Hyper-Focused Functional Minimalism"**. Seluruh keputusan desain dibuat untuk mempermudah lifter saat bernapas terengah-engah di gym dan tangan dipenuhi kapur atau keringat.

### Pilar Utama Desain:
1. **OLED Pure Black Foundation (`#000000`):** Menghilangkan backlight glow, menghemat daya baterai perangkat saat digunakan di sesi latihan berjam-jam, dan memberikan kontras tajam.
2. **Restrained Monochromatic Palette with Crimson Red Accent (`#BE3144`):** Menggunakan tingkat kecerahan abu-abu gelap terstruktur (`#0A0A0A`, `#121212`, `#1F1F1F`) untuk membedakan kedalaman elemen. Warna merah tua khas Gymnix hanya digunakan untuk tindakan primer (*Call to Action*), status aktif, atau indikator penting.
3. **High Scannability & Large Numerics:** Angka beban (kg), repetisi, dan kalori ditampilkan tebal (*extrabold*) dengan ukuran besar agar dapat dibaca dari jarak 1 meter saat ponsel diletakkan di lantai gym.
4. **Ergonomi Satu Tangan (*One-Handed Thumb Zone*):** Komponen interaksi utama (tombol *Log Set*, *Lanjut*, *Start Workout*) ditempatkan di zona bawah layar (*bottom-anchored*) agar mudah dijangkau satu jempol.

---

## 2. Color Palette & Design Tokens

Token warna Gymnix didefinisikan secara tersentralisasi pada [`src/constants/theme.ts`](file:///D:/UMN/Semester%207/Mobile%20Cross%20Platform/Gymnix/Gymnix/src/constants/theme.ts) dan dikonfigurasi melalui TailwindCSS/NativeWind:

```typescript
export const GymnixColors = {
  primary: '#BE3144',       // Crimson Red - Brand Accent & Active Primary CTA
  primaryDark: '#8F1D2C',   // Deep Crimson - Pressed state / Border glow
  primaryLight: '#D84A5D',  // Light Crimson - Highlights / Badges
  background: '#000000',    // True Black OLED - Layar utama
  card: '#0A0A0A',          // Elevated Card Surface L1
  cardSecondary: '#121212', // Elevated Card Surface L2 / Pill backgrounds
  borderDark: '#1F1F1F',    // Pemisah card & list separator
  borderMuted: '#27272A',   // Border sekunder / Input unselected
  muted: '#71717A',         // Placeholder text, captions, secondary labels
  text: '#FFFFFF',          // High-contrast primary typography
} as const;
```

### Palet Semantik Tambahan (Status & Trend):
* **Success / On-Track:** Emerald Green (`#10B981`, background pill: `rgba(16, 185, 129, 0.1)`, border: `rgba(16, 185, 129, 0.2)`). Digunakan untuk indikator *READY*, selisih target berat badan (`-0.3kg`), dan tren kenaikan leaderboard (`+2`).
* **Warning / Streak Fire:** Flame Orange (`#F97316` / Emoji `🔥`).
* **Muted Neutral:** Zinc 400 (`#A1A1AA`) untuk secondary text dan icon unselected.

---

## 3. Tipografi & Skala Teks

Gymnix mengadopsi keluarga font **SF Pro Rounded** (`ui-rounded`) untuk memberikan kesan modern, tegas, namun memiliki sudut membulat yang bersahabat (*ergonomic look*).

| Level Tipografi | Size (px/pt) | Weight | Line Height | Contoh Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Hero / Large Metric** | `32px` - `36px` | 800 (ExtraBold / Black) | `40px` | Angka Kalori (`2,450 kcal`), Berat (`74.5 kg`) |
| **Display Header** | `24px` | 800 (ExtraBold) | `30px` | Header Halaman (*Workout*, *Ranks*, Judul Split) |
| **Section Title** | `18px` - `20px` | 700 (Bold) | `26px` | Judul Modul (*Quick Start*, *Weekly Volume*) |
| **Body Primary** | `14px` - `16px` | 600 (SemiBold) / 500 | `22px` | Teks tombol, nama gerakan latihan |
| **Caption / Subhead** | `12px` - `13px` | 500 (Medium) | `16px` | Deskripsi latihan, subtitle target |
| **Micro Badge** | `10px` - `11px` | 700 (Bold) / Caps | `14px` | Status split (`TODAY'S SPLIT`), badge (*24/7*, *READY*) |

---

## 4. Sistem Layout & Spacing (8pt Grid)

* **Base Grid:** Kelipatan 4px / 8px (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`).
* **Horizontal Screen Padding:** `20px` pada tab utama, `24px` pada alur Onboarding.
* **Vertical Gap Between Cards:** `16px` - `20px`.
* **Corner Radius (Border Radius):**
  * `rounded-lg` (`8px`): Tag pill latihan, status badge mini.
  * `rounded-xl` (`12px`): Input field, action buttons, icon containers.
  * `rounded-2xl` (`16px`): Primary cards (Split Card, Volume Chart, Metric Card).
  * `rounded-full` (`9999px`): Avatar atlet, pill streak, floating indicators.

---

## 5. Spesifikasi Komponen UI Modular (Core Components)

### 5.1 Button Component (`src/components/ui/button.tsx`)
Komponen tombol serbaguna dengan berbagai varian:
* **Varian `default`:** Background `#BE3144`, teks putih tebal. Digunakan untuk aksi konfirmasi utama (*Start Session*, *Lanjut*, *Sign In*).
* **Varian `outline`:** Background transparan dengan border `#1F1F1F` atau border merah tipis.
* **Varian `secondary`:** Background `#141414` dengan border `#27272A`.
* **Varian `ghost`:** Tanpa latar belakang atau border, transparan untuk tombol navigasi sekunder.
* **Ergonomi Sentuh:** Ketinggian standar `48px` - `52px` untuk memenuhi aturan NFR-05 (*minimum touch target*).

### 5.2 Input Field Component (`src/components/ui/input.tsx`)
* **Latar:** `#0A0A0A` dengan border `#27272A`.
* **Active Focus State:** Border berubah menjadi `#BE3144` dengan teks input berwarna `#FFFFFF`.
* **Placeholder:** Teks redup `#71717A`.
* **Slot Icon:** Mendukung ikon awalan (*prefix*) atau akhiran (*suffix*) seperti ikon kunci sandi dan tombol sembunyikan/tampilkan kata sandi.

### 5.3 Onboarding Header (`src/components/ui/onboarding-header.tsx`)
* **Navigasi Balik:** Tombol panah kembali (*chevron-back*) dengan area sentuh luas.
* **Progress Bar:** Baris indikator tipis dengan latar belakang `#1F1F1F` dan garis kemajuan aktif `#BE3144` proporsional sesuai langkah (`currentStep / totalSteps`).

### 5.4 Metric Card & Chart Elements
* **Dual Metrics Row:** Layout kartu ganda bersebelahan (*Calorie Target* dan *Current Weight*) dengan perataan baseline antara nilai nominal dan satuan (`kcal`, `kg`).
* **Monochrome Bar Chart:** Batang grafik volume mingguan dengan indikator aktif (`#BE3144`), indikator estimasi hari belum selesai (*dashed border* `#3F3F46`), dan hari istirahat (*Rest* `#1A1A1A`).

---

## 6. Pola Interaksi & Aksesibilitas Gym

1. **Optimistic Visual Feedback:** Saat pengguna menekan centang set pada tabel logger, centang langsung berubah menjadi merah `#BE3144` dengan micro-bounce animation tanpa menunggu proses *round-trip* jaringan.
2. **Haptic Feedback:** Setiap kali tombol pencatatan set berhasil diselesaikan, perangkat memberikan getaran ringan (*light haptic pulse*) sebagai konfirmasi taktil tanpa lifter perlu menatap layar secara terus-menerus.
3. **Contrast Compliance:** Seluruh teks utama (`#FFFFFF` di atas `#000000` / `#0A0A0A`) memiliki rasio kontras melebihi `15:1`, jauh melampaui standar WCAG AAA (7:1), menjamin keterbacaan di bawah lampu sorot gym yang silau maupun di ruangan gym remang-remang.
