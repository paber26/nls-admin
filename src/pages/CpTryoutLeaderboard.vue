<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">🏆 Hasil & Leaderboard CP</h1>
        <p class="text-slate-500 text-sm mt-1">Pemantauan hasil submission peserta secara realtime.</p>
        <div v-if="paketInfo" class="mt-3 flex items-center gap-3">
          <span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
            {{ paketInfo.nama_paket }}
          </span>
          <span class="text-slate-400 text-xs flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ paketInfo.durasi_menit }} Menit
          </span>
        </div>
      </div>
      <div>
        <button @click="$router.push('/cp-tryout')" class="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium py-2 px-4 rounded-xl shadow-sm flex items-center gap-2 transition-all">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali ke Paket
        </button>
      </div>
    </div>

    <!-- TABS Navigation -->
    <div class="bg-white p-1 rounded-xl shadow-sm border border-slate-100 mb-6 inline-flex p-1">
      <button 
        @click="activeTab = 'leaderboard'"
        :class="['px-6 py-2.5 text-sm font-semibold rounded-lg transition-all', activeTab === 'leaderboard' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50']"
      >
        🌟 Klasemen (Leaderboard)
      </button>
      <button 
        @click="activeTab = 'submissions'"
        :class="['px-6 py-2.5 text-sm font-semibold rounded-lg transition-all', activeTab === 'submissions' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50']"
      >
        📄 Seluruh Riwayat Submissions
      </button>
    </div>

    <!-- TAB: LEADERBOARD -->
    <div v-show="activeTab === 'leaderboard'" class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div v-if="loadingLeaderboard" class="p-12 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-slate-500 text-sm">Memuat leaderboard...</p>
      </div>
      <div v-else-if="leaderboardData.length === 0" class="p-16 text-center">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-slate-700 mb-1">Daftar Kosong</h3>
        <p class="text-slate-500 text-sm max-w-sm mx-auto">Belum ada peserta yang mensubmit jawaban untuk paket soal ini.</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th class="p-4 text-center w-16">Rank</th>
              <th class="p-4">Peserta</th>
              <th class="p-4 w-40">Asal Sekolah</th>
              <th class="p-4 text-center w-32">Status Ujian</th>
              <th class="p-4 text-center w-24">Soal Benar</th>
              <th class="p-4 text-center w-24">Poin Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(row, index) in leaderboardData" :key="row.user_id" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-4 text-center font-bold">
                <span v-if="index === 0" class="text-yellow-500 text-xl" title="Peringkat 1">🥇</span>
                <span v-else-if="index === 1" class="text-slate-400 text-xl" title="Peringkat 2">🥈</span>
                <span v-else-if="index === 2" class="text-orange-400 text-xl" title="Peringkat 3">🥉</span>
                <span v-else class="text-slate-600">{{ row.rank }}</span>
              </td>
              <td class="p-4">
                <div class="font-bold text-slate-800 text-sm">{{ row.name }}</div>
              </td>
              <td class="p-4 text-sm text-slate-600">
                {{ row.school }}
              </td>
              <td class="p-4 text-center">
                <span v-if="row.status_pengerjaan === 'belum_mengerjakan'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">Belum Ujian</span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">Sudah Ujian</span>
              </td>
              <td class="p-4 text-center font-mono text-sm">
                {{ row.solved_count }}<span class="text-slate-400">/{{ paketInfo?.jumlah_soal || '-' }}</span>
              </td>
              <td class="p-4 text-center">
                <div class="inline-flex items-center justify-center bg-indigo-50 border border-indigo-100 text-indigo-700 w-12 h-8 rounded-lg font-bold">
                  {{ row.total_points }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB: SUBMISSIONS -->
    <div v-show="activeTab === 'submissions'" class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div v-if="loadingSubmissions" class="p-12 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-slate-500 text-sm">Memuat submissions...</p>
      </div>
      <div v-else-if="submissionsList.length === 0" class="p-16 text-center">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-slate-700 mb-1">Belum Ada Submission</h3>
        <p class="text-slate-500 text-sm max-w-sm mx-auto">Belum ada peserta yang mensubmit kodenya ke platform Judge0.</p>
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
            <tr v-for="sub in submissionsList" :key="sub.id" class="hover:bg-slate-50/50 transition-colors">
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
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const activeTab = ref('leaderboard')

const loadingLeaderboard = ref(true)
const loadingSubmissions = ref(false)

const paketInfo = ref(null)
const leaderboardData = ref([])
const submissionsList = ref([])

onMounted(() => {
  fetchLeaderboard()
})

watch(activeTab, (newTab) => {
  if (newTab === 'submissions' && submissionsList.value.length === 0) {
    fetchSubmissions()
  } else if (newTab === 'leaderboard' && leaderboardData.value.length === 0) {
    fetchLeaderboard()
  }
})

async function fetchLeaderboard() {
  const id = route.params.id
  if (!id) return
  
  loadingLeaderboard.value = true
  try {
    const res = await api.get(`/cp-tryout-packages/${id}/leaderboard?include_all=true`)
    paketInfo.value = res.data.data.paket
    leaderboardData.value = res.data.data.leaderboard
  } catch (err) {
    console.error('Failed fetching leaderboard:', err)
    Swal.fire('Error', 'Gagal memuat papan peringkat', 'error')
  } finally {
    loadingLeaderboard.value = false
  }
}

async function fetchSubmissions() {
  const id = route.params.id
  if (!id) return
  
  loadingSubmissions.value = true
  try {
    const res = await api.get(`/cp-tryout-packages/${id}/submissions`)
    submissionsList.value = res.data.data.submissions
  } catch (err) {
    console.error('Failed fetching submissions:', err)
    Swal.fire('Error', 'Gagal memuat daftar riwayat', 'error')
  } finally {
    loadingSubmissions.value = false
  }
}
</script>
