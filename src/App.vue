<template>
  <Login v-if="loggedIn == 0"></Login>
  <Isiformawal v-else-if="datalengkap == 0"></Isiformawal>
  <RouterView></RouterView>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Login from "./pages/autentifikasi/login.vue";
import Isiformawal from "./pages/autentifikasi/Isiformawal.vue";
</script>

<script>
localStorage.setItem("loggedIn", 1)
localStorage.setItem("datalengkap", 1)
export default {
  data() {
    return {
      loggedIn: localStorage.getItem("loggedIn"),
      datalengkap: localStorage.getItem("datalengkap")
    }
  },

  mounted() {
    if (this.loggedIn) {
      // console.log("oke dang")
    }
  }
}
</script>
