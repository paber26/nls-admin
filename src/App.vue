<template>
  <Login v-if="loggedIn == 0 && proseslogin == 0"></Login>
  <Isiformawal v-else-if="datalengkap == 0 && proseslogin == 0"></Isiformawal>
  <RouterView v-else></RouterView>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { RouterView } from "vue-router"
import Login from "./pages/autentifikasi/login.vue"
import Isiformawal from "./pages/autentifikasi/Isiformawal.vue"
import api from "@/services/api"

const loggedIn = ref(localStorage.getItem("loggedIn") || 0)
const datalengkap = ref(localStorage.getItem("datalengkap") || 0)
const proseslogin = ref(0)

const urlParams = new URLSearchParams(window.location.search)
if (urlParams.get("token")) {
  proseslogin.value = 1
}

const params = new URLSearchParams(window.location.search)
const token = params.get("token")

onMounted(async () => {
  try {
    const res = await api.get("/me")

    // ✅ SIMPAN KE LOCALSTORAGE
    localStorage.setItem("dataapi", JSON.stringify(res.data))
    localStorage.setItem("loggedIn", 1)
    localStorage.setItem("datalengkap", 1)
  } catch (err) {
    console.log("BELUM LOGIN / TOKEN INVALID")
    localStorage.setItem("loggedIn", 0)
  }
})
</script>
