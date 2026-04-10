<template>
  <AppShell>
    <template #header>
      <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <RouterLink to="/cp-problems" class="text-slate-400 hover:text-indigo-600 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </RouterLink>
          <div>
            <h1 class="text-lg font-semibold text-slate-800">Edit Soal Native CP</h1>
            <p class="text-sm text-slate-500">Perbarui parameter soal, time limit, dan test case</p>
          </div>
        </div>
      </div>
    </template>

    <div class="px-6 py-6 font-poppins text-slate-800">

      <div v-if="pageLoading" class="p-12 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        Memuat data...
      </div>

      <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <!-- Kolom Utama: Form Dasar -->
        <div class="xl:col-span-2 space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 class="text-lg font-semibold border-b pb-2 mb-4">Informasi Dasar</h2>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Judul Soal</label>
              <input v-model="form.title" type="text" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="Misal: A Tambah B">
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Deskripsi & Instruksi</label>
              <ckeditor :editor="ClassicEditor" v-model="form.description_html" :config="editorConfig" />
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Batas Waktu (Detik)</label>
                <input v-model="form.time_limit" type="number" step="0.1" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Batas Memori (MB)</label>
                <input v-model="form.memory_limit" type="number" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Poin</label>
                <input v-model="form.points" type="number" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
            </div>
          </div>
          
          <div class="flex justify-end gap-3">
            <RouterLink to="/cp-problems" class="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition font-medium">Batal</RouterLink>
            <button @click="submit" :disabled="saving" class="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium flex items-center justify-center min-w-[120px]">
              <span v-if="saving" class="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full mr-2"></span>
              Simpan Perubahan
            </button>
          </div>
        </div>

        <!-- Kolom Kanan: Test Cases -->
        <div class="xl:col-span-1 space-y-4">
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center justify-between border-b pb-2 mb-4">
              <h2 class="text-lg font-semibold">Uji Kasus (Test Cases)</h2>
              <button @click="addTestCase" class="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded text-slate-700 font-medium transition">+ Tambah</button>
            </div>

            <div class="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
              <div v-for="(tc, i) in form.test_cases" :key="i" class="p-4 bg-slate-50 border border-slate-200 rounded-lg relative group">
                <button @click="form.test_cases.splice(i, 1)" class="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition">Hapus</button>
                <div class="text-sm font-semibold mb-2">Kasus #{{ i + 1 }}</div>
                
                <div class="mb-3">
                  <label class="block text-xs font-medium text-slate-600 mb-1">Input (STDIN)</label>
                  <textarea v-model="tc.input" rows="3" class="w-full text-xs font-mono rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                </div>
                <div class="mb-3">
                  <label class="block text-xs font-medium text-slate-600 mb-1">Expected Output (STDOUT)</label>
                  <textarea v-model="tc.expected_output" rows="3" class="w-full text-xs font-mono rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                </div>
                
                <div class="flex items-center gap-2">
                  <input type="checkbox" v-model="tc.is_hidden" :id="`hidden_${i}`" class="rounded text-indigo-600 focus:ring-indigo-500">
                  <label :for="`hidden_${i}`" class="text-xs text-slate-700 cursor-pointer">Hidden Case (Sembunyikan dari peserta)</label>
                </div>
              </div>
              
              <div v-if="form.test_cases.length === 0" class="text-center text-sm text-slate-500 py-6">
                Belum ada test case. Silakan tambah untuk mengevaluasi jawaban user nanti.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppShell from '@/components/layout/AppShell.vue'
import api from '@/services/api'
import { ClassicEditor, Essentials, Bold, Italic, BlockQuote, List, Link, Heading, Table, TableToolbar, TableColumnResize, TableProperties, TableCellProperties } from 'ckeditor5'

const router = useRouter()
const route = useRoute()
const saving = ref(false)
const pageLoading = ref(true)

const form = ref({
  title: '',
  description_html: '',
  time_limit: 1.0,
  memory_limit: 256,
  points: 100,
  test_cases: []
})

const editorConfig = {
  plugins: [Essentials, Bold, Italic, BlockQuote, List, Link, Heading, Table, TableToolbar, TableColumnResize, TableProperties, TableCellProperties],
  toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'insertTable', 'undo', 'redo'],
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
  }
}

const fetchProblem = async () => {
  try {
    const res = await api.get(`/cp-problems/${route.params.id}`)
    const problemData = res.data.data
    form.value = {
      title: problemData.title,
      description_html: problemData.description_html || '',
      time_limit: problemData.time_limit,
      memory_limit: problemData.memory_limit,
      points: problemData.points,
      test_cases: problemData.test_cases.map(tc => ({
        input: tc.input || '',
        expected_output: tc.expected_output || '',
        is_hidden: !!tc.is_hidden
      }))
    }
  } catch (err) {
    alert('Gagal memuat soal')
    router.push('/cp-problems')
  } finally {
    pageLoading.value = false
  }
}

const addTestCase = () => {
  form.value.test_cases.push({
    input: '',
    expected_output: '',
    is_hidden: true
  })
}

const submit = async () => {
  if (!form.value.title) return alert('Judul harus diisi!')
  
  saving.value = true
  try {
    await api.put(`/cp-problems/${route.params.id}`, form.value)
    router.push('/cp-problems')
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menyimpan soal')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchProblem()
})
</script>
