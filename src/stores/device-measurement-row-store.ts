import { defineStore } from "pinia";
import api from "@/api";

import type { DeviceMeasurementRow } from "@/types/DeviceMeasurementRow";

export const useDeviceMeasurementRowStore = defineStore("device-measurement-row", () => {
    async function fetchDeviceMeasurementRowsById(deviceMeasurementId: string, fromDate: string, toDate: string): Promise<DeviceMeasurementRow[]> {
        const config = {
            params: {
                fromDate,
                toDate
            }
        };
        const response = await api.get(`/device-measurement-rows/${deviceMeasurementId}`, config);
        return response.data;
    }

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

    async function fetchHourlyDeviceMeasurementRows(roomId: string, measurementType: string, fromDate: string, toDate: string): Promise<DeviceMeasurementRow[]> {
            const config = {
                params: {
                    roomId,
                    measurementType,
                    fromDate,
                    toDate
                }
            };
            const response = await api.get("/hourly-average-measurements", config);
            return response.data;
    }

    return {
        fetchDeviceMeasurementRowsById,
        fetchDeviceMeasurementRows,
        fetchHourlyDeviceMeasurementRows
    };
});
