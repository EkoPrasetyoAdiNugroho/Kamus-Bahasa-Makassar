# Balla' Bahasa - Kamus Digital Bahasa Makassar

**Balla' Bahasa** (Rumah Bahasa) adalah aplikasi kamus digital modern yang dirancang untuk melestarikan dan memudahkan pembelajaran Bahasa Makassar. Aplikasi ini menyediakan terjemahan Indonesia - Makassar (dan sebaliknya), dilengkapi dengan aksara Lontara, kelas kata, dan fitur pencarian cerdas.

## 🌟 Fitur Utama

- **Pencarian Cerdas**: Mendukung algoritma *Naive String Matching* dan *Knuth-Morris-Pratt (KMP)* untuk hasil pencarian yang cepat dan akurat.
- **Data Lengkap**: Database berisi ratusan kosakata Makassar, lengkap dengan terjemahan, kelas kata (Kata Benda, Kerja, Sifat, dll), dan Aksara Lontara.
- **Aksara Lontara**: Menampilkan penulisan Lontara asli untuk setiap kata daerah.
- **Statistik & Eksplorasi**: Fitur "Dictionary Explorer" untuk menjelajahi kosa kata berdasarkan Abjad, Aksara Lontara, atau Kelas Kata.
- **Riwayat Pencarian**: Melacak kata-kata yang baru saja Anda cari untuk akses cepat.
- **Desain Modern**: Antarmuka yang responsif, bersih, dan mudah digunakan (User Friendly).

## 🚀 Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3 (Modern Variables & Flexbox), JavaScript (Vanilla).
- **Backend**: Node.js, Express.js.
- **Data**: JSON Database.
- **Tools**: Nodemon (Development).

## 📦 Cara Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di komputer Anda:

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/EkoPrasetyoAdiNugroho/Kamus-Bahasa-Makassar.git]
    cd Kamus Bhs daerah
    ```

2.  **Install Dependencies**
    Pastikan Anda sudah menginstall [Node.js](https://nodejs.org/).
    ```bash
    npm install
    ```

3.  **Jalankan Aplikasi**
    Mode Development (Auto-reload):
    ```bash
    npm run dev
    ```
    Atau Mode Production:
    ```bash
    npm start
    ```

4.  **Buka Browser**
    Akses aplikasi di: [http://localhost:3000](http://localhost:3000)

## 📂 Struktur Folder

```
balla-bahasa/
├── public/             # File statis (HTML, CSS, JS Frontend)
│   ├── assets/         # Gambar, Font, CSS Layouts
│   ├── script.js       # Logika Frontend
│   └── index.html      # Halaman Utama
├── src/                # Kode Backend
│   ├── algorithms/     # Implementasi Algoritma (Naive, KMP)
│   ├── controllers/    # Logika Pencarian & API
│   ├── routes/         # Routing API Express
│   └── app.js          # Setup Express App
├── data/               # Database
│   └── dictionary.json # Data Kamus (JSON)
├── server.js           # Entry Point Server
└── README.md           # Dokumentasi Project
```

## 👨‍💻 Pengembang

Dikembangkan sebagai proyek untuk pembelajaran dan pelestarian budaya.

---
*© 2026 Balla' Bahasa. All Rights Reserved.*

