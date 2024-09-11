<script setup lang="ts">
import { defineModel } from "vue";

import { useCityStore } from "@/stores/city-store";
import { useZoneStore } from "@/stores/zone-store";

const cityStore = useCityStore();
const zoneStore = useZoneStore();

const selectedCityId = defineModel("selectedCityId");
const selectedZoneId = defineModel("selectedZoneId");
</script>

<template>
    <div class="bg-white p-4 rounded text-center border border-danger">
        <div class="form-group">
            <label for="city-id" class="form-label">{{ $t("main.city") }}</label>
            <select id="city-id" v-model="selectedCityId" class="form-select">
                <option :value="null" disabled>{{ $t("main.selectACity") }}</option>
                <option v-for="city in cityStore.cities" :key="city.id" :value="city.id">{{ city.name }}</option>
            </select>
        </div>
        <div v-if="selectedCityId" class="form-group">
            <label for="zone-id" class="form-label">{{ $t("main.zone") }}</label>
            <select id="zone-id" v-model="selectedZoneId" class="form-select">
                <option :value="null" disabled>{{ $t("main.selectAZone") }}</option>
                <option v-for="zone in zoneStore.getZonesByCityId(selectedCityId as string)" :key="zone.id" :value="zone.id">{{ zone.name }}</option>
            </select>
        </div>
    </div>
</template>
