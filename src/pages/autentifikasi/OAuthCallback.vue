<template>
  <p>Logging in...</p>
  <p>gajelas ini</p>
</template>

<script setup>
import { onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

console.log("OAuthCallback Mounted")
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  // console.log("OAuth Callback Params:", params.toString())
  const token = params.get("token")

  if (token) {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("loggedIn", 1)

    window.location.href = "/"
  } else {
    router.push("/login")
  }
})
</script>
