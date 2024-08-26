<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDeviceMeasurementStore } from "@/stores/device-Measurement-store";
import { useSubscriptionStore } from '@/stores/subscriptions-store';
import type { Subscription } from '@/models/Subscription';
import type { Measurement } from "@/models/Measurement";
import type { AlertSetting } from "@/models/AlertSetting";
import { useAlertSettingsStore } from "@/stores/alert-settings-store";

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
});
</script>

<template>
  <div class="container">
    <h1>Details for Watercourse Responsibility</h1>

    <div v-if="measurement">
      <p><strong>Name :</strong> {{ measurement.name.value }}</p>
      <p><strong>Id :</strong> {{ measurement.id }}</p>
      <p><strong>Distance:</strong> {{ measurement.distance?.value ?? 'N/A' }} {{ measurement.distance?.unit?.value ?? 'N/A' }}</p>

      <!-- Alerts Section -->
      <h2>Alerts</h2>
      <div v-if="alerts.length">
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
      <div v-else>
        <p>No alerts found for this measurement.</p>
      </div>

      <h2>Subscriptions</h2>
      <div v-if="subscriptions.length">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Subscription Name</th>
              <th>Query</th>
              <th>Status</th>
              <th>Creation Date</th>
              <th>Emails</th>
              <th>Throttling </th>
              <th>Last Notification </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="subscription in subscriptions" :key="subscription.id">
              <td>{{ subscription.subscriptionName }}</td>
              <td>{{ subscription.q }}</td>
              <td>{{ subscription.status }}</td>
              <td>{{ new Date(subscription.creationDate).toLocaleDateString() }} </td>
              <td>
                <ul>
                  <li v-for="email in extractEmailsFromUrl(subscription.notification.endpoint.uri)" :key="email">
                    {{ email }}
                  </li>
                </ul>
              </td>
              <td>{{ subscription.throttling }}</td>
              <td>{{ subscription.lastNotification }} </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>No subscriptions found for this measurement.</p>
      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  margin-top: 20px;
}

p {
  margin: 10px 0;
}

strong {
  color: #333;
}
</style>
