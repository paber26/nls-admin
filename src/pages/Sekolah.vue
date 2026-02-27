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
        <div class="px-6 py-6 w-full">
          <!-- FILTER -->
          <section class="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama sekolah"
              class="px-4 py-2 border rounded-lg text-sm w-full md:w-72"
            />

            <select v-model="filterStatus" class="px-4 py-2 border rounded-lg text-sm w-full md:w-48">
              <option value="">Semua Status</option>
              <option value="Negeri">Negeri</option>
              <option value="Swasta">Swasta</option>
            </select>

            <select v-model="filterPeserta" class="px-4 py-2 border rounded-lg text-sm w-full md:w-48">
              <option value="">Semua Jumlah Peserta</option>
              <option value="ada">Sudah Ada Peserta</option>
              <option value="kosong">Belum Ada Peserta</option>
            </select>
          </section>

          <!-- TABLE SEKOLAH -->
          <section class="bg-white rounded-xl border overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-100">
                <tr>
                  <th class="px-4 py-3 text-center w-12">No</th>
                  <th class="px-4 py-3 text-left">Nama Sekolah</th>
                  <th class="px-4 py-3 text-left">Status</th>
                  <th class="px-4 py-3 text-center">Jumlah Peserta</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="loading">
                  <td colspan="5" class="px-4 py-6 text-center text-slate-500">Memuat data sekolah...</td>
                </tr>

                <tr v-for="(school, index) in sekolah" :key="school.id" class="border-t">
                  <td class="px-4 py-3 text-center">{{ index + 1 }}</td>
                  <td class="px-4 py-3 font-medium">{{ school.nama }}</td>
                  <td class="px-4 py-3">{{ school.status || "-" }}</td>
                  <td class="px-4 py-3 text-center">{{ school.jumlah_peserta || 0 }}</td>
                  <td class="px-4 py-3 text-center">
                    <RouterLink :to="`/sekolah/detail/${school.id}`" class="text-indigo-500 text-xs hover:underline">
                      Detail
                    </RouterLink>
                  </td>
                </tr>

                <tr v-if="!loading && sekolah.length === 0">
                  <td colspan="5" class="px-4 py-6 text-center text-slate-500">Belum ada data sekolah</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- INFO -->
          <p class="text-xs text-slate-500 mt-4">*Peringkat sekolah dihitung berdasarkan akumulasi nilai peserta.</p>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { RouterLink } from "vue-router"
import Sidebar from "../components/layout/Sidebar.vue"
import api from "@/services/api"

const sekolahRaw = ref([])
const sekolah = computed(() => {
  return sekolahRaw.value.filter((item) => {
    const matchSearch = item.nama.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchStatus = !filterStatus.value || item.status === filterStatus.value

    const matchPeserta =
      !filterPeserta.value ||
      (filterPeserta.value === "ada" && item.jumlah_peserta > 0) ||
      (filterPeserta.value === "kosong" && (!item.jumlah_peserta || item.jumlah_peserta === 0))

    return matchSearch && matchStatus && matchPeserta
  })
})
const loading = ref(false)

const searchQuery = ref("")
const filterStatus = ref("")
const filterPeserta = ref("")

const fetchSchools = async () => {
  loading.value = true
  try {
    const res = await api.get("/sekolah")
    sekolahRaw.value = res.data.data || res.data
    console.log("Data sekolah:", sekolahRaw.value)
  } catch (err) {
    console.error("Gagal mengambil data sekolah:", err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSchools()
})
</script>
