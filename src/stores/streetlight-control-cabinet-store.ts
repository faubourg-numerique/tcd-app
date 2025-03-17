import { defineStore } from "pinia";
import api from "@/api";
import { reactive } from "vue";
import type { StreetlightControlCabinet } from "@/types/StreetlightControlCabinet";

export const useStreetlightControlCabinetStore = defineStore("streetlightControlCabinet", () => {
   const cabinets = reactive<StreetlightControlCabinet[]>([]);

   const fetchCabinets = async () => {
      try {
         const response = await api.get<StreetlightControlCabinet[]>("/streetlight-control-cabinets");
         console.log("Cabinets récupérés :", response.data);
         cabinets.splice(0, cabinets.length, ...response.data); 
      } catch (error) {
         console.error("Erreur lors de la récupération des cabinets :", error);
      }
   };

   return { cabinets, fetchCabinets };
});
