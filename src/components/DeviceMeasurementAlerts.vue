<script setup lang="ts">
import Modal from "bootstrap/js/dist/modal";
import swal from "sweetalert2";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useDeviceMeasurementStore } from "@/stores/device-measurement-store";
import { useSubscriptionStore } from "@/stores/subscription-store";

const props = defineProps({
    deviceMeasurementId: {
        type: String,
        required: true,
    },
});

const { t } = useI18n();

const deviceMeasurementStore = useDeviceMeasurementStore();
const subscriptionStore = useSubscriptionStore();

const deviceMeasurement = deviceMeasurementStore.getDeviceMeasurement(props.deviceMeasurementId);
const subscriptions = computed(() => subscriptionStore.getSubscriptionsByEntityId(deviceMeasurement.id));

const watchedAttribute = deviceMeasurement.measurementType === "waste-level" ? "fillingLevel" : "currentLevel";

const subscriptionFormModalElement = ref(null);
let subscriptionFormModal: Modal | null = null;

const subscriptionQueryCriteria = ref(">");
const subscriptionQueryValue = ref(0);
const subscriptionEmails = ref("");

const subscription = {
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

function formatSeconds(seconds: number) {
    const formattedHours = Math.floor(seconds / 3600);
    const formattedMinutes = ("0" + Math.floor((seconds % 3600) / 60)).slice(-2);
    const formattedSeconds = ("0" + (seconds % 60)).slice(-2);
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function formatDate(date: string) {
    return new Date(date).toLocaleString();
}

async function createSubscription() {
    await subscriptionStore.createSubscription(subscription);
    await swal.fire({
        icon: "success",
        title: t("dialogs.createSubscriptionSuccessTitle"),
        text: t("dialogs.createSubscriptionSuccessText"),
    });

    if (subscriptionFormModal) {
        subscriptionFormModal.hide();
    }
}

async function deleteSubscription(subscription: any) {
    const result = await swal.fire({
        icon: "question",
        title: t("dialogs.deleteSubscriptionQuestionTitle"),
        text: t("dialogs.deleteSubscriptionQuestionText"),
        showCancelButton: true,
    });

    if (result.isConfirmed) {
        await subscriptionStore.deleteSubscription(subscription);
    }
}

watch(subscriptionQueryCriteria, () => {
    subscription.q = `${watchedAttribute}${subscriptionQueryCriteria.value}${subscriptionQueryValue.value}`;
});

watch(subscriptionQueryValue, () => {
    subscription.q = `${watchedAttribute}${subscriptionQueryCriteria.value}${subscriptionQueryValue.value}`;
});

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
                            <option value=">">{{ $t("main.greaterThan") }}</option>
                            <option value="<">{{ $t("main.lessThan") }}</option>
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
                        <input id="throttling" v-model="subscription.throttling" type="number" class="form-control" min="1" step="1" required />
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
    <div class="container-fluid mb-5">
        <h2 class="mt-4">
            <span class="me-3">{{ $t("main.alerts") }}</span>
            <button class="btn btn-sm btn-link" @click="subscriptionFormModal && subscriptionFormModal.show()">
                <FontAwesomeIcon :icon="['fas', 'plus']" />
            </button>
        </h2>
        <div v-if="subscriptions.length" class="table-responsive">
            <table class="table table-striped table-bordered align-middle">
                <thead>
                    <tr>
                        <th>{{ $t("main.criteria") }}</th>
                        <th>{{ $t("main.status") }}</th>
                        <th>{{ $t("main.emails") }}</th>
                        <th>{{ $t("main.reminder") }}</th>
                        <th>{{ $t("main.lastAlert") }}</th>
                        <th>{{ $t("main.actions") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="_subscription in subscriptions" :key="_subscription.id">
                        <td>{{ _subscription.q }}</td>
                        <td>{{ _subscription.status }}</td>
                        <td>
                            <div v-for="(email, index) in getEmailsFromUrl(_subscription.notification.endpoint.uri)" :key="index">{{ email }}</div>
                        </td>
                        <td>{{ formatSeconds(_subscription.throttling ?? 0) }}</td>
                        <td>{{ _subscription.notification.lastNotification ? formatDate(_subscription.notification.lastNotification) : "N/A" }}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-danger mx-auto" @click="deleteSubscription(_subscription)">
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
