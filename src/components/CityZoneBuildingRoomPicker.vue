<script setup lang="ts">
import { computed, defineModel, onMounted, watch } from "vue";

import { useCityStore } from "@/stores/city-store";
import { useZoneStore } from "@/stores/zone-store";
import { useBuildingStore } from "@/stores/building-store";
import { useRoomStore } from "@/stores/room-store";

const props = defineProps({
    responsibilities: {
        type: Array as () => string[],
        required: true,
    },
});

const cityStore = useCityStore();
const zoneStore = useZoneStore();
const buildingStore = useBuildingStore();
const roomStore = useRoomStore();

const selectedCityId = defineModel("selectedCityId");
const selectedZoneId = defineModel("selectedZoneId");
const selectedBuildingId = defineModel("selectedBuildingId");
const selectedRoomId = defineModel("selectedRoomId");

const sortedCities = computed(() => {
    const cities = [...cityStore.cities];
    cities.sort((a, b) => a.name.localeCompare(b.name));
    return cities;
});

const sortedFilteredZones = computed(() => {
    if (!selectedCityId.value) {
        return [];
    }
    let zones = [...zoneStore.getZonesByCityId(selectedCityId.value as string)];
    zones = zones.filter((zone) => zone.responsibilities.every((responsibility) => props.responsibilities.includes(responsibility)));
    zones.sort((a, b) => a.name.localeCompare(b.name));
    return zones;
});

const sortedBuildings = computed(() => {
    if (!selectedZoneId.value) {
        return [];
    }
    const buildings = [...buildingStore.getBuildingsByZoneId(selectedZoneId.value as string)];
    buildings.sort((a, b) => a.name.localeCompare(b.name));
    return buildings;
});

const sortedRooms = computed(() => {
    if (!selectedBuildingId.value) {
        return [];
    }
    const rooms = [...roomStore.getRoomsByBuildingId(selectedBuildingId.value as string)];
    rooms.sort((a, b) => a.name.localeCompare(b.name));
    return rooms;
});

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
    <div class="container bg-white p-4 rounded text-center border border-danger">
        <div class="row">
            <div class="col-12 col-md">
                <div class="form-group mb-3">
                    <label for="city-id" class="form-label">{{ $t("main.city") }}</label>
                    <select id="city-id" v-model="selectedCityId" class="form-select">
                        <option :value="null" disabled>{{ $t("main.selectACity") }}</option>
                        <option v-for="city in sortedCities" :key="city.id" :value="city.id">{{ city.name }}</option>
                    </select>
                </div>
            </div>
            <div v-if="selectedCityId" class="col-12 col-md">
                <div class="form-group mb-3">
                    <label for="zone-id" class="form-label">{{ $t("main.zone") }}</label>
                    <select id="zone-id" v-model="selectedZoneId" class="form-select">
                        <option :value="null" disabled>{{ $t("main.selectAZone") }}</option>
                        <option v-for="zone in sortedFilteredZones" :key="zone.id" :value="zone.id">{{ zone.name }}</option>
                    </select>
                </div>
            </div>
            <div v-if="selectedZoneId" class="col-12 col-md">
                <div class="form-group mb-3">
                    <label for="building-id" class="form-label">{{ $t("main.building") }}</label>
                    <select id="building-id" v-model="selectedBuildingId" class="form-select">
                        <option :value="null" disabled>{{ $t("main.selectABuilding") }}</option>
                        <option v-for="building in sortedBuildings" :key="building.id" :value="building.id">{{ building.name }}</option>
                    </select>
                </div>
            </div>
            <div v-if="selectedBuildingId" class="col-12 col-md">
                <div class="form-group">
                    <label for="room-id" class="form-label">{{ $t("main.room") }}</label>
                    <select id="room-id" v-model="selectedRoomId" class="form-select">
                        <option :value="null" disabled>{{ $t("main.selectARoom") }}</option>
                        <option v-for="room in sortedRooms" :key="room.id" :value="room.id">{{ room.name }}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>
