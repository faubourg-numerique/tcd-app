<script setup lang="ts">
import { computed, defineProps, onMounted, ref } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import { useStreetlightStore } from "@/stores/streetlight-store";


const props = defineProps<{ selectedZoneId: string | null }>();

const streetlightStore = useStreetlightStore();

const isLoading = ref(true);


onMounted(async () => {
  await streetlightStore.fetchStreetlights();
  isLoading.value = false;
});

const filteredStreetlights = computed(() => {
  if (!props.selectedZoneId) return [];
  return streetlightStore.streetlights.filter(
    (streetlight) => streetlight.hasZone === props.selectedZoneId
  );
});

const streetlightIcons = {
  on: new L.Icon({ iconSize: [24, 24], iconUrl: "/images/icons/on.svg" }),
  off: new L.Icon({ iconSize: [24, 24], iconUrl: "/images/icons/off.svg" }),
};
const getStreetlightIcon = (powerState: keyof typeof streetlightIcons) => {
  return streetlightIcons[powerState] || streetlightIcons.off;
};

const dashboardMapZoom = parseInt(import.meta.env.VITE_DASHBOARD_MAP_ZOOM);
const dashboardMapCenterLatitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LATITUDE);
const dashboardMapCenterLongitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LONGITUDE);
</script>

<template>
  <div class="container my-4">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="map-container position-relative">
              <p v-if="isLoading" class="text-muted text-center mt-3">Chargement des lampadaires...</p>
                <LMap v-else class="rounded" style="min-height: 60vh; width: 100%" :zoom="dashboardMapZoom" :center="[dashboardMapCenterLatitude, dashboardMapCenterLongitude]" :use-global-leaflet="false">
                <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap" />
                <LMarker v-for="streetlight in filteredStreetlights" :key="streetlight.id" :lat-lng="streetlight.location ? [streetlight.location[1], streetlight.location[0]] : [0, 0]" :icon="getStreetlightIcon(streetlight.powerState as 'on' | 'off')" />
              </LMap>
              <p v-if="!isLoading && filteredStreetlights.length === 0" class="text-muted text-center mt-3">
                Aucun lampadaire dans cette zone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  min-height: 60vh;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  overflow: hidden;
}
</style>
