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

        <button
          @click="exportToExcel"
          class="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 shadow"
        >
          Export Excel
        </button>
      </div>

      <!-- Toggle Section -->
      <div class="flex gap-3 mb-6">
        <button
          @click="showOngoing = !showOngoing"
          class="px-4 py-2 rounded-lg text-sm font-medium"
          :class="showOngoing ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'"
        >
          {{ showOngoing ? "Sembunyikan" : "Tampilkan" }} Peserta Sedang Mengerjakan
        </button>

        <button
          @click="showFinished = !showFinished"
          class="px-4 py-2 rounded-lg text-sm font-medium"
          :class="showFinished ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'"
        >
          {{ showFinished ? "Sembunyikan" : "Tampilkan" }} Peserta Sudah Selesai
        </button>
      </div>

      <!-- Peserta Sedang Mengerjakan -->
      <section v-if="showOngoing" class="bg-white rounded-xl border overflow-x-auto mb-8">
        <div class="px-4 py-3 border-b bg-amber-50">
          <h2 class="text-sm font-semibold text-amber-700">Peserta Sedang Mengerjakan</h2>
        </div>
        <table class="w-full text-sm">
          <thead class="bg-slate-100">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Nama</th>
              <th class="px-4 py-3 text-left">Sekolah</th>
              <th class="px-4 py-3 text-center">Durasi</th>
              <th class="px-4 py-3 text-center">Jawaban</th>
              <th class="px-4 py-3 text-center">Detail</th>
              <th class="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-6 text-center text-slate-400">Memuat data peserta...</td>
            </tr>
            <tr v-for="(item, index) in ongoingParticipants" :key="item.id" class="border-t">
              <td class="px-4 py-3">{{ index + 1 }}</td>
              <td class="px-4 py-3 font-medium">{{ item.name }}</td>
              <td class="px-4 py-3">{{ item.sekolah_nama ?? "-" }}</td>
              <td class="px-4 py-3 text-center text-xs">{{ calculateDuration(item.mulai, item.selesai) }}</td>
              <td class="px-4 py-3 text-center text-xs font-semibold">
                {{ item.jawaban_count ?? 0 }}
              </td>
              <td class="px-4 py-3 text-center">
                <button @click="openDetail(item)" class="text-xs bg-slate-200 px-3 py-1 rounded hover:bg-slate-300">
                  Lihat
                </button>
              </td>
              <td class="px-4 py-3 text-center">
                <button
                  @click="forceFinish(item)"
                  class="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Akhiri
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
      <section v-if="showFinished" class="bg-white rounded-xl border overflow-x-auto">
        <div class="px-4 py-3 border-b bg-emerald-50">
          <h2 class="text-sm font-semibold text-emerald-700">Peserta Sudah Selesai</h2>
        </div>
        <table class="w-full text-sm">
          <thead class="bg-slate-100">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Nama</th>
              <th class="px-4 py-3 text-left">Sekolah</th>
              <th class="px-4 py-3 text-center">Nilai</th>
              <th class="px-4 py-3 text-center">Selesai</th>
              <th class="px-4 py-3 text-center">Durasi</th>
              <th class="px-4 py-3 text-center">Jawaban</th>
              <th class="px-4 py-3 text-center">Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="px-4 py-6 text-center text-slate-400">Memuat data peserta...</td>
            </tr>
            <tr v-for="(item, index) in finishedParticipants" :key="item.id" class="border-t">
              <td class="px-4 py-3">{{ index + 1 }}</td>
              <td class="px-4 py-3 font-medium">{{ item.name }}</td>
              <td class="px-4 py-3">{{ item.sekolah_nama ?? "-" }}</td>
              <td class="px-4 py-3 text-center font-semibold">{{ item.nilai ?? "-" }}</td>
              <td class="px-4 py-3 text-center text-xs">{{ formatDate(item.selesai) }}</td>
              <td class="px-4 py-3 text-center text-xs">{{ calculateDuration(item.mulai, item.selesai) }}</td>
              <td class="px-4 py-3 text-center text-xs font-semibold">
                {{ item.jawaban_count ?? 0 }}
              </td>
              <td class="px-4 py-3 text-center">
                <button @click="openDetail(item)" class="text-xs bg-slate-200 px-3 py-1 rounded hover:bg-slate-300">
                  Lihat
                </button>
              </td>
            </tr>
            <tr v-if="!loading && finishedParticipants.length === 0">
              <td colspan="8" class="px-4 py-6 text-center text-slate-400">
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
              <strong>Jumlah Jawaban Tersimpan:</strong>
              {{ selectedParticipant?.jawaban_count ?? 0 }}
            </div>
            <div v-if="selectedParticipant?.answered_numbers?.length">
              <strong>Nomor Soal Dijawab:</strong>
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  v-for="num in selectedParticipant.answered_numbers"
                  :key="num"
                  class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                >
                  {{ num }}
                </span>
              </div>
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

      <!-- Confirm Modal -->
      <div v-if="showConfirmModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white w-[360px] rounded-xl p-6 text-center">
          <h3 class="text-lg font-semibold mb-4 text-red-600">Konfirmasi</h3>
          <p class="text-sm text-slate-600 mb-6">
            Yakin ingin mengakhiri tryout peserta
            <strong>{{ confirmTarget?.name }}</strong>
            ?
          </p>
          <div class="flex justify-center gap-3">
            <button
              @click="showConfirmModal = false"
              class="px-4 py-2 text-sm rounded-lg bg-slate-200 hover:bg-slate-300"
            >
              Batal
            </button>
            <button
              @click="confirmForceFinish"
              class="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Ya, Akhiri
            </button>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white w-[360px] rounded-xl p-6 text-center">
          <h3 class="text-lg font-semibold mb-4 text-emerald-600">Berhasil</h3>
          <p class="text-sm text-slate-600 mb-6">Tryout berhasil diakhiri.</p>
          <button
            @click="showSuccessModal = false"
            class="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"
