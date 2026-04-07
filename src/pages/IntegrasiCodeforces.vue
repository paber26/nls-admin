<template>
  <AppShell>
    <template #header>
      <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          <h1 class="text-lg font-semibold text-slate-800">Integrasi Codeforces</h1>
          <p class="text-sm text-slate-500">Akses Codeforces diamankan lewat nls-osn-api</p>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isPinging"
          @click="pingApi()"
        >
          <svg v-if="isPinging" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          {{ isPinging ? "Menguji Koneksi..." : "Test Koneksi API" }}
        </button>
      </div>
    </template>

    <div class="mx-auto max-w-7xl space-y-6 p-6 text-slate-800">
      <div
        v-if="successMessage"
        class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      >
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div class="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600">📡</div>
          <div>
            <p class="text-sm font-medium text-slate-500">Status Server CF</p>
            <div class="mt-1 flex items-center gap-2">
              <div class="h-2.5 w-2.5 rounded-full" :class="serverStatusDotClass"></div>
              <p class="text-lg font-semibold text-slate-900">{{ serverStatusLabel }}</p>
            </div>
            <p class="mt-1 text-xs text-slate-500">Cek terakhir: {{ lastCheckedLabel }}</p>
          </div>
        </div>

        <div class="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl text-indigo-600">
            🔐
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Mode Akses</p>
            <p class="mt-1 text-lg font-semibold text-slate-900">Via nls-osn-api</p>
            <p class="mt-1 text-xs text-slate-500">
              {{ connection.signedRequest ? "Signed request aktif" : "Signed request belum aktif" }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl text-orange-600">
            📥
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Submission Ditampilkan</p>
            <p class="mt-1 text-lg font-semibold text-slate-900">{{ submissions.length }}</p>
            <p class="mt-1 text-xs text-slate-500">Data terbaru dari handle yang dipilih</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-1">
          <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div class="border-b border-slate-100 bg-slate-50/60 px-6 py-5">
              <h2 class="text-base font-semibold text-slate-900">Tarik Data Manual</h2>
              <p class="mt-1 text-sm text-slate-500">
                Masukkan Codeforces handle. Admin akan membaca data lewat backend, bukan langsung ke Codeforces.
              </p>
            </div>

            <div class="space-y-5 p-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Codeforces Handle</label>
                <input
                  v-model.trim="targetHandle"
                  type="text"
                  placeholder="contoh: tourist"
                  class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  @keyup.enter="syncHandle"
                />
              </div>

              <button
                type="button"
                class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isSyncing"
                @click="syncHandle"
              >
                <svg v-if="isSyncing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ isSyncing ? "Mengambil Data..." : "Ambil Profil & Submission" }}
              </button>
            </div>
          </div>

          <div class="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 class="text-base font-semibold text-slate-900">Informasi Penting</h3>
            <ul class="list-disc space-y-2 pl-4 text-sm text-slate-600 marker:text-slate-300">
              <li>Kredensial Codeforces tetap berada di server `nls-osn-api` dan tidak dikirim ke browser admin.</li>
              <li>Endpoint Codeforces hanya bisa diakses admin yang sudah login lewat token NLS.</li>
              <li>
                Integrasi ke `cf_problem_id` dan sinkronisasi tryout penuh bisa dilanjutkan setelah schema databasenya
                ditambahkan.
              </li>
            </ul>
          </div>
        </div>

        <div class="space-y-6 lg:col-span-2">
          <section class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="text-base font-semibold text-slate-900">Profil Handle</h2>
                <p class="mt-1 text-sm text-slate-500">Data user diambil dari backend proxy Codeforces.</p>
              </div>
            </div>

            <div v-if="cfUser" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-500">Handle</p>
                <p class="mt-1 text-base font-semibold text-slate-900">{{ cfUser.handle || "-" }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-500">Rank</p>
                <p class="mt-1 text-base font-semibold text-slate-900">{{ cfUser.rank || "-" }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-500">Rating</p>
                <p class="mt-1 text-base font-semibold text-slate-900">{{ cfUser.rating ?? "-" }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-500">Max Rating</p>
                <p class="mt-1 text-base font-semibold text-slate-900">{{ cfUser.maxRating ?? "-" }}</p>
              </div>
            </div>

            <div
              v-else
              class="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
            >
              Belum ada handle yang dimuat.
            </div>
          </section>

          <section class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div class="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-5">
              <div>
                <h2 class="text-base font-semibold text-slate-900">Submission Terbaru</h2>
                <p class="mt-1 text-sm text-slate-500">Riwayat terbaru untuk handle yang dipilih.</p>
              </div>
              <button
                type="button"
                class="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="!targetHandle || isSyncing"
                @click="syncHandle"
              >
                Segarkan
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-left">
                <thead>
                  <tr class="border-b border-slate-100 bg-white">
                    <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Waktu</th>
                    <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Problem</th>
                    <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Bahasa</th>
                    <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Tes Lolos</th>
                    <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Verdict</th>
                  </tr>
                </thead>
                <tbody v-if="submissions.length" class="divide-y divide-slate-50 text-sm">
                  <tr v-for="submission in submissions" :key="submission.id" class="transition hover:bg-slate-50/50">
                    <td class="px-6 py-4 whitespace-nowrap text-slate-500">
                      {{ formatSubmissionTime(submission.creationTimeSeconds) }}
                    </td>
                    <td class="px-6 py-4">
                      <div class="font-medium text-slate-900">{{ problemCode(submission) }}</div>
                      <div class="text-xs text-slate-500">{{ submission.problem?.name || "-" }}</div>
                    </td>
                    <td class="px-6 py-4 text-slate-600">{{ submission.programmingLanguage || "-" }}</td>
                    <td class="px-6 py-4 text-slate-600">{{ submission.passedTestCount ?? 0 }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex rounded-md px-2 py-1 text-xs font-medium"
                        :class="verdictClass(submission.verdict)"
                      >
                        {{ verdictLabel(submission.verdict) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">
                      Belum ada submission yang ditampilkan.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-slate-200 my-8"></div>

      <!-- MANAJEMEN PROBLEM CODEFORCES -->
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Manajemen Problem Codeforces</h2>
          <p class="text-sm text-slate-500">Tambah problem Codeforces untuk dikerjakan peserta secara otomatis.</p>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Cari & Resolove Kolom Kiri -->
          <div class="space-y-6 lg:col-span-1">
            <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div class="border-b border-slate-100 bg-slate-50/60 px-6 py-5">
                <h3 class="text-base font-semibold text-slate-900">Impor Problem Baru</h3>
                <p class="mt-1 text-sm text-slate-500">Masukkan URL lengkap dari website Codeforces.</p>
              </div>

              <div class="space-y-5 p-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-700">URL Problem</label>
                  <input
                    v-model.trim="targetProblemUrl"
                    type="text"
                    placeholder="https://codeforces.com/problemset/problem/2209/D"
                    class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    @keyup.enter="resolveProblem"
                  />
                </div>

                <button
                  type="button"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="isResolving || !targetProblemUrl"
                  @click="resolveProblem"
                >
                  <svg v-if="isResolving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  {{ isResolving ? "Mencari..." : "Validasi Problem" }}
                </button>
              </div>

              <!-- Hasil Resolve Form Simpan -->
              <div v-if="resolvedProblem" class="border-t border-slate-100 bg-indigo-50/30 p-6 space-y-4">
                <div>
                  <p class="text-xs font-semibold uppercase text-indigo-500">Ditemukan</p>
                  <p class="mt-1 font-bold text-slate-900">{{ resolvedProblem.contestId }}{{ resolvedProblem.index }} - {{ resolvedProblem.name }}</p>
                  <div class="mt-2 flex flex-wrap gap-1">
                    <span v-for="tag in (resolvedProblem.tags || [])" :key="tag" class="rounded bg-white px-2 py-0.5 text-xs text-slate-600 border border-slate-200">
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <div class="space-y-3 pt-4 border-t border-indigo-100">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
                    <select v-model="newProblemMapelId" class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option value="">Pilih Mapel...</option>
                      <option v-for="mapel in mapelList" :key="mapel.id" :value="mapel.id">
                        {{ mapel.nama }} ({{ mapel.tingkat }})
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Poin Dasar</label>
                    <input v-model.number="newProblemPoints" type="number" min="0" class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <button
                    type="button"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isSavingProblem"
                    @click="saveProblem"
                  >
                    {{ isSavingProblem ? "Menyimpan..." : "Simpan ke Soal Codeforces" }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabel Daftar Problem Kolom Kanan -->
          <div class="space-y-6 lg:col-span-2">
            <section class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div class="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-5">
                <div>
                  <h3 class="text-base font-semibold text-slate-900">Daftar Problem Tersimpan</h3>
                  <p class="mt-1 text-sm text-slate-500">Soal-soal ini dapat dipilih saat menyusun Tryout / Paket NLS-OSN.</p>
                </div>
                <button
                  type="button"
                  class="text-sm font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
                  @click="loadSavedProblems"
                >
                  Segarkan
                </button>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left">
                  <thead>
                    <tr class="border-b border-slate-100 bg-white">
                      <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">ID CF</th>
                      <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Nama Problem</th>
                      <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Mapel</th>
                      <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Poin</th>
                      <th class="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody v-if="savedProblems.length" class="divide-y divide-slate-50 text-sm">
                    <tr v-for="p in savedProblems" :key="p.id" class="transition hover:bg-slate-50/50">
                      <td class="px-6 py-4 font-medium text-slate-900">
                        {{ p.cf_contest_id }}{{ p.cf_index }}
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-slate-900">{{ p.name }}</div>
                        <div class="text-xs text-slate-400 mt-0.5">Rating: {{ p.rating || 'N/A' }}</div>
                      </td>
                      <td class="px-6 py-4 text-slate-600">
                        {{ p.mapel ? p.mapel.nama : '-' }}
                      </td>
                      <td class="px-6 py-4 text-slate-600">{{ p.points }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-right">
                        <button class="text-rose-600 hover:text-rose-800 text-xs font-medium" @click="deleteProblem(p.id)">Hapus</button>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">
                        Belum ada problem Codeforces yang tersimpan.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import AppShell from "@/components/layout/AppShell.vue"
import api from "@/services/api"

const isPinging = ref(false)
const isSyncing = ref(false)
const targetHandle = ref("")
const successMessage = ref("")
const errorMessage = ref("")
const lastConnectionError = ref("")
const cfUser = ref(null)
const submissions = ref([])

// CF Problem Mgmt
const isResolving = ref(false)
const targetProblemUrl = ref("")
const resolvedProblem = ref(null)
const mapelList = ref([])
const savedProblems = ref([])
const newProblemMapelId = ref("")
const newProblemPoints = ref(100)
const isSavingProblem = ref(false)

const connection = ref({
  online: null,
  configured: false,
  signedRequest: false,
  checkedAt: ""
})

const serverStatusLabel = computed(() => {
  if (connection.value.online === null) {
    return "Belum Diuji"
  }

  return connection.value.online ? "Online" : "Gagal"
})

const serverStatusDotClass = computed(() => {
  if (connection.value.online === null) {
    return "bg-slate-300"
  }

  return connection.value.online ? "bg-emerald-500" : "bg-rose-500"
})

const lastCheckedLabel = computed(() => {
  if (!connection.value.checkedAt) {
    return "Belum ada"
  }

  return formatIsoDate(connection.value.checkedAt)
})

const pingApi = async ({ silent = false } = {}) => {
  isPinging.value = true

  if (!silent) {
    successMessage.value = ""
    errorMessage.value = ""
  }

  try {
    const { data } = await api.get("/codeforces/health")
    lastConnectionError.value = ""

    connection.value = {
      online: true,
      configured: Boolean(data.data?.configured),
      signedRequest: Boolean(data.data?.signed_request),
      checkedAt: data.data?.checked_at || new Date().toISOString()
    }

    if (!silent) {
      successMessage.value = data.message || "Koneksi Codeforces berhasil."
    }

    return true
  } catch (error) {
    const message = extractErrorMessage(error)
    lastConnectionError.value = message

    connection.value = {
      online: false,
      configured: false,
      signedRequest: false,
      checkedAt: new Date().toISOString()
    }

    if (!silent) {
      errorMessage.value = message
    }

    return false
  } finally {
    isPinging.value = false
  }
}

const syncHandle = async () => {
  const handle = targetHandle.value.trim()

  successMessage.value = ""
  errorMessage.value = ""

  if (!handle) {
    errorMessage.value = "Handle Codeforces wajib diisi."
    return
  }

  isSyncing.value = true

  try {
    const healthOk = await pingApi({ silent: true })

    if (!healthOk) {
      errorMessage.value = buildConnectionErrorMessage()
      return
    }

    const encodedHandle = encodeURIComponent(handle)

    const [userResponse, submissionsResponse] = await Promise.all([
      api.get(`/codeforces/handles/${encodedHandle}`),
      api.get(`/codeforces/handles/${encodedHandle}/submissions`, {
        params: { count: 20 }
      })
    ])

    cfUser.value = userResponse.data.data || null
    submissions.value = submissionsResponse.data.data || []
    successMessage.value = `Data Codeforces untuk handle ${handle} berhasil diambil.`
  } catch (error) {
    errorMessage.value = extractErrorMessage(error)
  } finally {
    isSyncing.value = false
  }
}

const buildConnectionErrorMessage = () => {
  if (lastConnectionError.value) {
    return lastConnectionError.value
  }

  if (connection.value.configured === false) {
    return "Konfigurasi Codeforces API di server belum lengkap. Cek CF_API_KEY dan CF_API_SECRET di nls-osn-api."
  }

  if (connection.value.online === false) {
    return "Backend belum bisa terhubung ke Codeforces API. Jalankan Test Koneksi API untuk melihat status terbaru."
  }

  return "Terjadi kesalahan saat menghubungkan ke Codeforces."
}

const extractErrorMessage = (error) => {
  return (
    error?.response?.data?.errors?.handle?.[0] ||
    error?.response?.data?.message ||
    error?.message ||
    "Terjadi kesalahan saat menghubungkan ke Codeforces."
  )
}

const formatIsoDate = (value) => {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value))
}

const formatSubmissionTime = (timestamp) => {
  if (!timestamp) {
    return "-"
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(timestamp * 1000))
}

const problemCode = (submission) => {
  const contestId = submission.problem?.contestId || submission.contestId || ""
  const index = submission.problem?.index || ""

  return `${contestId}${index}` || "-"
}

const verdictLabel = (verdict) => {
  if (!verdict) {
    return "In Queue"
  }

  if (verdict === "OK") {
    return "Accepted"
  }

  return verdict.replaceAll("_", " ")
}

const verdictClass = (verdict) => {
  if (verdict === "OK") {
    return "bg-emerald-50 text-emerald-700"
  }

  if (!verdict) {
    return "bg-amber-50 text-amber-700"
  }

  return "bg-rose-50 text-rose-700"
}

const loadMapel = async () => {
  try {
    const { data } = await api.get('/mapel')
    mapelList.value = data
  } catch (err) {
    console.error("Gagal load mapel", err)
  }
}

const loadSavedProblems = async () => {
  try {
    const { data } = await api.get('/cf-problems')
    savedProblems.value = data.data || []
  } catch (err) {
    console.error("Gagal load saved problems", err)
  }
}

const resolveProblem = async () => {
  if (!targetProblemUrl.value) return
  isResolving.value = true
  resolvedProblem.value = null
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const { data } = await api.get('/codeforces/problems/resolve', { params: { url: targetProblemUrl.value } })
    resolvedProblem.value = data.data?.problem || data.data
    successMessage.value = data.message || "Problem berhasil ditemukan."
  } catch (error) {
    errorMessage.value = extractErrorMessage(error)
  } finally {
    isResolving.value = false
  }
}

const saveProblem = async () => {
  if (!newProblemMapelId.value || typeof newProblemPoints.value !== 'number') {
    errorMessage.value = "Mapel dan poin wajib diisi."
    return
  }
  isSavingProblem.value = true
  errorMessage.value = ''
  
  try {
    await api.post('/cf-problems', {
      mapel_id: newProblemMapelId.value,
      cf_contest_id: resolvedProblem.value.contestId,
      cf_index: resolvedProblem.value.index,
      name: resolvedProblem.value.name,
      rating: resolvedProblem.value.rating || null,
      tags: resolvedProblem.value.tags || [],
      points: newProblemPoints.value
    })
    
    successMessage.value = "Problem Codeforces berhasil disimpan ke database!"
    resolvedProblem.value = null
    targetProblemUrl.value = ""
    loadSavedProblems()
  } catch (error) {
    errorMessage.value = extractErrorMessage(error)
  } finally {
    isSavingProblem.value = false
  }
}

const deleteProblem = async (id) => {
  if (!confirm("Hapus problem Codeforces ini dari database?")) return
  try {
    await api.delete(`/cf-problems/${id}`)
    loadSavedProblems()
  } catch (error) {
    errorMessage.value = extractErrorMessage(error)
  }
}

onMounted(() => {
  pingApi({ silent: true })
  loadMapel()
  loadSavedProblems()
})
</script>
