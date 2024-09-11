<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useRoute } from "vue-router";

import CityZonePicker from "@/components/CityZonePicker.vue";
import OperationScheduleCalendar from "@/components/OperationScheduleCalendar.vue";
import { useThermostatStore } from "@/stores/thermostat-store";

const route = useRoute();

const thermostatStore = useThermostatStore();

const selectedCityId: Ref<string | null> = ref(route.query.cityId as string ?? null);
const selectedZoneId: Ref<string | null> = ref(route.query.zoneId as string ?? null);
</script>

<template>
    <div class="container">
        <CityZonePicker class="mb-3" v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId" />
        <template v-if="selectedCityId && selectedZoneId">
            <div class="row mb-5">
                <div v-for="thermostat in thermostatStore.getThermostatsByZoneId(selectedZoneId)" :key="thermostat.id" class="col-md w-100">
                    <div class="container border border-danger rounded p-3">{{ thermostat.name }}</div>
                </div>
            </div>
            <OperationScheduleCalendar :city-id="selectedCityId" :zone-id="selectedZoneId" />
        </template>
    </div>
</template>
