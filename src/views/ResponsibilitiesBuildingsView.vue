<script setup lang="ts">
import { ref, type Ref } from "vue";

import { useThermostatStore } from "@/stores/thermostat-store";
import CityZoneSelector from "@/components/CityZoneSelector.vue";
import OperationScheduleCalendar from "@/components/OperationScheduleCalendar.vue";

const thermostatStore = useThermostatStore();

const selectedCityId: Ref<string | null> = ref(null);
const selectedZoneId: Ref<string | null> = ref(null);

async function updateThermostatTemperature(thermostatId: string) {
    const thermostat = thermostatStore.getThermostat(thermostatId);
    await thermostatStore.updateThermostat(selectedCityId.value, selectedZoneId.value, thermostatId);
}
</script>

<template>
    <div class="container">
        <div class="row">
            <CityZoneSelector v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId"></CityZoneSelector>
        </div>
        <div v-if="selectedCityId && selectedZoneId">
            <div class="row">
                <div v-for="thermostat in thermostatStore.getThermostatsByZoneId(selectedZoneId)" :key="thermostat.id" class="form-thermostat-container col-md mt-3 mb-3 w-100">
                    <form class="container border border-danger rounded d-flex flex-column align-items-center h-100 py-3" @submit.prevent="updateThermostatTemperature(thermostat.id)">
                        <div class="mb-3 w-50 form-group">
                            <label for="temperature" class="form-label">Temperature</label>
                            <input id="temperature" v-model="thermostat.temperature" type="number" min="-20" max="60" step="0.1" placeholder="Temperature" required class="form-control" />
                        </div>
                        <div class="mb-3 w-50 text-center form-group">
                            <p class="text-danger">{{ thermostat.name }}</p>
                            <input type="submit" class="btn btn-primary mt-auto" />
                        </div>
                    </form>
                </div>
            </div>
            <div class="mt-5">
                <OperationScheduleCalendar :city-id="selectedCityId" :zone-id="selectedZoneId" />
            </div>
        </div>
        <div v-else class="container-fluid">
            <div class="center">
                <p class="text-center">{{ $t("manager.thermostat.error") }}</p>
            </div>
        </div>
    </div>
</template>
