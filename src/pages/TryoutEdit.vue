<template>

    <AppShell>
    <template #header>
      <div>
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Edit Tryout</h1>
            <p class="text-sm text-slate-500">{{ form.paket }}</p>
          </div>

          <div class="flex gap-3">
            <RouterLink
              :to="`/tryout/kelola/${route.params.id}`"
              class="px-4 py-2 rounded-lg border text-sm hover:bg-slate-100"
            >
              Kelola Soal
            </RouterLink>
          </div>
              </div>
    </template>

        <!-- TOPBAR -->
        

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
                <div class="w-full mt-1 px-4 py-2 border rounded-lg bg-slate-50 text-slate-700 font-medium">
                  OSN SMA
                </div>
              </div>

              <div>
                <label class="text-sm text-slate-500">Mata Pelajaran</label>
                <select class="w-full mt-1 px-4 py-2 border rounded-lg" v-model="form.mapel_id">
                  <option value="">Pilih Mata Pelajaran</option>
                  <option v-for="mapel in mapels" :key="mapel.id" :value="mapel.id">
                    {{ mapel.nama }}
                  </option>
                </select>
              </div>

              <div>
                <label class="text-sm text-slate-500">Durasi (menit)</label>
                <input type="number" v-model="form.durasi_menit" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Waktu Mulai</label>
                <input type="datetime-local" v-model="form.mulai" class="w-full mt-1 px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label class="text-sm text-slate-500">Waktu Selesai</label>
                <input type="datetime-local" v-model="form.selesai" class="w-full mt-1 px-4 py-2 border rounded-lg" />
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
                  <input type="text" v-model="form.access_key_info" placeholder="Contoh: Hubungi admin next level study..." class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
              </div>
            </section>

            <!-- KETENTUAN KHUSUS -->
            <section class="bg-white rounded-xl border p-6">
              <label class="text-sm text-slate-500">Ketentuan Khusus (ditampilkan sebelum mulai tryout)</label>
              <ckeditor :editor="editor" v-model="form.ketentuan_khusus" :config="editorConfig" class="mt-2" />
            </section>

            <!-- PESAN SETELAH SELESAI -->
            <section class="bg-white rounded-xl border p-6">
              <label class="text-sm text-slate-500">
                Pesan Setelah Selesai (ditampilkan setelah peserta submit tryout)
              </label>
              <ckeditor :editor="editor" v-model="form.pesan_selesai" :config="editorConfig" class="mt-2" />
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

        <!-- TOAST POPUP -->
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform translate-y-4 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform translate-y-4 opacity-0"
        >
          <div v-if="toast.show" class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl font-medium text-sm"
            :class="toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'">
            <svg v-if="toast.type === 'success'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ toast.message }}
          </div>
        </transition>
        </AppShell>
  
</template>

<script setup>
import AppShell from "@/components/layout/AppShell.vue"
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter, RouterLink, RouterView } from "vue-router"
import Sidebar from "../components/layout/Sidebar.vue"
import api from "../services/api"
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Link,
  List,
  ListProperties,
  Image,
  ImageToolbar,
  ImageStyle,
  ImageUpload,
  ImageResize,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties
} from "ckeditor5"

const route = useRoute()
const router = useRouter()

const editor = ClassicEditor

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return {
      upload: async () => {
        const file = await loader.file
        const data = new FormData()
        data.append("upload", file)

        const response = await api.post("/upload-image", data)

        return {
          default: response.data.url
        }
      }
    }
  }
}

const editorConfig = {
  licenseKey: "GPL",
  extraPlugins: [MyCustomUploadAdapterPlugin],
  plugins: [
    Essentials,
    Bold,
    Italic,
    Paragraph,
    Mention,
    Undo,
    Link,
    List,
    ListProperties,
    Image,
    ImageToolbar,
    ImageStyle,
    ImageUpload,
    ImageResize,
    Table,
    TableToolbar,
    TableProperties,
    TableCellProperties
  ],
  toolbar: ["undo", "redo", "|", "bold", "italic", "link", "bulletedList", "numberedList", "|", "insertTable", "uploadImage"],
  list: {
    properties: {
      styles: true,
      startIndex: true,
      reversed: true
    }
  },
  image: {
    toolbar: ["imageStyle:alignLeft", "imageStyle:alignCenter", "imageStyle:alignRight", "|", "resizeImage"],
    resizeOptions: [
      {
        name: "resizeImage:original",
        label: "Original",
        value: null
      },
      {
        name: "resizeImage:50",
        label: "50%",
        value: "50"
      },
      {
        name: "resizeImage:75",
        label: "75%",
        value: "75"
      }
    ]
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableProperties", "tableCellProperties"]
  }
}

const form = ref({
  paket: "",
  mapel_id: "",
  durasi_menit: "",
  mulai: "",
  selesai: "",
  access_key: "",
  access_key_info: "",
  ketentuan_khusus: "",
  pesan_selesai: ""
})

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})
let toastTimeout = null

const showToast = (message, type = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.value = { show: true, message, type }
  toastTimeout = setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const mapels = ref([])

const fetchMapel = async () => {
  try {
    const res = await api.get("/mapel")
    mapels.value = res.data.data || res.data
  } catch (err) {
    console.error("Gagal mengambil data mapel:", err)
  }
}

const statusOptions = computed(() => [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Aktif" },
  { value: "finished", label: "Selesai" }
])

const useAccessKey = ref(false)

onMounted(async () => {
  fetchMapel()
  try {
    const id = route.params.id
    const { data } = await api.get(`/tryout/${id}`)
    form.value = {
      paket: data.paket ?? "",
      mapel_id: data.mapel_id ?? "",
      durasi_menit: data.durasi_menit ?? "",
      mulai: (data.mulai || "").slice(0, 16),
      selesai: (data.selesai || "").slice(0, 16),
      access_key: data.access_key ?? "",
      access_key_info: data.access_key_info ?? "Hubungi admin next level study untuk mendapatkan kunci akses.",
      status: data.status ?? "",
      ketentuan_khusus: data.ketentuan_khusus ?? "",
      pesan_selesai: data.pesan_selesai ?? ""
    }
    useAccessKey.value = !!form.value.access_key
  } catch (err) {
    showToast("Gagal memuat tryout", "error")
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
      access_key: useAccessKey.value ? form.value.access_key : "",
      access_key_info: useAccessKey.value ? form.value.access_key_info : "",
      status: form.value.status,
      ketentuan_khusus: form.value.ketentuan_khusus,
      pesan_selesai: form.value.pesan_selesai
    }

    const res = await api.put(`/tryout/${id}`, payload)
    showToast(res.data.message || "Soal berhasil diperbarui", "success")
    setTimeout(() => {
      router.push("/tryout")
    }, 1500)
  } catch (err) {
    console.error("Gagal memperbarui tryout:", err)
    showToast("Gagal memperbarui tryout", "error")
  }
}
</script>
