import { createRouter, createWebHistory } from "vue-router"

import Home from "../pages/Home.vue"
import About from "../pages/About.vue"
import Dashboard from "../pages/Dashboard.vue"
import Peserta from "../pages/Peserta.vue"
import Banksoal from "../pages/Banksoal.vue"
import Sekolah from "../pages/Sekolah.vue"
import Sekolahdetail from "../pages/SekolahDetail.vue"

import Tryout from "../pages/Tryout.vue"
import TryoutDetail from "../pages/TryoutDetail.vue"
import TryoutDetailEdit from "../pages/TryoutDetailEdit.vue"
import TryoutTambahPaket from "../pages/TryoutTambahPaket.vue"

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
    path: "/peserta",
    name: "Peserta",
    component: Peserta
  },
  {
    path: "/tryout",
    name: "Tryout",
    component: Tryout
  },
  {
    path: "/tryout/detail",
    name: "TryoutDetail",
    component: TryoutDetail
  },
  {
    path: "/tryout/detailedit",
    name: "TryoutDetailEdit",
    component: TryoutDetailEdit
  },
  {
    path: "/tryout/tambahpaket",
    name: "TryoutTambahPaket",
    component: TryoutTambahPaket
  },
  {
    path: "/banksoal",
    name: "Banksoal",
    component: Banksoal
  },
  {
    path: "/peringkat",
    name: "Peringkat",
    component: Peringkat
  },
  {
    path: "/sekolah",
    name: "Sekolah",
    component: Sekolah
  },
  {
    path: "/sekolah/detail/:id",
    name: "Sekolahdetail",
    component: Sekolahdetail
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
