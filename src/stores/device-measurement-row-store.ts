import { defineStore } from "pinia";
import api from "@/api";

import type { DeviceMeasurementRow } from "@/types/DeviceMeasurementRow";

function createConfig(zoneId: string, measurementType: string, fromDate: string, toDate: string) {
    return { params: { zoneId, measurementType, fromDate, toDate } };
}

export const useDeviceMeasurementRowStore = defineStore("device-measurement-row", () => {
    async function fetchDeviceMeasurementRows(zoneId: string, measurementType: string, fromDate: string, toDate: string): Promise<DeviceMeasurementRow[]> {
        
            const response = await api.get("/device-measurement-rows", createConfig(zoneId, measurementType, fromDate, toDate));
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
