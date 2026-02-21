<template>
  <div v-if="loading" class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-3 text-gray-500">Memuat data...</p>
    </div>
  </div>

  <Login v-else-if="!isAuthenticated" />
  <Isiformawal v-else-if="!profileComplete" />
  <RouterView v-else />
</template>

<script setup>
import { ref, onMounted } from "vue"
import { RouterView } from "vue-router"
import Login from "./pages/autentifikasi/login.vue"
import Isiformawal from "./pages/autentifikasi/Isiformawal.vue"
import api from "@/services/api"

const isAuthenticated = ref(false)
const profileComplete = ref(false)
const loading = ref(true)

console.log("API URL:", import.meta.env.VITE_API_URL)

onMounted(async () => {
  // 🔁 Handle OAuth callback token
  const params = new URLSearchParams(window.location.search)
  const oauthToken = params.get("token")

  if (oauthToken) {
    localStorage.setItem("auth_token", oauthToken)

    // bersihkan query param supaya tidak looping
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  const token = localStorage.getItem("auth_token")

  if (!token) {
    isAuthenticated.value = false
    loading.value = false
    return
  }

  try {
    const res = await api.get("/me")

    localStorage.setItem("dataapi", JSON.stringify(res.data))

    isAuthenticated.value = true

    // admin tidak perlu cek profil lengkap
    if (res.data.role === "admin") {
      profileComplete.value = true
    } else {
      profileComplete.value = !!res.data.sekolah_id
    }
  } catch (err) {
    console.log("TOKEN INVALID / BELUM LOGIN")
    isAuthenticated.value = false
  } finally {
    loading.value = false
  }
})
</script>
