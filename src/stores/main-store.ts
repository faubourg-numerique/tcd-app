import axios, { type AxiosInstance } from "axios";
import { defineStore } from "pinia";
import { ref, type Ref, reactive } from "vue";

export const useMainStore = defineStore("main", () => {
    const api: AxiosInstance = axios.create();
    const username: Ref<string> = ref("");
    const roles: string[] = reactive([]);
    const isAuthenticated: Ref<boolean> = ref(false);
    const isAuthorized: Ref<boolean> = ref(false);

    function $reset() {
        username.value = "";
        roles.length = 0;
        isAuthenticated.value = false;
        isAuthorized.value = false;
    }

    return { api, username, roles, isAuthenticated, isAuthorized, $reset };
});
