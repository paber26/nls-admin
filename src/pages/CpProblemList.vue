<template>
  <AppShell>
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Manajemen Soal Native CP</h1>
        <RouterLink
          to="/cp-problems/tambah"
          class="bg-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
        >
          + Tambah Soal CP
        </RouterLink>
      </div>

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
              <th class="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="p in problems" :key="p.id" class="hover:bg-slate-50 transition">
              <td class="px-6 py-4 font-mono">{{ p.id }}</td>
              <td class="px-6 py-4 font-medium text-slate-800">{{ p.title }}</td>
              <td class="px-6 py-4">{{ p.time_limit }}s / {{ p.memory_limit }}MB</td>
              <td class="px-6 py-4">{{ p.points }}</td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
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
  </AppShell>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppShell from '@/components/layout/AppShell.vue'
import api from '@/services/api'

const problems = ref([])
const loading = ref(true)
const error = ref(null)

const fetchProblems = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await api.get('/cp-problems')
    problems.value = res.data
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
