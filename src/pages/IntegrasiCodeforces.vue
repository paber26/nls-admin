<template>

    <AppShell>
    <template #header>
      <div>
          <h1 class="text-lg font-semibold text-slate-800">Integrasi Codeforces</h1>
          <p class="text-sm text-slate-500">Pengaturan sinkronisasi sistem judge otomatis</p>
              </div>
    </template>

        <!-- Top Header as standard for pages -->
        

        <!-- Page Specific Content -->
        <div class="p-6 max-w-7xl mx-auto space-y-6 text-slate-800">
          
          <!-- Heading Section -->
          <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold tracking-tight text-slate-900">Status & Sinkronisasi</h2>
              <p class="text-slate-500 mt-1 text-sm">Kelola API penjurian Codeforces dan status submissions NLS-OSN.</p>
            </div>
            <div>
              <button
                @click="pingApi"
                class="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 cursor-pointer"
                :disabled="isPinging"
              >
                <svg v-if="isPinging" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isPinging ? 'Menguji Koneksi...' : 'Test Koneksi API' }}
              </button>
            </div>
          </div>

          <!-- Status Overview Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                📡
              </div>
              <div>
                <p class="text-sm font-medium text-slate-500">Status Server CF</p>
                <div class="flex items-center gap-2 mt-1">
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <p class="text-lg font-semibold text-slate-900">Online</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <p class="text-sm font-medium text-slate-500">Auto Sync Pekerjaan</p>
                <div class="flex items-center gap-2 mt-1">
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p class="text-lg font-semibold text-slate-900">Aktif (tiap 5 mnt)</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl">
                📥
              </div>
              <div>
                <p class="text-sm font-medium text-slate-500">Submissions Harian</p>
                <div class="flex items-center gap-2 mt-1">
                  <p class="text-lg font-semibold text-slate-900">342 Ditarik</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Manual Sync Section -->
            <div class="lg:col-span-1 space-y-6">
              <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div class="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 class="text-base font-semibold text-slate-900">Tarik Data Manual</h3>
                  <p class="text-sm text-slate-500 mt-1">Paksa penarikan status submission dari Handle atau Tryout spesifik.</p>
                </div>
                
                <div class="p-6 space-y-5">
                  <div class="space-y-3">
                    <label class="block text-sm font-medium text-slate-700">Tipe Sinkronisasi</label>
                    <select class="block w-full rounded-lg border-slate-200 bg-slate-50 border py-2.5 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option>Satu Codeforces Handle</option>
                      <option>Seluruh Peserta Tryout</option>
                    </select>
                  </div>

                  <div class="space-y-3">
                    <label class="block text-sm font-medium text-slate-700">Target (Handle / Tryout ID)</label>
                    <input type="text" placeholder="e.g., paber26" class="block w-full rounded-lg border-slate-200 bg-white border py-2.5 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400" />
                  </div>

                  <button class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 cursor-pointer">
                    Mulai Sinkronisasi
                  </button>
                </div>
              </div>
              
              <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6 space-y-4">
                  <h3 class="text-base font-semibold text-slate-900">Informasi Penting</h3>
                  <ul class="text-sm text-slate-600 space-y-2 list-disc pl-4 marker:text-slate-300">
                      <li>Codeforces API hanya membatasi akses maks <span class="font-medium">1-5 request/detik</span>, sehingga hindari terlalu sering menarik secara manual seluruh data sekaligus.</li>
                      <li>Admin harus tetap menambahkan field <code class="bg-slate-100 px-1 py-0.5 rounded text-xs text-rose-600">cf_problem_id</code> ke Bank Soal untuk integrasi.</li>
                  </ul>
              </div>
            </div>

            <!-- Recent Log Activity -->
            <div class="lg:col-span-2">
              <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
                <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h3 class="text-base font-semibold text-slate-900">Aktivitas Sinkronisasi Terakhir</h3>
                    <p class="text-sm text-slate-500 mt-1">Log penarikan rating dan submission peserta.</p>
                  </div>
                  <button class="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">Segarkan Log</button>
                </div>
                
                <div class="p-0 flex-1 overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="border-b border-slate-100 bg-white">
                        <th class="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Waktu</th>
                        <th class="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Handle</th>
                        <th class="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Aktivitas</th>
                        <th class="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 text-sm">
                      <tr class="hover:bg-slate-50/50 transition">
                        <td class="px-6 py-4 whitespace-nowrap text-slate-500">10:42 AM</td>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-900">tourist</td>
                        <td class="px-6 py-4 text-slate-600">Auto Sync - 4 Submit baru ditemukan</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">Berhasil</span>
                        </td>
                      </tr>
                      <tr class="hover:bg-slate-50/50 transition">
                        <td class="px-6 py-4 whitespace-nowrap text-slate-500">10:35 AM</td>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-900">SYSTEM</td>
                        <td class="px-6 py-4 text-slate-600">Bulk Sync Tryout #TO-102 (20 Peserta)</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">Selesai</span>
                        </td>
                      </tr>
                      <tr class="hover:bg-slate-50/50 transition bg-red-50/30">
                        <td class="px-6 py-4 whitespace-nowrap text-slate-500">10:15 AM</td>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-900">random_user_123</td>
                        <td class="px-6 py-4 text-slate-600">Gagal menarik API - Handle CF tidak ditemukan</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700">Error 400</span>
                        </td>
                      </tr>
                      <tr class="hover:bg-slate-50/50 transition">
                        <td class="px-6 py-4 whitespace-nowrap text-slate-500">09:50 AM</td>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-900">paber26</td>
                        <td class="px-6 py-4 text-slate-600">Manual Sync - Problem 4A OK (Accepted)</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">Berhasil</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        </AppShell>
  
</template>

<script setup>
import AppShell from "@/components/layout/AppShell.vue"
import { ref } from 'vue'
import Sidebar from "../components/layout/Sidebar.vue"

const isPinging = ref(false)

const pingApi = () => {
  isPinging.value = true
  setTimeout(() => {
    isPinging.value = false
    alert('Codeforces API is reachable: OK!')
  }, 1000)
}
</script>
