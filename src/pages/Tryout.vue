<template>
  <div class="flex min-h-screen bg-bgsoft font-poppins">
    <Sidebar />

    <main class="flex-1 px-6 py-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-lg font-semibold">Tryout</h1>
          <p class="text-sm text-slate-500">Daftar tryout yang tersedia</p>
        </div>

        <RouterLink to="/tryout/tambah" class="px-4 py-2 bg-primary text-white rounded-lg text-sm">
          ➕ Tambah Tryout
        </RouterLink>
      </div>

      <!-- Table -->
      <section class="bg-white rounded-xl border overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-100">
            <tr>
              <th class="px-4 py-3 text-left">Nama Paket</th>
              <th class="px-4 py-3 text-left">Mapel</th>
              <th class="px-4 py-3 text-center">Periode</th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="px-4 py-3 text-center">Pembuat</th>
              <th class="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-6 text-center text-slate-400">Memuat data...</td>
            </tr>

            <tr v-for="item in tryouts" :key="item.id" class="border-t">
              <td class="px-4 py-3 font-medium">{{ item.paket }}</td>
              <td class="px-4 py-3">{{ item.mapel }}</td>

              <td class="px-4 py-3 text-center text-xs text-slate-600">
                <div class="flex flex-col leading-tight">
                  <span>{{ formatDate(item.mulai) }}</span>
                  <span class="text-slate-400">s/d</span>
                  <span>{{ formatDate(item.selesai) }}</span>
                </div>
              </td>

              <td class="px-4 py-3 text-center">
                <span
                  class="px-2 py-1 text-xs rounded font-medium"
                  :class="{
                    'bg-slate-200 text-slate-700': item.status === 'draft',
                    'bg-emerald-100 text-emerald-700': item.status === 'active',
                    'bg-blue-100 text-blue-700': item.status === 'finished'
                  }"
                >
                  {{ item.status === "draft" ? "Draft" : item.status === "active" ? "Aktif" : "Selesai" }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">{{ item.pembuat }}</td>
              <td class="px-4 py-3 text-center space-x-2">
                <RouterLink :to="`/tryout/detail/${item.id}`" class="text-xs text-primary hover:underline">
                  Detail
                </RouterLink>
                <RouterLink :to="`/tryout/edit/${item.id}`" class="text-xs text-slate-600 hover:underline">
                  Edit
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { RouterLink } from "vue-router"
import api from "@/services/api"
import Sidebar from "@/components/layout/Sidebar.vue"

const tryouts = ref([])
const loading = ref(true)

const formatDate = (datetime) => {
  if (!datetime) return "-"
  const date = new Date(datetime)
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

onMounted(async () => {
  const res = await api.get("/tryout")
  console.log("Tes Tryout API Response:", res.data)
  tryouts.value = res.data
  loading.value = false
})
</script>