import * as XLSX from "xlsx"

const participants = ref([])
const showOngoing = ref(true)
const showFinished = ref(true)

const showModal = ref(false)
const selectedParticipant = ref(null)

const showConfirmModal = ref(false)
const confirmTarget = ref(null)
const showSuccessModal = ref(false)

const openDetail = (item) => {
  selectedParticipant.value = item
  showModal.value = true
}

const forceFinish = (item) => {
  confirmTarget.value = item
  showConfirmModal.value = true
}

const confirmForceFinish = async () => {
  if (!confirmTarget.value) return

  try {
    console.log("Mengirim permintaan akhiri tryout untuk peserta:", confirmTarget.value.id)
    await api.post(`/monitoring-tryout/${confirmTarget.value.id}/force-finish`)
    console.log("Tryout berhasil diakhiri:", confirmTarget.value.id)

    confirmTarget.value.status = "submitted"
    confirmTarget.value.selesai = new Date().toISOString()

    showConfirmModal.value = false
    showSuccessModal.value = true
  } catch (error) {
    console.error("Gagal mengakhiri tryout:", error)
    showConfirmModal.value = false
  }
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

const exportToExcel = () => {
  const formattedData = participants.value.map((p, index) => ({
    No: index + 1,
    Nama: p.name,
    Email: p.email ?? "-",
    Sekolah: p.sekolah_nama ?? "-",
    WhatsApp: p.whatsapp ?? "-",
    Status: p.status,
    Nilai: p.nilai ?? "-",
    Mulai: formatDate(p.mulai),
    Selesai: formatDate(p.selesai),
    Durasi: calculateDuration(p.mulai, p.selesai),
    "Jumlah Jawaban": p.jawaban_count ?? 0
  }))

  const worksheet = XLSX.utils.json_to_sheet(formattedData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Monitoring Tryout")

  XLSX.writeFile(workbook, "monitoring_tryout.xlsx")
}
</script>
