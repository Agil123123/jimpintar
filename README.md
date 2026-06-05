# Jimpitan Desa PWA — Panduan Deploy

## Struktur File
```
jimpitan-pwa/
├── index.html       ← Aplikasi utama
├── manifest.json    ← Konfigurasi PWA
├── sw.js            ← Service Worker (offline support)
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## Cara Deploy ke Hosting Gratis

### Opsi 1: Netlify Drop (Termudah, 2 menit)
1. Buka https://app.netlify.com/drop
2. Drag & drop folder `jimpitan-pwa` ke halaman tersebut
3. Netlify otomatis memberi URL seperti: https://amazing-name-123.netlify.app
4. Buka URL tersebut di HP Android → Chrome akan otomatis menawarkan "Add to Home Screen"

### Opsi 2: GitHub Pages (Gratis permanen)
1. Buat akun GitHub di https://github.com
2. Buat repository baru (misal: `jimpitan-desa`)
3. Upload semua file ke repository
4. Settings → Pages → Source: Deploy from branch → main
5. URL: https://username.github.io/jimpitan-desa

### Opsi 3: Vercel (Gratis, cepat)
1. Install Node.js dari https://nodejs.org
2. Jalankan: `npm i -g vercel`
3. Masuk ke folder: `cd jimpitan-pwa`
4. Jalankan: `vercel --prod`
5. Ikuti instruksi, URL langsung siap

## Install di Android
1. Buka URL aplikasi di Chrome Android
2. Tap menu (⋮) → "Add to Home Screen" / "Install app"
3. Aplikasi akan muncul di layar utama seperti app biasa
4. Bekerja offline setelah pertama kali dibuka!

## Setup Google Apps Script
1. Buka pengaturan aplikasi → Copy kode Apps Script
2. Buat Google Spreadsheet baru
3. Ekstensi → Apps Script → Paste kode
4. Generate API Key di pengaturan aplikasi
5. Paste key ke variabel SECRET_KEY di script
6. Deploy → New deployment → Web app → Anyone
7. Copy URL → Paste ke pengaturan aplikasi
8. Test koneksi

## Fitur Keamanan
- Setiap request ke Google Sheets dilindungi X-API-Key header
- Key tersimpan aman di localStorage perangkat
- Offline-first: data tersimpan lokal, sinkron saat ada koneksi
- Background sync: antrian otomatis sinkron ketika online kembali
