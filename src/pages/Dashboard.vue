<template>
  <body class="bg-slate-100 font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN CONTENT ================= -->
      <main class="flex-1">
        <TopbarDashboard></TopbarDashboard>
        <!-- Content -->
        <div class="px-6 py-8">
          <!-- ================= SUMMARY & STATISTIK PENDAFTAR ================= -->
          <section class="grid md:grid-cols-4 gap-6 mb-10">
            <div class="bg-white p-6 rounded-xl border">
              <p class="text-sm text-slate-500">Tryout Diikuti</p>
              <h2 class="text-3xl font-semibold text-slate-800 mt-2">2</h2>
            </div>

            <div class="bg-white p-6 rounded-xl border">
              <p class="text-sm text-slate-500">Tryout Tersedia</p>
              <h2 class="text-3xl font-semibold text-slate-800 mt-2">9</h2>
            </div>

            <!-- Sekolah -->
            <div class="bg-white p-6 rounded-xl border flex items-center gap-5">
              <div class="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl">
                🏫
              </div>
              <div>
                <p class="text-sm text-slate-500">Sekolah Terdaftar</p>
                <h2 class="text-3xl font-semibold text-slate-800">128</h2>
                <p class="text-xs text-slate-400 mt-1">SMA/MA dari berbagai daerah</p>
              </div>
            </div>

            <!-- Siswa -->
            <div class="bg-white p-6 rounded-xl border flex items-center gap-5">
              <div
                class="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl"
              >
                👨‍🎓
              </div>
              <div>
                <p class="text-sm text-slate-500">Siswa Terdaftar</p>
                <h2 class="text-3xl font-semibold text-slate-800">3.462</h2>
                <p class="text-xs text-slate-400 mt-1">Peserta aktif tryout OSN & KSN</p>
              </div>
            </div>
          </section>

          <!-- Tryout -->
          <section>
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Tryout Tersedia</h3>

            <div class="grid md:grid-cols-3 gap-6">
              <div class="bg-white p-6 rounded-xl border">
                <span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">OSN SMA</span>
                <h4 class="font-medium mt-3 text-slate-800">Tryout OSN Matematika</h4>
                <p class="text-sm text-slate-500 mt-1">120 menit • 30 soal</p>
                <button class="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                  Mulai Tryout
                </button>
              </div>

              <div class="bg-white p-6 rounded-xl border">
                <span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">OSN SMA</span>
                <h4 class="font-medium mt-3 text-slate-800">Tryout OSN Fisika</h4>
                <p class="text-sm text-slate-500 mt-1">120 menit • 30 soal</p>
                <button class="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                  Mulai Tryout
                </button>
              </div>

              <div class="bg-white p-6 rounded-xl border">
                <span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">OSN SMA</span>
                <h4 class="font-medium mt-3 text-slate-800">Tryout OSN Kimia</h4>
                <p class="text-sm text-slate-500 mt-1">120 menit • 30 soal</p>
                <button class="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                  Mulai Tryout
                </button>
              </div>
            </div>
          </section>
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
