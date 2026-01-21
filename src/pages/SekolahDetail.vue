<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <!-- TOPBAR -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Detail Sekolah</h1>
            <p class="text-sm text-slate-500">SMA Negeri 1 Jakarta</p>
          </div>

          <a href="admin-sekolah.html" class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100">← Kembali</a>
        </header>

        <!-- CONTENT -->
        <div class="px-6 py-6 w-full space-y-6">
          <!-- PROFIL SEKOLAH -->
          <section class="bg-white rounded-xl border p-6 grid md:grid-cols-4 gap-6 text-sm">
            <div>
              <p class="text-slate-500">Nama Sekolah</p>
              <p class="font-medium">SMA Negeri 1 Jakarta</p>
            </div>
            <div>
              <p class="text-slate-500">Provinsi</p>
              <p class="font-medium">DKI Jakarta</p>
            </div>
            <div>
              <p class="text-slate-500">Total Peserta</p>
              <p class="font-medium">124</p>
            </div>
            <div>
              <p class="text-slate-500">Peringkat Nasional</p>
              <p class="font-medium text-indigo-600">3</p>
            </div>
          </section>

          <!-- RINGKASAN -->
          <section class="grid md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl border p-6">
              <p class="text-sm text-slate-500">Tryout Diikuti</p>
              <p class="text-3xl font-semibold text-slate-800 mt-2">18</p>
            </div>

            <div class="bg-white rounded-xl border p-6">
              <p class="text-sm text-slate-500">Rata-rata Nilai</p>
              <p class="text-3xl font-semibold text-slate-800 mt-2">78,6</p>
            </div>

            <div class="bg-white rounded-xl border p-6">
              <p class="text-sm text-slate-500">Nilai Tertinggi</p>
              <p class="text-3xl font-semibold text-emerald-600 mt-2">98</p>
            </div>
          </section>

          <!-- DAFTAR PESERTA -->
          <section class="bg-white rounded-xl border overflow-x-auto">
            <div class="p-4 border-b">
              <h3 class="font-semibold text-slate-800">Daftar Peserta</h3>
            </div>

            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-left">Nama</th>
                  <th class="px-4 py-3 text-center">Kelas</th>
                  <th class="px-4 py-3 text-center">Tryout Diikuti</th>
                  <th class="px-4 py-3 text-center">Nilai Terbaik</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr class="border-t">
                  <td class="px-4 py-3 font-medium">Budi Santoso</td>
                  <td class="px-4 py-3 text-center">XI</td>
                  <td class="px-4 py-3 text-center">12</td>
                  <td class="px-4 py-3 text-center font-semibold">98</td>
                  <td class="px-4 py-3 text-center">
                    <a href="admin-peserta.html" class="text-primary text-xs hover:underline">Lihat</a>
                  </td>
                </tr>

                <tr class="border-t bg-slate-50">
                  <td class="px-4 py-3 font-medium">Siti Aisyah</td>
                  <td class="px-4 py-3 text-center">XII</td>
                  <td class="px-4 py-3 text-center">10</td>
                  <td class="px-4 py-3 text-center font-semibold">95</td>
                  <td class="px-4 py-3 text-center">
                    <a href="admin-peserta.html" class="text-primary text-xs hover:underline">Lihat</a>
                  </td>
                </tr>

                <tr class="border-t">
                  <td class="px-4 py-3 font-medium">Andi Pratama</td>
                  <td class="px-4 py-3 text-center">XI</td>
                  <td class="px-4 py-3 text-center">8</td>
                  <td class="px-4 py-3 text-center font-semibold">92</td>
                  <td class="px-4 py-3 text-center">
                    <a href="admin-peserta.html" class="text-primary text-xs hover:underline">Lihat</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <p class="text-xs text-slate-500">
            *Data diambil dari akumulasi seluruh tryout yang diikuti peserta sekolah ini.
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
