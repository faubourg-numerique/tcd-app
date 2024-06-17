import './assets/main.css'
const userLanguage = window.navigator.language

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import fr from './locales/fr.json'

import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

library.add(fas)
library.add(far)
library.add(fab)

const i18n = createI18n({
  legacy: false,
  locale: userLanguage,
  fallbackLocale: 'en',
  messages: {
    en: en,
    fr: fr
  }
})

const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
