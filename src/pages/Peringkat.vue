<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1">
      <!-- Topbar -->
      <header class="bg-white border-b px-6 py-4">
        <h1 class="text-lg font-semibold text-slate-800">Peringkat</h1>
        <p class="text-sm text-slate-500">Lihat peringkat berdasarkan hasil tryout</p>
      </header>

      <div class="px-6 py-8">
        <div v-if="loadingTryouts" class="text-center text-slate-500 py-20">Memuat daftar tryout...</div>

        <div v-else>
          <!-- LIST TRYOUT -->
          <div v-if="!selectedTryout">
            <h2 class="text-md font-semibold mb-4">Pilih Tryout</h2>
            <div class="flex items-center gap-3 mb-4">
              <span class="text-sm text-slate-600">Filter Status:</span>

              <select
                v-model="statusFilter"
                class="border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
              >
                <option value="all">Semua</option>
                <option value="active">Active</option>
                <option value="finished">Finished</option>
              </select>
            </div>

            <div v-if="tryouts.length" class="bg-white border rounded-xl overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-100">
                  <tr>
                    <th class="px-4 py-3 text-left">No</th>
                    <th class="px-4 py-3 text-left">Paket</th>
                    <th class="px-4 py-3 text-left">Mulai</th>
                    <th class="px-4 py-3 text-left">Selesai</th>
                    <th class="px-4 py-3 text-center">Status</th>
                    <th class="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in tryouts" :key="item.id" class="border-t hover:bg-slate-50 transition">
                    <td class="px-4 py-3">{{ index + 1 }}</td>
                    <td class="px-4 py-3 font-medium text-slate-800">
                      {{ item.paket }}
                    </td>
                    <td class="px-4 py-3">
                      {{ formatDate(item.mulai) }}
                    </td>
                    <td class="px-4 py-3">
                      {{ formatDate(item.selesai) }}
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span
                        class="text-xs px-3 py-1 rounded-full font-semibold"
                        :class="
                          item.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                        "
                      >
                        {{ item.status === "active" ? "Active" : "Finished" }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <button
                        @click="selectTryout(item)"
                        class="text-xs px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Lihat
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="!tryouts.length" class="text-center text-slate-400 py-20">Belum ada tryout tersedia.</div>
          </div>

          <!-- LEADERBOARD -->
          <div v-else>
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-md font-semibold">Leaderboard - {{ selectedTryout.paket }}</h2>

              <button @click="resetView" class="text-sm px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">
                Kembali
              </button>
            </div>

            <div v-if="loadingRanking" class="text-center text-slate-500 py-20">Memuat peringkat...</div>

            <div v-else>
              <!-- Top 3 -->
              <div v-if="ranking.length" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div
                  v-for="(item, index) in ranking.slice(0, 3)"
                  :key="item.user_id"
                  class="bg-white border rounded-xl p-6 text-center shadow-sm"
                >
                  <div class="text-3xl mb-2">
                    <span v-if="index === 0">🥇</span>
                    <span v-else-if="index === 1">🥈</span>
                    <span v-else>🥉</span>
                  </div>

                  <h3 class="font-semibold text-slate-800">{{ item.name }}</h3>
                  <p class="text-xs text-slate-500">{{ item.sekolah_nama }}</p>

                  <div class="mt-3 text-lg font-bold text-indigo-600">
                    {{ item.nilai }}
                  </div>
                </div>
              </div>

              <!-- Table -->
              <div v-if="ranking.length" class="bg-white border rounded-xl overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-slate-100">
                    <tr>
                      <th class="px-4 py-3 text-left">Rank</th>
                      <th class="px-4 py-3 text-left">Nama</th>
                      <th class="px-4 py-3 text-left">Sekolah</th>
                      <th class="px-4 py-3 text-center">Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in ranking" :key="item.user_id" class="border-t hover:bg-slate-50">
                      <td class="px-4 py-3 font-semibold">
                        {{ item.peringkat }}
                      </td>
                      <td class="px-4 py-3">
                        {{ item.name }}
                      </td>
                      <td class="px-4 py-3">
                        {{ item.sekolah_nama }}
                      </td>
                      <td class="px-4 py-3 text-center font-bold text-indigo-600">
                        {{ item.nilai }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-if="!ranking.length" class="text-center text-slate-400 py-20">
                Belum ada peserta yang menyelesaikan tryout ini.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import api from "@/services/api"
import Sidebar from "../components/layout/Sidebar.vue"

const tryouts = ref([])
const ranking = ref([])

const selectedTryout = ref(null)

const loadingTryouts = ref(true)
const loadingRanking = ref(false)

const statusFilter = ref("all")

const formatDate = (datetime) => {
  if (!datetime) return "-"
  const date = new Date(datetime)
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

const fetchTryouts = async () => {
  loadingTryouts.value = true
  try {
    let url = "/leaderboard/tryouts"

    if (statusFilter.value !== "all") {
      url += `?status=${statusFilter.value}`
    }

    const res = await api.get(url)
    tryouts.value = res.data
  } catch (error) {
    console.error("Gagal mengambil tryout:", error)
  } finally {
    loadingTryouts.value = false
  }
}

const selectTryout = async (item) => {
  selectedTryout.value = item
  loadingRanking.value = true

  try {
    const res = await api.get(`/leaderboard/${item.id}`)
    ranking.value = res.data
    console.log("Data leaderboard berhasil diambil:", res.data)
  } catch (error) {
    console.error("Gagal mengambil leaderboard:", error)
  } finally {
    loadingRanking.value = false
  }
}

const resetView = () => {
  selectedTryout.value = null
  ranking.value = []
}

watch(statusFilter, () => {
  fetchTryouts()
})

onMounted(fetchTryouts)
</script>
