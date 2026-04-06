<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 flex h-screen flex-col overflow-visible border-r border-slate-800 bg-slate-900 text-slate-200 shadow-2xl transition-[transform,width] duration-300 ease-out"
    :class="open ? 'w-64 translate-x-0' : '-translate-x-full w-64 lg:w-[4.5rem] lg:translate-x-0'"
  >
    <!-- Logo & Branding -->
    <div
      class="flex border-b border-slate-800"
      :class="open ? 'items-center px-6 py-5' : 'justify-center px-2 py-4 lg:flex-col lg:gap-3'"
    >
      <div v-if="!open" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white font-bold text-sm tracking-widest shadow-inner">
        OSN
      </div>
      <div v-if="open" class="flex-1 w-full truncate">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Next Level Study</p>
        <p class="mt-0.5 text-lg font-semibold text-white">OSN Admin</p>
      </div>
    </div>

    <!-- User Info Panel -->
    <div v-if="open && user" class="border-b border-slate-800 px-6 py-4">
      <template v-if="user.role === 'admin'">
        <p class="truncate text-xs text-slate-400">Administrator</p>
        <p class="truncate font-medium text-white">{{ user.name }}</p>
      </template>

      <template v-else>
        <p class="truncate text-xs text-slate-400">Siswa</p>
        <p class="truncate font-medium text-white">{{ user.name }}</p>
        <p class="truncate text-xs text-slate-400 mt-1">
          {{ user.sekolah_nama || "Sekolah belum diisi" }}
          <span v-if="user.kelas">• Kelas {{ user.kelas }}</span>
        </p>
      </template>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 space-y-1 px-3 py-4 text-sm overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
      
      <RouterLink
        to="/"
        class="group relative flex rounded-lg py-3 transition"
        :class="navItemClass(isActive('/'))"
        @click="handleNavigate"
      >
        <span class="text-xl leading-none px-1">📊</span>
        <span v-if="open">Dashboard</span>
        <span v-if="!open" :class="tooltipClass">Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/peserta"
        class="group relative flex rounded-lg py-3 transition"
        :class="navItemClass(isSectionActive('/peserta'))"
        @click="handleNavigate"
      >
        <span class="text-xl leading-none px-1">👨‍🎓</span>
        <span v-if="open">Peserta</span>
        <span v-if="!open" :class="tooltipClass">Peserta</span>
      </RouterLink>

      <RouterLink
        to="/tryout"
        class="group relative flex rounded-lg py-3 transition"
        :class="navItemClass(isSectionActive('/tryout'))"
        @click="handleNavigate"
      >
        <span class="text-xl leading-none px-1">📝</span>
        <span v-if="open">Tryout</span>
        <span v-if="!open" :class="tooltipClass">Tryout</span>
      </RouterLink>

      <RouterLink
        to="/monitoring-tryout"
        class="group relative flex rounded-lg py-3 transition"
        :class="navItemClass(isSectionActive('/monitoring-tryout'))"
        @click="handleNavigate"
      >
        <span class="text-xl leading-none px-1">📈</span>
        <span v-if="open">Monitoring Tryout</span>
        <span v-if="!open" :class="tooltipClass">Monitoring Tryout</span>
      </RouterLink>

      <RouterLink
        to="/banksoal"
        class="group relative flex rounded-lg py-3 transition"
        :class="navItemClass(isSectionActive('/banksoal'))"
        @click="handleNavigate"
      >
        <span class="text-xl leading-none px-1">📚</span>
        <span v-if="open">Bank Soal</span>
        <span v-if="!open" :class="tooltipClass">Bank Soal</span>
      </RouterLink>

      <RouterLink
        to="/peringkat"
        class="group relative flex rounded-lg py-3 transition"
        :class="navItemClass(isSectionActive('/peringkat'))"
        @click="handleNavigate"
      >
        <span class="text-xl leading-none px-1">🏆</span>
        <span v-if="open">Peringkat</span>
        <span v-if="!open" :class="tooltipClass">Peringkat</span>
      </RouterLink>

      <RouterLink
        to="/sekolah"
        class="group relative flex rounded-lg py-3 transition"
        :class="navItemClass(isSectionActive('/sekolah'))"
        @click="handleNavigate"
      >
        <span class="text-xl leading-none px-1">🏫</span>
        <span v-if="open">Sekolah</span>
        <span v-if="!open" :class="tooltipClass">Sekolah</span>
      </RouterLink>

      <RouterLink
        to="/kelolaadmin"
        class="group relative flex rounded-lg py-3 transition"
        :class="navItemClass(isSectionActive('/kelolaadmin'))"
        @click="handleNavigate"
      >
        <span class="text-xl leading-none px-1">🛠️</span>
        <span v-if="open">Kelola Admin</span>
        <span v-if="!open" :class="tooltipClass">Kelola Admin</span>
      </RouterLink>

      <RouterLink
        to="/integrasi-codeforces"
        class="group relative flex rounded-lg py-3 transition"
        :class="navItemClass(isSectionActive('/integrasi-codeforces'))"
        @click="handleNavigate"
      >
        <span class="text-xl leading-none px-1">🧑‍💻</span>
        <span v-if="open">Integrasi CF</span>
        <span v-if="!open" :class="tooltipClass">Integrasi Codeforces</span>
      </RouterLink>
    </nav>

    <!-- Logout Section -->
    <div class="border-t border-slate-800 px-3 py-4">
      <button
        type="button"
        class="group relative flex rounded-lg py-3 text-red-400 transition hover:bg-red-500/10 cursor-pointer"
        :class="open ? 'w-full items-center justify-start gap-3 px-4' : 'mx-auto h-12 w-12 items-center justify-center'"
        @click="handleLogout"
      >
        <span class="text-xl leading-none">🚪</span>
        <span v-if="open" class="font-medium">Logout</span>
        <span v-if="!open" :class="tooltipClass">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"

const props = defineProps({
  open: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(["close", "open"])

const route = useRoute()
const user = ref(null)

const tooltipClass =
  "pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-white shadow-xl ring-1 ring-white/10 group-hover:block"

const isActive = (path) => route.path === path
const isSectionActive = (prefix) => route.path.startsWith(prefix)

const navItemClass = (isCurrent) => [
  props.open ? "items-center justify-start gap-3 px-4" : "mx-auto h-12 w-12 items-center justify-center",
  isCurrent ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"
]

const handleNavigate = () => {
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    emit("close")
  }
}

onMounted(() => {
  const savedUser = localStorage.getItem("dataapi")
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }
})

const handleLogout = () => {
  localStorage.removeItem("auth_token")
  localStorage.removeItem("dataapi")
  localStorage.removeItem("datalengkap")
  localStorage.removeItem("loggedIn")
  localStorage.removeItem("draft_banksoal")

  window.location.href = "/login"
}
</script>
<style scoped>
/* Optional tiny scrollbar logic */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 10px;
}
</style>
