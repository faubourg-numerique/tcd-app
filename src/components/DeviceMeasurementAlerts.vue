<script setup lang="ts">
import Modal from "bootstrap/js/dist/modal";
import swal from "sweetalert2";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useMainStore } from "@/stores/main-store";
import { useAlertSettingsStore } from "@/stores/alert-settings-store";
import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useFloodMonitoringStore } from "@/stores/flood-monitoring-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { useWasteContainerStore } from "@/stores/waste-container-store";
import { useZoneStore } from "@/stores/zone-store";
import type { AlertSettings } from "@/types/AlertSettings";

const props = defineProps({
    deviceMeasurementId: {
        type: String,
        required: true,
    },
});

const { t } = useI18n();

const mainStore = useMainStore();
const alertSettingsStore = useAlertSettingsStore();
const deviceMeasurementStore = useDeviceMeasurementStore();
const floodMonitoringStore = useFloodMonitoringStore();
const subscriptionStore = useSubscriptionStore();
const wasteContainerStore = useWasteContainerStore();
const zoneStore = useZoneStore();

const deviceMeasurement = deviceMeasurementStore.getDeviceMeasurement(props.deviceMeasurementId);
const alertSettings = computed(() => alertSettingsStore.getAlertSettingsByEntityId(deviceMeasurement.id));

let entity;
if (deviceMeasurement.measurementType === "waste-level") {
    entity = wasteContainerStore.getWasteContainerByDeviceMeasurementId(deviceMeasurement.id);
} else {
    entity = floodMonitoringStore.getFloodMonitoringByDeviceMeasurementId(deviceMeasurement.id);
}

const zone = zoneStore.getZone(entity.hasZone);

const watchedAttribute = deviceMeasurement.measurementType === "waste-level" ? "fillingLevel" : "currentLevel";

const subscriptionFormModalElement = ref(null);
let subscriptionFormModal: Modal | null = null;

const canReadAlerts = mainStore.hasRole(`${zone.role}AlertsRead`);
const canWriteAlerts = mainStore.hasRole(`${zone.role}AlertsWrite`);

const subscriptionQueryCriteria = ref(">");
const subscriptionQueryValue = ref(0);
const subscriptionEmails = ref("");
const subscriptionThrottlingDays = ref(0);

const subscription = {
    subscriptionName: "",
    type: "Subscription",
    entities: [
        {
            id: deviceMeasurement.id,
            type: "DeviceMeasurement",
        },
    ],
    q: "",
    throttling: 0,
    notification: {
        attributes: [watchedAttribute, "name"],
        endpoint: {
            uri: "",
        },
    },
};

function getEmailsFromUrl(url: string) {
    const params = new URL(url).searchParams;
    const emails = params.get("emails");
    return emails?.split(",") ?? [];
}

function formatSecondsToDays(seconds: number) {
    return Math.floor(seconds / (24 * 60 * 60));
}

function formatDate(date: string) {
    return new Date(date).toLocaleString();
}

async function createSubscription() {
    subscription.subscriptionName = `${watchedAttribute} ${subscriptionQueryCriteria.value} ${subscriptionQueryValue.value} - ${deviceMeasurement.name}`;
    subscription.q = `${watchedAttribute}${subscriptionQueryCriteria.value}${subscriptionQueryValue.value}`;
    subscription.throttling = subscriptionThrottlingDays.value * 24 * 60 * 60;

    const _subscription = await subscriptionStore.createSubscription(subscription);

    const _alertSettings = {
        criteriaType: subscriptionQueryCriteria.value === "<" ? "LT" : "GT",
        criteriaValue: subscriptionQueryValue.value,
        name: subscription.subscriptionName,
        propertyName: watchedAttribute,
        hasEntity: deviceMeasurement.id,
        hasSubscription: _subscription.id
    };
    await alertSettingsStore.createAlertSettings(_alertSettings as AlertSettings);

    await swal.fire({
        icon: "success",
        title: t("dialogs.createSubscriptionSuccessTitle"),
        text: t("dialogs.createSubscriptionSuccessText"),
    });

    if (subscriptionFormModal) {
        subscriptionFormModal.hide();
    }
}

async function deleteAlertSettings(_alertSettings: AlertSettings) {
    const result = await swal.fire({
        icon: "question",
        title: t("dialogs.deleteAlertQuestionTitle"),
        text: t("dialogs.deleteAlertQuestionText"),
        showCancelButton: true,
    });

    if (result.isConfirmed) {
        const _subscription = subscriptionStore.getSubscription(_alertSettings.hasSubscription);
        await alertSettingsStore.deleteAlertSettings(_alertSettings);
        await subscriptionStore.deleteSubscription(_subscription);
    }
}

