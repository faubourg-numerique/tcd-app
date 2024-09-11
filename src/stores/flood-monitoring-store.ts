import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import FloodMonitoringNotFoundError from "@/errors/NotFoundError/FloodMonitoringNotFoundError";

import type { FloodMonitoring } from "@/types/FloodMonitoring";

export const useFloodMonitoringStore = defineStore("flood-monitoring", () => {
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
        $reset();
        const response = await api.get("/flood-monitorings");
        floodMonitorings.push(...response.data);
    }

    function $reset() {
        floodMonitorings.length = 0;
    }

    return { floodMonitorings, getFloodMonitoring, getFloodMonitoringsByZoneId, fetchFloodMonitorings, $reset };
});
