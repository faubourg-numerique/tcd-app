<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPolygon } from '@vue-leaflet/vue-leaflet'
import { useOauthStore } from '../stores/oauth-store'
import type { AxiosResponse } from 'axios'

import type { Streetlight } from '@/model/Streetlight'
import type { Zone } from '@/model/Zone'

const { t } = useI18n()
const thermostat1DashboardPanel1Url =
  import.meta.env.VITE_THERMOSTAT_1_DASHBOARD_PANEL_1_URL.replace(
    '$customText',
    t('dashboard.thermostat.temperature')
  ) as string
const thermostat1DashboardPanel2Url = import.meta.env
  .VITE_THERMOSTAT_1_DASHBOARD_PANEL_2_URL as string

const dataUrl = import.meta.env.VITE_API_URL as string

const markers = ref<Streetlight[]>([])
const zones = ref<Zone[]>([])

onMounted(async () => {
  try {
    const response: AxiosResponse = await useOauthStore().backend.get(dataUrl + 'data-map')
    console.log(response.data)
    const streetlights: Array<Streetlight> = response.data.streetlights
    const zoneArray: Array<Zone> = response.data.zones

    await nextTick()

    markers.value = streetlights
    zones.value = zoneArray
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-7 col-sm-12">
        <l-map :zoom="12" :center="[50.267, 1.672]" :use-global-leaflet="false">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          <l-marker
            v-for="marker in markers"
            :key="marker.id"
            :lat-lng="[marker.coordinates.lat, marker.coordinates.long]"
          ></l-marker>

          <l-polygon
            v-for="zone in zones"
            :key="zone.id"
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
