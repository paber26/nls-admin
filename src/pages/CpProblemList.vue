<template>
  <AppShell>
    <template #header>
      <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Manajemen Soal Native CP</h1>
          <p class="text-sm text-slate-500">Daftar bank soal khusus untuk tipe Competitive Programming</p>
        </div>
        <div class="flex gap-3">
          <RouterLink
            to="/cp-problems/tambah"
            class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 font-medium"
          >
            + Tambah Soal
          </RouterLink>
        </div>
      </div>
    </template>

    <div class="p-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-slate-500">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          Memuat data soal...
        </div>

        <div v-else-if="error" class="p-8 text-center text-red-500">
          {{ error }}
        </div>

        <table v-else class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Judul Soal</th>
              <th class="px-6 py-4">Time Label</th>
              <th class="px-6 py-4">Poin</th>
              <th class="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="p in problems" :key="p.id" class="hover:bg-slate-50 transition">
              <td class="px-6 py-4 font-mono">{{ p.id }}</td>
              <td class="px-6 py-4 font-medium text-slate-800">{{ p.title }}</td>
              <td class="px-6 py-4">{{ p.time_limit }}s / {{ p.memory_limit }}MB</td>
              <td class="px-6 py-4">{{ p.points }}</td>
              <td class="px-6 py-4">
                <div class="flex gap-2 justify-center">
                  <button
                    @click="openPreview(p)"
                    class="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg font-medium transition"
                  >
                    Lihat
                  </button>
                  <RouterLink
                    :to="`/cp-problems/edit/${p.id}`"
                    class="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1.5 rounded-lg font-medium transition"
                  >
                    Edit
                  </RouterLink>
                  <button
                    @click="deleteProblem(p.id)"
                    class="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg font-medium transition"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="problems.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">
                Belum ada soal CP yang dibuat. Klik tombol Tambah Soal CP untuk memulai.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL PREVIEW -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          
          <div class="flex flex-col items-center justify-center px-6 py-5 border-b border-slate-200 bg-slate-50 relative">
            <h2 class="text-xl font-bold text-slate-800 text-center">{{ selectedProblem?.title }}</h2>
            <p class="text-xs text-slate-500 mt-1 font-mono text-center">
              ⏱ {{ selectedProblem?.time_limit }}s &nbsp;|&nbsp; 💾 {{ selectedProblem?.memory_limit }}MB &nbsp;|&nbsp; 🏅 {{ selectedProblem?.points }} Poin
            </p>
            <button @click="showModal = false" class="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 140px);" id="math-container">
            <div class="prose prose-slate max-w-none text-sm cf-custom-styles mb-8" v-html="selectedProblem?.description_html"></div>

            <div v-if="selectedProblem?.input_format_html" class="mb-6">
              <h3 class="font-bold text-slate-800 text-lg border-b pb-2 mb-3">Format Masukan</h3>
              <div class="prose prose-slate max-w-none text-sm cf-custom-styles" v-html="selectedProblem?.input_format_html"></div>
            </div>

            <div v-if="selectedProblem?.output_format_html" class="mb-8">
              <h3 class="font-bold text-slate-800 text-lg border-b pb-2 mb-3">Format Keluaran</h3>
              <div class="prose prose-slate max-w-none text-sm cf-custom-styles" v-html="selectedProblem?.output_format_html"></div>
            </div>
            
            <div v-if="selectedProblem?.test_cases && selectedProblem.test_cases.length > 0">
              <h3 class="font-bold text-slate-800 text-lg border-b pb-2 mb-4">Contoh Kasus Uji</h3>
              <div v-for="(tc, idx) in selectedProblem.test_cases" :key="idx" class="mb-6 rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                <div class="bg-slate-50 px-4 py-2 font-mono text-sm font-semibold border-b border-slate-200 text-slate-700 flex justify-between">
                  <span>Kasus #{{ idx + 1 }}</span>
                  <span v-if="tc.is_hidden" class="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded">Hidden</span>
                </div>
                <div class="flex flex-col sm:flex-row">
                  <div class="flex-1 p-4 border-b sm:border-b-0 sm:border-r border-slate-200">
                    <div class="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Input (STDIN)</div>
                    <pre class="font-mono text-sm bg-white border border-slate-100 rounded p-3 overflow-x-auto text-slate-800">{{ tc.input }}</pre>
                  </div>
                  <div class="flex-1 p-4">
                    <div class="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Output (STDOUT)</div>
                    <pre class="font-mono text-sm bg-white border border-slate-100 rounded p-3 overflow-x-auto text-slate-800">{{ tc.expected_output }}</pre>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
            <button @click="showModal = false" class="px-5 py-2 z-10 bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium rounded-lg transition">Tutup</button>
          </div>
        </div>
      </div>
    </transition>
  </AppShell>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import AppShell from '@/components/layout/AppShell.vue'
import api from '@/services/api'
import katex from "katex"
import renderMathInElement from "katex/contrib/auto-render"
import "katex/dist/katex.min.css"

const problems = ref([])
const loading = ref(true)
const error = ref(null)

const showModal = ref(false)
const selectedProblem = ref(null)

const renderKatex = async () => {
  await nextTick()
  const container = document.getElementById("math-container")
  if (!container) return

  try {
    renderMathInElement(container, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false
    })
  } catch (e) {
    console.error("KaTeX render error:", e)
  }
}

const openPreview = async (problem) => {
  selectedProblem.value = problem
  showModal.value = true
  await nextTick()
  setTimeout(() => {
    renderKatex()
  }, 100)
}

const fetchProblems = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await api.get('/cp-problems')
    problems.value = res.data.data || []
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal memuat data.'
  } finally {
    loading.value = false
  }
}

const deleteProblem = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus soal ini beserta test case-nya?')) return
  try {
    await api.delete(`/cp-problems/${id}`)
    fetchProblems()
  } catch (err) {
    alert('Gagal menghapus soal')
  }
}

onMounted(() => {
  fetchProblems()
})
</script>
