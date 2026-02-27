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

          <!-- RIWAYAT TRYOUT -->
          <section class="bg-white rounded-xl border p-10 text-center">
            <h3 class="font-semibold text-slate-800 mb-2">Riwayat Tryout</h3>
            <p class="text-slate-500">Fitur riwayat tryout sedang dalam tahap pengembangan.</p>
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

onMounted(() => {
  fetchPeserta()
})
</script>
