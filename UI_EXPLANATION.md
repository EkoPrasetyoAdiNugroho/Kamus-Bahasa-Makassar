# Penjelasan Antarmuka Pengguna (User Interface)
## Aplikasi Kamus Bahasa Daerah Menggunakan String Matching

Dokumen ini berisi penjelasan mengenai elemen-elemen antarmuka pengguna (UI) yang telah dirancang untuk tujuan presentasi projek akademik.

### 1. Filosofi Desain (Design Philosophy)
Desain mengusung tema **"Academic Minimalist"** dengan fokus pada:
- **Kejelasan (Clarity)**: Penggunaan ruang putih (white space) yang cukup agar konten mudah dibaca.
- **Fokus (Focus)**: Elemen pencarian diletakkan di tengah sebagai fitur utama.
- **Hierarki Visual**: Penggunaan ukuran font dan warna yang membedakan antara judul, input, dan hasil pencarian.

### 2. Komponen Utama

#### A. Header
- **Judul & Subjudul**: Memberikan konteks langsung mengenai aplikasi dan algoritma yang digunakan (Naive & KMP).
- **Styling**: Menggunakan font serif (*Merriweather*) untuk memberikan kesan formal dan akademik.

#### B. Kartu Pencarian (Search Card)
- **Input Keyword**: Kolom teks utama untuk memasukkan kata yang dicari.
- **Pilihan Algoritma**: Dropdown untuk memilih algoritma (Naive vs KMP), memungkinkan pengguna membandingkan kinerja keduanya.
- **Arah Bahasa**: Dropdown untuk memilih arah terjemahan (Indonesia -> Daerah atau sebaliknya).
- **Tombol Clean**: Tombol aksi utama dengan warna kontras (*Academic Blue*) yang memberikan umpan balik visual saat di-hover.

#### C. Penampilan Hasil (Result Display)
- **Dinamis**: Bagian ini tersembunyi (*hidden*) secara default dan hanya muncul setelah pencarian dilakukan.
- **Layout Terstruktur**:
    - **Hasil Utama**: Kata dan Arti ditampilkan paling atas dengan ukuran font lebih besar.
    - **Detail Komputasi**: Bagian khusus yang menampilkan metrik algoritma (Jumlah Perbandingan, Index, Waktu Eksekusi) untuk keperluan analisis akademik. Dipisahkan garis horizontal untuk membedakan data pengguna umum vs data teknis.

#### D. Feedback Sistem
- **Loading State**: Spinner animasi memberikan kepastian bahwa sistem sedang memproses permintaan.
- **Error/No Result**: Pesan yang jelas muncul jika kata tidak ditemukan atau terjadi kesalahan server, menjaga pengalaman pengguna tetap baik (*User Experience*).

### 3. Implementasi Teknis
- **Responsif**: Layout menyesuaikan diri dengan ukuran layar (Mobile Friendly) menggunakan CSS Flexbox dan Grid.
- **Interaktif**: JavaScript menangani validasi input dan permintaan ke server tanpa me-reload halaman (*Single Page Application feel*).

---
*Dibuat untuk memenuhi persyaratan tugas pengembangan aplikasi berbasis web dengan algoritma String Matching.*
