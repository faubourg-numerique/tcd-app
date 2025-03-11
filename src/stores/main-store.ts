import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useMainStore = defineStore("main", () => {
    const isAuthenticated = ref(false);
    const isAuthorized = ref(false);
    const roles = reactive<string[]>([]);
    const user = reactive({
        username: "",
        email: "",
        given_name: "",
        family_name: "",
    });

    function hasRole(role: string) {
        return roles.includes(role);
    }

    function setUser(userData: { username: string, email: string, given_name?: string, family_name?: string, roles: { name: string }[] }) {
        user.username = userData.username;
        user.email = userData.email;
        user.given_name = userData.given_name || "";
        user.family_name = userData.family_name || "";
        roles.length = 0; 
        roles.push(...userData.roles.map(role => role.name));
    }

    function $reset() {
        isAuthenticated.value = false;
        isAuthorized.value = false;
        roles.length = 0;
        Object.assign(user, { username: "", email: "", given_name: "", family_name: "" });
    }

    return { isAuthenticated, isAuthorized, roles, user, hasRole, setUser, $reset };
});
