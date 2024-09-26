import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import StreetlightNotFoundError from "@/errors/NotFoundError/StreetlightNotFoundError";

import type { Streetlight } from "@/types/Streetlight";

export const useStreetlightStore = defineStore("streetlight", () => {
    const streetlights: Streetlight[] = reactive([]);

    function getStreetlight(streetlightId: string) {
        const streetlight = streetlights.find((streetlight) => streetlight.id === streetlightId);
        if (!streetlight) {
            throw new StreetlightNotFoundError(streetlightId);
        }
        return streetlight;
    }

    function getStreetlightsByZoneId(zoneId: string) {
        return streetlights.filter((streetlight) => streetlight.hasZone === zoneId);
    }

    async function fetchStreetlights() {
        $reset();
        const response = await api.get("/streetlights");
        streetlights.push(...response.data);
    }

    function $reset() {
        streetlights.length = 0;
    }

    return { streetlights, getStreetlight, getStreetlightsByZoneId, fetchStreetlights, $reset };
});
