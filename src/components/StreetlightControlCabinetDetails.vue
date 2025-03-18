<script setup lang="ts">
import { defineProps, ref } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

const props = defineProps<{
  cabinet: { id: string; name: string };
  streetlights: { id: string; name: string; powerState: string; location: number[] }[];
}>();

const dashboardMapZoom = parseInt(import.meta.env.VITE_DASHBOARD_MAP_ZOOM);
const dashboardMapCenterLatitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LATITUDE);
const dashboardMapCenterLongitude = parseFloat(import.meta.env.VITE_DASHBOARD_MAP_CENTER_LONGITUDE);

const streetlightIcons = {
  on: new L.Icon({ iconSize: [16, 16], iconUrl: "/images/icons/on.svg" }),
  off: new L.Icon({ iconSize: [16, 16], iconUrl: "/images/icons/off.svg" }),
};

const getStreetlightIcon = (powerState: keyof typeof streetlightIcons) => {
  return streetlightIcons[powerState] || streetlightIcons.off;
};

const showModal = ref(false);
</script>

<template>
  <div>
    <button class="btn btn-primary" @click="showModal = true">Afficher les détails</button>

    <div v-if="showModal" class="modal fade" tabindex="-1" :class="{ show: showModal }" style="display: block;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Détails du Cabinet</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
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
              <LMap style="min-height: 60vh" :zoom="dashboardMapZoom" :center="[dashboardMapCenterLatitude, dashboardMapCenterLongitude]" :use-global-leaflet="false" >
                <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap"  />
                <template v-for="streetlight in streetlights" :key="streetlight.id">
                  <LMarker
                    v-if="streetlight.location"
                    :lat-lng="[streetlight.location[1], streetlight.location[0]]"
                    :icon="getStreetlightIcon(streetlight.powerState as 'on' | 'off')"
                  />
                </template>
              </LMap>
            </keep-alive>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showModal = false">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
