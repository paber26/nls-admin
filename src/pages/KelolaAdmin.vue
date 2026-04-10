<template>

    <AppShell>
    <template #header>
      <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          <h1 class="text-lg font-semibold text-slate-800">Kelola User</h1>
          <p class="text-sm text-slate-500">Atur role Peserta atau Admin</p>
        </div>

        <div class="shrink-0 text-left text-sm sm:text-right">
          <p class="font-medium text-slate-800">Admin</p>
          <p class="text-slate-500">Super Administrator</p>
        </div>
      </div>
    </template>

        <!-- Topbar -->
        

        <!-- Content -->
        <div class="px-6 py-8">
          <section class="bg-white rounded-xl border p-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 class="font-semibold text-slate-800">Daftar User</h3>
              <div class="flex items-center gap-3">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Cari nama / email"
                  class="px-4 py-2 border rounded-lg text-sm w-full sm:w-64"
                />
                <select
                  v-model="perPage"
                  class="px-4 py-2 border rounded-lg text-sm"
                >
                  <option :value="10">10 / halaman</option>
                  <option :value="20">20 / halaman</option>
                  <option :value="50">50 / halaman</option>
                </select>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-100">
                  <tr>
                    <th class="px-4 py-3 text-left">Nama</th>
                    <th class="px-4 py-3 text-left">Email</th>
                    <th class="px-4 py-3 text-center">Role</th>
                    <th class="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in paginatedUsers" :key="user.id" class="border-t">
                    <td class="px-4 py-3 font-medium">{{ user.name }}</td>
                    <td class="px-4 py-3">{{ user.email }}</td>
                    <td class="px-4 py-3 text-center">
                      <span
                        class="px-2 py-1 text-xs rounded"
                        :class="user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'"
                      >
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <select v-model="user.role" @change="updateRole(user)" class="px-2 py-1 border rounded text-xs">
                        <option value="peserta">Peserta</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- ================= PAGINATION ================= -->
            <div v-if="total > 0" class="flex justify-between items-center mt-6 text-sm text-slate-600">
              <span>
                Menampilkan {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, total) }} dari
                {{ total }} user
              </span>

              <div class="flex gap-2">
                <button
                  class="px-3 py-1 border rounded hover:bg-slate-50 transition disabled:opacity-50"
                  :disabled="currentPage === 1"
                  @click="changePage(currentPage - 1)"
                >
                  Prev
                </button>

                <button v-if="startPage > 1" class="px-3 py-1 border rounded hover:bg-slate-50 transition" @click="changePage(1)">1</button>
                <span v-if="startPage > 2" class="px-2">...</span>

                <button
                  v-for="page in visiblePages"
                  :key="page"
                  class="px-3 py-1 border rounded transition"
                  :class="page === currentPage ? 'bg-indigo-500 text-white border-indigo-500' : 'hover:bg-slate-50'"
                  @click="changePage(page)"
                >
                  {{ page }}
                </button>

                <span v-if="endPage < lastPage - 1" class="px-2">...</span>
                <button v-if="endPage < lastPage" class="px-3 py-1 border rounded hover:bg-slate-50 transition" @click="changePage(lastPage)">
                  {{ lastPage }}
                </button>

                <button
                  class="px-3 py-1 border rounded hover:bg-slate-50 transition disabled:opacity-50"
                  :disabled="currentPage === lastPage"
                  @click="changePage(currentPage + 1)"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
        </AppShell>
  
</template>

<script setup>
import AppShell from "@/components/layout/AppShell.vue"
import { ref, onMounted, computed, watch } from "vue"
import Sidebar from "../components/layout/Sidebar.vue"
import api from "@/services/api"

const users = ref([])

const searchQuery = ref("")
const currentPage = ref(1)
const perPage = ref(10)

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(u => 
    (u.name && u.name.toLowerCase().includes(query)) || 
    (u.email && u.email.toLowerCase().includes(query))
  )
})

const total = computed(() => filteredUsers.value.length)
const lastPage = computed(() => Math.ceil(total.value / perPage.value) || 1)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredUsers.value.slice(start, end)
})

// Validation to ensure currentPage doesn't exceed lastPage when filtering
watch([searchQuery, perPage], () => {
  currentPage.value = 1
})

const maxVisible = 5

const startPage = computed(() => {
  return Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
})

const endPage = computed(() => {
  return Math.min(lastPage.value, startPage.value + maxVisible - 1)
})

const visiblePages = computed(() => {
  const pages = []
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i)
  }
  return pages
})

const changePage = (page) => {
  if (page >= 1 && page <= lastPage.value) {
    currentPage.value = page
  }
}

onMounted(async () => {
  const res = await api.get("/users")
  users.value = res.data
})

const updateRole = async (user) => {
  await api.put(`/users/${user.id}/role`, {
    role: user.role
  })
}
</script>