watch(subscriptionEmails, () => {
    subscription.notification.endpoint.uri = `${import.meta.env.VITE_ALERT_NOTIFICATION_URL}emails=${encodeURIComponent(subscriptionEmails.value)}`;
});

onMounted(() => {
    if (subscriptionFormModalElement.value) {
        subscriptionFormModal = new Modal(subscriptionFormModalElement.value);
    }
});
</script>

<template>
    <div ref="subscriptionFormModalElement" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <form class="modal-content" @submit.prevent="createSubscription">
                <div class="modal-header">
                    <h1 id="exampleModalLabel" class="modal-title fs-5">{{ $t("main.alert") }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="query-criteria" class="form-label">{{ $t("main.criteria") }}</label>
                        <select id="query-criteria" v-model="subscriptionQueryCriteria" class="form-control" required>
                            <option v-if="!alertSettings.some((_alertSettings) => _alertSettings.criteriaType === 'GT')" value=">">{{ $t("main.greaterThan") }}</option>
                            <option v-if="!alertSettings.some((_alertSettings) => _alertSettings.criteriaType === 'LT')" value="<">{{ $t("main.lessThan") }}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="query-value" class="form-label">{{ $t("main.value") }}</label>
                        <input id="query-value" v-model="subscriptionQueryValue" type="number" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label for="emails" class="form-label">{{ $t("main.emails") }}</label>
                        <input id="emails" v-model="subscriptionEmails" type="text" class="form-control" required />
                        <div class="form-text">{{ $t("dialogs.alertEmailsInputDescription") }}</div>
                    </div>
                    <div class="mb-3">
                        <label for="throttling" class="form-label">{{ $t("main.reminder") }}</label>
                        <input id="throttling" v-model="subscriptionThrottlingDays" type="number" class="form-control" min="1" step="1" required />
                        <div class="form-text">{{ $t("dialogs.alertThrottlingInputDescription") }}</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ $t("main.close") }}</button>
                    <button type="submit" class="btn btn-primary">{{ $t("main.create") }}</button>
                </div>
            </form>
        </div>
    </div>
    <div v-if="canReadAlerts" class="container-fluid mb-5">
        <h2 class="mt-4">
            <span class="me-3">{{ $t("main.alerts") }}</span>
            <button v-if="canWriteAlerts && alertSettings.length < 2" class="btn btn-sm btn-link" @click="subscriptionFormModal && subscriptionFormModal.show()">
                <FontAwesomeIcon :icon="['fas', 'plus']" />
            </button>
        </h2>
        <div v-if="alertSettings.length" class="table-responsive">
            <table class="table table-striped table-bordered align-middle">
                <thead>
                    <tr>
                        <th>{{ $t("main.criteria") }}</th>
                        <th>{{ $t("main.status") }}</th>
                        <th>{{ $t("main.emails") }}</th>
                        <th>{{ $t("main.reminder") }}</th>
                        <th>{{ $t("main.lastAlert") }}</th>
                        <th v-if="canWriteAlerts">{{ $t("main.actions") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="_alertSettings in alertSettings" :key="_alertSettings.id">
                        <td>{{ subscriptionStore.getSubscription(_alertSettings.hasSubscription).q }}</td>
                        <td>{{ subscriptionStore.getSubscription(_alertSettings.hasSubscription).status }}</td>
                        <td>
                            <div v-for="(email, index) in getEmailsFromUrl(subscriptionStore.getSubscription(_alertSettings.hasSubscription).notification.endpoint.uri)" :key="index">{{ email }}</div>
                        </td>
                        <td>{{ formatSecondsToDays(subscriptionStore.getSubscription(_alertSettings.hasSubscription).throttling ?? 0) }} J</td>
                        <td>{{ subscriptionStore.getSubscription(_alertSettings.hasSubscription).notification.lastNotification ? formatDate(subscriptionStore.getSubscription(_alertSettings.hasSubscription).notification.lastNotification) : "N/A" }}</td>
                        <td v-if="canWriteAlerts">
                            <button class="btn btn-sm btn-outline-danger mx-auto" @click="deleteAlertSettings(_alertSettings)">
                                {{ $t("main.delete") }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="alert alert-warning">{{ $t("main.noAlert") }}</div>
    </div>
</template>
