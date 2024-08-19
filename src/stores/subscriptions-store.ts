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
            console.log('subscriptions:', response);
            console.log('subscriptions:', subscriptions.value);       
        } catch (error) {
            console.error('Error subscriptions:', error);
        }
    }

    return {  
        subscriptions,
        getsubscriptions
    };
});
