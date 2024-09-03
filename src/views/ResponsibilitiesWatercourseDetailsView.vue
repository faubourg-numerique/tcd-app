<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Details for Watercourse Responsibility</h1>

    <div v-if="measurement" class="bg-light p-3 rounded shadow-sm">
      <MeasurementGeneral :measurement="measurement" />

      <MeasurementVisualization :grafanaUrl="grafanaUrlMap[measurement.id]" />

      <MeasurementAlerts :alerts="alerts" />

      <MeasurementSubscriptions :subscriptions="subscriptions" @delete-subscription="deleteSubscription" />
    </div>

    <div class="text-center mt-4">
      <button class="btn btn-primary" type="button" @click="openModal">Créer une Subscription</button>
    </div>
    
    <Modal :is-open="isModalOpen" :measurement-id="measurement?.id" @close="closeModal">
      <template #title>Créer une nouvelle Subscription</template>
      <template #body>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDeviceMeasurementStore } from "@/stores/device-Measurement-store";
import { useSubscriptionStore } from '@/stores/subscriptions-store';
import { useAlertSettingsStore } from "@/stores/alert-settings-store";
import MeasurementGeneral from '@/components/DeviceMesurementGeneral.vue';
import MeasurementVisualization from '@/components/DeviceMeasurementVisualization.vue';
import MeasurementAlerts from '@/components/DeviseMeasurementAlerts.vue';
import MeasurementSubscriptions from '@/components/DeviceMeasurementSubscriptions.vue';
import Modal from '@/components/SubscriptionModal.vue'; 
import swal from "sweetalert2";

import type { Measurement } from "@/models/Measurement";
import type { Subscription } from "@/models/Subscription";
import type { AlertSetting } from "@/models/AlertSetting";

const route = useRoute();
const deviceMeasurementStore = useDeviceMeasurementStore();
const subscriptionStore = useSubscriptionStore();
const alertSettingsStore = useAlertSettingsStore();

const measurement = ref<Measurement | null>(null);
const subscriptions = ref<Subscription[]>([]);
const alerts = ref<AlertSetting[]>([]);

const grafanaUrlMap: Record<string, string> = {
  'urn:ngsi-ld:DeviceMeasurement:7247c13d-4447-4a77-be08-64a7a1e1eff2': 'https://grafana.ouranos-ws.com/d-solo/fdw6nnfyq6nswc/water-course?orgId=1&theme=light&panelId=1&from=now-24h&to=now',
  'urn:ngsi-ld:DeviceMeasurement:4b434ee0-bf2c-4115-9c5a-67d6e0b0b9d5': 'https://grafana.ouranos-ws.com/d-solo/fdw6nnfyq6nswc/water-course?orgId=1&theme=light&panelId=2&from=now-24h&to=now',
  'urn:ngsi-ld:DeviceMeasurement:403445fd-d644-4c7b-bc5c-b8ad19a0cbd7': 'https://grafana.ouranos-ws.com/d-solo/fdw6nnfyq6nswc/water-course?orgId=1&theme=light&panelId=3&from=now-24h&to=now',
  'urn:ngsi-ld:DeviceMeasurement:4370a32c-4362-4b4a-8305-164b67c80d63': 'https://grafana.ouranos-ws.com/d-solo/fdw6nnfyq6nswc/water-course?orgId=1&theme=light&panelId=4&from=now-24h&to=now',
  'urn:ngsi-ld:DeviceMeasurement:a6f66924-cb51-45d0-826a-06a3abb0ab12': 'https://grafana.ouranos-ws.com/d-solo/fdw6nnfyq6nswc/water-course?orgId=1&theme=light&panelId=5&from=now-24h&to=now'
};


onMounted(async () => {
  const measurementId = route.params.id as string;

  await deviceMeasurementStore.getDeviceMeasurements();
  measurement.value = deviceMeasurementStore.measurements.find(
    (m: Measurement) => m.id === measurementId
  ) ?? null;

  await subscriptionStore.getsubscriptions();
  
  if (measurement.value) {
    subscriptions.value = subscriptionStore.subscriptions.filter((subscription: Subscription) => {
      return subscription.entities.some(entity => entity.id === measurement.value?.id);
    });

    await alertSettingsStore.getAlertSettings();
    
    alerts.value = alertSettingsStore.alertSettings.filter((alert: AlertSetting) => {
      return alert.hasEntity.object === measurement.value?.id;
    });
  }
});

const isModalOpen = ref(false);

function openModal() {
  isModalOpen.value = true;
}

async function closeModal() {
  isModalOpen.value = false;
  await subscriptionStore.getsubscriptions();
  subscriptions.value = subscriptionStore.subscriptions.filter((subscription: Subscription) => {
    return subscription.entities.some(entity => entity.id === measurement.value?.id);
  });
}

function deleteSubscription(subscriptionId: string) {
  swal.fire({
    title: 'Vous êtes sûr?',
    text: 'De supprimer cette subscription',
    icon: 'warning',
    confirmButtonText: 'Oui',
  }).then(async (result) => {
    if (result.isConfirmed) {
      await subscriptionStore.deletesubscription(subscriptionId);
      await subscriptionStore.getsubscriptions();  
      subscriptions.value = subscriptionStore.subscriptions.filter((subscription: Subscription) => {
        return subscription.entities.some(entity => entity.id === measurement.value?.id);
      });
    }
  });
}
</script>
