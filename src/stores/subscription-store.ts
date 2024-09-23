import { defineStore } from "pinia";
import { reactive } from "vue";

import api from "@/api";
import SubscriptionNotFoundError from "@/errors/NotFoundError/SubscriptionNotFoundError";

export const useSubscriptionStore = defineStore("subscription", () => {
    const subscriptions: any[] = reactive([]);

    function getSubscription(subscriptionId: string) {
        const subscription = subscriptions.find((subscription) => subscription.id === subscriptionId);
        if (!subscription) {
            throw new SubscriptionNotFoundError(subscriptionId);
        }
        return subscription;
    }

    function getSubscriptionIndex(subscriptionId: string) {
        const index = subscriptions.findIndex((subscription) => subscription.id === subscriptionId);
        if (index === -1) {
            throw new SubscriptionNotFoundError(subscriptionId);
        }
        return index;
    }

    function getSubscriptionsByEntityId(entityId: string) {
        return subscriptions.filter((subscription) => subscription.entities.some((entity: any) => entity.id === entityId));
    }

    async function fetchSubscriptions() {
        $reset();
        const response = await api.get("/subscriptions");
        subscriptions.push(...response.data);
    }

    async function createSubscription(subscription: any) {
        const response = await api.post("/subscriptions", subscription);
        subscriptions.push(response.data);
        return response.data;
    }

    async function deleteSubscription(subscription: any) {
        const index = getSubscriptionIndex(subscription.id);
        await api.delete(`/subscriptions/${subscription.id}`);
        subscriptions.splice(index, 1);
    }

    function $reset() {
        subscriptions.length = 0;
    }

    return { subscriptions, getSubscription, getSubscriptionsByEntityId, fetchSubscriptions, createSubscription, deleteSubscription, $reset };
});
