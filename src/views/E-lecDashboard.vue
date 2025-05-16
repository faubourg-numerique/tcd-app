<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useStreetlightStore } from "@/stores/streetlight-store";
import { useThermostatStore } from "@/stores/thermostat-store";
import api from "@/api";
import EnergyChart from "@/components/EnergyChart.vue";
import DeviceProductionCard from "@/components/DeviceProductionCard.vue";
import DeviceConsumptionCard from "@/components/DeviceConsumptionCard.vue";
import DeviceHistoryModal from "@/components/DeviceHistoryModal.vue"; // Importez le nouveau composant
import Swal from "sweetalert2";

const zoneId = "urn:ngsi-ld:Zone:636fc64e-0200-4cb6-9d13-e13a7255f12e";
const roomId = "urn:ngsi-ld:Room:4bd5355f-cfaf-4435-b0a8-7368abb2d123";

const streetlightStore = useStreetlightStore();
const thermostatStore = useThermostatStore();

const windTurbines = ref<{ currentPowerProduction?: { value: number } }[]>([]);
const solarPanels = ref<{ currentPowerProduction?: { value: number } }[]>([]);

const totalConsumption = ref<number | null>(null);
const totalProduction = ref<number | null>(null);
const clickedType = ref<string | null>(null);

const selectedDevice = ref<any>(null);
const showDeviceDetails = ref<boolean>(false);

const streetlightsInZone = computed(() =>
  streetlightStore.getStreetlightsByZoneId(zoneId)
);
const thermostatsInRoom = computed(() =>
  thermostatStore.getThermostatsByRoomId(roomId)
);

async function openDeviceDetails(device: any) {
  selectedDevice.value = device;
  showDeviceDetails.value = true;
}

function closeDeviceDetailsModal() {
  showDeviceDetails.value = false;
  selectedDevice.value = null;
}

async function fetchData() {
  await streetlightStore.fetchStreetlights();
  await thermostatStore.fetchThermostats();

  const windResponse = await api.get("/eLec-dashboard/wind-turbines");
  windTurbines.value = windResponse.data;

  const solarResponse = await api.get("/eLec-dashboard/solar-panels");
  solarPanels.value = solarResponse.data;

  handleCardClick("consumption");
  handleCardClick("production");
}

function handleCardClick(type: "consumption" | "production") {
  clickedType.value = type;

  if (type === "consumption") {
    let sum = 0;
    streetlightsInZone.value.forEach(light => {
      if (light.currentPowerConsumption) {
        sum += Number(light.currentPowerConsumption);
      }
    });
    thermostatsInRoom.value.forEach(thermostat => {
      if (thermostat.currentPowerConsumption) {
        sum += Number(thermostat.currentPowerConsumption);
      }
    });
    totalConsumption.value = sum;
  }

  if (type === "production") {
    let sum = 0;
    windTurbines.value.forEach(turbine => {
      if (turbine.currentPowerProduction?.value) {
        sum += Number(turbine.currentPowerProduction.value);
      }
    });
    solarPanels.value.forEach(panel => {
      if (panel.currentPowerProduction?.value) {
        sum += Number(panel.currentPowerProduction.value);
      }
    });
    totalProduction.value = sum;
  }
}

let refreshInterval: number | null = null;

onMounted(() => {
  fetchData();
  refreshInterval = window.setInterval(fetchData, 60000);
});

onUnmounted(() => {
  if (refreshInterval !== null) {
    clearInterval(refreshInterval);
  }
});
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">E-lec ⚡</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link active" href="#">Dashboard</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container py-5 bg-light rounded">
    <h1 class="text-success mb-4">Welcome to <strong>E-lec ⚡</strong></h1>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="card border-primary h-100" @click="handleCardClick('consumption')" style="cursor: pointer;">
          <div class="card-body">
            <h5 class="card-title text-primary">Current Energy Consumption</h5>
            <p class="card-text">Click to see the total energy consumption.</p>
            <div v-if="clickedType === 'consumption'">
              <strong>Total: {{ totalConsumption }} kW</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-success h-100" @click="handleCardClick('production')" style="cursor: pointer;">
          <div class="card-body">
            <h5 class="card-title text-success">Energy Production</h5>
            <p class="card-text">Click to see the total energy production.</p>
            <div v-if="clickedType === 'production'">
              <strong>Total: {{ totalProduction }} kW</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-warning h-100">
          <div class="card-body">
            <h5 class="card-title text-warning">Upcoming Maintenance</h5>
            <p class="card-text">Schedule for upcoming maintenance tasks.</p>
            <a href="#" class="btn btn-outline-warning">View Schedule</a>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-info mb-4">
      <div class="card-body">
        <h5 class="card-title text-info">Production vs Consumption</h5>
        <EnergyChart :consumption="totalProduction || 0" :production="totalConsumption || 0" />
      </div>
    </div>


    <div class="row mt-5">
      <h2 class="mb-4">Current Power Production</h2>
      <div class="col-md-6">
        <DeviceProductionCard title="Wind Turbines" :items="windTurbines" />
      </div>
      <div class="col-md-6">
        <DeviceProductionCard title="Solar Panels" :items="solarPanels" />
      </div>
    </div>

    <div class="row mt-5">
      <h2 class="mb-4">Current Power Consumption</h2>
      <div class="col-md-6">
        <DeviceConsumptionCard title="Streetlights" :items="streetlightsInZone" @item-click="openDeviceDetails" />
      </div>
      <div class="col-md-6">
        <DeviceConsumptionCard title="Thermostats" :items="thermostatsInRoom" @item-click="openDeviceDetails" />
      </div>
    </div>

    <DeviceHistoryModal
      :device="selectedDevice"
      :show="showDeviceDetails"
      @close="closeDeviceDetailsModal"
    />
  </div>
</template>

<style scoped>

</style>