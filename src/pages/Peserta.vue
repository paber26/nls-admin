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

        <!-- Content -->
        <div class="px-6 py-6">
          <!-- ================= FILTER ================= -->
          <section class="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama / email"
              class="px-4 py-2 border rounded-lg text-sm w-full md:w-64"
            />

            <input
              v-model="filterSekolah"
              type="text"
              placeholder="Sekolah"
              class="px-4 py-2 border rounded-lg text-sm w-full md:w-56"
            />

            <select v-model="filterKelas" class="px-4 py-2 border rounded-lg text-sm w-full md:w-32">
              <option value="">Kelas</option>
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>

            <select v-model="filterStatus" class="px-4 py-2 border rounded-lg text-sm w-full md:w-40">
              <option value="">Status Profil</option>
              <option value="Lengkap">Lengkap</option>
              <option value="Belum Lengkap">Belum Lengkap</option>
            </select>

            <select
              v-model="perPage"
              @change="handlePerPageChange"
              class="px-4 py-2 border rounded-lg text-sm w-full md:w-40"
            >
              <option :value="10">10 / halaman</option>
              <option :value="20">20 / halaman</option>
              <option :value="50">50 / halaman</option>
              <option :value="100">100 / halaman</option>
              <option :value="200">200 / halaman</option>
            </select>
          </section>

          <!-- ================= TABLE ================= -->
          <section class="bg-white rounded-xl border overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-center w-12">No</th>
                  <th class="px-4 py-3 text-left">Nama</th>
                  <th class="px-4 py-3 text-left">Sekolah</th>
                  <th class="px-4 py-3 text-center">Kelas</th>
                  <th class="px-4 py-3 text-left">WhatsApp</th>
                  <th class="px-4 py-3 text-center">Status</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(peserta, index) in pesertaList" :key="peserta.id" class="border-t">
                  <td class="px-4 py-3 text-center text-slate-500">
                    {{ index + 1 }}
                  </td>
                  <td class="px-4 py-3 font-medium">
                    {{ peserta.nama_lengkap }}
                  </td>
                  <td class="px-4 py-3">
                    {{ peserta.sekolah_nama }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    {{ peserta.kelas }}
                  </td>
                  <td class="px-4 py-3">
                    {{ peserta.whatsapp }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span
                      v-if="peserta.status_profil === 'Lengkap'"
                      class="px-2 py-1 text-xs bg-emerald-100 text-emerald-600 rounded"
                    >
                      Lengkap
                    </span>
                    <span v-else class="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">Belum Lengkap</span>
                  </td>
                  <td class="px-4 py-3 text-center space-x-2">
                    <RouterLink :to="`/peserta/detail/${peserta.id}`" class="text-primary text-xs hover:underline">
                      Detail
                    </RouterLink>
                    <a href="#" class="text-red-500 text-xs hover:underline">Nonaktifkan</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- ================= PAGINATION ================= -->
          <div class="flex justify-between items-center mt-4 text-sm text-slate-600">
            <span>
              Menampilkan {{ (currentPage - 1) * perPage + 1 }}– {{ Math.min(currentPage * perPage, total) }} dari
              {{ total }} peserta
            </span>

            <div class="flex gap-2">
              <button
                class="px-3 py-1 border rounded"
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
              >
                Prev
              </button>

              <button v-if="startPage > 1" class="px-3 py-1 border rounded" @click="changePage(1)">1</button>

              <span v-if="startPage > 2" class="px-2">...</span>

              <button
                v-for="page in visiblePages"
                :key="page"
                class="px-3 py-1 border rounded"
                :class="page === currentPage ? 'bg-primary text-white' : ''"
                @click="changePage(page)"
              >
                {{ page }}
              </button>

              <span v-if="endPage < lastPage - 1" class="px-2">...</span>

              <button v-if="endPage < lastPage" class="px-3 py-1 border rounded" @click="changePage(lastPage)">
                {{ lastPage }}
              </button>

              <button
                class="px-3 py-1 border rounded"
                :disabled="currentPage === lastPage"
                @click="changePage(currentPage + 1)"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue"
import api from "@/services/api"

import Sidebar from "../components/layout/Sidebar.vue"

const pesertaList = ref([])

const searchQuery = ref("")
const filterSekolah = ref("")
const filterKelas = ref("")
const filterStatus = ref("")

const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)
const perPage = ref(10)

watch([searchQuery, filterSekolah, filterKelas, filterStatus], () => {
  currentPage.value = 1
  fetchPeserta()
})

const fetchPeserta = async () => {
  try {
    const response = await api.get("/peserta", {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value,
        sekolah: filterSekolah.value,
        kelas: filterKelas.value,
        status: filterStatus.value
      }
    })

    pesertaList.value = response.data.data
    currentPage.value = response.data.current_page
    lastPage.value = response.data.last_page
    total.value = response.data.total
  } catch (error) {
    console.error("Gagal mengambil data peserta:", error)
  }
}

const maxVisible = 5

const startPage = computed(() => {
  return Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
})

const endPage = computed(() => {
  return Math.min(lastPage.value, startPage.value + maxVisible - 1)
})

const visiblePages = computed(() => {
  const pages = []
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i)
  }
  return pages
})

const changePage = (page) => {
  if (page < 1 || page > lastPage.value) return
  currentPage.value = page
  fetchPeserta()
}

const handlePerPageChange = () => {
  currentPage.value = 1
  fetchPeserta()
}

onMounted(() => {
  fetchPeserta()
})
</script>
