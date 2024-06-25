import { defineStore } from "pinia";
import { reactive } from "vue";

import StreetlightNotFoundError from "@/errors/NotFoundError/StreetlightNotFoundError";
import type { Streetlight } from "@/models/Streetlight";
import { useMainStore } from "@/stores/main-store";

export const useStreetlightStore = defineStore("streetlight", () => {
    const mainStore = useMainStore();

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
        streetlights.length = 0;
        const response = await mainStore.api.get("/streetlights");
        streetlights.push(...response.data);
    }

    async function updateStreetlight(cityId: string, zoneId: string, streetlightId: string, data: Object) {
        await mainStore.api.patch(`/cities/${cityId}/zones/${zoneId}/streetlights/${streetlightId}`, data);
    }

    function $reset() {
        streetlights.length = 0;
    }

    return { streetlights, getStreetlight, getStreetlightsByZoneId, fetchStreetlights, updateStreetlight, $reset };
});
