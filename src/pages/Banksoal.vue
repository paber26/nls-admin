<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN ================= -->
      <main class="flex-1">
        <!-- Topbar -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Bank Soal (Paket)</h1>
            <p class="text-sm text-slate-500">Kelola paket soal berdasarkan mata pelajaran KSN SMA</p>
          </div>

          <a href="#" class="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-indigo-700">
            ➕ Buat Paket Soal
          </a>
        </header>

        <!-- Content -->
        <div class="px-6 py-6">
          <!-- ================= FILTER ================= -->
          <section class="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-4">
            <select class="px-4 py-2 border rounded-lg text-sm w-full md:w-56">
              <option>Semua Mapel</option>
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

            <select class="px-4 py-2 border rounded-lg text-sm w-full md:w-40">
              <option>Status</option>
              <option>Draft</option>
              <option>Aktif</option>
            </select>
          </section>

          <!-- ================= TABLE PAKET ================= -->
          <section class="bg-white rounded-xl border overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-left">Nama Paket</th>
                  <th class="px-4 py-3 text-left">Mapel</th>
                  <th class="px-4 py-3 text-center">Jumlah Soal</th>
                  <th class="px-4 py-3 text-center">Status</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr class="border-t">
                  <td class="px-4 py-3 font-medium">Paket Matematika KSN #1</td>
                  <td class="px-4 py-3">Matematika</td>
                  <td class="px-4 py-3 text-center">30</td>
                  <td class="px-4 py-3 text-center">
                    <span class="px-2 py-1 text-xs bg-emerald-100 text-emerald-600 rounded">Aktif</span>
                  </td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <a href="admin-paket-detail.html" class="text-primary text-xs hover:underline">Kelola Soal</a>
                    <a href="#" class="text-slate-600 text-xs hover:underline">Edit</a>
                    <a href="#" class="text-red-500 text-xs hover:underline">Hapus</a>
                  </td>
                </tr>

                <tr class="border-t bg-slate-50">
                  <td class="px-4 py-3 font-medium">Paket Fisika KSN #1</td>
                  <td class="px-4 py-3">Fisika</td>
                  <td class="px-4 py-3 text-center">25</td>
                  <td class="px-4 py-3 text-center">
                    <span class="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">Draft</span>
                  </td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <a href="admin-paket-detail.html" class="text-primary text-xs hover:underline">Kelola Soal</a>
                    <a href="#" class="text-slate-600 text-xs hover:underline">Edit</a>
                    <a href="#" class="text-red-500 text-xs hover:underline">Hapus</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- ================= INFO ================= -->
          <p class="text-xs text-slate-500 mt-4">
            *Setiap paket soal hanya untuk satu mata pelajaran dan dapat digunakan pada satu atau beberapa tryout.
          </p>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router"

import Sidebar from "../components/layout/Sidebar.vue"
</script>
