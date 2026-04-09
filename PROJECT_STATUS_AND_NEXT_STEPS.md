# NLS OSN Admin - Project Status & Next Steps

Tanggal update: 2026-04-09

## Yang Sudah Dikerjakan
- Halaman Integrasi Codeforces sudah berjalan untuk admin.
- Menu baru `Tryout CP` sudah dibuat (`/cp-tryout`).
- Fitur manajemen paket CP:
  - Buat paket lewat modal popup.
  - Daftar paket + kolom `Periode`.
  - Aksi: `Kelola`, `Edit`, `Leaderboard`.
- Halaman khusus kelola soal paket:
  - Route: `/cp-tryout/:id/kelola`
  - Bisa memilih dan menyimpan soal Codeforces dalam paket.
- Modal `Edit` paket:
  - Edit nama paket, durasi, status, jadwal mulai, jadwal berakhir.

## Next Steps
- Tambah search/filter di tabel paket CP:
  - Berdasarkan nama paket, status, rentang tanggal.
- Tambah pagination di daftar paket bila data sudah banyak.
- Tambah guard UX:
  - Konfirmasi saat mengubah status ke `finished`.
  - Notifikasi jika paket active tapi belum ada soal.
- Tambah indikator ringkas di tabel:
  - Jumlah peserta yang sudah mengerjakan.
  - Update terakhir leaderboard.
- Final QA mobile:
  - Pastikan modal dan tabel tetap nyaman di layar kecil.

