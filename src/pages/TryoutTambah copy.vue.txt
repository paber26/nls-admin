<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <!-- TOPBAR -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Buat Tryout Baru</h1>
            <p class="text-sm text-slate-500">Konfigurasi awal tryout sebelum ditambahkan soal</p>
          </div>

          <RouterLink to="/tryout" class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100">← Kembali</RouterLink>
        </header>

        <!-- CONTENT -->
        <div class="px-6 py-6 w-full">
          <form class="space-y-6">
            <!-- INFORMASI UTAMA -->
            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Nama Tryout</label>
                <input
                  type="text"
                  class="w-full mt-1 px-4 py-2 border rounded-lg"
                  placeholder="Contoh: Tryout KSN Matematika #1"
                />
              </div>

              <div>
                <label class="text-sm text-slate-500">Kategori</label>
                <select class="w-full mt-1 px-4 py-2 border rounded-lg">
                  <option>KSN SMA</option>
                  <option>OSN SMA</option>
                  <option>Simulasi Nasional</option>
                  <option>Tryout Sekolah</option>
                </select>
              </div>

              <div>
                <label class="text-sm text-slate-500">Mata Pelajaran</label>
                <select class="w-full mt-1 px-4 py-2 border rounded-lg">
                  <option>Matematika</option>
                  <option>Fisika</option>
                  <option>Kimia</option>
                  <option>Biologi</option>
                  <option>Informatika</option>
                  <option>Astronomi</option>
                  <option>Ekonomi</option>
                  <option>Geografi</option>
                  <option>Kebumian</option>
                </select>
              </div>

              <div>
                <label class="text-sm text-slate-500">Durasi (menit)</label>
                <input type="number" class="w-full mt-1 px-4 py-2 border rounded-lg" placeholder="Contoh: 120" />
              </div>
            </section>

            <!-- JADWAL -->
            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Tanggal Mulai</label>
                <input type="date" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Tanggal Selesai</label>
                <input type="date" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Waktu Mulai</label>
                <input type="time" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Waktu Selesai</label>
                <input type="time" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>
            </section>

            <!-- PENGATURAN -->
            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-3 gap-6 text-sm">
              <div class="flex items-center gap-3">
                <input type="checkbox" class="w-4 h-4" />
                <label>Acak Urutan Soal</label>
              </div>

              <div class="flex items-center gap-3">
                <input type="checkbox" class="w-4 h-4" />
                <label>Acak Pilihan Jawaban</label>
              </div>

              <div class="flex items-center gap-3">
                <input type="checkbox" class="w-4 h-4" />
                <label>Tampilkan Pembahasan Setelah Selesai</label>
              </div>
            </section>

            <!-- ACTION -->
            <section class="flex gap-4">
              <button
                type="submit"
                class="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-indigo-700"
              >
                Simpan & Lanjutkan
              </button>

              <a href="admin-tryout.html" class="px-6 py-3 rounded-lg border hover:bg-slate-100">
                Simpan sebagai Draft
              </a>
            </section>
          </form>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import Sidebar from "../components/layout/Sidebar.vue"
</script>
