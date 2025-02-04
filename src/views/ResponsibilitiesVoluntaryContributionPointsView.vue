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
import { useZoneStore } from "@/stores/zone-store";

DataTable.use(DataTablesLib);

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const alertSettingsStore = useAlertSettingsStore();
const subscriptionStore = useSubscriptionStore();
const wasteContainerStore = useWasteContainerStore();
const deviceMeasurementStore = useDeviceMeasurementStore();
const zoneStore = useZoneStore();

const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);

const filterPaper = ref(true);
const filterPlastic = ref(true);
const filterGlass = ref(true);

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
            data: "zone",
            title: t("main.zone")
        },
        {
            data: "fillingLevel",
            title: t("main.fillingLevel")
        },
        {
            data: "minimumThreshold",
            title: "Seuil min"
        },
        {
            data: "maximumThreshold",
            title: "Seuil max"
        }
    ]
};

const data = computed(() => {
    const rows = [];
    for (const wasteContainer of wasteContainerStore.wasteContainers) {
        if (!filterPaper.value && wasteContainer.storedWasteKind === "paper") {
            continue;
        }
        if (!filterPlastic.value && wasteContainer.storedWasteKind === "plastic") {
            continue;
        }
        if (!filterGlass.value && wasteContainer.storedWasteKind === "glass") {
            continue;
        }
        if (selectedZoneId.value && (wasteContainer.hasZone !== selectedZoneId.value)) {
            continue;
        }

        const row = {
            deviceMeasurementId: wasteContainer.hasDeviceMeasurement,
            name: wasteContainer.name,
            zone: zoneStore.getZone(wasteContainer.hasZone).name,
            fillingLevel: `${Math.floor(deviceMeasurementStore.getDeviceMeasurement(wasteContainer.hasDeviceMeasurement)?.fillingLevel) ?? "N/A"} %`,
            minimumThreshold: (getAlertSettings(wasteContainer.hasDeviceMeasurement, "LT").length ? `${getAlertSettings(wasteContainer.hasDeviceMeasurement, "LT")[0].criteriaValue} %` + (subscriptionStore.getSubscription(getAlertSettings(wasteContainer.hasDeviceMeasurement, "LT")[0].hasSubscription).notification.lastNotification ? ` (${formatDate(subscriptionStore.getSubscription(getAlertSettings(wasteContainer.hasDeviceMeasurement, "LT")[0].hasSubscription).notification.lastNotification)})` : "") : ""),
            maximumThreshold: (getAlertSettings(wasteContainer.hasDeviceMeasurement, "GT").length ? `${getAlertSettings(wasteContainer.hasDeviceMeasurement, "GT")[0].criteriaValue} %` + (subscriptionStore.getSubscription(getAlertSettings(wasteContainer.hasDeviceMeasurement, "GT")[0].hasSubscription).notification.lastNotification ? ` (${formatDate(subscriptionStore.getSubscription(getAlertSettings(wasteContainer.hasDeviceMeasurement, "GT")[0].hasSubscription).notification.lastNotification)})` : "") : "")
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
        <h1>{{ $t("main.voluntaryContributionPoints") }}</h1>
        <CityZonePicker v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId" class="mb-4" />
        <div v-if="selectedCityId" class="p-4 rounded border border-danger">
            <form class="row align-items-center d-flex flex-wrap">
                <div class="col-auto">
                    <div class="form-check">
                        <input id="filter-paper" class="form-check-input" type="checkbox" v-model="filterPaper">
                        <label for="filter-paper" class="form-check-label">Carton</label>
                    </div>
                </div>
                <div class="col-auto">
                    <div class="form-check">
                        <input id="filter-plastic" class="form-check-input" type="checkbox" v-model="filterPlastic">
                        <label for="filter-plastic" class="form-check-label">Plastique</label>
                    </div>
                </div>
                <div class="col-auto">
                    <div class="form-check">
                        <input id="filter-glass" class="form-check-input" type="checkbox" v-model="filterGlass">
                        <label for="filter-glass" class="form-check-label">Verre</label>
                    </div>
                </div>
            </form>
            <div class="table-responsive">
                <DataTable :options="options" :data="data" class="table table-striped" @click="resolveRoute($event)"></DataTable>
            </div>
        </div>
        <div class="mb-5"></div>
    </div>
</template>
