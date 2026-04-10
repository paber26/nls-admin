<template>

    <AppShell>
    <template #header>
      <div>
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Buat Tryout Baru</h1>
            <p class="text-sm text-slate-500">Konfigurasi awal tryout sebelum ditambahkan soal</p>
          </div>

          <RouterLink to="/tryout" class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100">← Kembali</RouterLink>
              </div>
    </template>

        <!-- TOPBAR -->
        

        <!-- CONTENT -->
        <div class="px-6 py-6 w-full">
          <form class="space-y-6" @submit.prevent="submitTryout">
            <!-- INFORMASI UTAMA -->
            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Nama Tryout</label>
                <input
                  type="text"
                  class="w-full mt-1 px-4 py-2 border rounded-lg"
                  placeholder="Contoh: Tryout KSN Matematika #1"
                  v-model="form.paket"
                />
                <p v-if="errors.paket" class="text-xs text-red-500 mt-1">
                  {{ errors.paket }}
                </p>
              </div>

              <div>
                <label class="text-sm text-slate-500">Kategori</label>
                <div class="w-full mt-1 px-4 py-2 border rounded-lg bg-slate-100 text-slate-700">OSN SMA</div>
              </div>

              <div>
                <label class="text-sm text-slate-500">Mata Pelajaran</label>
                <select class="w-full mt-1 px-4 py-2 border rounded-lg" v-model="form.mapel_id">
                  <option value="">Pilih Mata Pelajaran</option>
                  <option v-for="mapel in mapels" :key="mapel.id" :value="mapel.id">
                    {{ mapel.nama }}
                  </option>
                </select>
                <p v-if="errors.mapel_id" class="text-xs text-red-500 mt-1">
                  {{ errors.mapel_id }}
                </p>
              </div>

              <div>
                <label class="text-sm text-slate-500">Durasi (menit)</label>
                <input
                  type="number"
                  class="w-full mt-1 px-4 py-2 border rounded-lg"
                  placeholder="Contoh: 120"
                  v-model="form.durasi_menit"
                />
                <p v-if="errors.durasi_menit" class="text-xs text-red-500 mt-1">
                  {{ errors.durasi_menit }}
                </p>
              </div>
            </section>

            <!-- JADWAL -->
            <section class="bg-white rounded-xl border p-6 grid md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Tanggal Mulai</label>
                <input type="date" class="w-full mt-1 px-4 py-2 border rounded-lg" v-model="form.mulai" />
                <p v-if="errors.mulai" class="text-xs text-red-500 mt-1">
                  {{ errors.mulai }}
                </p>
              </div>

              <div>
                <label class="text-sm text-slate-500">Tanggal Selesai</label>
                <input type="date" class="w-full mt-1 px-4 py-2 border rounded-lg" v-model="form.selesai" />
                <p v-if="errors.selesai" class="text-xs text-red-500 mt-1">
                  {{ errors.selesai }}
                </p>
              </div>

              <div>
                <label class="text-sm text-slate-500">Waktu Mulai</label>
                <input type="time" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Waktu Selesai</label>
                <input type="time" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
                  <input type="checkbox" v-model="useAccessKey" class="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500 border-slate-300" />
                  Gunakan Kunci Akses
                </label>
                <div v-if="useAccessKey" class="mt-3">
                  <label class="text-sm text-slate-500">Kunci Akses</label>
                  <input type="text" v-model="form.access_key" placeholder="Masukkan kunci akses..." class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />

                  <label class="text-sm text-slate-500 mt-3 block">Keterangan (tampil ke siswa)</label>
                  <input type="text" v-model="form.access_key_info" placeholder="Contoh: Hubungi admin..." class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
              </div>
            </section>

            <!-- ACTION -->
            <section class="flex gap-4 justify-end">
              <button
                type="submit"
                class="px-6 py-3 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-700"
              >
                Simpan & Lanjutkan
              </button>
            </section>
          </form>
        </div>
        </AppShell>
  
</template>

<script setup>
import AppShell from "@/components/layout/AppShell.vue"
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import api from "@/services/api"
import Sidebar from "../components/layout/Sidebar.vue"

const router = useRouter()

const form = ref({
  paket: "",
  mapel_id: "",
  durasi_menit: "",
  mulai: "",
  selesai: "",
  access_key: "",
  access_key_info: "Hubungi admin next level study untuk mendapatkan kunci akses.",
  is_active: 0
})

const useAccessKey = ref(false)

const errors = ref({})

const mapels = ref([])

const fetchMapel = async () => {
  try {
    const res = await api.get("/mapel")
    mapels.value = res.data.data || res.data
  } catch (err) {
    console.error("Gagal mengambil data mapel:", err)
  }
}

const loadDraftOrApi = () => {
  const draft = localStorage.getItem("draft_tryout")
  if (draft) {
    try {
      const parsed = JSON.parse(draft)
      form.value = {
        ...form.value,
        ...parsed
      }
      if (parsed.access_key) {
        useAccessKey.value = true
      }
    } catch (e) {
      // console.error("Gagal memuat draft tryout:", e)
    }
  }
}

onMounted(() => {
  loadDraftOrApi()
  fetchMapel()
})

const validateForm = () => {
  errors.value = {}

  if (!form.value.paket || form.value.paket.length < 3) {
    errors.value.paket = "Nama tryout minimal 3 karakter"
  }

  if (!form.value.mapel_id) {
    errors.value.mapel_id = "Mata pelajaran wajib dipilih"
  }

  if (!form.value.durasi_menit || form.value.durasi_menit <= 0) {
    errors.value.durasi_menit = "Durasi harus lebih dari 0 menit"
  }

  if (!form.value.mulai) {
    errors.value.mulai = "Tanggal mulai wajib diisi"
  }

  if (!form.value.selesai) {
    errors.value.selesai = "Tanggal selesai wajib diisi"
  }

  if (form.value.mulai && form.value.selesai && new Date(form.value.mulai) > new Date(form.value.selesai)) {
    errors.value.selesai = "Tanggal selesai harus setelah tanggal mulai"
  }

  return Object.keys(errors.value).length === 0
}

const submitTryout = async () => {
  if (!validateForm()) {
    return
  }

  // Jika opsi tidak dicentang, kosongkan akses key sebelum submit
  if (!useAccessKey.value) {
    form.value.access_key = ""
    form.value.access_key_info = ""
  }

  try {
    // simpan draft terakhir ke localStorage
    localStorage.setItem("draft_tryout_last", JSON.stringify(form.value))
    // simpan draft ke localStorage
    // const existing = localStorage.getItem("draft_tryout")
    // const drafts = existing ? JSON.parse(existing) : []

    // drafts.push({
    //   ...form.value,
    //   created_at: new Date().toISOString()
    // })

    localStorage.setItem("draft_tryout", JSON.stringify(form.value))

    // kirim ke backend
    const res = await api.post("/tryout", form.value)


    if (res.data?.success) {
      alert(res.data.message)
      localStorage.removeItem("draft_tryout")
      router.push("/tryout")
    } else {
      alert("Tryout tersimpan di draft, tapi gagal dikirim ke server")
    }
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menyimpan tryout")
  }
}
</script>
