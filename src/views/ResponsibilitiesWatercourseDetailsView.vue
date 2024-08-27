<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDeviceMeasurementStore } from "@/stores/device-Measurement-store";
import { useSubscriptionStore } from '@/stores/subscriptions-store';
import type { Subscription } from '@/models/Subscription';
import type { Measurement } from "@/models/Measurement";
import type { AlertSetting } from "@/models/AlertSetting";
import { useAlertSettingsStore } from "@/stores/alert-settings-store";
import  Modal  from '@/components/SubscriptionModal.vue'; 

const route = useRoute();
const deviceMeasurementStore = useDeviceMeasurementStore();
const subscriptionStore = useSubscriptionStore();
const alertSettingsStore = useAlertSettingsStore();

const measurement = ref<Measurement | null>(null);
const subscriptions = ref<Subscription[]>([]);
const alerts = ref<AlertSetting[]>([]);

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
</script>

<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Details for Watercourse Responsibility</h1>

   
    <div v-if="measurement" class="bg-light p-3 rounded shadow-sm">
      <p><strong>Name :</strong> {{ measurement.name.value }}</p>
      <p><strong>Id :</strong> {{ measurement.id }}</p>
      <p><strong>Distance:</strong> {{ measurement.distance?.value ?? 'N/A' }} {{ measurement.distance?.unit?.value ?? 'N/A' }}</p>

     
      <h2 class="mt-4">Alerts</h2>
      <div v-if="alerts.length" class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Id</th>
              <th>Criteria</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in alerts" :key="alert.id">
              <td>{{ alert.name.value }}</td>
              <td>{{ alert.id }}</td>
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
              <th>Subscription Name</th>
              <th>Subscription ID</th>
              <th>Query</th>
              <th>Status</th>
              <th>Creation Date</th>
              <th>Emails</th>
              <th>Throttling</th>
              <th>Last Notification</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="subscription in subscriptions" :key="subscription.id">
              <td>{{ subscription.subscriptionName }}</td>
              <td>{{ subscription.id }}</td>
              <td>{{ subscription.q }}</td>
              <td>{{ subscription.status }}</td>
              <td>{{ new Date(subscription.creationDate).toLocaleDateString() }}</td>
              <td>
                <ul class="list-unstyled">
                  <li v-for="email in extractEmailsFromUrl(subscription.notification.endpoint.uri)" :key="email">
                    {{ email }}
                  </li>
                </ul>
              </td>
              <td>{{ subscription.throttling }}</td>
              <td>{{ subscription.lastNotification ?? 'N/A' }}</td>
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
    <Modal :is-open="isModalOpen" @close="closeModal">
      <template #title>Créer une nouvelle Subscription

      </template>
      <modal-body>

      </modal-body>
    </Modal>
  </div>
</template>



<style scoped>

</style>
