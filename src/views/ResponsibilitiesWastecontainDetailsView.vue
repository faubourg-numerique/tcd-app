<template>
    <div class="container mt-4">
      <h1 class="text-center mb-4">Surveillance du niveau P.A.V.</h1>
  
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
  'urn:ngsi-ld:DeviceMeasurement:b87eb1f6-41c9-4861-8dd0-088ebe7881a7': 'https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=1',
  'urn:ngsi-ld:DeviceMeasurement:a17e49e6-68f5-45d9-90e8-de7b229de350': 'https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=2',
  'urn:ngsi-ld:DeviceMeasurement:8725b1f6-3cdd-4f24-8e1f-af34a6f4a0b8': 'https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=4',
  'urn:ngsi-ld:DeviceMeasurement:48e5334e-8c99-48d9-a386-836bf0d440aa': 'https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=5',
  'urn:ngsi-ld:DeviceMeasurement:f7ca0c34-f0b3-4fbd-921e-19fb3517f50d': 'https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=7',
  'urn:ngsi-ld:DeviceMeasurement:a482a1be-1787-4974-9101-accee04a5b9c': 'https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=8',
  'urn:ngsi-ld:DeviceMeasurement:fe6b5228-78fe-4272-938b-501d23a356c2': 'https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=3',
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
  