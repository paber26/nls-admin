<template>
  <body class="bg-bgsoft font-poppins">
    <div class="flex min-h-screen">
      <Sidebar></Sidebar>

      <!-- MAIN -->
      <main class="flex-1">
        <!-- TOPBAR -->
        <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Edit Tryout</h1>
            <p class="text-sm text-slate-500">{{ form.paket }}</p>
          </div>

          <div class="flex gap-3">
            <RouterLink
              :to="`/admin-tryout/${route.params.id}`"
              class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100"
            >
              Preview
            </RouterLink>
            <RouterLink
              :to="`/tryout/kelola/${route.params.id}`"
              class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100"
            >
              Kelola Soal
            </RouterLink>
          </div>
        </header>

        <!-- CONTENT -->
        <div class="px-6 py-6 w-full">
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <!-- INFORMASI UTAMA -->
            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Nama Tryout</label>
                <input type="text" v-model="form.paket" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Kategori</label>
                <select disabled class="w-full mt-1 px-4 py-2 border rounded-lg">
                  <option selected value="KSN SMA">KSN SMA</option>
                  <option value="OSN SMA">OSN SMA</option>
                  <option value="Simulasi Nasional">Simulasi Nasional</option>
                  <option value="Tryout Sekolah">Tryout Sekolah</option>
                </select>
              </div>

              <div>
                <label class="text-sm text-slate-500">Mata Pelajaran</label>
                <select class="w-full mt-1 px-4 py-2 border rounded-lg" v-model="form.mapel_nama">
                  <option value="Matematika">Matematika</option>
                  <option value="Fisika">Fisika</option>
                  <option value="Kimia">Kimia</option>
                  <option value="Biologi">Biologi</option>
                  <option value="Informatika">Informatika</option>
                  <option value="Astronomi">Astronomi</option>
                  <option value="Ekonomi">Ekonomi</option>
                  <option value="Geografi">Geografi</option>
                  <option value="Kebumian">Kebumian</option>
                </select>
              </div>

              <div>
                <label class="text-sm text-slate-500">Durasi (menit)</label>
                <input type="number" v-model="form.durasi_menit" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>
            </section>

            <!-- JADWAL -->
            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Tanggal Mulai</label>
                <input type="datetime-local" v-model="form.mulai" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Tanggal Selesai</label>
                <input type="datetime-local" v-model="form.selesai" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>
            </section>

            <!-- STATUS -->
            <section class="bg-white rounded-xl border p-6 grid gap-2">
              <label class="text-sm text-slate-500">Status Tryout</label>
              <select v-model="form.status" class="w-full px-4 py-2 border rounded-lg">
                <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </section>

            <!-- ACTION -->
            <section class="flex gap-4">
              <button
                type="submit"
                class="px-6 py-3 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-700"
              >
                Simpan Perubahan
              </button>

              <RouterLink to="/tryout" class="px-6 py-3 rounded-lg border hover:bg-slate-100">Batal</RouterLink>
            </section>
          </form>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter, RouterLink, RouterView } from "vue-router"
import Sidebar from "../components/layout/Sidebar.vue"
import api from "../services/api"

const route = useRoute()
const router = useRouter()

const form = ref({
  paket: "",
  mapel_id: "",
  mapel_nama: "",
  durasi_menit: "",
  mulai: "",
  selesai: ""
})

const statusOptions = computed(() => [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Aktif" },
  { value: "finished", label: "Selesai" }
])

onMounted(async () => {
  try {
    const id = route.params.id
    const { data } = await api.get(`/tryout/${id}`)
    form.value = {
      paket: data.paket ?? "",
      mapel_id: data.mapel_id ?? "",
      mapel_nama: data.mapel_nama ?? "",
      durasi_menit: data.durasi_menit ?? "",
      mulai: data.mulai ?? "",
      selesai: data.selesai ?? "",
      status: data.status ?? ""
    }
  } catch (err) {
    // handle error, e.g. notify user
  }
})

const handleSubmit = async () => {
  try {
    const id = route.params.id
    const payload = {
      paket: form.value.paket,
      mapel_id: Number(form.value.mapel_id),
      durasi_menit: Number(form.value.durasi_menit),
      mulai: form.value.mulai,
      selesai: form.value.selesai,
      status: form.value.status
    }

    const res = await api.put(`/tryout/${id}`, payload)
    alert(res.data.message || "Soal berhasil diperbarui")
    router.push("/tryout")
  } catch (err) {
    console.error("Gagal memperbarui tryout:", err)
    // handle error, e.g. notify user
  }
}
</script>
