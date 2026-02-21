<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN ================= -->
      <main class="flex-1">
        <!-- Topbar -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Dashboard Admin</h1>
            <p class="text-sm text-slate-500">Dashboard sedang dalam tahap pengembangan</p>
          </div>

          <div class="text-right text-sm">
            <p class="font-medium text-slate-800">Admin</p>
            <p class="text-slate-500">Super Administrator</p>
          </div>
        </header>

        <!-- Content -->
        <div class="px-6 py-8">
          <section class="bg-white rounded-2xl border p-10 text-center">
            <div class="flex justify-center mb-6">
              <div class="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <h2 class="text-2xl font-semibold text-slate-800 mb-3">Dashboard Dalam Perbaikan</h2>

            <p class="text-slate-500 mb-8">
              Fitur statistik dan ringkasan akan segera tersedia. Saat ini Anda dapat melakukan pengelolaan soal dan
              paket tryout.
            </p>

            <div class="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
              <RouterLink
                to="/banksoal"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl transition text-center"
              >
                ➕ Kelola Bank Soal
              </RouterLink>

              <RouterLink
                to="/tryout"
                class="bg-slate-800 hover:bg-slate-900 text-white px-6 py-4 rounded-xl transition text-center"
              >
                📝 Kelola Paket Tryout
              </RouterLink>
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
</script>
