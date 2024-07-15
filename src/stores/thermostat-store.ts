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

    async function fetchThermostats() {
        const response = await mainStore.api.get("/thermostats");
        thermostats.push(...response.data);
    }

    async function updateThermostat(thermostatId: string, data: Object) {
        await mainStore.api.patch(`/thermostats/${thermostatId}`, data);
    }

    function $reset() {
        thermostats.length = 0;
    }

    return { thermostats, getThermostat, fetchThermostats, updateThermostat, $reset };
});
