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

    function getAlertSettingsIndex(alertSettingsId: string) {
        const index = alertSettings.findIndex((_alertSettings) => _alertSettings.id === alertSettingsId);
        if (index === -1) {
            throw new AlertSettingsNotFoundError(alertSettingsId);
        }
        return index;
    }

    function getAlertSettingsByEntityId(entityId: string) {
        return alertSettings.filter((_alertSettings) => _alertSettings.hasEntity === entityId);
    }

    async function fetchAlertSettings() {
        $reset();
        const response = await api.get("/alert-settings");
        alertSettings.push(...response.data);
    }

    async function createAlertSettings(_alertSettings: AlertSettings) {
        const response = await api.post("/alert-settings", _alertSettings);
        alertSettings.push(response.data);
        return response.data;
    }

    async function deleteAlertSettings(_alertSettings: AlertSettings) {
        const index = getAlertSettingsIndex(_alertSettings.id);
        await api.delete(`/alert-settings/${_alertSettings.id}`);
        alertSettings.splice(index, 1);
    }

    function $reset() {
        alertSettings.length = 0;
    }

    return { alertSettings, getAlertSettings, getAlertSettingsIndex, getAlertSettingsByEntityId, fetchAlertSettings, createAlertSettings, deleteAlertSettings, $reset };
});
