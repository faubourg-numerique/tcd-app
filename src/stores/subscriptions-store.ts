import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMainStore } from '@/stores/main-store';


export const useSubscriptionStore = defineStore('subscriptionStore', () => {
    const  subscriptions = ref([]);
    
    
    const mainStore = useMainStore();

    async function getsubscriptions() {
        try {
            const response = await mainStore.api.get('/subscriptions'); 
            subscriptions.value = response.data;         
        } catch (error) {
            console.error('Error subscriptions:', error);
        }
    }
    async function createsubscription(subscription: any) {
        try {
            await mainStore.api.post('/subscriptions', subscription);
        } catch (error) {
            console.error('Error creating subscription:', error);
        }
    }
    async function deletesubscription(subscriptionId: string) {
        try {
            await mainStore.api.delete(`/subscriptions/${subscriptionId}`);
        } catch (error) {
            console.error('Error deleting subscription:', error);
        }
    }

    return {  
        subscriptions,
        getsubscriptions ,
        createsubscription ,
        deletesubscription ,
    };
});
