<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <!-- TOPBAR -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Detail Peserta</h1>
            <p class="text-sm text-slate-500">Informasi lengkap peserta tryout</p>
          </div>

          <RouterLink to="/peserta" class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100">
            ← Kembali
          </RouterLink>
        </header>

        <!-- CONTENT -->
        <div class="px-6 py-6 w-full space-y-6">
          <!-- PROFIL PESERTA -->
          <section class="bg-white rounded-xl border p-6 text-sm">
            <div v-if="loading" class="text-center py-10 text-slate-500">Memuat data peserta...</div>

            <div v-else-if="peserta" class="grid md:grid-cols-4 gap-6">
              <div>
                <p class="text-slate-500">Nama</p>
                <p class="font-medium">{{ peserta.nama_lengkap || peserta.name }}</p>
              </div>
              <div>
                <p class="text-slate-500">Sekolah</p>
                <p class="font-medium">{{ peserta.sekolah.nama }}</p>
              </div>
              <div>
                <p class="text-slate-500">Kelas</p>
                <p class="font-medium">{{ peserta.kelas }}</p>
              </div>
              <div>
                <p class="text-slate-500">WhatsApp</p>
                <p class="font-medium">{{ peserta.whatsapp }}</p>
              </div>
              <div>
                <p class="text-slate-500">Asal Daerah</p>
                <p class="font-medium">{{ peserta.provinsi }}{{ peserta.kota ? ", " + peserta.kota : "" }}</p>
              </div>
              <div>
                <p class="text-slate-500">Email</p>
                <p class="font-medium">{{ peserta.email }}</p>
              </div>
              <div>
                <p class="text-slate-500">Tryout Diikuti</p>
                <p class="font-medium">{{ peserta.total_tryout || 0 }}</p>
              </div>
            </div>
          </section>

          <!-- STATUS EVENT -->
          <section class="bg-white rounded-xl border p-6 text-sm">
            <h3 class="font-semibold text-slate-800 mb-4">Status Event</h3>

            <div class="flex items-center justify-between">
              <div>
                <p class="text-slate-600">Terdaftar Event</p>
                <p class="text-xs text-slate-500">Mengontrol akses peserta ke event (kolom is_event_registered)</p>
              </div>

              <select
                @change="toggleEventStatus($event.target.value)"
                :value="peserta?.is_event_registered ? 1 : 0"
                class="px-4 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option :value="1">Aktif</option>
                <option :value="0">Nonaktif</option>
              </select>
            </div>
          </section>

          <!-- RINGKASAN -->
          <!-- <section class="grid md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl border p-6">
              <p class="text-sm text-slate-500">Nilai Terbaik</p>
              <p class="text-3xl font-semibold text-emerald-600 mt-2">98</p>
            </div>

            <div class="bg-white rounded-xl border p-6">
              <p class="text-sm text-slate-500">Rata-rata Nilai</p>
              <p class="text-3xl font-semibold text-slate-800 mt-2">82,4</p>
            </div>

            <div class="bg-white rounded-xl border p-6">
              <p class="text-sm text-slate-500">Peringkat Terbaik</p>
              <p class="text-3xl font-semibold text-indigo-600 mt-2">5</p>
            </div>
          </section> -->

          <!-- KELOLA TRYOUT & EVENT -->
          <section class="bg-white rounded-xl border p-6 space-y-6 text-sm">
            <div>
              <h3 class="font-semibold text-slate-800 mb-4">Kelola Tryout Peserta</h3>

              <div v-if="peserta?.tryouts?.length" class="space-y-2">
                <div
                  v-for="item in peserta.tryouts"
                  :key="item.id"
                  class="flex justify-between items-center border rounded-lg px-4 py-2"
                >
                  <div>
                    <p class="font-medium text-slate-700">{{ item.nama }}</p>
                    <p class="text-xs text-slate-500">Status: {{ item.status }}</p>
                  </div>
                  <button
                    @click="removeTryout(item.id)"
                    class="px-3 py-1 text-xs rounded bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              <div v-else class="text-slate-500 text-sm">Belum ada tryout yang diikuti.</div>
            </div>
          </section>

          <p class="text-xs text-slate-500">
            *Data ditampilkan berdasarkan seluruh tryout yang telah diselesaikan peserta.
          </p>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { RouterLink, useRoute } from "vue-router"
import { ref, onMounted } from "vue"
import api from "@/services/api"

import Sidebar from "../components/layout/Sidebar.vue"

const route = useRoute()
const peserta = ref(null)
const loading = ref(true)

const fetchPeserta = async () => {
  try {
    const { data } = await api.get(`/peserta/detail/${route.params.id}`)
    peserta.value = data
    console.log("Data peserta berhasil diambil:", data)
  } catch (error) {
    console.error("Gagal mengambil detail peserta", error)
  } finally {
    loading.value = false
  }
}

const toggleEventStatus = async (value) => {
  try {
    const { data } = await api.patch(`/peserta/toggle-event/${route.params.id}`, { is_event_registered: Number(value) })

    peserta.value.is_event_registered = data.is_event_registered
  } catch (error) {
    console.error("Gagal mengubah status event", error)
  }
}

const removeTryout = async (tryoutId) => {
  if (!confirm("Yakin ingin menghapus peserta dari tryout ini?")) return

  try {
    await api.delete(`/peserta/remove-tryout/${route.params.id}/${tryoutId}`)

    peserta.value.tryouts = peserta.value.tryouts.filter((t) => t.id !== tryoutId)
  } catch (error) {
    console.error("Gagal menghapus tryout peserta", error)
  }
}

onMounted(() => {
  fetchPeserta()
})
</script>
