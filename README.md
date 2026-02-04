# 🗺️ PetaPintar - Direktori Lokasi Interaktif

PetaPintar adalah aplikasi pemetaan modern berbasis web yang dirancang untuk mengelola dan menampilkan direktori lokasi (seperti Drop Point, Kantor, atau Rumah) secara interaktif. Dilengkapi dengan integrasi AI untuk pembuatan deskripsi otomatis dan sistem manajemen database real-time.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Fitur Utama

### 👤 Antarmuka Publik (User)
- **Peta Interaktif:** Tampilan peta full-screen menggunakan Leaflet dengan kustomisasi Pin bergaya Google Maps.
- **Pencarian & Filter:** Mencari lokasi berdasarkan nama dan menyaring berdasarkan kategori (Drop Point, Gateway, dll).
- **Detail Lokasi:** Informasi lengkap termasuk foto, pemilik, status operasional, dan jam kerja.
- **Koneksi Terdekat:** Sistem otomatis menghitung dan menampilkan 3 lokasi terdekat dari titik yang dipilih.
- **Rute Navigasi:** Tombol sekali klik untuk navigasi langsung ke Google Maps.
- **Lapor Perubahan:** Pengguna dapat menyarankan perubahan data jika ditemukan informasi yang tidak akurat.

### 🔐 Antarmuka Admin
- **Dashboard Manajemen:** CRUD (Create, Read, Update, Delete) lokasi secara real-time.
- **AI Description Generator:** Integrasi dengan **Google Gemini AI** untuk membuat deskripsi tempat secara otomatis hanya dari nama lokasi.
- **Manajemen Media:** Unggah foto lokasi langsung ke Supabase Storage.
- **Bulk Import/Export Excel:** 
  - Ekspor seluruh data ke format `.xlsx`.
  - Impor data massal dari Excel dengan **Smart Coordinate Cleaning** (menangani otomatis format koordinat yang salah seperti titik ribuan `2.572.531`).
- **Verifikasi Laporan:** Admin dapat meninjau, menerima, atau menolak laporan perubahan data dari publik.

## 🚀 Teknologi yang Digunakan

- **Frontend:** React 19, TypeScript, Tailwind CSS.
- **Peta:** Leaflet.js & React-Leaflet.
- **Backend/Database:** Supabase (PostgreSQL & Real-time Auth).
- **Storage:** Supabase Storage (untuk foto lokasi).
- **AI:** Google Gemini API (Model: gemini-2.5-flash).
- **Excel Handling:** SheetJS (XLSX).
- **Icons:** Lucide React.

## 📦 Panduan Instalasi

1. **Clone Repositori**
   ```bash
   git clone https://github.com/username/peta-pintar.git
   cd peta-pintar
   ```

2. **Konfigurasi Supabase**
   Buka file `index.html` dan cari bagian script di bawah ini. Ganti dengan kredensial dari dashboard Supabase Anda (Settings > API):
   ```javascript
   window.VITE_SUPABASE_URL = 'URL_PROJECT_ANDA';
   window.VITE_SUPABASE_ANON_KEY = 'ANON_KEY_ANDA';
   ```

3. **Konfigurasi Database**
   Buat tabel berikut di SQL Editor Supabase:
   - `locations`: Untuk menyimpan data titik koordinat.
   - `reports`: Untuk menyimpan laporan dari user.
   - Buat Bucket di Storage dengan nama `location-images` dan set menjadi **Public**.

4. **Konfigurasi AI**
   Pastikan Environment Variable `API_KEY` (Gemini API) sudah terkonfigurasi pada lingkungan deployment Anda.

## 📖 Cara Penggunaan

### Menambahkan Lokasi Baru (Admin)
1. Masuk ke halaman `/admin` dan login.
2. Klik pada peta untuk mengambil koordinat Latitude & Longitude secara otomatis.
3. Masukkan nama tempat, klik tombol **"GENERATE AI"** untuk membuat deskripsi otomatis.
4. Isi detail lainnya dan klik **Simpan**.

### Impor Data dari Excel
1. Gunakan tombol **Export Excel** untuk mendapatkan template yang benar.
2. Isi data pada file Excel tersebut.
3. Jika koordinat Anda berformat titik ribuan (Contoh: `-6.123.456`), sistem akan otomatis memperbaikinya menjadi format GPS yang benar (`-6.123456`) saat diimpor.
4. Klik **Import Excel** dan pilih file Anda.

## 🛠️ Struktur File
- `/pages`: Berisi halaman utama (Public, Admin, Login).
- `/components`: Komponen UI yang dapat digunakan kembali (MapView, Navbar, Modal).
- `/services`: Logika integrasi API (Supabase, Gemini AI).
- `/lib`: Inisialisasi library pihak ketiga.

## 📝 Lisensi & Kredit
Aplikasi ini dikembangkan oleh **TIM NM RANTAU**. 
Bebas digunakan untuk keperluan pembelajaran dengan tetap mencantumkan kredit pengembang.

---
*Dibuat dengan ❤️ untuk kemudahan pemetaan lokasi.*
