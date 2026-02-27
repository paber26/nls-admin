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
          <section class="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
            <select
              v-model="selectedMapel"
              @change="fetchBankSoal"
              class="px-4 py-2 border rounded-lg text-sm w-full md:w-56"
            >
              <option value="">Semua Mapel</option>
              <option value="Matematika">Matematika</option>
              <option value="Fisika">Fisika</option>
              <option value="Kimia">Kimia</option>
              <option value="Biologi">Biologi</option>
              <option value="Informatika">Informatika</option>
              <option value="Astronomi">Astronomi</option>
              <option value="Ekonomi">Ekonomi</option>
              <option value="Geografi">Geografi</option>
              <option value="Kebumian">Kebumian</option>
            </select>

            <select
              v-model="selectedStatus"
              @change="fetchBankSoal"
              class="px-4 py-2 border rounded-lg text-sm w-full md:w-40"
            >
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="aktif">Aktif</option>
            </select>

            <div class="flex items-center gap-2 text-sm">
              <span class="text-slate-500">Tampilkan:</span>
              <select
                v-model.number="perPage"
                @change="handlePerPageChange"
                class="px-3 py-2 border rounded-lg text-sm"
              >
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
                <option :value="200">200</option>
              </select>
            </div>
          </section>

          <!-- ================= TABLE PAKET ================= -->
          <section class="bg-white rounded-xl border overflow-x-auto">
            <table :key="currentPage" class="w-full text-sm">
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
                <tr v-else-if="bankSoal.length === 0">
                  <td colspan="5" class="px-4 py-8 text-center text-slate-400">
                    Belum ada soal pada kategori ini atau coba refresh
                  </td>
                </tr>

                <tr v-for="item in bankSoal" :key="item.id" class="border-t">
                  <td class="px-4 py-3">{{ item.mapel }}</td>
                  <td class="px-4 py-3 font-medium">
                    <div v-html="formatSoal(item.pertanyaan)"></div>
                  </td>
                  <td class="px-4 py-3 text-center">{{ item.pembuat }}</td>
                  <td class="px-4 py-3 text-center">{{ item.jumlah_terpakai }}</td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <RouterLink :to="`/banksoal/lihat/${item.id}`" class="text-blue-600 text-xs hover:underline">
                      Lihat
                    </RouterLink>
                    <RouterLink :to="`/banksoal/edit/${item.id}`" class="text-slate-600 text-xs hover:underline">
                      Edit
                    </RouterLink>
                    <a href="#" class="text-red-500 text-xs hover:underline">Hapus</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- ================= PAGINATION ================= -->
          <div class="flex flex-wrap gap-3 justify-between items-center mt-4 text-sm">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              ⬅ Sebelumnya
            </button>

            <span>Halaman {{ currentPage }} dari {{ lastPage }}</span>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === lastPage"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              Selanjutnya ➡
            </button>
          </div>

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
import { ref, onMounted, nextTick, watch } from "vue"
import "katex/dist/katex.min.css"
// import { api } from "@/services/api"
import api from "@/services/api"

import Sidebar from "../components/layout/Sidebar.vue"

const bankSoal = ref([])
const loading = ref(true)

const selectedMapel = ref("")
const selectedStatus = ref("")

const currentPage = ref(1)
const lastPage = ref(1)
const perPage = ref(50)

const truncate = (text, limit = 100) => {
  if (!text) return "-"

  // Jika mengandung LaTeX, jangan truncate supaya MathJax tidak error
  if (text.includes("$")) {
    return text
  }

  return text.length > limit ? text.slice(0, limit) + "..." : text
}

const formatSoal = (text, limit = 100) => {
  if (!text) return "-"

  let result = text

  // Paksa display math ($$) jadi inline math ($) khusus untuk tabel
  result = result.replace(/\$\$(.*?)\$\$/gs, "$$$1$")

  // Hilangkan newline yang bikin MathJax turun baris
  result = result.replace(/\n+/g, " ")

  // Truncate hanya jika tidak ada LaTeX
  if (!result.includes("$")) {
    return result.length > limit ? result.slice(0, limit) + "..." : result
  }

  return result
}

const fetchBankSoal = async () => {
  try {
    loading.value = true

    const params = {}
    if (selectedMapel.value) params.mapel = selectedMapel.value
    if (selectedStatus.value) params.status = selectedStatus.value

    params.page = currentPage.value
    params.per_page = perPage.value

    const res = await api.get("/banksoal", { params })
    console.log("API Bank Soal Response:", res.data)

    // Support array, normal pagination, or nested resource pagination
    if (Array.isArray(res.data)) {
      bankSoal.value = res.data
      currentPage.value = 1
      lastPage.value = 1
    } else if (Array.isArray(res.data.data)) {
      // Normal Laravel pagination
      bankSoal.value = res.data.data
      currentPage.value = res.data.current_page ?? 1
      lastPage.value = res.data.last_page ?? 1
    } else if (Array.isArray(res.data.data?.data)) {
      // Laravel Resource pagination (nested)
      bankSoal.value = res.data.data.data
      currentPage.value = res.data.data.current_page ?? 1
      lastPage.value = res.data.data.last_page ?? 1
    } else {
      bankSoal.value = []
      currentPage.value = 1
      lastPage.value = 1
    }

    await nextTick()
  } catch (error) {
    console.error("Gagal mengambil bank soal:", error)
    bankSoal.value = []
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => {
  if (page < 1 || page > lastPage.value) return
  currentPage.value = page
  fetchBankSoal()
}

const handlePerPageChange = () => {
  currentPage.value = 1
  fetchBankSoal()
}

onMounted(() => {
  fetchBankSoal()
})
</script>
