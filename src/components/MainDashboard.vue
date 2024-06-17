<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick, getCurrentInstance } from 'vue';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker , LPolygon } from "@vue-leaflet/vue-leaflet";

const { t } = useI18n()
const mapMainDashboard = import.meta.env.VITE_MAP_MAIN_DASHBOARD as string
const thermostat1DashboardPanel1Url =
  import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_1_URL.replace(
    '$customText',
    t('dashboard.thermostat.temperature')
  ) as string
const thermostat1DashboardPanel2Url = import.meta.env
  .VITE_THERMOSTAT_1_DASHBOARD_PANEL_2_URL as string


const mapMainDashboard = import.meta.env.VITE_MAP_MAIN_DASHBOARD as string;
const dataUrl = import.meta.env.VITE_API_URL as string ; 

const markers = ref([]); 
const zones = ref ([]) ; 


onMounted(async () => {
  try {
    const response = await axios.get(dataUrl+'data-map');
    const data = response.data;
    console.log(data) ;
    
    const streetlights = data.streetlights.map(light => ({
      id: light.id,
      name: light.name ,
      lat: light.location.value.coordinates[1],  
      lng: light.location.value.coordinates[0]   
    }));

   const zoneData = data.zones.map(zone => ({
  id: zone.id,
  name: zone.name,
  coordinates: zone.location.value.coordinates[0].map(coord => [coord[1], coord[0]])
}));
    console.log(zoneData) ;
    
    await nextTick();
    
    markers.value = streetlights;
    zones.value = zoneData;
    console.log(markers.value);
    console.log(zones.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  
})
;

</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-7 col-sm-12">
        <l-map zoom="12" :center="[50.267, 1.672]" :use-global-leaflet="false">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          <l-marker v-for="marker in markers" :key="marker.id" :lat-lng="[marker.lat, marker.lng]"></l-marker>

          <l-polygon v-for="zone in zones" :key="zone.id"
            :lat-lngs="zone.coordinates"
            color="#FF00002"
            :fill="true"
            :fillOpacity="0.5"
            fillColor="#FF0000"
          />
        </l-map>
      </div>
  
      <div class="col-md-5 col-sm-12">
        <div class="w-100">
          <iframe class="h-100 w-100" :src="thermostat1DashboardPanel1Url" frameborder="0"></iframe>
        </div>
        <div class="w-100">
          <iframe class="h-100 w-100" :src="thermostat1DashboardPanel2Url" frameborder="0"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-div-dashboard {
  height: 80vh;
}
</style>
