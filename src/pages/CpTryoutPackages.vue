<template>
  <AppShell>
    <template #header>
      <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Tryout CP Paket</h1>
          <p class="text-sm text-slate-500">Kelola paket Competitive Programming dari soal Codeforces.</p>
        </div>

        <button
          type="button"
          class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer"
          @click="openCreateModal"
        >
          + Tambah Paket
        </button>
      </div>
    </template>

    <div class="space-y-6 p-6">
      <div v-if="successMessage" class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <section class="rounded-xl border bg-white">
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
                  <div class="flex items-center justify-center gap-3">
                    <button type="button" class="text-indigo-600 hover:underline cursor-pointer" @click="openManage(item.id)">
                      Kelola
                    </button>
                    <button
                      type="button"
                      class="text-slate-700 hover:underline cursor-pointer"
                      @click="openLeaderboard(item.id)"
                    >
                      Leaderboard
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!loadingPackages && !packages.length">
                <td colspan="5" class="px-4 py-8 text-center text-slate-400">Belum ada paket CP.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-if="selectedPackageId" class="rounded-xl border bg-white">
        <div class="flex items-center justify-between border-b bg-slate-50 px-4 py-3">
          <div>
            <h2 class="text-base font-semibold text-slate-700">Leaderboard Paket CP</h2>
            <p class="text-xs text-slate-500">{{ selectedPackageName || "-" }}</p>
          </div>
          <button
            type="button"
            class="text-sm text-indigo-600 hover:underline cursor-pointer disabled:cursor-not-allowed disabled:text-slate-400"
            :disabled="loadingLeaderboard"
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
                  Belum ada peserta yang mengerjakan soal pada paket ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="closeCreateModal"
    >
      <div class="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-800">Buat Paket CP</h2>
          <button type="button" class="text-slate-500 hover:text-slate-700 cursor-pointer" @click="closeCreateModal">✕</button>
        </div>

        <form class="space-y-4" @submit.prevent="savePackage">
          <div>
            <label class="text-sm text-slate-600">Nama Paket</label>
            <input v-model="createForm.nama_paket" type="text" class="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-sm text-slate-600">Durasi (menit)</label>
            <input
              v-model.number="createForm.durasi_menit"
              type="number"
              min="1"
              class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label class="text-sm text-slate-600">Mulai</label>
            <input v-model="createForm.mulai" type="datetime-local" class="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-sm text-slate-600">Selesai</label>
            <input
              v-model="createForm.selesai"
              type="datetime-local"
              class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label class="text-sm text-slate-600">Status</label>
            <select v-model="createForm.status" class="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
              <option value="draft">Draft</option>
              <option value="active">Aktif</option>
              <option value="finished">Selesai</option>
            </select>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50 cursor-pointer" @click="closeCreateModal">
              Batal
            </button>
            <button type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer">
              Buat Paket
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import AppShell from "@/components/layout/AppShell.vue"
import api from "@/services/api"

const router = useRouter()

const packages = ref([])
const leaderboardRows = ref([])
const selectedPackageId = ref(null)
const selectedPackageName = ref("")

const loadingPackages = ref(false)
const loadingLeaderboard = ref(false)

const successMessage = ref("")
const errorMessage = ref("")

const showCreateModal = ref(false)
const createForm = ref({
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

const prettyStatus = (status) => {
  if (status === "active") return "Aktif"
  if (status === "finished") return "Selesai"
  return "Draft"
}

const clearMessages = () => {
  successMessage.value = ""
  errorMessage.value = ""
}

const resetCreateForm = () => {
  createForm.value = {
    nama_paket: "",
    durasi_menit: 120,
    mulai: "",
    selesai: "",
    status: "draft",
  }
}

const openCreateModal = () => {
  clearMessages()
  resetCreateForm()
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
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

const openManage = (id) => {
  router.push(`/cp-tryout/${id}/kelola`)
}

const openLeaderboard = async (id) => {
  clearMessages()

  try {
    const { data } = await api.get(`/cp-tryout-packages/${id}`)
    selectedPackageId.value = id
    selectedPackageName.value = data?.data?.nama_paket || ""
    await fetchLeaderboard()
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || "Gagal memuat leaderboard paket CP."
  }
}

const savePackage = async () => {
  clearMessages()

  const payload = {
    nama_paket: createForm.value.nama_paket,
    durasi_menit: Number(createForm.value.durasi_menit),
    mulai: toDateTimePayload(createForm.value.mulai),
    selesai: toDateTimePayload(createForm.value.selesai),
    status: createForm.value.status,
  }

  try {
    const { data } = await api.post("/cp-tryout-packages", payload)
    successMessage.value = "Paket CP berhasil dibuat."
    closeCreateModal()
    await fetchPackages()

    const newId = data?.data?.id
    if (newId) router.push(`/cp-tryout/${newId}/kelola`)
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
  await fetchPackages()
})
</script>

