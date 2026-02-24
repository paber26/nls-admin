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
          </section>

          <!-- ================= TABLE PAKET ================= -->
          <section class="bg-white rounded-xl border overflow-x-auto">
            <table ref="tableRef" class="w-full text-sm">
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
                    <div class="mathjax-content inline-mathjax" v-html="formatSoal(item.pertanyaan)"></div>
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
import { ref, onMounted, nextTick } from "vue"
import renderMathInElement from "katex/contrib/auto-render"
import "katex/dist/katex.min.css"
// import { api } from "@/services/api"
import api from "@/services/api"

import Sidebar from "../components/layout/Sidebar.vue"

const bankSoal = ref([])
const loading = ref(true)

const selectedMapel = ref("")
const selectedStatus = ref("")

const tableRef = ref(null)

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

    const res = await api.get("/banksoal", { params })

    // Pastikan selalu array
    bankSoal.value = Array.isArray(res.data) ? res.data : []

    await nextTick()

    // Render KaTeX dengan ref (aman untuk Vue lifecycle)
    if (bankSoal.value.length > 0 && tableRef.value) {
      try {
        // Pastikan element masih ada di DOM
        if (document.body.contains(tableRef.value)) {
          renderMathInElement(tableRef.value, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false }
            ],
            throwOnError: false
          })
        }
      } catch (e) {
        console.warn("Render KaTeX error (ignored):", e)
      }
    }
  } catch (error) {
    console.error("Gagal mengambil bank soal:", error)
    bankSoal.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBankSoal()
})
</script>
