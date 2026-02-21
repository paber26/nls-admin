<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN ================= -->
      <main class="flex-1">
        <!-- Topbar -->
        <header class="bg-white border-b px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Kelola Peserta</h1>
          <p class="text-sm text-slate-500">Daftar seluruh peserta yang terdaftar di platform</p>
        </header>

        <div class="px-6 py-16 flex items-center justify-center">
          <div class="max-w-xl w-full bg-white border rounded-2xl shadow-sm p-10 text-center">
            <div
              class="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-4xl"
            >
              👥
            </div>

            <h2 class="text-xl font-semibold text-slate-800 mb-3">Modul Kelola Peserta Sedang Dikembangkan</h2>

            <p class="text-sm text-slate-500 leading-relaxed mb-6">
              Fitur manajemen peserta seperti pencarian, filter sekolah, pengaturan status profil, dan monitoring
              aktivitas akan segera tersedia. Sistem ini akan terintegrasi langsung dengan database peserta secara
              real-time.
            </p>

            <div class="bg-slate-50 border rounded-lg px-4 py-3 text-xs text-slate-500">
              🚀 Coming Soon — Manajemen Peserta Terintegrasi
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
