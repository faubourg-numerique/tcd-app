import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import DeviceMeasurementNotFoundError from "@/errors/NotFoundError/DeviceMeasurementNotFoundError";

import type { DeviceMeasurement } from "@/types/DeviceMeasurement";

export const useDeviceMeasurementStore = defineStore("device-measurement", () => {
    const deviceMeasurements: DeviceMeasurement[] = reactive([]);

    function getDeviceMeasurement(deviceMeasurementId: string) {
        const deviceMeasurement = deviceMeasurements.find((deviceMeasurement) => deviceMeasurement.id === deviceMeasurementId);
        if (!deviceMeasurement) {
            throw new DeviceMeasurementNotFoundError(deviceMeasurementId);
        }
        return deviceMeasurement;
    }

    async function fetchDeviceMeasurements() {
        $reset();
        const response = await api.get("/device-measurements");
        deviceMeasurements.push(...response.data);
    }

    function $reset() {
        deviceMeasurements.length = 0;
    }

    return { deviceMeasurements, getDeviceMeasurement, fetchDeviceMeasurements, $reset };
});
