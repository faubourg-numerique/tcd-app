<script setup lang="ts">
import { computed, ref, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import DataTable from "datatables.net-vue3";
import DataTablesLib from "datatables.net-bs5";
import language from "datatables.net-plugins/i18n/fr-FR.mjs";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

import CityZonePicker from "@/components/CityZonePicker.vue";
import { useAlertSettingsStore } from "@/stores/alert-settings-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useWasteContainerStore } from "@/stores/waste-container-store";

DataTable.use(DataTablesLib);

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const alertSettingsStore = useAlertSettingsStore();
const subscriptionStore = useSubscriptionStore();
const wasteContainerStore = useWasteContainerStore();
const deviceMeasurementStore = useDeviceMeasurementStore();

const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);

const options = {
    language,
    columns: [
        {
            data: "name",
            title: t("main.name"),
            render: function (x, y, data) {
                return `<a href="#" data-device-measurement-id="${data.deviceMeasurementId}">${data.name}</a>`;
            }
        },
        {
            data: "fillingLevel",
            title: t("main.fillingLevel")
        },
        {
            data: "minimumThreshold",
            title: "Seuil minimum"
        },
        {
            data: "maximumThreshold",
            title: "Seuil maximum"
        }
    ]
};

const data = computed(() => {
    const rows = [];

    if (!selectedZoneId.value) {
        return rows;
    }

    for (const wasteContainer of wasteContainerStore.getWasteContainersByZoneId(selectedZoneId.value)) {
        const row = {
            deviceMeasurementId: wasteContainer.hasDeviceMeasurement,
            name: wasteContainer.name,
            fillingLevel: `${Math.floor(deviceMeasurementStore.getDeviceMeasurement(wasteContainer.hasDeviceMeasurement)?.fillingLevel) ?? "N/A"} %`,
            minimumThreshold: (getAlertSettings(wasteContainer.hasDeviceMeasurement, "GT").length ? `${getAlertSettings(wasteContainer.hasDeviceMeasurement, "GT")[0].criteriaValue} %` + (subscriptionStore.getSubscription(getAlertSettings(wasteContainer.hasDeviceMeasurement, "GT")[0].hasSubscription).notification.lastNotification ? ` (${formatDate(subscriptionStore.getSubscription(getAlertSettings(wasteContainer.hasDeviceMeasurement, "GT")[0].hasSubscription).notification.lastNotification)})` : "") : ""),
            maximumThreshold: (getAlertSettings(wasteContainer.hasDeviceMeasurement, "LT").length ? `${getAlertSettings(wasteContainer.hasDeviceMeasurement, "LT")[0].criteriaValue} %` + (subscriptionStore.getSubscription(getAlertSettings(wasteContainer.hasDeviceMeasurement, "LT")[0].hasSubscription).notification.lastNotification ? ` (${formatDate(subscriptionStore.getSubscription(getAlertSettings(wasteContainer.hasDeviceMeasurement, "LT")[0].hasSubscription).notification.lastNotification)})` : "") : "")
        };
        rows.push(row);
    }

    return rows;
});

function getAlertSettings(entityId: string, criteriaType: string) {
    const alertSettings = alertSettingsStore.getAlertSettingsByEntityId(entityId);
    return alertSettings.filter((_alertSettings) => _alertSettings.criteriaType === criteriaType);
}

function formatDate(date: string) {
    return new Date(date).toLocaleString();
}

function resolveRoute(event) {
    const deviceMeasurementId = event.target.dataset.deviceMeasurementId
    if (!deviceMeasurementId) {
        return
    }
    event.preventDefault()
    router.push({ name: "responsibilities.voluntaryContributionPoints.details", params: { deviceMeasurementId } });
}
</script>

<template>
    <div class="container">
        <CityZonePicker v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId" class="mb-4" />
        <template v-if="selectedCityId && selectedZoneId">
            <h1>{{ $t("main.voluntaryContributionPoints") }}</h1>
            <DataTable :options="options" :data="data" class="table table-striped" @click="resolveRoute($event)"></DataTable>
        </template>
    </div>
</template>
