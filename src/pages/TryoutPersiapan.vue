<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- ================= MAIN ================= -->
      <main class="flex-1">
        <!-- Topbar -->
        <header class="bg-white border-b px-6 py-4">
          <h1 class="text-lg font-semibold text-slate-800">Persiapan Tryout</h1>
          <p class="text-sm text-slate-500">Harap baca ketentuan sebelum memulai tryout</p>
        </header>

        <!-- Content -->
        <div class="px-6 py-8 w-full">
          <div class="grid lg:grid-cols-3 gap-6">
            <!-- LEFT (2/3) -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Info Tryout -->
              <section class="bg-white rounded-xl border p-6">
                <span class="inline-block text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded mb-3">OSN SMA</span>
                <h2 class="text-xl font-semibold text-slate-800">Tryout OSN Matematika</h2>
                <p class="text-sm text-slate-500 mt-1">Waktu: 120 menit • Jumlah soal: 30</p>
              </section>

              <!-- Ketentuan -->
              <section class="bg-white rounded-xl border p-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">Ketentuan & Persiapan</h3>

                <ul class="space-y-4 text-sm text-slate-700">
                  <li class="flex gap-3">
                    <span class="text-primary mt-1">✔</span>
                    Gunakan
                    <b>Google Chrome versi terbaru</b>
                    untuk pengalaman terbaik.
                  </li>

                  <li class="flex gap-3">
                    <span class="text-primary mt-1">✔</span>
                    Pastikan
                    <b>koneksi internet stabil</b>
                    selama pengerjaan tryout.
                  </li>

                  <li class="flex gap-3">
                    <span class="text-primary mt-1">✔</span>
                    Siapkan
                    <b>alat tulis</b>
                    (pulpen, pensil, kertas coretan).
                  </li>

                  <li class="flex gap-3">
                    <span class="text-primary mt-1">✔</span>
                    Pastikan perangkat dalam kondisi
                    <b>baterai cukup</b>
                    .
                  </li>

                  <li class="flex gap-3">
                    <span class="text-primary mt-1">✔</span>
                    Setelah dimulai,
                    <b>waktu berjalan terus</b>
                    dan tidak bisa dihentikan.
                  </li>

                  <li class="flex gap-3">
                    <span class="text-primary mt-1">✔</span>
                    <b>Berdoa</b>
                    , kerjakan dengan
                    <b>jujur dan mandiri</b>
                    .
                  </li>
                </ul>
              </section>
            </div>

            <!-- RIGHT (1/3) -->
            <div class="space-y-6">
              <!-- Konfirmasi -->
              <section class="bg-white rounded-xl border p-6 sticky top-6">
                <label class="flex items-start gap-3 text-sm text-slate-700 mb-6">
                  <input type="checkbox" class="mt-1" />
                  <span>Saya telah membaca dan memahami seluruh ketentuan tryout.</span>
                </label>

                <div class="flex flex-col gap-3">
                  <a
                    href="tryout.html"
                    class="px-6 py-3 rounded-lg border text-center text-slate-700 hover:bg-slate-100"
                  >
                    Kembali
                  </a>

                  <a
                    href="cbt.html"
                    class="px-6 py-3 rounded-lg bg-primary text-white text-center font-semibold hover:bg-indigo-700"
                  >
                    Mulai Tryout
                  </a>
                </div>
              </section>
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
