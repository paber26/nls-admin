<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <!-- TOPBAR -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Detail Tryout</h1>
            <p class="text-sm text-slate-500">Preview soal sebelum tryout dibuka ke peserta</p>
          </div>

          <div class="flex gap-3">
            <RouterLink
              :to="`/tryout/kelola/${route.params.id}`"
              class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100"
            >
              Kelola Soal
            </RouterLink>
            <RouterLink
              :to="`/tryout/edit/${route.params.id}`"
              class="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
            >
              Edit Tryout
            </RouterLink>
          </div>
        </header>

        <!-- CONTENT (FULL WIDTH) -->
        <div v-if="loading" class="px-6 py-6 text-slate-500">Memuat detail tryout...</div>
        <div v-else class="px-6 py-6 w-full">
          <!-- INFO TRYOUT -->
          <section class="bg-white rounded-xl border p-4 mb-6 grid md:grid-cols-5 gap-4 text-sm">
            <div>
              <p class="text-slate-500">Nama Tryout</p>
              <p class="font-medium">{{ tryout.paket }}</p>
            </div>
            <div>
              <p class="text-slate-500">Mapel</p>
              <p class="font-medium">{{ tryout.mapel_nama }}</p>
            </div>
            <div>
              <p class="text-slate-500">Jumlah Soal</p>
              <p class="font-medium">30</p>
            </div>
            <div>
              <p class="text-slate-500">Durasi</p>
              <p class="font-medium">{{ tryout.durasi_menit }} menit</p>
            </div>
            <div>
              <p class="text-slate-500">Status</p>
              <span
                class="px-2 py-1 text-xs rounded"
                :class="{
                  'bg-slate-200 text-slate-700': tryout.status === 'draft',
                  'bg-emerald-100 text-emerald-700': tryout.status === 'active',
                  'bg-blue-100 text-blue-700': tryout.status === 'finished'
                }"
              >
                {{ tryout.status === "draft" ? "Draft" : tryout.status === "active" ? "Aktif" : "Selesai" }}
              </span>
            </div>
          </section>

          <!-- PREVIEW SOAL (1 KOLOM FULL WIDTH) -->
          <section class="space-y-6">
            <div v-for="(item, index) in soal" :key="item.id" class="bg-white rounded-xl border p-6">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-semibold">
                  Soal {{ index + 1 }}
                  <span class="text-xs text-slate-500">
                    ({{ item.tipe === "pg" ? "Pilihan Ganda" : "Isian Singkat" }})
                  </span>
                </h3>

                <span v-if="item.tipe === 'pg'" class="text-xs bg-slate-100 px-2 py-1 rounded">
                  Kunci: {{ item.jawaban_label }}
                </span>

                <span v-else class="text-xs bg-slate-100 px-2 py-1 rounded">Jawaban: {{ item.jawaban }}</span>
              </div>

              <p class="mb-4 leading-relaxed">
                {{ item.pertanyaan }}
              </p>

              <!-- PILIHAN GANDA -->
              <ul v-if="item.tipe === 'pg'" class="space-y-2 text-sm">
                <li
                  v-for="opsi in item.opsi"
                  :key="opsi.id"
                  :class="opsi.is_correct ? 'font-semibold text-emerald-600' : ''"
                >
                  {{ opsi.label }}. {{ opsi.teks }}
                </li>
              </ul>

              <!-- PEMBAHASAN -->
              <div v-if="item.pembahasan" class="mt-4 p-4 bg-slate-50 rounded-lg text-sm">
                <p class="font-medium mb-1">Pembahasan:</p>
                {{ item.pembahasan }}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { RouterLink, useRoute } from "vue-router"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"

const route = useRoute()
const tryout = ref(null)
const soal = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [tryoutRes, soalRes] = await Promise.all([
      api.get(`/tryout/${route.params.id}`),
      api.get(`/tryout/${route.params.id}/soal`)
    ])

    tryout.value = tryoutRes.data
    soal.value = soalRes.data
  } catch (err) {
    console.error("Gagal mengambil detail tryout", err)
  } finally {
    loading.value = false
  }
})
</script>
