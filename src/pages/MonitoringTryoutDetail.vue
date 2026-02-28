<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1 px-6 py-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-lg font-semibold">Daftar Peserta Tryout</h1>
          <p class="text-sm text-slate-500">Menampilkan peserta yang mengikuti tryout ini</p>
        </div>
      </div>

      <!-- Peserta Sedang Mengerjakan -->
      <section class="bg-white rounded-xl border overflow-x-auto mb-8">
        <div class="px-4 py-3 border-b bg-amber-50">
          <h2 class="text-sm font-semibold text-amber-700">Peserta Sedang Mengerjakan</h2>
        </div>
        <table class="w-full text-sm">
          <thead class="bg-slate-100">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Nama</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Sekolah</th>
              <th class="px-4 py-3 text-center">Mulai</th>
              <th class="px-4 py-3 text-center">Durasi</th>
              <th class="px-4 py-3 text-center">Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-6 text-center text-slate-400">Memuat data peserta...</td>
            </tr>
            <tr v-for="(item, index) in ongoingParticipants" :key="item.id" class="border-t">
              <td class="px-4 py-3">{{ index + 1 }}</td>
              <td class="px-4 py-3 font-medium">{{ item.name }}</td>
              <td class="px-4 py-3">{{ item.email ?? "-" }}</td>
              <td class="px-4 py-3">{{ item.sekolah_nama ?? "-" }}</td>
              <td class="px-4 py-3 text-center text-xs">{{ formatDate(item.mulai) }}</td>
              <td class="px-4 py-3 text-center text-xs">{{ calculateDuration(item.mulai, item.selesai) }}</td>
              <td class="px-4 py-3 text-center">
                <button @click="openDetail(item)" class="text-xs bg-slate-200 px-3 py-1 rounded hover:bg-slate-300">
                  Lihat
                </button>
              </td>
            </tr>
            <tr v-if="!loading && ongoingParticipants.length === 0">
              <td colspan="7" class="px-4 py-6 text-center text-slate-400">
                Tidak ada peserta yang sedang mengerjakan.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Peserta Sudah Selesai -->
      <section class="bg-white rounded-xl border overflow-x-auto">
        <div class="px-4 py-3 border-b bg-emerald-50">
          <h2 class="text-sm font-semibold text-emerald-700">Peserta Sudah Selesai</h2>
        </div>
        <table class="w-full text-sm">
          <thead class="bg-slate-100">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Nama</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Sekolah</th>
              <th class="px-4 py-3 text-center">Nilai</th>
              <th class="px-4 py-3 text-center">Mulai</th>
              <th class="px-4 py-3 text-center">Selesai</th>
              <th class="px-4 py-3 text-center">Durasi</th>
              <th class="px-4 py-3 text-center">Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" class="px-4 py-6 text-center text-slate-400">Memuat data peserta...</td>
            </tr>
            <tr v-for="(item, index) in finishedParticipants" :key="item.id" class="border-t">
              <td class="px-4 py-3">{{ index + 1 }}</td>
              <td class="px-4 py-3 font-medium">{{ item.name }}</td>
              <td class="px-4 py-3">{{ item.email ?? "-" }}</td>
              <td class="px-4 py-3">{{ item.sekolah_nama ?? "-" }}</td>
              <td class="px-4 py-3 text-center font-semibold">{{ item.nilai ?? "-" }}</td>
              <td class="px-4 py-3 text-center text-xs">{{ formatDate(item.mulai) }}</td>
              <td class="px-4 py-3 text-center text-xs">{{ formatDate(item.selesai) }}</td>
              <td class="px-4 py-3 text-center text-xs">{{ calculateDuration(item.mulai, item.selesai) }}</td>
              <td class="px-4 py-3 text-center">
                <button @click="openDetail(item)" class="text-xs bg-slate-200 px-3 py-1 rounded hover:bg-slate-300">
                  Lihat
                </button>
              </td>
            </tr>
            <tr v-if="!loading && finishedParticipants.length === 0">
              <td colspan="9" class="px-4 py-6 text-center text-slate-400">
                Belum ada peserta yang menyelesaikan tryout.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white w-[420px] rounded-xl p-6 relative">
          <button @click="showModal = false" class="absolute top-3 right-3 text-slate-500">✕</button>
          <h3 class="text-lg font-semibold mb-4">Detail Peserta</h3>

          <div class="space-y-2 text-sm">
            <div>
              <strong>Nama:</strong>
              {{ selectedParticipant?.name }}
            </div>
            <div>
              <strong>Email:</strong>
              {{ selectedParticipant?.email }}
            </div>
            <div>
              <strong>Sekolah:</strong>
              {{ selectedParticipant?.sekolah_nama }}
            </div>
            <div>
              <strong>WhatsApp:</strong>
              {{ selectedParticipant?.whatsapp ?? "-" }}
            </div>
            <div>
              <strong>Status:</strong>
              {{ selectedParticipant?.status }}
            </div>
            <div>
              <strong>Nilai:</strong>
              {{ selectedParticipant?.nilai ?? "-" }}
            </div>
            <div>
              <strong>Mulai:</strong>
              {{ formatDate(selectedParticipant?.mulai) }}
            </div>
            <div>
              <strong>Selesai:</strong>
              {{ formatDate(selectedParticipant?.selesai) }}
            </div>
            <div>
              <strong>Durasi:</strong>
              {{ calculateDuration(selectedParticipant?.mulai, selectedParticipant?.selesai) }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"

const participants = ref([])

const showModal = ref(false)
const selectedParticipant = ref(null)

const openDetail = (item) => {
  selectedParticipant.value = item
  showModal.value = true
}

const calculateDuration = (start, end) => {
  if (!start) return "-"
  const startTime = new Date(start)
  const endTime = end ? new Date(end) : new Date()
  const diffMs = endTime - startTime
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours > 0) {
    return `${hours}j ${remainingMinutes}m`
  }
  return `${remainingMinutes}m`
}

const ongoingParticipants = computed(() => participants.value.filter((p) => p.status === "ongoing"))

const finishedParticipants = computed(() => participants.value.filter((p) => p.status === "submitted"))

const loading = ref(true)

import { useRoute } from "vue-router"
const route = useRoute()

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

onMounted(async () => {
  const tryoutId = route.params.id
  const res = await api.get(`/monitoring-tryout/${tryoutId}`)
  participants.value = res.data
  console.log("Tes Monitoring Tryout API Response:", res.data)
  loading.value = false
})
</script>
