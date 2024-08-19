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
      <p><strong>Max Alert:</strong> {{ measurement.maxAlerte?.value ?? 'N/A' }}</p>
      <p><strong>Current Alert:</strong> {{ measurement.enAlerte?.value ?? 'N/A' }}</p>
      <p><strong>Temporisation:</strong> {{ measurement.temporisation?.value ?? 'N/A' }}</p>

      <h2>Alerts</h2>
      <div v-if="alerts.length">
        <ul>
          <li v-for="alert in alerts" :key="alert.id">
            <p>{{ alert.name.value }} :</p>
            <p>Criteria: {{ alert.criteriaType.value }}</p>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No alerts found for this measurement.</p>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
    <h2>Subscriptions</h2>
      <div v-if="subscriptions.length">
          <div v-for="subscription in subscriptions" :key="subscription.id">
            <p>{{ subscription.subscriptionName }}  </p>
            <span>Status :  {{ subscription.status }}</span>
          </div>
      </div>
      <div v-else>
        <p>No subscriptions found for this measurement.</p>
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
