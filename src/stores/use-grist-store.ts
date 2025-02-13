import { defineStore } from "pinia";
import axios from "axios";
import type { DeviceMeasurementRow } from "@/types/DeviceMeasurementRow";
import type { DeviceMeasurement } from "@/types/DeviceMeasurement";

export const useGristStore = defineStore("grist", {
  state: () => ({
    apiKey: "",
    docId: "",
  }),
  actions: {
    async initializeGrist() {
      this.apiKey = prompt("Veuillez entrer votre clé API Grist :") || "";
      this.docId = prompt("Veuillez entrer votre ID de document Grist :") || "";
    },

    async sendDataToGrist(deviceMeasurement: DeviceMeasurement, deviceMeasurementRows: DeviceMeasurementRow[]) {
      if (!this.apiKey || !this.docId) {
        await this.initializeGrist();
      }
      
      const GRIST_API_URL_CURRENT = `${import.meta.env.VITE_GRIST_API_URL}/docs/${this.docId}/tables/Current/records`;
      const GRIST_API_URL_HISTORY = `${import.meta.env.VITE_GRIST_API_URL}/docs/${this.docId}/tables/History/records`;
      
      try {
        // ✅ Envoi des données actuelles
        await axios.post(GRIST_API_URL_CURRENT, {
          records: [
            {
              fields: {
                "idDevice": deviceMeasurement.id,
                "distance": deviceMeasurement.distance ?? null,
                "humidity": deviceMeasurement.humidity ?? null,
                "measurementtype": deviceMeasurement.measurementType ?? null,
                "name": deviceMeasurement.name ?? null,
                "pressure": deviceMeasurement.pressure ?? null,
                "refDevice": deviceMeasurement.refDevice ?? null,
                "temperature": deviceMeasurement.temperature ?? null,
                "vdd": deviceMeasurement.vdd ?? null,
              },
            },
          ],
        }, {
          headers: { "Authorization": `Bearer ${this.apiKey}` }
        });

        // ✅ Envoi des données historiques si elles existent
        if (deviceMeasurementRows.length > 0) {
          const recordsHistory = deviceMeasurementRows.map(row => ({
            fields: {
              "idDevice": deviceMeasurement.id,
              "datetime": row.datetime,
              "distance": row.distance ?? null,
              "humidity": row.humidity ?? null,
              "measurementtype": deviceMeasurement.measurementType ?? null,
              "name": deviceMeasurement.name ?? null,
              "pressure": row.pressure ?? null,
              "refDevice": deviceMeasurement.refDevice ?? null,
              "temperature": row.temperature ?? null,
              "vdd": row.vdd ?? null,
              "currentlevel": deviceMeasurement.currentLevel ?? null,
            }
          }));
          
          await axios.post(GRIST_API_URL_HISTORY, { records: recordsHistory }, {
            headers: { "Authorization": `Bearer ${this.apiKey}` }
          });
        }

        alert("✅ Données envoyées à Grist avec succès !");
      } catch (error) {
        console.error("❌ Erreur en envoyant les données à Grist :", error);
        alert(`❌ Erreur : ${error.response?.data?.error || error.message}`);
      }
    }
  }
});
