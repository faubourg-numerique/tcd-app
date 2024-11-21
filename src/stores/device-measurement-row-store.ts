import { defineStore } from "pinia";

import api from "@/api";

import type { DeviceMeasurementRow } from "@/types/DeviceMeasurementRow";

export const useDeviceMeasurementRowStore = defineStore("device-measurement-row", () => {
    async function fetchDeviceMeasurementRows(zoneId: string, measurementType: string): Promise<DeviceMeasurementRow[]> {
        const config = {
            params: {
                zoneId,
                measurementType
            }
        };
        const response = await api.get("/device-measurement-rows", config);
        return response.data;
    }

    return { fetchDeviceMeasurementRows };
});
