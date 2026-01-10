<template>
  <div class="bg-slate-100 font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN CONTENT ================= -->
      <main class="flex-1">
        <TopbarTryout></TopbarTryout>

        <!-- Content -->
        <div class="px-6 py-8">
          <!-- Filter -->
          <section class="flex flex-wrap gap-3 mb-8">
            <button class="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm">Semua</button>
            <button class="px-4 py-2 rounded-lg bg-white border text-sm">Matematika</button>
            <button class="px-4 py-2 rounded-lg bg-white border text-sm">Fisika</button>
            <button class="px-4 py-2 rounded-lg bg-white border text-sm">Kimia</button>
            <button class="px-4 py-2 rounded-lg bg-white border text-sm">Biologi</button>
            <button class="px-4 py-2 rounded-lg bg-white border text-sm">Informatika</button>
          </section>

          <!-- Tryout List -->
          <section class="grid md:grid-cols-3 gap-6">
            <!-- Card -->
            <div class="bg-white p-6 rounded-xl border">
              <span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">OSN SMA • Matematika</span>
              <h3 class="font-medium mt-3 text-slate-800">Tryout OSN Matematika #1</h3>
              <p class="text-sm text-slate-500 mt-1">30 soal • 120 menit</p>

              <span class="inline-block mt-3 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                Belum Dikerjakan
              </span>

              <RouterLink
                to="/tryout/persiapan"
                class="mt-4 block w-full text-center bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                Mulai Tryout
              </RouterLink>
            </div>

            <div class="bg-white p-6 rounded-xl border">
              <span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">OSN SMA • Fisika</span>
              <h3 class="font-medium mt-3 text-slate-800">Tryout OSN Fisika #1</h3>
              <p class="text-sm text-slate-500 mt-1">30 soal • 120 menit</p>

              <span class="inline-block mt-3 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Selesai</span>
              <RouterLink
                to="/tryout/hasil/ini"
                class="mt-4 block w-full text-center border border-indigo-500 text-indigo-500 py-2 rounded-lg hover:bg-indigo-500 hover:text-white"
              >
                Lihat Hasil
              </RouterLink>
            </div>

            <div class="bg-white p-6 rounded-xl border">
              <span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">OSN SMA • Kimia</span>
              <h3 class="font-medium mt-3 text-slate-800">Tryout OSN Kimia #1</h3>
              <p class="text-sm text-slate-500 mt-1">30 soal • 120 menit</p>

              <span class="inline-block mt-3 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Sedang Berjalan</span>

              <button class="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-700">
                Lanjutkan
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router"

import Sidebar from "../components/layout/Sidebar.vue"
import TopbarTryout from "../components/layout/TopbarTryout.vue"
</script>
