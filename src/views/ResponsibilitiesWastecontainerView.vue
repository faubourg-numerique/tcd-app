<script setup lang="ts">
import CityZoneSelector from "@/components/CityZoneSelector.vue";
import { useDeviceMeasurementStore } from '@/stores/device-Measurement-store';
import { useWasteContainerStore } from "@/stores/waste-container-store";
import { ref, type Ref } from 'vue';
import { useRoute } from "vue-router";

const route = useRoute();

const wasteContainerStore = useWasteContainerStore();
const deviceMeasurementStore = useDeviceMeasurementStore();

const selectedCityId: Ref<string | null> = ref(route.query.cityId as string ?? null);
const selectedZoneId: Ref<string | null> = ref(route.query.zoneId as string ?? null);

function getDeviceMeasurement(deviceMeasurementId: string) {
  return deviceMeasurementStore.getDeviceMeasurement(deviceMeasurementId);
}
</script>

<template>
  <div class="container">
      <div class="m-4">
          <CityZoneSelector v-model:selected-city-id="selectedCityId" v-model:selected-zone-id="selectedZoneId"></CityZoneSelector>
      </div>
      <template v-if="selectedCityId && selectedZoneId">
        <h1>PAV</h1>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Distance</th>
                        <th>Max alerte</th>
                        <th>En alerte</th>
                        <th>Temporisation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="wasteContainer in wasteContainerStore.getWasteContainersByZoneId(selectedZoneId)" :key="wasteContainer.id">
                        <td>
                            <router-link :to="`/responsibilities/water-level/${wasteContainer.hasDeviceMeasurement}`" class="no-link">
                                {{ wasteContainer.name }} 
                            </router-link>
                        </td>
                        <td>{{ getDeviceMeasurement(wasteContainer.hasDeviceMeasurement)?.distance?.value ?? 'N/A' }} mm</td>
                        <td>{{ getDeviceMeasurement(wasteContainer.hasDeviceMeasurement)?.maxAlerte?.value ?? 'N/A' }}</td>
                        <td>{{ getDeviceMeasurement(wasteContainer.hasDeviceMeasurement)?.enAlerte?.value ?? 'N/A' }}</td>
                        <td>{{ getDeviceMeasurement(wasteContainer.hasDeviceMeasurement)?.temporisation?.value ?? 'N/A' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </template>
  </div>
</template>
