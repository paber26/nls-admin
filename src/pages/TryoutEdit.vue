<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <!-- TOPBAR -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Detail Tryout</h1>
            <p class="text-sm text-slate-500">Preview soal sebelum tryout dibuka ke peserta</p>
          </div>

          <div class="flex gap-3">
            <a href="admin-tryout-soal.html" class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100">
              Kelola Soal
            </a>
            <button class="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">
              Aktifkan Tryout
            </button>
          </div>
        </header>

        <!-- CONTENT (FULL WIDTH) -->
        <div class="px-6 py-6 w-full">
          <!-- INFO TRYOUT -->
          <section class="bg-white rounded-xl border p-4 mb-6 grid md:grid-cols-5 gap-4 text-sm">
            <div>
              <p class="text-slate-500">Nama Tryout</p>
              <p class="font-medium">Tryout OSN Matematika #1</p>
            </div>
            <div>
              <p class="text-slate-500">Mapel</p>
              <p class="font-medium">Matematika</p>
            </div>
            <div>
              <p class="text-slate-500">Jumlah Soal</p>
              <p class="font-medium">30</p>
            </div>
            <div>
              <p class="text-slate-500">Durasi</p>
              <p class="font-medium">120 menit</p>
            </div>
            <div>
              <p class="text-slate-500">Status</p>
              <span class="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">Draft</span>
            </div>
          </section>

          <!-- PREVIEW SOAL (1 KOLOM FULL WIDTH) -->
          <section class="space-y-6">
            <!-- SOAL 1 -->
            <div class="bg-white rounded-xl border p-6">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-semibold">
                  Soal 1
                  <span class="text-xs text-slate-500">(Pilihan Ganda)</span>
                </h3>
                <span class="text-xs bg-slate-100 px-2 py-1 rounded">Kunci: C</span>
              </div>

              <p class="mb-4 leading-relaxed">Jika diketahui f(x) = 2x² − 3x + 1, maka nilai f(3) adalah …</p>

              <ul class="space-y-2 text-sm">
                <li>A. 4</li>
                <li>B. 7</li>
                <li class="font-semibold text-emerald-600">C. 10</li>
                <li>D. 13</li>
                <li>E. 16</li>
              </ul>

              <div class="mt-4 p-4 bg-slate-50 rounded-lg text-sm">
                <p class="font-medium mb-1">Pembahasan:</p>
                Substitusi x = 3 ke fungsi f(x), diperoleh nilai f(3) = 10.
              </div>
            </div>

            <!-- SOAL 2 -->
            <div class="bg-white rounded-xl border p-6">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-semibold">
                  Soal 2
                  <span class="text-xs text-slate-500">(Isian Singkat)</span>
                </h3>
                <span class="text-xs bg-slate-100 px-2 py-1 rounded">Jawaban: 12</span>
              </div>

              <p class="mb-4 leading-relaxed">Hitunglah nilai dari 3 × (4 + 2).</p>

              <div class="mt-4 p-4 bg-slate-50 rounded-lg text-sm">
                <p class="font-medium mb-1">Pembahasan:</p>
                Operasi di dalam kurung terlebih dahulu, sehingga 3 × 6 = 12.
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
</script>
