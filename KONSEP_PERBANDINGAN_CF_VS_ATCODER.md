# Perbandingan Integrasi: Codeforces vs AtCoder untuk NLS-OSN

Dokumen ini membandingkan dua platform *Online Judge* terbesar di dunia sebagai basis data soal dan sistem penilaian (*judging*) untuk platform NLS-OSN.

## 1. Tabel Perbandingan Cepat

| Fitur | Codeforces (CF) | AtCoder (AC) |
| :--- | :--- | :--- |
| **Status API** | **Resmi** & Sangat Dokumentatif. | **Tidak Resmi** (Rerespons pada Komunitas). |
| **Stabilitas** | Tinggi (Jarang ada perubahan *breaking*). | Sedang (Tergantung pada maintenance proyek `kenkoooo`). |
| **Gaya Soal** | Kreatif, *Ad-Hoc*, Matematika. | Edukatif, Algoritma Standar, Terstruktur. |
| **Dukungan Subtask** | Jarang (Biasanya versi *Easy/Hard*). | **Native** (Sangat sesuai format OSN/IOI). |
| **Limit API** | 5 request / detik. | ~1 request / detik (rekomendasi komunitas). |
| **Bahasa Pengantar** | Inggris / Rusia. | Jepang / Inggris. |

---

## 2. Analisis Mendalam

### A. Codeforces
**Kelebihan:**
*   **Keamanan Teknis**: Karena memiliki API resmi, integrasi dengan Laravel di `nls-osn-api` jauh lebih aman dan stabil.
*   **Database Raksasa**: Memiliki ribuan soal dari berbagai tingkat kesulitan (Div 1, 2, 3, 4).
*   **Popularitas**: Hampir semua calon peserta OSN sudah familiar dengan UI dan sistem Codeforces.

**Kekurangan:**
*   **Format Skor**: Tidak selalu memiliki *partial scoring* (subtask) seperti di OSN sebenarnya. Seringkali menggunakan sistem *penalty* waktu yang berbeda dengan IOI.

### B. AtCoder
**Kelebihan:**
*   **Pedagogi & Kurikulum**: Seri *AtCoder Beginner Contest* (ABC) sangat cocok untuk kurikulum belajar pemrograman dari nol hingga mahir.
*   **Format IOI**: Banyak soal AtCoder yang menggunakan subtasks, sangat mirip dengan apa yang akan ditemui peserta di OSN Informatika sebenarnya.
*   **Clean Code**: Solusi AtCoder biasanya lebih fokus pada implementasi algoritma yang bersih daripada trik-trik aneh.

**Kekurangan:**
*   **Ketergantungan Pihak Ketiga**: Karena tidak ada API resmi, jika website AtCoder berubah strukturnya, integrasi NLS bisa terganggu hingga komunitas memperbarui API mereka (`AtCoder Problems`).

---

## 3. Rekomendasi untuk NLS-OSN

Mengingat target audiens adalah **Peserta OSN Informatika**, berikut adalah rekomendasi strategi:

1.  **Gunakan Codeforces sebagai Infrastruktur Utama**:
    Karena stabilitas API-nya, gunakan Codeforces untuk fitur "Tryout Akbar" atau kontes yang membutuhkan reliabilitas tinggi.
2.  **Gunakan AtCoder untuk Materi Latihan (Bank Soal)**:
    Soal-soal AtCoder sangat bagus untuk latihan topik spesifik (seperti DP, Greedy, Graph). Admin bisa menyalin deskripsi soal AtCoder ke NLS dan memverifikasi hasilnya manual atau menggunakan API komunitas jika diperlukan.
3.  **Hybrid Approach**:
    Desain database di `nls-osn-api` agar fleksibel menyimpan ID dari berbagai platform (misal: kolom `external_source` bisa berisi `codeforces` atau `atcoder`).

---

## 4. Kesimpulan Akhir
*   **Pilih Codeforces jika**: Anda mengutamakan **stabilitas sistem** dan kemudahan integrasi backend.
*   **Pilih AtCoder jika**: Anda mengutamakan **kualitas edukasi soal** yang selaras dengan format teknis olimpiade (subtasks).

---
*Dibuat oleh AI Assistant - Antigravity*
