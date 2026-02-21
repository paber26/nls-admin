import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import router from "./router"
// import { CKEditor } from "@ckeditor/ckeditor5-vue"
// import { CkeditorPlugin } from "@ckeditor/ckeditor5-vue"
// import { CkeditorPlugin } from "@ckeditor/ckeditor5-vue"
// import "ckeditor5/ckeditor5.css" // CSS sekarang jadi satu
import { CkeditorPlugin } from "@ckeditor/ckeditor5-vue" // Sesuai Gambar 1
import "ckeditor5/ckeditor5.css"
// import CKEditor from "@ckeditor/ckeditor5-vue"

// import * as CKTest from "@ckeditor/ckeditor5-vue"
// console.log("Isi CKEditor Package:", CKTest)

const app = createApp(App)
app.use(router)
// app.use(CKEditor.default || CKEditor)
app.use(CkeditorPlugin)
// app.use(CKEditor)
app.mount("#app")

// const app = createApp(App)

// app.use(CKEditor)

// app.mount("#app")
