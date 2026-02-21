<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <!-- TOPBAR -->
        <header class="bg-white border-b px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Data Sekolah</h1>
          <p class="text-sm text-slate-500">Daftar sekolah dan statistik peserta</p>
        </header>

        <!-- CONTENT -->
        <div class="px-6 py-20 flex items-center justify-center bg-gradient-to-b from-white to-slate-50">
          <div class="max-w-xl w-full bg-white border border-slate-200 rounded-3xl shadow-sm p-12 text-center">
            <div
              class="w-24 h-24 mx-auto mb-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-5xl shadow-inner"
            >
              🏫
            </div>

            <h2 class="text-2xl font-semibold text-slate-800 mb-3">Modul Data Sekolah Sedang Dikembangkan</h2>

            <p class="text-sm text-slate-500 leading-relaxed mb-8">
              Fitur manajemen sekolah, statistik peserta, serta integrasi peringkat antar sekolah akan segera tersedia
              dalam versi berikutnya. Nantinya sistem akan menampilkan distribusi peserta, performa rata-rata, dan
              analisis berbasis data secara real-time.
            </p>

            <div class="bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-xs text-slate-500">
              🚀 Coming Soon — Statistik Sekolah & Analitik Peserta
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
import TopbarDashboard from "../components/layout/TopbarDashboard.vue"
</script>
