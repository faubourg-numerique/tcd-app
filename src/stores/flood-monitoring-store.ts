import { defineStore } from "pinia";
import { reactive } from "vue";

import FloodMonitoringNotFoundError from "@/errors/NotFoundError/FloodMonitoringNotFoundError";
import type { FloodMonitoring } from "@/models/FloodMonitoring";
import { useMainStore } from "@/stores/main-store";

export const useFloodMonitoringStore = defineStore("flood-monitoring", () => {
    const mainStore = useMainStore();

    const floodMonitorings: FloodMonitoring[] = reactive([]);

    function getFloodMonitoring(floodMonitoringId: string) {
        const floodMonitoring = floodMonitorings.find((floodMonitoring) => floodMonitoring.id === floodMonitoringId);
        if (!floodMonitoring) {
            throw new FloodMonitoringNotFoundError(floodMonitoringId);
        }
        return floodMonitoring;
    }

    function getFloodMonitoringsByZoneId(zoneId: string) {
        return floodMonitorings.filter((floodMonitoring) => floodMonitoring.hasZone === zoneId);
    }

    async function fetchFloodMonitorings() {
        floodMonitorings.length = 0;
        const response = await mainStore.api.get("/flood-monitorings");
        floodMonitorings.push(...response.data);
    }

    function $reset() {
        floodMonitorings.length = 0;
    }

    return { floodMonitorings, getFloodMonitoring, getFloodMonitoringsByZoneId, fetchFloodMonitorings, $reset };
});
