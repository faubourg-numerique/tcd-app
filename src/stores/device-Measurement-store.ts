import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { useMainStore } from '@/stores/main-store';

export const useDeviceMeasurementStore = defineStore('deviceMeasurementStore', () => {
    const measurements = reactive<any[]>([]);
    
    
    const mainStore = useMainStore();

    function getDeviceMeasurement(deviceMeasurementId: string) {
        return measurements.find((measurement) => measurement.id === deviceMeasurementId);
    }

    async function fetchDeviceMeasurements() {
        try {
            const response = await mainStore.api.get('/device-measurements'); 
            measurements.push(...response.data);         
        } catch (error) {
            console.error('Erreur lors de la récupération des mesures des appareils:', error);
        }
    }

    return {  
        measurements,
        getDeviceMeasurement,
        fetchDeviceMeasurements
    };
});
