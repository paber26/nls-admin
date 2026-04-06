# Konsep Integrasi Codeforces di NLS-OSN

Dokumen ini menjelaskan rancangan integrasi antara **NLS-OSN** dan **Codeforces** untuk menyelenggarakan kontes Competitive Programming (CP) tanpa perlu membangun sistem *judging* sendiri.

## 1. Latar Belakang (Overview)
NLS-OSN ingin menyediakan fitur kontes yang menggunakan soal-soal berkualitas dari Codeforces. Karena Codeforces tidak mengizinkan pembuatan kontes secara otomatis melalui API, NLS-OSN akan bertindak sebagai **Leaderboard & Portal**, sementara Codeforces bertindak sebagai **Judge (Penilai)**.

## 2. Alur Kerja (Workflow)

### A. Persiapan Admin (NLS-OSN Admin)
1. Admin memilih soal di Codeforces (contoh: `A. Watermelon` dari kontes `4`, ID Problem: `4A`).
2. Di Dashboard Admin NLS, admin membuat soal baru di **Bank Soal** dan mengisi field `cf_problem_id` dengan nilai `4A`.
3. Admin menyusun soal-soal tersebut ke dalam satu paket **Tryout/Kontes**.

### B. Partisipasi Peserta (NLS-OSN User)
1. Peserta login ke NLS-OSN dan melengkapi profil mereka dengan **Codeforces Handle** (contoh: `paber26`).
2. Peserta membuka halaman kontes di NLS, membaca deskripsi soal yang sudah disalin admin.
3. Peserta mengerjakan soal dan mengunggahnya langsung ke website **Codeforces.com** (atau NLS menyediakan link langsung ke halaman submit soal tersebut).

### C. Penarikan Skor Otomatis (NLS-OSN API)
1. Sistem NLS akan memanggil Codeforces API (`user.status`) secara berkala atau saat peserta menekan tombol "Refresh Status".
2. API akan memberikan daftar pengiriman (submissions) terbaru dari handle peserta.
3. Backend NLS memfilter submission yang memiliki `problemIndex` dan `contestId` yang sesuai dengan soal kontes.
4. Jika ditemukan submission dengan verdict `OK` (Accepted), maka poin peserta di leaderboard NLS akan diperbarui secara otomatis.

---

## 3. Komponen Teknis yang Dibutuhkan

### Database Updates
- **Table `users`**: Menambahkan kolom `cf_handle` (string).
- **Table `banksoal`**: Menambahkan kolom `cf_problem_id` (string).
- **Table `jawaban_peserta`**: Menambahkan kolom `cf_submission_id` dan `verdict`.

### API Integration
- **Endpoint CF**: `https://codeforces.com/api/user.status?handle={handle}`
- **Fungsi Filter**: 
  - Mencocokkan `contestId` dan `index`.
  - Memastikan waktu submit berada dalam rentang waktu kontes NLS dimulai.

---

## 4. Keuntungan & Batasan

### Keuntungan
- **Kualitas Soal Terjamin**: Memakai bank soal kelas dunia.
- **Biaya Server Rendah**: Tidak perlu menjalankan mesin *judging* (isolator/sandbox) di server sendiri.
- **Ekosistem**: Peserta bisa melihat solusi orang lain di Codeforces setelah kontes selesai untuk pembelajaran.

### Batasan
- **Handle Mandatory**: Peserta wajib punya akun Codeforces.
- **Delay API**: Ada jeda singkat (beberapa detik) antara submit di CF dan update skor di NLS.
- **Manual Problem Statement**: Admin harus menyalin manual deskripsi soal ke NLS agar peserta tidak perlu bolak-balik antar tab secara berlebihan.

---

*Dibuat oleh AI Assistant - Antigravity*
