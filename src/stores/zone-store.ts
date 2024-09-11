import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import ZoneNotFoundError from "@/errors/NotFoundError/ZoneNotFoundError";

import type { Zone } from "@/types/Zone";

export const useZoneStore = defineStore("zone", () => {
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

    async function fetchZones() {
        $reset();
        const response = await api.get("/zones");
        zones.push(...response.data);
    }

    function $reset() {
        zones.length = 0;
    }

    return { zones, getZone, getZonesByCityId, fetchZones, $reset };
});
