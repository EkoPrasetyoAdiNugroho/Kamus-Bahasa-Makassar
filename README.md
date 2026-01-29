# Aplikasi Kamus Bahasa Daerah (String Matching)
Aplikasi ini adalah sistem kamus digital yang dirancang untuk menerjemahkan bahasa (Indonesia - Daerah) menggunakan pendekatan algoritma pencarian string. Projek ini bertujuan untuk membandingkan kinerja antara algoritma **Naive String Matching** dan **Knuth-Morris-Pratt (KMP)**.
## Fitur Utama
-   **Pencarian Dua Arah**: Menerjemahkan dari Bahasa Indonesia ke Bahasa Daerah dan sebaliknya.
-   **Perbandingan Algoritma**: Pengguna dapat memilih untuk menggunakan algoritma Naive atau KMP untuk mencari kata.
-   **Metrik Komputasi**: Menampilkan detail teknis pencarian seperti:
    -   Jumlah Perbandingan (Comparisons)
    -   Indeks Kata Ditemukan
    -   Waktu Eksekusi
-   **Antarmuka Akademik Minimalis**: Desain bersih dan fokus pada fungsionalitas pencarian.
## Teknologi yang Digunakan
-   **Frontend**: HTML, CSS, JavaScript (Vanilla)
-   **Backend**: Node.js, Express.js
-   **Database**: PostgreSQL (via Neon Database)
-   **Library Tambahan**: `xlsx` (excel parsing), `cors`, `dotenv`
## Instalasi
1.  **Clone repositori ini** (atau unduh file source code):
    ```bash
    git clone <repository-url>
    ```
2.  **Masuk ke direktori projek**:
    ```bash
    cd <nama-folder-projek>
    ```
3.  **Instal dependensi**:
    ```bash
    npm install
    ```
4.  **Konfigurasi Environment**:
    Buat file `.env` dan tambahkan konfigurasi database atau port jika diperlukan (sesuaikan dengan `server.js`).
5.  **Jalankan aplikasi (Mode Development)**:
    ```bash
    npm run dev
    ```
    Atau untuk mode produksi:
    ```bash
    npm start
    ```
6.  Buka browser dan akses `http://localhost:3000` (atau port yang dikonfigurasi).
## Struktur Projek
-   `/src`: Berisi kode sumber backend dan implementasi algoritma.
-   `/public`: File statis frontend (HTML, CSS, JS).
-   `/data`: Data kamus (Excel/JSON).
---
*Dibuat untuk tugas pengembangan aplikasi berbasis web dengan algoritma String Matching.*
