import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { createPinia } from "pinia";
import swal from "sweetalert2";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

import App from "@/App.vue";
import frDialogs from "@/locales/fr/dialogs.json";
import frMain from "@/locales/fr/main.json";
import enDialogs from "@/locales/en/dialogs.json";
import enMain from "@/locales/en/main.json";
import router from "@/router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas);
library.add(far);
library.add(fab);

const app = createApp(App);

const i18n = createI18n({
    legacy: false,
    locale: "en",
    //locale: navigator.language,
    fallbackLocale: "fr",
    messages: {
        en: {
            main: enMain,
            dialogs: enDialogs,
        },
        fr: {
            main: frMain,
            dialogs: frDialogs,
        },
    },
});

const pinia = createPinia();

app.config.errorHandler = (error) => {
    console.error(error);

    swal.fire({
        icon: "error",
        title: "An error has occured",
        text: error as string,
        customClass: {
            htmlContainer: "pre",
        },
    });
};

app.component("FontAwesomeIcon", FontAwesomeIcon);

app.use(i18n);
app.use(pinia);
app.use(router);

app.mount("#app");
