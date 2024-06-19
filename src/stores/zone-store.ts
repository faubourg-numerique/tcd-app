import { defineStore } from "pinia";
import { reactive } from "vue";

import ZoneNotFoundError from "@/errors/NotFoundError/ZoneNotFoundError";
import type { Zone } from "@/models/Zone";
import { useMainStore } from "@/stores/main-store";

export const useZoneStore = defineStore("zone", () => {
    const mainStore = useMainStore();

    const zones: Zone[] = reactive([]);

    function getZone(zoneId: string) {
        const zone = zones.find((zone) => zone.id === zoneId);
        if (!zone) {
            throw new ZoneNotFoundError(zoneId);
        }
        return zone;
    }

    function getZonesByCityId(cityId: string) {
        return zones.filter((zone) => zone.hasCity === cityId);
    }

    async function fetchZones(cityId: string) {
        zones.splice(0, zones.length, ...zones.filter((zone) => zone.hasCity !== cityId));
        const response = await mainStore.api.get(`/cities/${cityId}/zones`);
        zones.push(...response.data);
    }

    function $reset() {
        zones.lenth = 0;
    }

    return { zones, getZone, getZonesByCityId, fetchZones, $reset };
});
