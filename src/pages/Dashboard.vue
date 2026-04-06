<template>

    <AppShell>
    <template #header>
      <div>
          <h1 class="text-lg font-semibold text-slate-800">Dashboard Admin</h1>
          <p class="text-sm text-slate-500">Ringkasan data utama platform</p>
              </div>
    </template>

        

        <div class="px-6 py-6 space-y-6">
          <section v-if="loading" class="bg-white rounded-xl border p-8 text-center text-slate-500">
            Memuat ringkasan dashboard...
          </section>

          <section v-else class="space-y-6">
            <div
              v-if="errorMessage"
              class="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm"
            >
              {{ errorMessage }}
            </div>

            <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <article class="bg-white rounded-xl border p-4">
                <p class="text-xs text-slate-500">Total Tryout</p>
                <p class="text-2xl font-bold text-slate-800 mt-1">{{ totalTryout }}</p>
              </article>

              <article class="bg-white rounded-xl border p-4">
                <p class="text-xs text-slate-500">Tryout Aktif</p>
                <p class="text-2xl font-bold text-emerald-700 mt-1">{{ totalTryoutAktif }}</p>
              </article>

              <article class="bg-white rounded-xl border p-4">
                <p class="text-xs text-slate-500">Total Peserta</p>
                <p class="text-2xl font-bold text-indigo-700 mt-1">{{ totalPeserta }}</p>
              </article>

              <article class="bg-white rounded-xl border p-4">
                <p class="text-xs text-slate-500">Total Sekolah</p>
                <p class="text-2xl font-bold text-sky-700 mt-1">{{ totalSekolah }}</p>
              </article>
            </section>

            <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <article class="bg-white rounded-xl border p-4 lg:col-span-2">
                <h2 class="text-sm font-semibold text-slate-800 mb-3">Monitoring Aktivitas Peserta</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div class="rounded-lg border p-3 bg-amber-50">
                    <p class="text-xs text-slate-500">Sedang Mengerjakan</p>
                    <p class="text-xl font-bold text-amber-700">{{ totalSedangMengerjakan }}</p>
                  </div>
                  <div class="rounded-lg border p-3 bg-emerald-50">
                    <p class="text-xs text-slate-500">Sudah Selesai</p>
                    <p class="text-xl font-bold text-emerald-700">{{ totalSudahSelesai }}</p>
                  </div>
                  <div class="rounded-lg border p-3 bg-slate-100">
                    <p class="text-xs text-slate-500">Total Partisipasi</p>
                    <p class="text-xl font-bold text-slate-700">{{ totalPartisipasi }}</p>
                  </div>
                </div>
              </article>

              <article class="bg-white rounded-xl border p-4">
                <h2 class="text-sm font-semibold text-slate-800 mb-3">Aksi Cepat</h2>
                <div class="space-y-2">
                  <RouterLink to="/tryout" class="block text-sm px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200">
                    Kelola Tryout
                  </RouterLink>
                  <RouterLink
                    to="/monitoring-tryout"
                    class="block text-sm px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                  >
                    Monitoring Peserta
                  </RouterLink>
                  <RouterLink
                    to="/banksoal"
                    class="block text-sm px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                  >
                    Kelola Bank Soal
                  </RouterLink>
                  <RouterLink
                    to="/peserta"
                    class="block text-sm px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                  >
                    Kelola Peserta
                  </RouterLink>
                </div>
              </article>
            </section>

            <section class="bg-white rounded-xl border overflow-x-auto">
              <div class="px-4 py-3 border-b">
                <h2 class="text-sm font-semibold text-slate-800">Tryout Terbaru</h2>
              </div>
              <table class="w-full text-sm">
                <thead class="bg-slate-100">
                  <tr>
                    <th class="px-4 py-3 text-left">No</th>
                    <th class="px-4 py-3 text-left">Paket</th>
                    <th class="px-4 py-3 text-left">Mapel</th>
                    <th class="px-4 py-3 text-center">Mulai</th>
                    <th class="px-4 py-3 text-center">Selesai</th>
                    <th class="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="recentTryouts.length === 0">
                    <td colspan="6" class="px-4 py-6 text-center text-slate-400">Belum ada data tryout.</td>
                  </tr>
                  <tr v-for="(item, index) in recentTryouts" :key="item.id" class="border-t">
                    <td class="px-4 py-3">{{ index + 1 }}</td>
                    <td class="px-4 py-3 font-medium">{{ item.paket || "-" }}</td>
                    <td class="px-4 py-3">{{ item.mapel || "-" }}</td>
                    <td class="px-4 py-3 text-center">{{ formatDate(item.mulai) }}</td>
                    <td class="px-4 py-3 text-center">{{ formatDate(item.selesai) }}</td>
                    <td class="px-4 py-3 text-center">
                      <span
                        class="px-2 py-1 text-xs rounded font-medium"
                        :class="{
                          'bg-slate-200 text-slate-700': item.status === 'draft',
                          'bg-emerald-100 text-emerald-700': item.status === 'active',
                          'bg-blue-100 text-blue-700': item.status === 'finished'
                        }"
                      >
                        {{ item.status === "draft" ? "Draft" : item.status === "active" ? "Aktif" : "Selesai" }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </section>
        </div>
        </AppShell>
  
</template>

<script setup>
import AppShell from "@/components/layout/AppShell.vue"
import { computed, onMounted, ref } from "vue"
import { RouterLink } from "vue-router"
import api from "@/services/api"
import Sidebar from "../components/layout/Sidebar.vue"

const loading = ref(true)
const errorMessage = ref("")

const tryouts = ref([])
const monitoringTryouts = ref([])
const totalPeserta = ref(0)
const totalSekolah = ref(0)

const formatDate = (datetime) => {
  if (!datetime) return "-"
  const date = new Date(datetime)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

const toArray = (data) => (Array.isArray(data) ? data : [])

const totalTryout = computed(() => tryouts.value.length)
const totalTryoutAktif = computed(() => tryouts.value.filter((item) => item.status === "active").length)

const totalSedangMengerjakan = computed(() =>
  monitoringTryouts.value.reduce((sum, item) => sum + Number(item.sedang_mengerjakan ?? 0), 0)
)
const totalSudahSelesai = computed(() =>
  monitoringTryouts.value.reduce((sum, item) => sum + Number(item.sudah_selesai ?? 0), 0)
)
const totalPartisipasi = computed(() =>
  monitoringTryouts.value.reduce((sum, item) => sum + Number(item.total_peserta ?? 0), 0)
)

const recentTryouts = computed(() => {
  return [...tryouts.value]
    .sort((a, b) => new Date(b.mulai || 0) - new Date(a.mulai || 0))
    .slice(0, 6)
})

onMounted(async () => {
  loading.value = true
  errorMessage.value = ""

  try {
    const [tryoutRes, monitoringRes, pesertaRes, sekolahRes] = await Promise.all([
      api.get("/tryout"),
      api.get("/monitoring-tryout"),
      api.get("/peserta", { params: { page: 1, per_page: 1 } }),
      api.get("/sekolah")
    ])

    tryouts.value = toArray(tryoutRes.data)
    monitoringTryouts.value = toArray(monitoringRes.data)

    totalPeserta.value = Number(pesertaRes?.data?.total ?? 0)

    const sekolahData = sekolahRes?.data?.data ?? sekolahRes?.data ?? []
    totalSekolah.value = Array.isArray(sekolahData) ? sekolahData.length : Number(sekolahRes?.data?.total ?? 0)
  } catch (error) {
    console.error("Gagal memuat dashboard:", error)
    errorMessage.value = "Sebagian data dashboard gagal dimuat. Coba refresh halaman."
  } finally {
    loading.value = false
  }
})
</script>
