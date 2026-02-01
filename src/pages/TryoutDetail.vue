<template>
  <div class="bg-bgsoft font-poppins min-h-screen flex">
    <Sidebar />

    <main class="flex-1">
      <!-- TOPBAR -->
      <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-lg font-semibold">Detail Tryout</h1>
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

      <!-- CONTENT -->
      <div v-if="loading" class="px-6 py-6 text-slate-500">Memuat detail tryout...</div>

      <div v-else class="px-6 py-6">
        <!-- INFO TRYOUT -->
        <section class="bg-white rounded-xl border p-4 mb-6 grid md:grid-cols-5 gap-4 text-sm">
          <div>
            <p class="text-slate-500">Nama Tryout</p>
            <p class="font-medium">{{ tryout?.paket }}</p>
          </div>

          <div>
            <p class="text-slate-500">Mapel</p>
            <p class="font-medium">{{ tryout?.mapel_nama }}</p>
          </div>

          <div>
            <p class="text-slate-500">Jumlah Soal</p>
            <p class="font-medium">{{ soalList.length }}</p>
          </div>

          <div>
            <p class="text-slate-500">Total Poin</p>
            <p class="font-medium">{{ totalPoin }}</p>
          </div>

          <div>
            <p class="text-slate-500">Durasi</p>
            <p class="font-medium">{{ tryout?.durasi_menit }} menit</p>
          </div>

          <div>
            <p class="text-slate-500">Status</p>
            <span
              class="px-2 py-1 text-xs rounded"
              :class="{
                'bg-slate-200 text-slate-700': tryout?.status === 'draft',
                'bg-emerald-100 text-emerald-700': tryout?.status === 'active',
                'bg-blue-100 text-blue-700': tryout?.status === 'finished'
              }"
            >
              {{ tryout?.status }}
            </span>
          </div>
        </section>

        <!-- PREVIEW SOAL -->
        <section class="space-y-6">
          <div v-for="(item, index) in soalList" :key="item.id" class="bg-white rounded-xl border p-6">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-semibold">
                Soal {{ index + 1 }}
                <span class="text-xs text-slate-500">
                  ({{ item.tipe === "pg" ? "Pilihan Ganda" : "Isian Singkat" }})
                </span>
              </h3>
            </div>

            <p class="mb-4 leading-relaxed">
              {{ item.pertanyaan }}
            </p>

            <!-- OPSI PG -->
            <ul v-if="item.tipe === 'pg'" class="space-y-2 text-sm">
              <li
                v-for="opsi in item.opsi"
                :key="opsi.id"
                class="flex justify-between items-center"
                :class="opsi.is_correct ? 'font-semibold text-emerald-600' : ''"
              >
                <span>{{ opsi.label }}. {{ opsi.teks }}</span>

                <span class="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">{{ opsi.poin }} poin</span>
              </li>
            </ul>

            <!-- JAWABAN / KUNCI -->
            <div class="mb-3 text-sm">
              <span v-if="item.tipe === 'pg'" class="inline-block bg-slate-100 px-3 py-1 rounded font-medium">
                Kunci: {{ item.jawaban_label }}
              </span>

              <span v-else class="inline-block bg-slate-100 px-3 py-1 rounded font-medium">
                Jawaban: {{ item.jawaban }}
              </span>
            </div>

            <!-- POIN -->
            <div class="mb-2 text-sm">
              <span class="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded font-medium">
                Poin: {{ item.poin }}
              </span>
            </div>

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
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { RouterLink, useRoute } from "vue-router"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"

const route = useRoute()

const tryout = ref(null)
const soalList = ref([])
const totalPoin = computed(() => {
  return soalList.value.reduce((total, soal) => {
    return total + (Number(soal.poin) || 0)
  }, 0)
})
const loading = ref(true)

onMounted(async () => {
  try {
    const [tryoutRes, soalRes] = await Promise.all([
      api.get(`/tryout/${route.params.id}`),
      api.get(`/tryout/${route.params.id}/soal-detail`)
    ])

    tryout.value = tryoutRes.data
    console.log("Tryout Res Data:", tryout.value)
    soalList.value = soalRes.data
    console.log("Soal Value:", soalList.value)
  } catch (err) {
    console.error("Gagal mengambil detail tryout", err)
  } finally {
    loading.value = false
  }
})
</script>
