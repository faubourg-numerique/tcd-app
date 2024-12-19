<script setup lang="ts">
import { defineModel, onMounted, watch } from "vue";

import { useCityStore } from "@/stores/city-store";
import { useZoneStore } from "@/stores/zone-store";
import { useBuildingStore } from "@/stores/building-store";
import { useRoomStore } from "@/stores/room-store";

const cityStore = useCityStore();
const zoneStore = useZoneStore();
const buildingStore = useBuildingStore();
const roomStore = useRoomStore();

const selectedCityId = defineModel("selectedCityId");
const selectedZoneId = defineModel("selectedZoneId");
const selectedBuildingId = defineModel("selectedBuildingId");
const selectedRoomId = defineModel("selectedRoomId");

onMounted(() => {
    selectedCityId.value = cityStore.cities.length === 1 ? cityStore.cities[0].id : null;
});

watch(selectedCityId, (cityId) => {
    const zones = zoneStore.getZonesByCityId(cityId as string);
    selectedZoneId.value = zones.length === 1 ? zones[0].id : null;
});

watch(selectedZoneId, (zoneId) => {
    const buildings = buildingStore.getBuildingsByZoneId(zoneId as string);
    selectedBuildingId.value = buildings.length === 1 ? buildings[0].id : null;
});

watch(selectedBuildingId, (buildingId) => {
    const rooms = roomStore.getRoomsByBuildingId(buildingId as string);
    selectedRoomId.value = rooms.length === 1 ? rooms[0].id : null;
});
</script>

<template>
    <div class="container bg-white p-4 rounded text-center border border-danger mb-3">
        <div class="row">
            <div class="col-12 col-md">
                <div class="form-group mb-3">
                    <label for="city-id" class="form-label">{{ $t("main.city") }}</label>
                    <select id="city-id" v-model="selectedCityId" class="form-select">
                        <option :value="null" disabled>{{ $t("main.selectACity") }}</option>
                        <option v-for="city in cityStore.cities" :key="city.id" :value="city.id">{{ city.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div v-if="selectedCityId" class="col-12 col-md">
                <div class="form-group mb-3">
                    <label for="zone-id" class="form-label">{{ $t("main.zone") }}</label>
                    <select id="zone-id" v-model="selectedZoneId" class="form-select">
                        <option :value="null" disabled>{{ $t("main.selectAZone") }}</option>
                        <option v-for="zone in zoneStore.getZonesByCityId(selectedCityId as string)" :key="zone.id"
                            :value="zone.id">{{ zone.name }}</option>
                    </select>
                </div>
            </div>
            <div v-if="selectedZoneId" class="col-12 col-md">
                <div class="form-group mb-3">
                    <label for="building-id" class="form-label">{{ $t("main.building") }}</label>
                    <select id="building-id" v-model="selectedBuildingId" class="form-select">
                        <option :value="null" disabled>{{ $t("main.selectABuilding") }}</option>
                        <option v-for="building in buildingStore.getBuildingsByZoneId(selectedZoneId as string)"
                            :key="building.id" :value="building.id">{{ building.name }}</option>
                    </select>
                </div>
            </div>
            <div v-if="selectedBuildingId" class="col-12 col-md">
                <div class="form-group">
                    <label for="room-id" class="form-label">{{ $t("main.room") }}</label>
                    <select id="room-id" v-model="selectedRoomId" class="form-select">
                        <option :value="null" disabled>{{ $t("main.selectARoom") }}</option>
                        <option v-for="room in roomStore.getRoomsByBuildingId(selectedBuildingId as string)"
                            :key="room.id" :value="room.id">{{ room.name }}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>
