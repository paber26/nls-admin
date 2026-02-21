<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN ================= -->
      <main class="flex-1">
        <!-- Topbar -->
        <header class="bg-white border-b px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Peringkat</h1>
          <p class="text-sm text-slate-500">Lihat peringkat berdasarkan hasil tryout</p>
        </header>

        <!-- Content -->
        <div class="px-6 py-16 flex items-center justify-center">
          <div class="max-w-lg w-full bg-white border rounded-2xl shadow-sm p-10 text-center">
            <div
              class="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-4xl"
            >
              🏆
            </div>

            <h2 class="text-xl font-semibold text-slate-800 mb-3">Fitur Peringkat Sedang Dikembangkan</h2>

            <p class="text-sm text-slate-500 leading-relaxed mb-6">
              Sistem peringkat nasional dan sekolah akan segera tersedia. Nantinya Anda dapat melihat posisi peserta
              berdasarkan nilai tryout secara real-time dan terintegrasi.
            </p>

            <div class="bg-slate-50 border rounded-lg px-4 py-3 text-xs text-slate-500">
              🚀 Coming Soon — Leaderboard Nasional & Sekolah
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
import TopbarPeringkat from "../components/layout/TopbarPeringkat.vue"
</script>
