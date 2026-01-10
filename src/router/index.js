import { createRouter, createWebHistory } from "vue-router"

import Home from "../pages/Home.vue"
import About from "../pages/About.vue"
import Dashboard from "../pages/Dashboard.vue"
import Tryout from "../pages/Tryout.vue"
import Peringkat from "../pages/Peringkat.vue"
import Persiapan from "../pages/TryoutPersiapan.vue"
import TryoutHasil from "../pages/TryoutHasil.vue"

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/tryout",
    name: "Tryout",
    component: Tryout
  },
  {
    path: "/peringkat",
    name: "Peringkat",
    component: Peringkat
  },
  {
    path: "/tryout/persiapan",
    name: "Persiapan",
    component: Persiapan
  },
  {
    path: "/tryout/hasil/:id",
    name: "TryoutHasil",
    component: TryoutHasil
  },
  {
    path: "/about",
    name: "About",
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
