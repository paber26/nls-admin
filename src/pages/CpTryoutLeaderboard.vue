<template>
  <AppShell>
    <template #header>
      <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Riwayat Submissions</h1>
          <p class="text-sm text-slate-500 truncate">Monitoring daftar submission dari peserta.</p>
        </div>
        
        <button
          @click="$router.push('/cp-tryout')"
          type="button"
          class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer"
        >
          Kembali ke Paket
        </button>
      </div>
    </template>

    <div class="space-y-6 p-6">
      <div class="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari nama peserta atau judul soal..." 
          class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
        >
      </div>
      <button 
        @click="fetchSubmissions" 
        :disabled="loadingSubmissions"
        class="bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 font-medium py-2 px-4 rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        Refresh Data
      </button>
    </div>

    <!-- TAB: SUBMISSIONS -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div v-if="loadingSubmissions" class="p-12 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-slate-500 text-sm">Memuat submissions...</p>
      </div>
      <div v-else-if="filteredSubmissions.length === 0" class="p-16 text-center">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-slate-700 mb-1">Daftar Kosong</h3>
        <p class="text-slate-500 text-sm max-w-sm mx-auto">Tidak ada histori pengiriman kode yang cocok dengan pencarian.</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th class="p-4">Tanggal</th>
              <th class="p-4">Peserta</th>
              <th class="p-4">Soal</th>
              <th class="p-4">Bahasa</th>
              <th class="p-4 text-center">Execution Waktu</th>
              <th class="p-4 text-center">Memory</th>
              <th class="p-4">Verdict</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="sub in filteredSubmissions" :key="sub.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-4">
                <div class="text-slate-800 font-medium whitespace-nowrap">{{ sub.created_at }}</div>
                <div class="text-slate-400 text-xs">{{ sub.time_ago }}</div>
              </td>
              <td class="p-4 font-semibold text-slate-800">
                {{ sub.user }}
              </td>
              <td class="p-4 text-slate-600 font-medium">
                {{ sub.problem_title }}
              </td>
              <td class="p-4 font-mono text-xs text-indigo-600">
                {{ sub.language }}
              </td>
              <td class="p-4 text-center font-mono text-slate-500">
                {{ sub.execution_time ? sub.execution_time + 's' : '-' }}
              </td>
              <td class="p-4 text-center font-mono text-slate-500">
                {{ sub.memory_used ? sub.memory_used + ' KB' : '-' }}
              </td>
              <td class="p-4">
                <span 
                  class="px-2.5 py-1 rounded inline-flex text-xs font-bold font-mono"
                  :class="[
                    sub.verdict === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                  ]"
                >
                  {{ sub.verdict }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import AppShell from "@/components/layout/AppShell.vue"

const route = useRoute()
const loadingSubmissions = ref(false)
const searchQuery = ref('')
const paketInfo = ref(null)
const submissionsList = ref([])

onMounted(() => {
  fetchSubmissions()
})

const filteredSubmissions = computed(() => {
  if (!searchQuery.value) return submissionsList.value
  
  const q = searchQuery.value.toLowerCase()
  return submissionsList.value.filter(sub => {
    return (sub.user && sub.user.toLowerCase().includes(q)) || 
           (sub.problem_title && sub.problem_title.toLowerCase().includes(q))
  })
})

async function fetchSubmissions() {
  const id = route.params.id
  if (!id) return
  
  loadingSubmissions.value = true
  try {
    const res = await api.get(`/cp-tryout-packages/${id}/submissions`)
    paketInfo.value = res.data.data.paket
    submissionsList.value = res.data.data.submissions
  } catch (err) {
    console.error('Failed fetching submissions:', err)
    alert('Error: Gagal memuat daftar riwayat')
  } finally {
    loadingSubmissions.value = false
  }
}
</script>
