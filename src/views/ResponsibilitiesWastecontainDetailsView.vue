<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Details for Watercourse Responsibility</h1>

    <div v-if="measurement" class="bg-light p-3 rounded shadow-sm">
      <MeasurementGeneral :measurement="measurement" />

      <MeasurementVisualization :grafanaUrl="grafanaUrlMap[measurement.id]" />

      <MeasurementAlerts :alerts="alerts" />

      <MeasurementSubscriptions 
        :key="subscriptionsKey" 
        :subscriptions="subscriptions" 
        @delete-subscription="deleteSubscription" 
      />
    </div>

    <div class="text-center mt-4">
      <button class="btn btn-primary" type="button" @click="openModal">Créer une Subscription</button>
    </div>
    
    <Modal :is-open="isModalOpen" :measurement-id="measurement?.id" @close="closeModal" @subscription-created="handleSubscriptionCreated">
      <template #title>Créer une nouvelle Subscription</template>
      <template #body>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
const subscriptionsKey = ref(0); // Clé dynamique pour le composant des subscriptions

const grafanaUrlMap: Record<string, string> = {
  'urn:ngsi-ld:DeviceMeasurement:7247c13d-4447-4a77-be08-64a7a1e1eff2': 'https://grafana.ouranos-ws.com/d-solo/fdw6nnfyq6nswc/water-course?orgId=1&theme=light&panelId=1&from=now-24h&to=now',
  // Ajoutez d'autres URLs ici
};

async function loadSubscriptionsAndAlerts() {
  if (measurement.value) {
    await subscriptionStore.getsubscriptions();
    subscriptions.value = subscriptionStore.subscriptions.filter((subscription: Subscription) => {
      return subscription.entities.some(entity => entity.id === measurement.value?.id);
    });

    await alertSettingsStore.getAlertSettings();
    alerts.value = alertSettingsStore.alertSettings.filter((alert: AlertSetting) => {
      return alert.hasEntity.object === measurement.value?.id;
    });
  }
}

onMounted(async () => {
  const measurementId = route.params.id as string;

  await deviceMeasurementStore.getDeviceMeasurements();
  measurement.value = deviceMeasurementStore.measurements.find(
    (m: Measurement) => m.id === measurementId
  ) ?? null;

  await loadSubscriptionsAndAlerts();
});

const isModalOpen = ref(false);

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

async function handleSubscriptionCreated() {
  await loadSubscriptionsAndAlerts();
  subscriptionsKey.value += 1; // Incrémenter la clé pour forcer le re-render
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
      await loadSubscriptionsAndAlerts(); // Recharger les subscriptions après suppression
    }
  });
}
</script>

<style>
template{
  margin-bottom: 10px;
}
</style>
