import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { createPinia } from "pinia";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import App from "@/App.vue";
import router from "@/router";

import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

library.add(fas);
library.add(far);
library.add(fab);

const i18n = createI18n({
    legacy: false,
    locale: window.navigator.language,
    fallbackLocale: "en",
    messages: { en, fr },
});

const pinia = createPinia();

const app = createApp(App);

app.component("FontAwesomeIcon", FontAwesomeIcon);

app.use(i18n);
app.use(pinia);
app.use(router);

app.mount("#app");
