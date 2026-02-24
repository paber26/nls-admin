<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN ================= -->
      <main class="flex-1">
        <!-- Topbar -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Kelola Tryout</h1>
            <p class="text-sm text-slate-500">Buat, atur, dan kelola seluruh tryout</p>
          </div>

          <!-- <Ro href="#" class="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-700"> -->
          <RouterLink
            to="/tryout/tambahpaket"
            class="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-700"
          >
            ➕ Buat Tryout
          </RouterLink>
        </header>

        <!-- Content -->
        <div class="px-6 py-6">
          <!-- ================= FILTER ================= -->
          <section class="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Cari nama tryout"
              class="px-4 py-2 border rounded-lg text-sm w-full md:w-64"
            />

            <select class="px-4 py-2 border rounded-lg text-sm w-full md:w-48">
              <option>Kategori</option>
              <option>OSN SMA</option>
              <option>KSN SMA</option>
              <option>Simulasi Nasional</option>
              <option>Tryout Sekolah</option>
            </select>

            <select class="px-4 py-2 border rounded-lg text-sm w-full md:w-40">
              <option>Mapel</option>
              <option>Matematika</option>
              <option>Fisika</option>
              <option>Kimia</option>
              <option>Biologi</option>
              <option>Informatika</option>
            </select>

            <select class="px-4 py-2 border rounded-lg text-sm w-full md:w-40">
              <option>Status</option>
              <option>Draft</option>
              <option>Aktif</option>
              <option>Selesai</option>
            </select>
          </section>

          <!-- ================= TABLE TRYOUT ================= -->
          <section class="bg-white rounded-xl border overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-left">Nama Tryout</th>
                  <th class="px-4 py-3 text-left">Kategori</th>
                  <th class="px-4 py-3 text-left">Mapel</th>
                  <th class="px-4 py-3 text-center">Soal</th>
                  <th class="px-4 py-3 text-center">Peserta</th>
                  <th class="px-4 py-3 text-center">Status</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr class="border-t">
                  <td class="px-4 py-3 font-medium">Tryout OSN Matematika #1</td>
                  <td class="px-4 py-3">OSN SMA</td>
                  <td class="px-4 py-3">Matematika</td>
                  <td class="px-4 py-3 text-center">30</td>
                  <td class="px-4 py-3 text-center">1.245</td>
                  <td class="px-4 py-3 text-center">
                    <span class="px-2 py-1 text-xs bg-emerald-100 text-emerald-600 rounded">Aktif</span>
                  </td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <RouterLink to="/tryout/detailedit" class="text-indigo-500 text-xs hover:underline">
                      Edit
                    </RouterLink>
                    <RouterLink to="/tryout/detail" class="text-slate-600 text-xs hover:underline">Detail</RouterLink>
                    <a href="#" class="text-red-500 text-xs hover:underline">Hapus</a>
                  </td>
                </tr>

                <tr class="border-t bg-slate-50">
                  <td class="px-4 py-3 font-medium">Tryout OSN Fisika #1</td>
                  <td class="px-4 py-3">OSN SMA</td>
                  <td class="px-4 py-3">Fisika</td>
                  <td class="px-4 py-3 text-center">30</td>
                  <td class="px-4 py-3 text-center">980</td>
                  <td class="px-4 py-3 text-center">
                    <span class="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">Draft</span>
                  </td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <RouterLink to="/tryout/edit" class="text-indigo-500 text-xs hover:underline">Edit</RouterLink>
                    <RouterLink to="/tryout/detail" class="text-slate-600 text-xs hover:underline">Detail</RouterLink>
                    <a href="#" class="text-red-500 text-xs hover:underline">Hapus</a>
                  </td>
                </tr>

                <tr class="border-t">
                  <td class="px-4 py-3 font-medium">Simulasi Nasional Kimia</td>
                  <td class="px-4 py-3">Simulasi Nasional</td>
                  <td class="px-4 py-3">Kimia</td>
                  <td class="px-4 py-3 text-center">40</td>
                  <td class="px-4 py-3 text-center">2.120</td>
                  <td class="px-4 py-3 text-center">
                    <span class="px-2 py-1 text-xs bg-slate-200 text-slate-700 rounded">Selesai</span>
                  </td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <RouterLink to="/tryout/detail" class="text-slate-600 text-xs hover:underline">Detail</RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- ================= PAGINATION ================= -->
          <div class="flex justify-between items-center mt-4 text-sm text-slate-600">
            <span>Menampilkan 1–10 dari 24 tryout</span>

            <div class="flex gap-2">
              <button class="px-3 py-1 border rounded">Prev</button>
              <button class="px-3 py-1 border rounded bg-indigo-500 text-white">1</button>
              <button class="px-3 py-1 border rounded">2</button>
              <button class="px-3 py-1 border rounded">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router"

import Sidebar from "../components/layout/Sidebar.vue"
import TopbarTryout from "../components/layout/TopbarTryout.vue"
</script>
