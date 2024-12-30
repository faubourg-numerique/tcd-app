import { defineStore } from "pinia";
import api from "@/api";

import type { DeviceMeasurementRow } from "@/types/DeviceMeasurementRow";

function createConfig(zoneId: string, measurementType: string, fromDate: string, toDate: string) {
    return { params: { zoneId, measurementType, fromDate, toDate } };
}

export const useDeviceMeasurementRowStore = defineStore("device-measurement-row", () => {
    async function fetchDeviceMeasurementRows(roomId: string, measurementType: string, fromDate: string, toDate: string): Promise<DeviceMeasurementRow[]> {
        const config = {
            params: {
                roomId,
                measurementType,
                fromDate,
                toDate
            }
        };
        const response = await api.get("/device-measurement-rows", config);
        return response.data;
    }

    async function fetchHourlyDeviceMeasurementRows(zoneId: string, measurementType: string, fromDate: string, toDate: string): Promise<DeviceMeasurementRow[]> {
    
            const response = await api.get("/hourly-average-measurements", createConfig(zoneId, measurementType, fromDate, toDate));
            return response.data;
    }

    return {
        fetchDeviceMeasurementRows,
        fetchHourlyDeviceMeasurementRows
    };
});
