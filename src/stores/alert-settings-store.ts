import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import AlertSettingsNotFoundError from "@/errors/NotFoundError/AlertSettingsNotFoundError";

import type { AlertSettings } from "@/types/AlertSettings";

export const useAlertSettingsStore = defineStore("alert-settings", () => {
    const alertSettings: AlertSettings[] = reactive([]);

    function getAlertSettings(alertSettingsId: string) {
        const _alertSettings = alertSettings.find((alertSettings) => alertSettings.id === alertSettingsId);
        if (!_alertSettings) {
            throw new AlertSettingsNotFoundError(alertSettingsId);
        }
        return _alertSettings;
    }

    async function fetchAlertSettings() {
        $reset();
        const response = await api.get("/alert-settings");
        alertSettings.push(...response.data);
    }

    function $reset() {
        alertSettings.length = 0;
    }

    return { alertSettings, getAlertSettings, fetchAlertSettings, $reset };
});
