import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api";

export const useUserStore = defineStore('user', () => {
    async function getUsers() {
        const response = await api.get("/users");
        return response;
    }

    return { getUsers };
});
