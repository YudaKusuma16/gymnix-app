# Product Requirements & Vision Document: Gymnix

## 1. Executive Summary & Vision Statement

**Gymnix** adalah aplikasi *mobile workout logger* dan pendamping kebugaran berbasis *cross-platform* (iOS & Android) yang dirancang untuk mengatasi friksi utama para pelaku angkat beban (*weightlifters & gym-goers*): **kompleksitas antarmuka, beban kognitif saat latihan, dan ketidakstabilan sinyal di lingkungan gym.**

### Visi Utama:
> *"Memberikan pengalaman pencatatan latihan angkat beban paling cepat, tanpa hambatan (zero-friction), mandiri tanpa koneksi internet (offline-first), serta hemat daya dengan estetika modern True Black OLED."*

Gymnix menolak tren aplikasi kebugaran modern yang dipenuhi fitur sosial non-esensial, animasi lambat, dan form pengisian bertingkat yang menghambat pengguna di tengah set latihan.

---

## 2. Target Pengguna (User Personas)

### Persona 1: "The Dedicated Lifter" (Alex Pratama, 24 tahun)
* **Karakteristik:** Rutin berlatih di gym 4–5 kali seminggu, fokus pada *progressive overload* (hipertrofi & kekuatan).
* **Pain Points:** 
  * Waktu istirahat antar set (*rest time*) sangat terbatas (60–90 detik); input yang rumit mengganggu fokus.
  * Basement gym sering tidak memiliki sinyal seluler; aplikasi berbasis cloud sering macet atau *loading spinner* berkepanjangan.
* **Kebutuhan di Gymnix:** Pencatatan beban/reps dalam hitungan detik (<10 detik per set), melihat beban sebelumnya (*previous weight*) secara instan, serta pelacakan total volume (tonase).

### Persona 2: "The Beginner Gym Enthusiast" (Nadia, 21 tahun)
* **Karakteristik:** Baru memulai latihan beban, membutuhkan panduan target kalori, template latihan siap pakai, dan pencarian gym terdekat.
* **Pain Points:** Bingung menghitung target kalori/BMR dan tidak tahu struktur split latihan.
* **Kebutuhan di Gymnix:** Onboarding yang terarah (gender, antropometri, target latihan), rekomendasi kalori otomatis, serta direktori gym yang jelas.

---

## 3. Product Scope & Functional Requirements (FR)

### Modul 1: Autentikasi & Akun
* **FR-01 (Account Management):** Pengguna dapat mendaftar (*Sign Up*) menggunakan email & password, login (*Sign In*), dan integrasi opsi Social Auth (Google & Apple).
* **FR-01.1 (Token Session):** Pengelolaan sesi aman menggunakan JWT (Access Token & Refresh Token) dengan mekanisme *silent refresh*.

### Modul 2: Onboarding Assessment (Antropometri & Target)
* **FR-02 (Step-by-Step Physical Profiling):** Wizard 4-langkah tanpa *cognitive overload*:
  1. *Gender Selection:* Penentuan basis metabolisme (Male / Female).
  2. *Physical Measurements:* Input tinggi badan (cm) dan berat badan (kg) melalui kontrol *stepper/ruler*.
  3. *Fitness Goal:* Pilihan Hypertrophy, Strength, Fat Loss, atau General Fitness.
  4. *Experience & Frequency:* Frekuensi latihan mingguan (Pemula 1-2x, Menengah 3-4x, Lanjutan 5+x).
* **FR-02.1 (Calorie & BMR Calculation):** Kalkulasi otomatis BMR menggunakan formula *Mifflin-St Jeor* dan estimasi TDEE untuk menetapkan *Daily Target Calories*.

