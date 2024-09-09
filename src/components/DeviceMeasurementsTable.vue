<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useDeviceMeasurementStore } from "@/stores/device-Measurement-store";
import { useSubscriptionStore } from '@/stores/subscriptions-store';
import { useAlertSettingsStore } from "@/stores/alert-settings-store";
import type { Subscription } from '@/models/Subscription';
import type { Measurement } from "@/models/Measurement";

const props = defineProps<{
  measurementType: string;
}>();

const deviceMeasurementStore = useDeviceMeasurementStore();
const subscriptionStore = useSubscriptionStore();
const alertSettingsStore = useAlertSettingsStore(); 

const measurements = ref<Measurement[]>([]);
const subscriptions = ref<Subscription[]>([]);

onMounted(async () => {
    measurements.value = deviceMeasurementStore.measurements.filter(
        (measurement: Measurement) => measurement.measurementType.value === props.measurementType
    );

    await subscriptionStore.getsubscriptions();
    subscriptions.value = subscriptionStore.subscriptions.filter((subscription: Subscription) => {
        return subscription.entities.some((entity) => {
            return measurements.value.some((measurement: Measurement) => measurement.id === entity.id);
        });
    });

    await alertSettingsStore.getAlertSettings(); 
});

watch(() => props.measurementType, async () => {
    measurements.value = deviceMeasurementStore.measurements.filter(
        (measurement: Measurement) => measurement.measurementType.value === props.measurementType
    );
});
</script>

<template>
    <div class="container">
        <h1>{{ measurementType }} Measurements</h1>
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
                            <router-link :to="`/responsibilities/${measurementType}/${measurement.id}`" class="no-link">
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
