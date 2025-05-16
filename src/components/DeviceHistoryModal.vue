<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import api from "@/api";
import Swal from "sweetalert2";
import 'chart.js/auto';
import { Line } from 'vue-chartjs';
import 'chartjs-adapter-date-fns';
import { fr } from 'date-fns/locale';

const props = defineProps<{
  device: any | null;
  show: boolean;
}>();

const emit = defineEmits(["close"]);

const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);
const elecMeasurements = ref<{ value: any; timeInstant: any }[]>([]);
const isLoading = ref(false);
const chartData = ref(null);
const chartOptions = ref({
  responsive: true,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'hour',
        displayFormats: {
          hour: 'dd MMM HH:mm'
        },
        tooltipFormat: 'dd MMM HH:mm',
        locale: fr
      },
      title: {
        display: true,
        text: 'Date et Heure'
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Consommation (kW)'
      }
    }
  },
  plugins: {
    legend: {
      display: false // Pas besoin de légende pour une seule série de données
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('fr-FR', { style: 'decimal' }).format(context.parsed.y) + ' kW';
          }
          return label;
        }
      }
    }
  }
});

watch(
  () => props.show,
  async (newShow) => {
    if (newShow && props.device) {
      startDate.value = null;
      endDate.value = null;
      elecMeasurements.value = [];
      chartData.value = null; // Réinitialiser les données du graphique
    }
  }
);

async function fetchDeviceHistory() {
  console.log('fetchDeviceHistory - Start Date:', startDate.value, 'End Date:', endDate.value);
  if (!props.device || !startDate.value || !endDate.value) return;

  isLoading.value = true;
  try {
    const formattedStartDate = new Date(startDate.value + 'T00:00:00Z').toISOString();
    const formattedEndDate = new Date(endDate.value + 'T23:59:59Z').toISOString();
    console.log('fetchDeviceHistory - Formatted Start Date:', formattedStartDate, 'Formatted End Date:', formattedEndDate);
    const response = await api.get(`/eLec-dashboard/elec-filling-measurements/${props.device.id}`, {
      params: {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }
    });

    const consumptionData = response.data['https://ngsi-ld.ouranos-ws.com/currentPowerConsumption'];
    console.log('fetchDeviceHistory - Consumption Data:', consumptionData);
    if (Array.isArray(consumptionData)) {
      const filteredMeasurements = consumptionData
        .filter(entry => {
          const entryDate = new Date(entry.observedAt).getTime();
          const startOfDayUTC = new Date(formattedStartDate).getTime();
          const endOfDayUTC = new Date(formattedEndDate).getTime();
          console.log('entry.observedAt:', entry.observedAt, 'entryDate:', entryDate);
          console.log('startDate:', formattedStartDate, 'startOfDayUTC:', startOfDayUTC);
          console.log('endDate:', formattedEndDate, 'endOfDayUTC:', endOfDayUTC);
          return entryDate >= startOfDayUTC && entryDate <= endOfDayUTC;
        })
        .map(entry => ({
          value: entry.value,
          timeInstant: entry.observedAt,
        }));
      elecMeasurements.value = filteredMeasurements;
      console.log('Données après filtrage:', elecMeasurements.value);

      // Préparer les données pour le graphique
      chartData.value = {
        datasets: [{
          label: 'Consommation (kW)',
          data: elecMeasurements.value.map(m => ({ x: new Date(m.timeInstant), y: m.value })),
          borderColor: '#4CAF50',
          fill: false,
          tension: 0.1
        }]
      };
    } else {
      elecMeasurements.value = [];
      chartData.value = null;
    }

    await nextTick();


  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Impossible de récupérer l\'historique du dispositif.',
    });
  } finally {
    isLoading.value = false;
  }
}

function closeModal() {
  emit("close");
}
</script>

<template>
  <div v-if="show" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Historique - {{ device?.name || 'Dispositif' }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="fetchDeviceHistory">
            <div class="mb-3">
              <label class="form-label">Date of begin :</label>
              <input type="date" class="form-control" v-model="startDate" required>
            </div>
            <div class="mb-3">
              <label class="form-label">End Date :</label>
              <input type="date" class="form-control" v-model="endDate" required>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Show the history  
            </button>
            <button type="button" class="btn btn-secondary ms-2" @click="closeModal" :disabled="isLoading">Annuler</button>
          </form>

          <div v-if="chartData" class="mt-4">
            <h4>History of data </h4>
            <Line :data="chartData" :options="chartOptions" />
          </div>
          <div v-else-if="startDate && endDate && !isLoading">
          </div>
          <div v-if="isLoading" class="d-flex justify-content-center mt-3">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>