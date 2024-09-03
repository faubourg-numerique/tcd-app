import { defineStore } from "pinia";
import { reactive } from "vue";

import ThermostatNotFoundError from "@/errors/NotFoundError/ThermostatNotFoundError";
import type { Thermostat } from "@/models/Thermostat";
import { useMainStore } from "@/stores/main-store";

export const useThermostatStore = defineStore("thermostat", () => {
    const mainStore = useMainStore();

    const thermostats: Thermostat[] = reactive([]);

    function getThermostat(thermostatId: string) {
        const thermostat = thermostats.find((thermostat) => thermostat.id === thermostatId);
        if (!thermostat) {
            throw new ThermostatNotFoundError(thermostatId);
        }
        return thermostat;
    }

    function getThermostatsByZoneId(zoneId: string) {
        return thermostats.filter((thermostat) => thermostat.hasZone === zoneId);
    }

    async function fetchThermostats() {
        thermostats.length = 0;
        const response = await mainStore.api.get("/thermostats");
        thermostats.push(...response.data);
    }

    async function updateThermostat(cityId: string, zoneId: string, thermostatId: string) {
        const thermostat = getThermostat(thermostatId);
        const data = {
            temperature: thermostat.temperature
        };
        await mainStore.api.patch(`/cities/${cityId}/zones/${zoneId}/thermostats/${thermostatId}`, data);
    }

    function $reset() {
        thermostats.length = 0;
    }

    return { thermostats, getThermostat, getThermostatsByZoneId, fetchThermostats, updateThermostat, $reset };
});
