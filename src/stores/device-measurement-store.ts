import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import DeviceMeasurementNotFoundError from "@/errors/NotFoundError/DeviceMeasurementNotFoundError";

import type { DeviceMeasurement } from "@/types/DeviceMeasurement";
import { useThermostatStore } from "@/stores/thermostat-store";

export const useDeviceMeasurementStore = defineStore("device-measurement", () => {
    const thermostatStore = useThermostatStore();

    const deviceMeasurements: DeviceMeasurement[] = reactive([]);

    function getDeviceMeasurement(deviceMeasurementId: string) {
        const deviceMeasurement = deviceMeasurements.find((deviceMeasurement) => deviceMeasurement.id === deviceMeasurementId);
        if (!deviceMeasurement) {
            throw new DeviceMeasurementNotFoundError(deviceMeasurementId);
        }
        return deviceMeasurement;
    }

    function getDeviceMeasurementsByZoneIdAndMeasurementType(zoneId: string, measurementType: string) {
        const deviceMeasurementIds: string[] = [];
        switch(measurementType) {
            case "thermostat": {
                const thermostats = thermostatStore.getThermostatsByZoneId(zoneId);
                for (const thermostat of thermostats) {
                    if (thermostat.hasDeviceMeasurement) {
                        deviceMeasurementIds.push(thermostat.hasDeviceMeasurement);
                    }
                }
                break;
            }
            default: {
                throw new Error(`'${measurementType}' is not a supported measurement type`);
            }
        }

        return deviceMeasurements.filter((deviceMeasurement) => 
            deviceMeasurementIds.includes(deviceMeasurement.id)
        );
    }

    async function fetchDeviceMeasurements() {
        $reset();
        const response = await api.get("/device-measurements");
        deviceMeasurements.push(...response.data);
    }

    function $reset() {
        deviceMeasurements.length = 0;
    }

    return { deviceMeasurements, getDeviceMeasurement, getDeviceMeasurementsByZoneIdAndMeasurementType, fetchDeviceMeasurements, $reset };
});
