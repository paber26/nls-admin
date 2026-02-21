<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="bg-white shadow-lg rounded-2xl p-10 text-center w-full max-w-md">
      <div class="flex justify-center mb-6">
        <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 class="text-xl font-semibold text-slate-800 mb-2">Sedang Masuk...</h2>
      <p class="text-slate-500 text-sm">Mohon tunggu sebentar, kami sedang memverifikasi akun Anda.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

console.log("OAuthCallback Mounted")
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const token = params.get("token")

  if (token) {
    localStorage.setItem("auth_token", token)

    // minimal loading 1 detik agar animasi terlihat
    setTimeout(() => {
      router.replace("/")
    }, 1000)
  } else {
    setTimeout(() => {
      router.replace("/login")
    }, 1000)
  }
})
</script>