### Modul 3: Beranda & Analisis Performa (Home Dashboard)
* **FR-03 (Today's Split Card):** Menampilkan split latihan hari ini (misal: *Push Day A*), estimasi durasi, dan daftar otot yang dilatih beserta CTA langsung *Start Session*.
* **FR-03.1 (Daily Streak System):** Melacak konsistensi latihan harian dengan badge api (`🔥 4d Streak`) yang diperbarui secara otomatis.
* **FR-03.2 (Vitals & Daily Target):** Memantau target kalori harian dan berat badan terkini dengan indikator selisih delta target (*on-track status*).
* **FR-03.3 (Weekly Volume Tonnage Bar Chart):** Visualisasi total volume mingguan ($\sum \text{Beban (kg)} \times \text{Reps}$) dalam grafik batang monokrom responsif.
* **FR-03.4 (PR Highlight):** Penanda pencapaian *Personal Record* (PR) terbaru pada gerakan tertentu.

### Modul 4: Pencatatan Latihan (Workout Logger Engine)
* **FR-04 (Quick Start Empty Workout):** Memulai sesi latihan kosong tanpa template secara instan.
* **FR-04.1 (Routine Templates Catalog):** Pemilihan template latihan terstruktur berdasarkan kategori (*Hypertrophy, Strength, Fat Loss, Bodyweight*).
* **FR-04.2 (Live Set Logging):**
  * Pencatatan nomor set, beban sebelumnya (*ghost text* / referensi beban lalu), beban saat ini (kg), repetisi, dan checklist status selesai.
  * Tambah set baru atau hapus baris set dengan gestur geser / tekan.
* **FR-04.3 (Session Summary & Volume Accumulation):** Menghitung total durasi latihan dan akumulasi tonase saat tombol *Finish Session* ditekan.

### Modul 5: Peringkat & Gamifikasi (Ranks / Leaderboard)
* **FR-05 (Leaderboard Scopes):** Menampilkan papan peringkat berdasarkan volume tonase mingguan dengan cakupan **Global** dan **Local Gym**.
* **FR-05.1 (Competitive Tiers):** Sistem tingkatan bertingkat: *Bronze, Silver, Gold, Platinum, Diamond* dengan posisi pengguna tersemat (*pinned user card*).

### Modul 6: Eksplorasi Gym (Gyms Directory)
* **FR-06 (Nearby Gyms Directory):** Menampilkan daftar pusat kebugaran terdekat lengkap dengan jarak (km), jam operasional, rating, dan fasilitas utama (*Olympic Lifting, Monolift, Sauna, 24/7*).
* **FR-06.1 (Filter & Search):** Filter cepat chip (*Nearest <3km, Open Now, Free Weights, 24/7 Access*).

### Modul 7: Profil Atlet & Pengaturan (Profile)
* **FR-07 (Athlete Profile Overview):** Menampilkan ringkasan bio, riwayat tanggal bergabung, gym tempat bernaung, statistik streak aktif, dan akses pengaturan preferensi aplikasi.

---

## 4. Non-Functional Requirements (NFR)

| ID | Kategori | Kriteria & Metrik Penerimaan |
| :--- | :--- | :--- |
| **NFR-01** | **Speed & Zero Friction** | Waktu pencatatan 1 baris set (Beban + Reps + Check) harus selesai dalam **< 10 detik**. |
| **NFR-02** | **Offline-First Resilience** | Aplikasi harus berfungsi 100% untuk pencatatan latihan tanpa koneksi internet. Tidak boleh ada pemblokiran antarmuka (*blocking loaders*) saat offline. |
| **NFR-03** | **Client Latency & Responsiveness** | Respons interaksi input lokal harus di bawah **50 ms** menggunakan *Optimistic UI Update*. |
| **NFR-04** | **Power Consumption & OLED Design** | Menggunakan latar hitam mutlak (`#000000`) untuk memanfaatkan efisiensi pemadaman piksel layar OLED/AMOLED pada ponsel pintar. |
| **NFR-05** | **Ergonomi Penggunaan Gym** | Area sentuh interaktif (*Touch Target*) minimal berukuran **48 x 48 dp** agar mudah ditekan saat tangan berkeringat atau menggunakan sarung tangan gym. |
| **NFR-06** | **Integritas Data Transaksional** | Penyelesaian sesi latihan (*Finish Session*) menggunakan transaksi atomik (ACID) untuk mencegah korupsi akumulasi tonase mingguan dan riwayat PR. |

---

## 5. Batasan & Lingkup Proyek (Out of Scope)

Untuk menjaga ketajaman dan fokus arsitektur:
1. **Tidak Ada Fitur Media Sosial Kompleks:** Tidak ada fitur feed video pendek, kolom komentar publik, atau fitur obrolan *direct messaging*.
2. **Zero External Object Storage:** Semua aset visual, ikon latihan, dan gambar anatomi dikemas secara lokal di bundle aplikasi; tidak ada streaming video instruksional resolusi tinggi dari S3 bucket eksternal.
3. **No External Hardware Requirement:** Pelacakan beban tidak membutuhkan sensor IoT eksternal atau barbell tracker pintar.
