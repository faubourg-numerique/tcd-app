<script setup lang="ts">
import { defineModel, onMounted, watch } from "vue";

import { useCityStore } from "@/stores/city-store";
import { useZoneStore } from "@/stores/zone-store";

const cityStore = useCityStore();
const zoneStore = useZoneStore();

const selectedCityId = defineModel("selectedCityId");
const selectedZoneId = defineModel("selectedZoneId");

onMounted(() => {
    selectedCityId.value = cityStore.cities.length === 1 ? cityStore.cities[0].id : null;
});

watch(selectedCityId, (zoneId) => {
    const zones = zoneStore.getZonesByCityId(zoneId as string);
    selectedZoneId.value = zones.length === 1 ? zones[0].id : null;
});
</script>

<template>
    <div class="container bg-white p-4 rounded text-center border border-danger">
        <div class="row">
            <div class="col-12 col-md">
                <div class="form-group mb-3">
                    <label for="city-id" class="form-label">{{ $t("main.city") }}</label>
                    <select id="city-id" v-model="selectedCityId" class="form-select">
                        <option :value="null" disabled>{{ $t("main.selectACity") }}</option>
                        <option v-for="city in cityStore.cities" :key="city.id" :value="city.id">{{ city.name }}</option>
                    </select>
                </div>
            </div>
            <div v-if="selectedCityId" class="col-12 col-md">
                <div class="form-group">
                    <label for="zone-id" class="form-label">{{ $t("main.zone") }}</label>
                    <select id="zone-id" v-model="selectedZoneId" class="form-select">
                        <option :value="null">{{ $t("main.selectAZone") }}</option>
                        <option v-for="zone in zoneStore.getZonesByCityId(selectedCityId as string)" :key="zone.id" :value="zone.id">{{ zone.name }}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>
