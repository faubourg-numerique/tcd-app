<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useRoute } from "vue-router";

import CityZonePicker from "@/components/CityZonePicker.vue";
import { useAlertSettingsStore } from "@/stores/alert-settings-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useFloodMonitoringStore } from "@/stores/flood-monitoring-store";

const route = useRoute();

const alertSettingsStore = useAlertSettingsStore();
const subscriptionStore = useSubscriptionStore();
const floodMonitoringStore = useFloodMonitoringStore();
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
            <h1>{{ $t("main.watercourses") }}</h1>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>{{ $t("main.name") }}</th>
                            <th>GT</th>
                            <th>LT</th>
                            <th class="text-end">{{ $t("main.waterLevel") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="floodMonitoring in floodMonitoringStore.getFloodMonitoringsByZoneId(selectedZoneId)" :key="floodMonitoring.id">
                            <td>
                                <RouterLink :to="{ name: 'responsibilities.watercourses.details', params: { deviceMeasurementId: floodMonitoring.hasDeviceMeasurement } }" class="no-link">{{ floodMonitoring.name }}</RouterLink>
                            </td>
                            <td>
                                <template v-if="getAlertSettings(floodMonitoring.hasDeviceMeasurement, 'GT').length">
                                    {{ getAlertSettings(floodMonitoring.hasDeviceMeasurement, 'GT')[0].criteriaValue }} mm
                                    <template v-if="subscriptionStore.getSubscription(getAlertSettings(floodMonitoring.hasDeviceMeasurement, 'GT')[0].hasSubscription).notification.lastNotification">
                                        ({{ formatDate(subscriptionStore.getSubscription(getAlertSettings(floodMonitoring.hasDeviceMeasurement, 'GT')[0].hasSubscription).notification.lastNotification) }})
                                    </template>
                                </template>
                            </td>
                            <td>
                                <template v-if="getAlertSettings(floodMonitoring.hasDeviceMeasurement, 'LT').length">
                                    {{ getAlertSettings(floodMonitoring.hasDeviceMeasurement, 'LT')[0].criteriaValue }} mm
                                    <template v-if="subscriptionStore.getSubscription(getAlertSettings(floodMonitoring.hasDeviceMeasurement, 'LT')[0].hasSubscription).notification.lastNotification">
                                        ({{ formatDate(subscriptionStore.getSubscription(getAlertSettings(floodMonitoring.hasDeviceMeasurement, 'LT')[0].hasSubscription).notification.lastNotification) }})
                                    </template>
                                </template>
                            </td>
                            <td class="text-end">{{ deviceMeasurementStore.getDeviceMeasurement(floodMonitoring.hasDeviceMeasurement)?.currentLevel ?? "N/A" }} mm</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
