import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/api";

export const useGristStore = defineStore("gristStore", () => {
    // State
    const deviceMeasurementId = ref(null);
    const apiKey = ref(null);
    const docId = ref(null);
    const fromDate = ref(null);  
    const toDate = ref(null);    
    const loading = ref(false);
    const error = ref(null);
    const responseData = ref(null);  // ✅ Stocke la réponse ici

    // Vérifie si toutes les données sont prêtes à être envoyées
    const canSend = computed(() => 
        deviceMeasurementId.value && apiKey.value && docId.value && fromDate.value && toDate.value
    );

    // Action : Envoie les données au backend
    async function sendDataToBackend() {
        if (!canSend.value) {
            console.warn("⚠️ Tous les champs ne sont pas remplis !");
            return;
        }

        console.log("📤 Données envoyées :", {
            deviceMeasurementId: deviceMeasurementId.value,
            apiKey: apiKey.value,
            docId: docId.value,
            fromDate: fromDate.value,
            toDate: toDate.value,
        });

        loading.value = true;
        error.value = null;

        try {
            const response = await api.post("/send-to-grist", {
                deviceMeasurementId: deviceMeasurementId.value,
                apiKey: apiKey.value,
                docId: docId.value,
                fromDate: fromDate.value,  
                toDate: toDate.value       
            });

            responseData.value = response.data;  // ✅ Stocke la réponse
           
        } catch (err) {
            console.error("❌ Erreur d'envoi :", err.response?.data || err.message);
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    return { 
        deviceMeasurementId, apiKey, docId, fromDate, toDate, loading, error, canSend, sendDataToBackend, responseData 
    };
});
