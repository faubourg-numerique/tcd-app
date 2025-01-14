<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useRoute } from "vue-router";

import CityZonePicker from "@/components/CityZonePicker.vue";
import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useFloodMonitoringStore } from "@/stores/flood-monitoring-store";

const route = useRoute();

const floodMonitoringStore = useFloodMonitoringStore();
const deviceMeasurementStore = useDeviceMeasurementStore();

const selectedCityId: Ref<string | null> = ref((route.query.cityId as string) ?? null);
const selectedZoneId: Ref<string | null> = ref((route.query.zoneId as string) ?? null);
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
                            <th class="text-end">{{ $t("main.waterLevel") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="floodMonitoring in floodMonitoringStore.getFloodMonitoringsByZoneId(selectedZoneId)" :key="floodMonitoring.id">
                            <td>
                                <RouterLink :to="{ name: 'responsibilities.watercourses.details', params: { deviceMeasurementId: floodMonitoring.hasDeviceMeasurement } }" class="no-link">{{ floodMonitoring.name }}</RouterLink>
                            </td>
                            <td class="text-end">{{ deviceMeasurementStore.getDeviceMeasurement(floodMonitoring.hasDeviceMeasurement)?.currentLevel ?? "N/A" }} mm</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
