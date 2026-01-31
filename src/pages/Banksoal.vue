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

          <RouterLink
            to="/banksoal/tambah"
            class="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-indigo-700"
          >
            ➕ Tambah Soal
          </RouterLink>
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
                  <th class="px-4 py-3 text-left">Mapel</th>
                  <th class="px-4 py-3 text-left">Soal</th>
                  <th class="px-4 py-3 text-center">Pengentri</th>
                  <th class="px-4 py-3 text-center">Jumlah Terpakai</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="loading">
                  <td colspan="5" class="px-4 py-6 text-center text-slate-400">Memuat data...</td>
                </tr>

                <tr v-for="item in bankSoal" :key="item.id" class="border-t">
                  <td class="px-4 py-3">{{ item.mapel }}</td>
                  <td class="px-4 py-3 font-medium">{{ truncate(item.pertanyaan, 100) }}</td>
                  <td class="px-4 py-3 text-center">{{ item.pembuat }}</td>
                  <td class="px-4 py-3 text-center">{{ item.jumlah_terpakai }}</td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <RouterLink :to="`/banksoal/edit/${item.id}`" class="text-slate-600 text-xs hover:underline">
                      Edit
                    </RouterLink>
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
import { ref, onMounted } from "vue"
// import { api } from "@/services/api"
import api from "@/services/api"

import Sidebar from "../components/layout/Sidebar.vue"

const bankSoal = ref([])
const loading = ref(true)

const truncate = (text, limit = 100) => {
  if (!text) return "-"
  return text.length > limit ? text.slice(0, limit) + "..." : text
}

onMounted(async () => {
  const res = await api.get("/banksoal")
  bankSoal.value = res.data
  loading.value = false

  console.log("Bank Soal Data:", res.data)
  console.log("Loaing State:", loading.value)
})
</script>
