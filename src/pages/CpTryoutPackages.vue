<template>
  <AppShell>
    <template #header>
      <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Tryout CP Paket</h1>
          <p class="text-sm text-slate-500">
            Buat paket Competitive Programming dari soal Codeforces, atur waktu, dan monitor leaderboard.
          </p>
        </div>
      </div>
    </template>

    <div class="space-y-6 p-6">
      <div v-if="successMessage" class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <section class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="xl:col-span-2 rounded-xl border bg-white">
          <div class="border-b bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Daftar Paket CP</div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-100 text-slate-700">
                <tr>
                  <th class="px-4 py-3 text-left">Paket</th>
                  <th class="px-4 py-3 text-center">Durasi</th>
                  <th class="px-4 py-3 text-center">Soal</th>
                  <th class="px-4 py-3 text-center">Status</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loadingPackages">
                  <td colspan="5" class="px-4 py-6 text-center text-slate-400">Memuat paket...</td>
                </tr>
                <tr v-for="item in packages" :key="item.id" class="border-t">
                  <td class="px-4 py-3 font-medium">{{ item.nama_paket }}</td>
                  <td class="px-4 py-3 text-center">{{ item.durasi_menit }} menit</td>
                  <td class="px-4 py-3 text-center">{{ item.jumlah_soal }}</td>
                  <td class="px-4 py-3 text-center">
                    <span
                      class="rounded px-2 py-1 text-xs font-medium"
                      :class="{
                        'bg-slate-200 text-slate-700': item.status === 'draft',
                        'bg-emerald-100 text-emerald-700': item.status === 'active',
                        'bg-blue-100 text-blue-700': item.status === 'finished'
                      }"
                    >
                      {{ prettyStatus(item.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button type="button" class="text-indigo-600 hover:underline cursor-pointer" @click="selectPackage(item.id)">
                      Kelola
                    </button>
                  </td>
                </tr>
                <tr v-if="!loadingPackages && !packages.length">
                  <td colspan="5" class="px-4 py-8 text-center text-slate-400">Belum ada paket CP.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-4">
          <h2 class="text-base font-semibold text-slate-800">{{ selectedPackageId ? "Edit Paket CP" : "Buat Paket CP" }}</h2>
          <form class="mt-4 space-y-4" @submit.prevent="savePackage">
            <div>
              <label class="text-sm text-slate-600">Nama Paket</label>
              <input v-model="form.nama_paket" type="text" class="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="text-sm text-slate-600">Durasi (menit)</label>
              <input v-model.number="form.durasi_menit" type="number" min="1" class="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="text-sm text-slate-600">Mulai</label>
              <input v-model="form.mulai" type="datetime-local" class="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="text-sm text-slate-600">Selesai</label>
              <input v-model="form.selesai" type="datetime-local" class="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="text-sm text-slate-600">Status</label>
              <select v-model="form.status" class="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
                <option value="draft">Draft</option>
                <option value="active">Aktif</option>
                <option value="finished">Selesai</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer">
                {{ selectedPackageId ? "Update Paket" : "Buat Paket" }}
              </button>
              <button
                v-if="selectedPackageId"
                type="button"
                class="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                @click="resetForm"
              >
                Paket Baru
              </button>
            </div>
          </form>
        </div>
      </section>

      <section class="rounded-xl border bg-white p-4">
        <div class="mb-4 flex items-center justify-between gap-2">
          <h2 class="text-base font-semibold text-slate-800">Soal Dalam Paket</h2>
          <button
            type="button"
            class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="!selectedPackageId || savingProblems"
            @click="saveSelectedProblems"
          >
            {{ savingProblems ? "Menyimpan..." : "Simpan Daftar Soal" }}
          </button>
        </div>

        <div v-if="!selectedPackageId" class="rounded-lg border border-dashed px-4 py-6 text-sm text-slate-500">
          Pilih paket dulu untuk menambahkan soal.
        </div>

        <div v-else class="space-y-3">
          <div v-if="loadingProblems" class="text-sm text-slate-500">Memuat soal Codeforces...</div>
          <div v-else-if="!cfProblems.length" class="text-sm text-slate-500">Belum ada soal Codeforces terintegrasi.</div>
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

      <section class="rounded-xl border bg-white">
        <div class="flex items-center justify-between border-b bg-slate-50 px-4 py-3">
          <h2 class="text-base font-semibold text-slate-700">Leaderboard Paket CP</h2>
          <button
            type="button"
            class="text-sm text-indigo-600 hover:underline cursor-pointer disabled:cursor-not-allowed disabled:text-slate-400"
            :disabled="!selectedPackageId || loadingLeaderboard"
            @click="fetchLeaderboard"
          >
            Refresh
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-100 text-slate-700">
              <tr>
                <th class="px-4 py-3 text-center">Rank</th>
                <th class="px-4 py-3 text-left">Nama</th>
                <th class="px-4 py-3 text-left">Handle</th>
                <th class="px-4 py-3 text-center">Solved</th>
                <th class="px-4 py-3 text-center">Poin</th>
                <th class="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingLeaderboard">
                <td colspan="6" class="px-4 py-6 text-center text-slate-400">Memuat leaderboard...</td>
              </tr>
              <tr v-for="item in leaderboardRows" :key="item.user_id" class="border-t">
                <td class="px-4 py-3 text-center font-semibold">{{ item.rank }}</td>
                <td class="px-4 py-3">
                  <div class="font-medium">{{ item.name }}</div>
                  <div class="text-xs text-slate-500">{{ item.school || "-" }}</div>
                </td>
                <td class="px-4 py-3">{{ item.cf_handle || "-" }}</td>
                <td class="px-4 py-3 text-center">{{ item.solved_count }}</td>
                <td class="px-4 py-3 text-center font-medium">{{ item.total_points }}</td>
                <td class="px-4 py-3 text-center">
                  <span
                    class="rounded px-2 py-1 text-xs font-medium"
                    :class="
                      item.status_pengerjaan === 'sudah_mengerjakan'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-700'
                    "
                  >
                    {{ item.status_pengerjaan === "sudah_mengerjakan" ? "Sudah Mengerjakan" : "Belum Mengerjakan" }}
                  </span>
                </td>
              </tr>
              <tr v-if="!loadingLeaderboard && !leaderboardRows.length">
                <td colspan="6" class="px-4 py-8 text-center text-slate-400">
                  {{ selectedPackageId ? "Belum ada peserta yang mengerjakan soal pada paket ini." : "Pilih paket untuk melihat leaderboard." }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </AppShell>
</template>

<script setup>
import { onMounted, ref } from "vue"
import AppShell from "@/components/layout/AppShell.vue"
import api from "@/services/api"

const packages = ref([])
const cfProblems = ref([])
const leaderboardRows = ref([])
const selectedProblemIds = ref([])
const selectedPackageId = ref(null)

const loadingPackages = ref(false)
const loadingProblems = ref(false)
const loadingLeaderboard = ref(false)
const savingProblems = ref(false)

const successMessage = ref("")
const errorMessage = ref("")

const form = ref({
  nama_paket: "",
  durasi_menit: 120,
  mulai: "",
  selesai: "",
  status: "draft",
})

const toDateTimePayload = (value) => {
  if (!value) return null
  return value.length === 16 ? `${value}:00` : value
}

const toDateTimeInput = (value) => {
  if (!value) return ""
  return value.slice(0, 16)
}

const prettyStatus = (status) => {
  if (status === "active") return "Aktif"
  if (status === "finished") return "Selesai"
  return "Draft"
}

const clearMessages = () => {
  successMessage.value = ""
  errorMessage.value = ""
}

const fetchPackages = async () => {
  loadingPackages.value = true
  try {
    const { data } = await api.get("/cp-tryout-packages")
    packages.value = Array.isArray(data?.data) ? data.data : []
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || "Gagal memuat paket CP."
  } finally {
    loadingPackages.value = false
  }
}

const fetchCfProblems = async () => {
  loadingProblems.value = true
  try {
    const { data } = await api.get("/cf-problems")
    cfProblems.value = Array.isArray(data?.data) ? data.data : []
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || "Gagal memuat daftar soal Codeforces."
  } finally {
    loadingProblems.value = false
  }
}

const selectPackage = async (id) => {
  clearMessages()
  selectedPackageId.value = id
  leaderboardRows.value = []

  try {
    const { data } = await api.get(`/cp-tryout-packages/${id}`)
    const pkg = data?.data
    if (!pkg) return

    form.value = {
      nama_paket: pkg.nama_paket || "",
      durasi_menit: pkg.durasi_menit || 120,
      mulai: toDateTimeInput(pkg.mulai),
      selesai: toDateTimeInput(pkg.selesai),
      status: pkg.status || "draft",
    }

    selectedProblemIds.value = Array.isArray(pkg.soal) ? pkg.soal.map((item) => item.id) : []
    await fetchLeaderboard()
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || "Gagal memuat detail paket CP."
  }
}

const resetForm = () => {
  selectedPackageId.value = null
  selectedProblemIds.value = []
  leaderboardRows.value = []
  form.value = {
    nama_paket: "",
    durasi_menit: 120,
    mulai: "",
    selesai: "",
    status: "draft",
  }
  clearMessages()
}

const savePackage = async () => {
  clearMessages()

  const payload = {
    nama_paket: form.value.nama_paket,
    durasi_menit: Number(form.value.durasi_menit),
    mulai: toDateTimePayload(form.value.mulai),
    selesai: toDateTimePayload(form.value.selesai),
    status: form.value.status,
  }

  try {
    if (selectedPackageId.value) {
      await api.put(`/cp-tryout-packages/${selectedPackageId.value}`, payload)
      successMessage.value = "Paket CP berhasil diperbarui."
      await selectPackage(selectedPackageId.value)
    } else {
      const { data } = await api.post("/cp-tryout-packages", payload)
      const newId = data?.data?.id
      successMessage.value = "Paket CP berhasil dibuat."
      await fetchPackages()
      if (newId) await selectPackage(newId)
    }
    await fetchPackages()
  } catch (error) {
    const validationErrors = error?.response?.data?.errors
    if (validationErrors) {
      const firstField = Object.keys(validationErrors)[0]
      errorMessage.value = validationErrors[firstField]?.[0] || "Validasi gagal."
      return
    }
    errorMessage.value = error?.response?.data?.message || "Gagal menyimpan paket CP."
  }
}

const saveSelectedProblems = async () => {
  clearMessages()

  if (!selectedPackageId.value) {
    errorMessage.value = "Pilih paket terlebih dahulu."
    return
  }

  savingProblems.value = true
  try {
    await api.put(`/cp-tryout-packages/${selectedPackageId.value}/problems`, {
      problem_ids: selectedProblemIds.value,
    })
    successMessage.value = "Daftar soal paket berhasil disimpan."
    await fetchPackages()
    await fetchLeaderboard()
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || "Gagal menyimpan daftar soal."
  } finally {
    savingProblems.value = false
  }
}

const fetchLeaderboard = async () => {
  if (!selectedPackageId.value) return

  loadingLeaderboard.value = true
  try {
    const { data } = await api.get(`/cp-tryout-packages/${selectedPackageId.value}/leaderboard`)
    leaderboardRows.value = Array.isArray(data?.data?.leaderboard) ? data.data.leaderboard : []
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || "Gagal memuat leaderboard."
  } finally {
    loadingLeaderboard.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchPackages(), fetchCfProblems()])
})
</script>
