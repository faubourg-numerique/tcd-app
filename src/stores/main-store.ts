import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useMainStore = defineStore("main", () => {
    const isAuthenticated = ref(false);
    const isAuthorized = ref(false);
    const roles: string[] = reactive([]);
    const username = ref("");

    function $reset() {
        isAuthenticated.value = false;
        isAuthorized.value = false;
        roles.length = 0;
        username.value = "";
    }

    return { isAuthenticated, isAuthorized, roles, username, $reset };
});
