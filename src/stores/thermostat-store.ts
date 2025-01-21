import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import ThermostatNotFoundError from "@/errors/NotFoundError/ThermostatNotFoundError";

import type { Thermostat } from "@/types/Thermostat";

export const useThermostatStore = defineStore("thermostat", () => {
    const thermostats: Thermostat[] = reactive([]);

    function getThermostat(thermostatId: string) {
        const thermostat = thermostats.find((thermostat) => thermostat.id === thermostatId);
        if (!thermostat) {
            throw new ThermostatNotFoundError(thermostatId);
        }
        return thermostat;
    }

    function getThermostatsByRoomId(roomId: string) {
        return thermostats.filter((thermostat) => thermostat.hasRoom === roomId);
    }

    async function fetchThermostats() {
        $reset();
        const response = await api.get("/thermostats");
        thermostats.push(...response.data);
    }

    function $reset() {
        thermostats.length = 0;
    }

    return { thermostats, getThermostat, getThermostatsByRoomId, fetchThermostats, $reset };
});
