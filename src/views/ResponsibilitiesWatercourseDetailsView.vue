<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Details for Watercourse Responsibility</h1>

    <div v-if="measurement" class="bg-light p-3 rounded shadow-sm">
      <div>
        <h2>Géneral</h2>
        <p><strong>Name:</strong> {{ measurement.name.value }}</p>
        <p><strong>Distance:</strong> {{ measurement.distance?.value ?? 'N/A' }} {{ measurement.distance?.unit?.value ?? 'N/A' }}</p>
      </div>

      <div v-if="grafanaUrlMap[measurement.id]" class="mt-4">
        <h2>Visualisation</h2>
        <iframe :src="grafanaUrlMap[measurement.id]" width="450" height="200" frameborder="0"></iframe>
      </div>

      <h2 class="mt-4">Alerts</h2>
      <div v-if="alerts.length" class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Criteria</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in alerts" :key="alert.id">
              <td>{{ alert.name.value }}</td>
              <td>{{ alert.criteriaType.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="alert alert-warning" role="alert">
        No alerts found for this measurement.
      </div>

      <h2 class="mt-4">Subscriptions</h2>
      <div v-if="subscriptions.length" class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Query</th>
              <th>Status</th>
              <th>Emails</th>
              <th>Throttling</th>
              <th>Last Notification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="subscription in subscriptions" :key="subscription.id">
              <td>{{ subscription.q }}</td>
              <td>{{ subscription.status }}</td>
              <td>
                <ul class="list-unstyled">
                  <li v-for="email in extractEmailsFromUrl(subscription.notification.endpoint.uri)" :key="email">
                    {{ email }}
                  </li>
                </ul>
              </td>
              <td>{{ subscription.throttling }}</td>
              <td>{{ subscription.lastNotification ?? 'N/A' }}</td>
              <td>
                <button class="btn btn-outline-danger" @click="deleteSubscription(subscription.id)">
                  <i class="bi bi-trash"></i> Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="alert alert-warning" role="alert">
        No subscriptions found for this measurement.
      </div>
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
import Modal from '@/components/SubscriptionModal.vue'; 
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


function extractEmailsFromUrl(url: string): string[] {
  const urlParams = new URL(url).searchParams;
  const emailsParam = urlParams.get('emails');
  return emailsParam ? emailsParam.split(',') : [];
}

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
  console.log(subscriptions.value);
});

const isModalOpen = ref(false);

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}
function deleteSubscription(subscriptionId: string) {
  subscriptionStore.deletesubscription(subscriptionId);
}
</script>
<style>
template{
  margin-bottom: 10px;
}
</style>