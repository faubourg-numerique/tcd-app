<template>
  <div v-if="isOpen">
    <div class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><slot name="title"></slot></h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="subscriptionName" class="form-label">Subscription Name</label>
                <input id="subscriptionName" type="text" v-model="subscriptionName" class="form-control" name="subscriptionName" required>
              </div>
              <div class="mb-3">
                <label for="QueryCriteria" class="form-label">Query Criteria</label>
                <select id="QueryCriteria" v-model="selected" class="form-control" required>
                  <option disabled value="">Please select one Criteria</option>
                  <option value="=">= Equal to</option>
                  <option value="≥">≥ Greater than or equal to</option>
                  <option value=">">> Greater than</option>
                  <option value="≤">≤ Less than or equal to</option>
                  <option value="<">< Less than</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="QueryValue" class="form-label">Query Value</label>
                <input id="QueryValue" type="number" v-model.number="queryValue" class="form-control" name="queryValue" required>
              </div>
              <div class="mb-3">
                <label for="mail" class="form-label">Emails</label>
                <input id="mail" type="email" v-model="emails" class="form-control" placeholder="Enter emails separated by commas" required>
              </div>
              <div class="mb-3">
                <label for="throttling" class="form-label">Throttling</label>
                <input id="throttling" type="number" v-model.number="throttling" class="form-control" name="Throttling" min="5000" required>
              </div>
              <button type="submit" class="btn btn-primary">Créer</button>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'; 
import { useSubscriptionStore } from "@/stores/subscriptions-store";

// Props
const props = defineProps({
  isOpen: Boolean,
  measurementId: String,  
});

// Emit event
const emit = defineEmits(['close']);

// Reactive state
const subscriptionName = ref<string>('');
const selected = ref<string>('');
const queryValue = ref<number | null>(null);
const emails = ref<string>('');
const throttling = ref<number | null>(null);

// Close modal function
function closeModal() {
  emit('close');
}

// Submit form function
async function submitForm() {
  try {
    const subscriptionStore = useSubscriptionStore();

    const emailArray = emails.value.split(',').map(email => email.trim());

    await subscriptionStore.createsubscription({
      
      subscriptionName: subscriptionName.value,
      type: "Subscription",
      entities: [
        {
          id: props.measurementId,  
          type: "DeviceMeasurement",
        },
      ],
      q: `distance${selected.value}${queryValue.value}`,
      throttling: throttling.value,
      isActive: true,
      "notification": {
            "attributes": [
                "distance"
            ],
        format: "normalized",
        endpoint: {
          uri: `https://example.com?emails=${encodeURIComponent(emailArray.join(','))}`,
          accept: "application/json",
        },
        status: "ok",
      },
    });

    closeModal();
  } catch (error) {
    console.error('Failed to create subscription:', error);
  }
}
</script>

<style scoped>
.modal {
  display: block;
}

.modal-backdrop {
  z-index: 1040;
}
</style>
