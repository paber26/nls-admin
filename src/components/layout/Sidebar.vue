<template>
  <!-- ================= SIDEBAR ================= -->
  <aside class="w-64 bg-slate-900 text-slate-200 flex flex-col">
    <!-- Logo -->
    <div class="px-6 py-5 text-lg font-semibold border-b border-slate-800">Next Level Study</div>

    <!-- User Info -->
    <div class="px-6 py-4 border-b border-slate-800">
      <p class="text-xs text-slate-400">Siswa</p>
      <p class="font-medium">Aldo</p>
      <p class="text-xs text-slate-400">SMA • Kelas XI</p>
    </div>

    <!-- Menu -->
    <nav class="flex-1 px-3 py-4 space-y-1 text-sm">
      <RouterLink
        to="/"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition"
        :class="$route.path === '/' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-300'"
      >
        🏠
        <span>Beranda</span>
      </RouterLink>

      <RouterLink
        to="/tryout"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition"
        :class="isTryoutRoute ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-300'"
      >
        📝
        <span>Tryout</span>
      </RouterLink>

      <RouterLink
        to="/peringkat"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition"
        :class="$route.path === '/peringkat' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-300'"
      >
        🏆
        <span>Peringkat</span>
      </RouterLink>
    </nav>

    <!-- Logout -->
    <div class="px-3 py-4 border-t border-slate-800">
      <a
        href="login.html"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
      >
        🚪
        <span>Logout</span>
      </a>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from "vue-router"
import { computed } from "vue"

const route = useRoute()

const isTryoutRoute = computed(() => route.path.startsWith("/tryout")).value
</script>
