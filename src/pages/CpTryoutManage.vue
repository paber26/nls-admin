<template>
  <AppShell>
    <template #header>
      <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Kelola Soal Tryout CP</h1>
          <p class="text-sm text-slate-500">{{ packageDetail?.nama_paket || "-" }}</p>
        </div>

        <RouterLink to="/cp-tryout" class="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50">← Kembali ke Paket</RouterLink>
      </div>
    </template>

    <div class="space-y-6 p-6">
      <div v-if="successMessage" class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <section class="rounded-xl border bg-white p-4">
        <div class="mb-4 flex items-center justify-between gap-2">
          <div>
            <h2 class="text-base font-semibold text-slate-800">Daftar Soal Paket</h2>
            <p class="text-xs text-slate-500">Pilih soal untuk ditampilkan pada paket ini.</p>
          </div>
          <button
            type="button"
            class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="savingProblems"
            @click="showConfirmModal = true"
          >
            {{ savingProblems ? "Menyimpan..." : "Simpan Daftar Soal" }}
          </button>
        </div>

        <div v-if="loading" class="text-sm text-slate-500">Memuat data paket...</div>

        <div v-else class="space-y-3">
          <div v-if="!cpProblems.length" class="text-sm text-slate-500">Belum ada soal Native CP.</div>
          <label
            v-for="problem in cpProblems"
            :key="problem.id"
            class="flex items-start gap-3 rounded-lg border px-3 py-2 text-sm"
          >
            <input v-model="selectedProblemIds" :value="problem.id" type="checkbox" class="mt-0.5 h-4 w-4" />
            <span>
              <span class="font-medium">CP-{{ problem.id }} - {{ problem.title }}</span>
              <span class="block text-xs text-slate-500">Poin {{ problem.points ?? 0 }}</span>
            </span>
          </label>
        </div>
      </section>
    </div>

    <!-- Confirm Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="showConfirmModal = false"
    >
      <div class="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
        <div class="mb-4 text-center">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold text-slate-800">Simpan Daftar Soal?</h2>
          <p class="mt-2 text-sm text-slate-500">
            Apakah Anda yakin ingin menyimpan daftar soal yang telah diceklis untuk dimasukkan ke paket ini?
          </p>
        </div>

        <div class="mt-5 flex justify-center gap-3">
          <button
            type="button"
            class="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            @click="showConfirmModal = false"
          >
            Batal
          </button>
          <button
            type="button"
            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
            @click="executeSaveProblems"
          >
            Ya, Simpan
          </button>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { RouterLink, useRoute } from "vue-router"
import AppShell from "@/components/layout/AppShell.vue"
import api from "@/services/api"

const route = useRoute()

const loading = ref(false)
const savingProblems = ref(false)
const showConfirmModal = ref(false)
const packageDetail = ref(null)
const cpProblems = ref([])
const selectedProblemIds = ref([])

const successMessage = ref("")
const errorMessage = ref("")

const clearMessages = () => {
  successMessage.value = ""
  errorMessage.value = ""
}

const fetchData = async () => {
  loading.value = true
  clearMessages()
  try {
    const [packageRes, problemRes] = await Promise.all([
      api.get(`/cp-tryout-packages/${route.params.id}`),
      api.get("/cp-problems"),
    ])

    packageDetail.value = packageRes?.data?.data || null
    cpProblems.value = Array.isArray(problemRes?.data?.data) ? problemRes.data.data : []
    selectedProblemIds.value = Array.isArray(packageDetail.value?.soal)
      ? packageDetail.value.soal.map((item) => item.id)
      : []
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || "Gagal memuat data paket."
  } finally {
    loading.value = false
  }
}

const executeSaveProblems = async () => {
  showConfirmModal.value = false
  clearMessages()
  savingProblems.value = true
  try {
    await api.put(`/cp-tryout-packages/${route.params.id}/problems`, {
      problem_ids: selectedProblemIds.value,
    })
    successMessage.value = "Daftar soal paket berhasil disimpan."
    await fetchData()
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || "Gagal menyimpan daftar soal."
  } finally {
    savingProblems.value = false
  }
}

onMounted(fetchData)
</script>

