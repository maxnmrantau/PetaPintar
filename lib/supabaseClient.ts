
import { createClient } from '@supabase/supabase-js';

// Access global variables defined in index.html
const supabaseUrl = (window as any).VITE_SUPABASE_URL as string;
const supabaseAnonKey = (window as any).VITE_SUPABASE_ANON_KEY as string;

let client;

// Cek apakah URL masih placeholder atau tidak valid
// Ini mencegah "Layar Putih" (Crash) saat aplikasi dimuat
const isInvalidUrl = !supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL' || !supabaseUrl.startsWith('http');

if (isInvalidUrl) {
  console.error("CRITICAL: Supabase URL belum dikonfigurasi di index.html");
  
  if (typeof window !== 'undefined') {
    // Tampilkan pesan peringatan agar pengguna tahu apa yang salah
    setTimeout(() => {
        alert("⚠️ KONFIGURASI PENTING DIPERLUKAN\n\nAplikasi berjalan dalam mode terbatas karena Anda belum mengganti 'YOUR_SUPABASE_PROJECT_URL' di file index.html dengan URL Database asli Anda.\n\nSilakan edit file index.html agar data bisa disimpan.");
    }, 1000);
  }

  // Buat "Mock Client" (Klien Palsu) agar aplikasi tetap bisa dirender tanpa error fatal
  client = {
    from: () => ({
      select: async () => ({ data: [], error: null }), // Return data kosong
      insert: async () => ({ error: { message: "Database belum dikonfigurasi" } }),
      update: async () => ({ error: { message: "Database belum dikonfigurasi" } }),
      delete: async () => ({ error: { message: "Database belum dikonfigurasi" } }),
    }),
    storage: {
      from: () => ({
         upload: async () => ({ error: { message: "Storage belum dikonfigurasi" } }),
         getPublicUrl: () => ({ data: { publicUrl: "" } })
      })
    }
  } as any;

} else {
  // Jika URL valid, buat koneksi asli
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Gagal menginisialisasi Supabase:", error);
    client = {} as any;
  }
}

export const supabase = client;
