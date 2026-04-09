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
            @click="saveSelectedProblems"
          >
            {{ savingProblems ? "Menyimpan..." : "Simpan Daftar Soal" }}
          </button>
        </div>

        <div v-if="loading" class="text-sm text-slate-500">Memuat data paket...</div>

        <div v-else class="space-y-3">
          <div v-if="!cfProblems.length" class="text-sm text-slate-500">Belum ada soal Codeforces terintegrasi.</div>
          <label
            v-for="problem in cfProblems"
            :key="problem.id"
            class="flex items-start gap-3 rounded-lg border px-3 py-2 text-sm"
          >
            <input v-model="selectedProblemIds" :value="problem.id" type="checkbox" class="mt-0.5 h-4 w-4" />
            <span>
              <span class="font-medium">{{ problem.cf_contest_id }}{{ problem.cf_index }} - {{ problem.name }}</span>
              <span class="block text-xs text-slate-500">Poin {{ problem.points ?? 0 }} • Rating {{ problem.rating ?? "-" }}</span>
            </span>
          </label>
        </div>
      </section>
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
const packageDetail = ref(null)
const cfProblems = ref([])
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
      api.get("/cf-problems"),
    ])

    packageDetail.value = packageRes?.data?.data || null
    cfProblems.value = Array.isArray(problemRes?.data?.data) ? problemRes.data.data : []
    selectedProblemIds.value = Array.isArray(packageDetail.value?.soal)
      ? packageDetail.value.soal.map((item) => item.id)
      : []
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || "Gagal memuat data paket."
  } finally {
    loading.value = false
  }
}

const saveSelectedProblems = async () => {
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

