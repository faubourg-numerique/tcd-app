<script setup lang="ts">
import { useDeviceMeasurementStore } from "@/stores/device-Measurement-store";

const urls: { [deviceMeasurementId: string]: string } = {
    "urn:ngsi-ld:DeviceMeasurement:b87eb1f6-41c9-4861-8dd0-088ebe7881a7": "https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=1",
    "urn:ngsi-ld:DeviceMeasurement:a17e49e6-68f5-45d9-90e8-de7b229de350": "https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=2",
    "urn:ngsi-ld:DeviceMeasurement:8725b1f6-3cdd-4f24-8e1f-af34a6f4a0b8": "https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=4",
    "urn:ngsi-ld:DeviceMeasurement:48e5334e-8c99-48d9-a386-836bf0d440aa": "https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=5",
    "urn:ngsi-ld:DeviceMeasurement:f7ca0c34-f0b3-4fbd-921e-19fb3517f50d": "https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=7",
    "urn:ngsi-ld:DeviceMeasurement:a482a1be-1787-4974-9101-accee04a5b9c": "https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=8",
    "urn:ngsi-ld:DeviceMeasurement:fe6b5228-78fe-4272-938b-501d23a356c2": "https://grafana.ouranos-ws.com/d-solo/cdx6rx38rpb7ke/p-a-v?orgId=1&theme=light&panelId=3",
    "urn:ngsi-ld:DeviceMeasurement:7247c13d-4447-4a77-be08-64a7a1e1eff2": "https://grafana.ouranos-ws.com/d-solo/fdw6nnfyq6nswc/water-course?orgId=1&theme=light&panelId=1&from=now-24h&to=now",
    "urn:ngsi-ld:DeviceMeasurement:4b434ee0-bf2c-4115-9c5a-67d6e0b0b9d5": "https://grafana.ouranos-ws.com/d-solo/fdw6nnfyq6nswc/water-course?orgId=1&theme=light&panelId=2&from=now-24h&to=now",
    "urn:ngsi-ld:DeviceMeasurement:403445fd-d644-4c7b-bc5c-b8ad19a0cbd7": "https://grafana.ouranos-ws.com/d-solo/fdw6nnfyq6nswc/water-course?orgId=1&theme=light&panelId=3&from=now-24h&to=now",
    "urn:ngsi-ld:DeviceMeasurement:4370a32c-4362-4b4a-8305-164b67c80d63": "https://grafana.ouranos-ws.com/d-solo/fdw6nnfyq6nswc/water-course?orgId=1&theme=light&panelId=4&from=now-24h&to=now",
    "urn:ngsi-ld:DeviceMeasurement:a6f66924-cb51-45d0-826a-06a3abb0ab12": "https://grafana.ouranos-ws.com/d-solo/fdw6nnfyq6nswc/water-course?orgId=1&theme=light&panelId=5&from=now-24h&to=now"
};

const props = defineProps({
    deviceMeasurementId: {
        type: String,
        required: true
    }
});

const deviceMeasurementStore = useDeviceMeasurementStore();

const deviceMeasurement = deviceMeasurementStore.getDeviceMeasurement(props.deviceMeasurementId);
</script>

<template>
    <div v-if="deviceMeasurement.id in urls">
        <h2>{{ $t("main.visualizations") }}</h2>
        <iframe :src="urls[deviceMeasurement.id]" width="450" height="200" frameborder="0"></iframe>
    </div>
</template>
