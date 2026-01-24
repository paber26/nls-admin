<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <!-- TOPBAR -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Detail Peserta</h1>
            <p class="text-sm text-slate-500">Informasi lengkap peserta tryout</p>
          </div>

          <RouterLink to="/peserta" class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100">
            ← Kembali
          </RouterLink>
        </header>

        <!-- CONTENT -->
        <div class="px-6 py-6 w-full space-y-6">
          <!-- PROFIL PESERTA -->
          <section class="bg-white rounded-xl border p-6 grid md:grid-cols-4 gap-6 text-sm">
            <div>
              <p class="text-slate-500">Nama</p>
              <p class="font-medium">Budi Santoso</p>
            </div>
            <div>
              <p class="text-slate-500">Sekolah</p>
              <p class="font-medium">SMA Negeri 1 Jakarta</p>
            </div>
            <div>
              <p class="text-slate-500">Kelas</p>
              <p class="font-medium">XI</p>
            </div>
            <div>
              <p class="text-slate-500">WhatsApp</p>
              <p class="font-medium">0812xxxxxxx</p>
            </div>
            <div>
              <p class="text-slate-500">Asal Daerah</p>
              <p class="font-medium">DKI Jakarta</p>
            </div>
            <div>
              <p class="text-slate-500">Email</p>
              <p class="font-medium">budi@email.com</p>
            </div>
            <div>
              <p class="text-slate-500">Tryout Diikuti</p>
              <p class="font-medium">12</p>
            </div>
            <div>
              <p class="text-slate-500">Status Akun</p>
              <span class="px-2 py-1 text-xs bg-emerald-100 text-emerald-600 rounded">Aktif</span>
            </div>
          </section>

          <!-- RINGKASAN -->
          <section class="grid md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl border p-6">
              <p class="text-sm text-slate-500">Nilai Terbaik</p>
              <p class="text-3xl font-semibold text-emerald-600 mt-2">98</p>
            </div>

            <div class="bg-white rounded-xl border p-6">
              <p class="text-sm text-slate-500">Rata-rata Nilai</p>
              <p class="text-3xl font-semibold text-slate-800 mt-2">82,4</p>
            </div>

            <div class="bg-white rounded-xl border p-6">
              <p class="text-sm text-slate-500">Peringkat Terbaik</p>
              <p class="text-3xl font-semibold text-indigo-600 mt-2">5</p>
            </div>
          </section>

          <!-- RIWAYAT TRYOUT -->
          <section class="bg-white rounded-xl border overflow-x-auto">
            <div class="p-4 border-b">
              <h3 class="font-semibold text-slate-800">Riwayat Tryout</h3>
            </div>

            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-left">Nama Tryout</th>
                  <th class="px-4 py-3 text-center">Mapel</th>
                  <th class="px-4 py-3 text-center">Nilai</th>
                  <th class="px-4 py-3 text-center">Peringkat</th>
                  <th class="px-4 py-3 text-center">Tanggal</th>
                </tr>
              </thead>

              <tbody>
                <tr class="border-t">
                  <td class="px-4 py-3 font-medium">Tryout KSN Matematika #1</td>
                  <td class="px-4 py-3 text-center">Matematika</td>
                  <td class="px-4 py-3 text-center font-semibold">98</td>
                  <td class="px-4 py-3 text-center font-semibold">5</td>
                  <td class="px-4 py-3 text-center">15 Jan 2026</td>
                </tr>

                <tr class="border-t bg-slate-50">
                  <td class="px-4 py-3 font-medium">Tryout KSN Fisika #1</td>
                  <td class="px-4 py-3 text-center">Fisika</td>
                  <td class="px-4 py-3 text-center font-semibold">85</td>
                  <td class="px-4 py-3 text-center font-semibold">12</td>
                  <td class="px-4 py-3 text-center">12 Jan 2026</td>
                </tr>
              </tbody>
            </table>
          </section>

          <p class="text-xs text-slate-500">
            *Data ditampilkan berdasarkan seluruh tryout yang telah diselesaikan peserta.
          </p>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router"

import Sidebar from "../components/layout/Sidebar.vue"
import TopbarDashboard from "../components/layout/TopbarDashboard.vue"
</script>
