// stores/device-measurement-store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMainStore } from '@/stores/main-store';

export const useDeviceMeasurementStore = defineStore('deviceMeasurementStore', () => {
    const measurements = ref([]);
    
    
    const mainStore = useMainStore();

    async function getDeviceMeasurements() {
        try {
            const response = await mainStore.api.get('/DeviceMeasurements');
            measurements.value = response.data;
            console.log(measurements.value);
        } catch (error) {
            console.error('Erreur lors de la récupération des mesures des appareils:', error);
        }
    }

    return {
        measurements,
        getDeviceMeasurements
    };
});
