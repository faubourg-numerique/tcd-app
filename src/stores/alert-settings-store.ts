import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMainStore } from '@/stores/main-store';

export const useAlertSettingsStore = defineStore('alert-settings-store', () => {
    const alertSettings = ref([]);    
    const mainStore = useMainStore();

    async function getAlertSettings() {
        try {
            const response = await mainStore.api.get('/alert-settings'); 
            alertSettings.value = response.data;         
        } catch (error) {
            console.error('Erreur lors de la récupération des Alertes :', error);
        }
    }

    return {  
        alertSettings,
        getAlertSettings
    };
});
