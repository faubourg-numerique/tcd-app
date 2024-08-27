<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDeviceMeasurementStore } from "@/stores/device-Measurement-store";
import { useSubscriptionStore } from '@/stores/subscriptions-store';
import { useRouter } from 'vue-router';
import type { Subscription } from '@/models/Subscription';
import type { Measurement } from "@/models/Measurement";
import { useAlertSettingsStore } from "@/stores/alert-settings-store";


const deviceMeasurementStore = useDeviceMeasurementStore();
const subscriptionStore = useSubscriptionStore();
const alertSettingsStore = useAlertSettingsStore(); // Créez une instance de la boutique

const measurements = ref<Measurement[]>([]);
const subscriptions = ref<Subscription[]>([]);


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const router = useRouter();

onMounted(async () => {
    await deviceMeasurementStore.getDeviceMeasurements();
    measurements.value = deviceMeasurementStore.measurements.filter(
        (measurement: Measurement) => measurement.measurementType.value === 'water-level'
    );

    await subscriptionStore.getsubscriptions();

    subscriptions.value = subscriptionStore.subscriptions.filter((subscription: Subscription) => {
        return subscription.entities.some((entity) => {
            return measurements.value.some((measurement: Measurement) => measurement.id === entity.id);
        });
    });

    await alertSettingsStore.getAlertSettings(); 
});
</script>


<template>
    <div class="container">
        <h1>Responsibilities Watercourse</h1>
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
                    <tr v-for="measurement in measurements" :key="measurement.id">
                        <td>
                            <router-link :to="`/responsibilities/watercourse/${measurement.id}`" class="no-link">
                                {{ measurement.name.value }} 
                            </router-link>
                        </td>
                        <td>{{ measurement.distance?.value ?? 'N/A' }} {{ measurement.distance?.unit?.value ?? 'N/A' }}</td>
                        <td>{{ measurement.maxAlerte?.value ?? 'N/A' }}</td>
                        <td>{{ measurement.enAlerte?.value ?? 'N/A' }}</td>
                        <td>{{ measurement.temporisation?.value ?? 'N/A' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
a:hover {
    border-bottom: 1px solid;
    background: rgb(220, 53, 69);
}
a {
    text-decoration: none;
    color: inherit;
    cursor: default;
}
</style>
