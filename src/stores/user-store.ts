import { defineStore } from "pinia";
import api from "@/api";

export const useUserStore = defineStore("user", () => {
    
    async function fetchUserPreferences(email: string) {
        try {
            const response = await api.get(`/users/${email}`);
            console.log("Préférences récupérées:", response);
            return response.data; 
        } catch (error) {
            console.error("Erreur lors de la récupération des préférences:", error);
            throw error;
        }
    }

    async function updateUserPreferences(email: string, gristApiKey: string, gristDocId: string) {
        try {
            const response = await api.put("/users", { email, gristApiKey, gristDocId });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour des préférences:", error);
            throw error;
        }
    }

return { fetchUserPreferences, updateUserPreferences };
});
