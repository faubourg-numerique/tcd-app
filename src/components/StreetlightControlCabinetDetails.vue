<script setup lang="ts">
import { defineProps } from "vue";
import "leaflet/dist/leaflet.css";

import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";

const props = defineProps<{
  cabinet: { id: string; name: string };
  streetlights: { id: string; name: string; powerState: string; location: number[] }[];
}>();

const dashboardMapZoom = parseInt(import.meta.env.VITE_DASHBOARD_MAP_ZOOM);
const dashboardMapCenterLatitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LATITUDE);
const dashboardMapCenterLongitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LONGITUDE);
</script>

<template>
  <div class="accordion-body">
    <h5>Liste des Lampadaires</h5>
    <table class="table table-bordered table-striped mt-2">
      <thead class="table-danger">
        <tr>
          <th scope="col">Nom</th>
          <th scope="col">État</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="streetlight in streetlights" :key="streetlight.id">
          <td>{{ streetlight.name }}</td>
          <td>{{ streetlight.powerState }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="streetlights.length === 0" class="text-muted text-center">
      Aucun lampadaire associé.
    </p>
    <keep-alive>
    <LMap style="height: 300px; width: 100%; border: 1px solid #ccc; border-radius: 5px" :zoom="dashboardMapZoom" :center="[dashboardMapCenterLatitude, dashboardMapCenterLongitude]" :use-global-leaflet="false">
      <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap" />

      <template v-for="streetlight in streetlights" :key="streetlight.id">
        <LMarker v-if="streetlight.location" :lat-lng="[streetlight.location[1], streetlight.location[0]]">
          <LPopup> 
            <b>{{ streetlight.name }}</b><br />
            État: {{ streetlight.powerState }}
          </LPopup>
        </LMarker>
      </template>
    </LMap>
    </keep-alive>
  </div>
</template>
