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
                            <th>{{ $t("main.distance") }}</th>
                            <th>{{ $t("main.maximumAlert") }}</th>
                            <th>{{ $t("main.onAlert") }}</th>
                            <th>{{ $t("main.timeout") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="floodMonitoring in floodMonitoringStore.getFloodMonitoringsByZoneId(selectedZoneId)" :key="floodMonitoring.id">
                            <td>
                                <RouterLink :to="`/responsibilities/watercourses/${floodMonitoring.hasDeviceMeasurement}`" class="no-link">{{ floodMonitoring.name }}</RouterLink>
                            </td>
                            <td>{{ deviceMeasurementStore.getDeviceMeasurement(floodMonitoring.hasDeviceMeasurement)?.distance ?? "N/A" }} mm</td>
                            <td>N/A</td>
                            <td>N/A</td>
                            <td>N/A</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
