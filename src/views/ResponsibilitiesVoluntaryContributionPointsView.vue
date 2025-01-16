<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useRoute } from "vue-router";

import CityZonePicker from "@/components/CityZonePicker.vue";
import { useAlertSettingsStore } from "@/stores/alert-settings-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useWasteContainerStore } from "@/stores/waste-container-store";

const route = useRoute();

const alertSettingsStore = useAlertSettingsStore();
const subscriptionStore = useSubscriptionStore();
const wasteContainerStore = useWasteContainerStore();
const deviceMeasurementStore = useDeviceMeasurementStore();

const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);

function getAlertSettings(entityId: string, criteriaType: string) {
    const alertSettings = alertSettingsStore.getAlertSettingsByEntityId(entityId);
    return alertSettings.filter((_alertSettings) => _alertSettings.criteriaType === criteriaType);
}

function formatDate(date: string) {
    return new Date(date).toLocaleString();
}
</script>

<template>
    <div class="container">
        <CityZonePicker v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId" class="mb-4" />
        <template v-if="selectedCityId && selectedZoneId">
            <h1>{{ $t("main.voluntaryContributionPoints") }}</h1>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>{{ $t("main.name") }}</th>
                            <th class="text-end">{{ $t("main.fillingLevel") }}</th>
                            <th>Seuil minimum</th>
                            <th>Seuil maximum</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="wasteContainer in wasteContainerStore.getWasteContainersByZoneId(selectedZoneId)" :key="wasteContainer.id">
                            <td>
                                <RouterLink :to="{ name: 'responsibilities.voluntaryContributionPoints.details', params: { deviceMeasurementId: wasteContainer.hasDeviceMeasurement } }" class="no-link">{{ wasteContainer.name }}</RouterLink>
                            </td>
                            <td class="text-end">{{ deviceMeasurementStore.getDeviceMeasurement(wasteContainer.hasDeviceMeasurement)?.fillingLevel ? Math.floor(deviceMeasurementStore.getDeviceMeasurement(wasteContainer.hasDeviceMeasurement).fillingLevel ?? 0) : "N/A" }} %</td>
                            <td>
                                <template v-if="getAlertSettings(wasteContainer.hasDeviceMeasurement, 'GT').length">
                                    {{ getAlertSettings(wasteContainer.hasDeviceMeasurement, 'GT')[0].criteriaValue }} %
                                    <template v-if="subscriptionStore.getSubscription(getAlertSettings(wasteContainer.hasDeviceMeasurement, 'GT')[0].hasSubscription).notification.lastNotification">
                                        ({{ formatDate(subscriptionStore.getSubscription(getAlertSettings(wasteContainer.hasDeviceMeasurement, 'GT')[0].hasSubscription).notification.lastNotification) }})
                                    </template>
                                </template>
                            </td>
                            <td>
                                <template v-if="getAlertSettings(wasteContainer.hasDeviceMeasurement, 'LT').length">
                                    {{ getAlertSettings(wasteContainer.hasDeviceMeasurement, 'LT')[0].criteriaValue }} %
                                    <template v-if="subscriptionStore.getSubscription(getAlertSettings(wasteContainer.hasDeviceMeasurement, 'LT')[0].hasSubscription).notification.lastNotification">
                                        ({{ formatDate(subscriptionStore.getSubscription(getAlertSettings(wasteContainer.hasDeviceMeasurement, 'LT')[0].hasSubscription).notification.lastNotification) }})
                                    </template>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
