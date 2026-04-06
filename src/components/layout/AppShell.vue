<template>
  <div :class="['min-h-screen font-poppins', shellClass]">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] lg:hidden cursor-pointer"
      @click="closeSidebar"
    ></div>

    <Sidebar :open="sidebarOpen" @close="closeSidebar" @open="openSidebar" />

    <div
      class="min-h-screen flex flex-col transition-[padding] duration-300 ease-out"
      :class="sidebarOpen ? 'lg:pl-64' : 'lg:pl-[4.5rem]'"
    >
      <header
        class="sticky top-0 z-30"
        :class="hasHeaderSlot ? 'border-b border-slate-200/80 bg-white/92 backdrop-blur' : 'bg-transparent'"
      >
        <div class="flex items-center gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-900 hover:shadow cursor-pointer"
            @click="toggleSidebar"
          >
            <span class="sr-only">{{ sidebarOpen ? "Sembunyikan sidebar" : "Tampilkan sidebar" }}</span>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div class="min-w-0 flex-1">
            <slot
              v-if="hasHeaderSlot"
              name="header"
              :sidebar-open="sidebarOpen"
              :toggle-sidebar="toggleSidebar"
            />
          </div>
        </div>
      </header>

      <main class="min-w-0 flex-1 flex flex-col overflow-x-hidden">
        <slot :sidebar-open="sidebarOpen" :toggle-sidebar="toggleSidebar" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch, useSlots, computed } from "vue"
import { useRoute } from "vue-router"
import Sidebar from "./Sidebar.vue"

const props = defineProps({
  shellClass: {
    type: String,
    default: "bg-bgsoft"
  }
})

const route = useRoute()
const slots = useSlots()
const hasHeaderSlot = computed(() => !!slots.header)

const SIDEBAR_STORAGE_KEY = "nls_osn_admin_sidebar_open"

const getDesktopSidebarState = () => {
  if (typeof window === "undefined") return true
  if (window.innerWidth < 1024) return false
  const savedState = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
  return savedState === null ? true : savedState === "true"
}

const sidebarOpen = ref(getDesktopSidebarState())

const persistDesktopSidebarState = (isOpen) => {
  if (typeof window !== "undefined" && window.innerWidth >= 1024) {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isOpen))
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
  persistDesktopSidebarState(sidebarOpen.value)
}

const closeSidebar = () => {
  sidebarOpen.value = false
  persistDesktopSidebarState(false)
}

const openSidebar = () => {
  sidebarOpen.value = true
  persistDesktopSidebarState(true)
}

const syncSidebarWithViewport = () => {
  if (typeof window === "undefined") return
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
    return
  }
  sidebarOpen.value = getDesktopSidebarState()
}

onMounted(() => {
  syncSidebarWithViewport()
  if (typeof window !== "undefined") {
    window.addEventListener("resize", syncSidebarWithViewport)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", syncSidebarWithViewport)
  }
})

watch(
  () => route.fullPath,
  () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      closeSidebar()
    }
  }
)
</script>
