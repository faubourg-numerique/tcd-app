<!-- eslint-disable vue/require-default-prop -->
<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div v-if="isOpen">
    <div class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog">
        <form @submit.prevent="submitForm" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><slot name="title"></slot></h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="subscriptionName" class="form-label">Nom</label>
              <input id="subscriptionName" type="text" v-model="subscriptionName" class="form-control" name="subscriptionName" required>
            </div>
            <div class="mb-3">
              <label for="QueryCriteria" class="form-label">Critère</label>
              <select id="QueryCriteria" v-model="selected" class="form-control" required>
                <option value=">">> Supérieur à</option>
                <option value="<">< Inférieur à</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="QueryValue" class="form-label">Valeur</label>
              <input id="QueryValue" type="number" v-model.number="queryValue" class="form-control" name="queryValue" required>
            </div>
            <div class="mb-3">
              <label for="mail" class="form-label">Emails (séparés par des virgules)</label>
              <input id="mail" type="text" v-model="emails" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="throttling" class="form-label">Rappel (en secondes)</label>
              <input id="throttling" type="number" v-model.number="throttling" class="form-control" name="Throttling" min="1" required>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Fermer</button>
            <button type="submit" class="btn btn-primary">Enregister</button>
          </div>
        </form>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'; 
import { useSubscriptionStore } from "@/stores/subscriptions-store";
import swal from 'sweetalert2';
import type { Subscription } from '@/models/Subscription';

const props = defineProps({
  isOpen: Boolean,
  measurementId: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close']);

const subscriptionName = ref<string>('');
const selected = ref<string>('');
const queryValue = ref<number | null>(null);
const emails = ref<string>('');
const throttling = ref<number | null>(null);

function closeModal() {
  emit('close');
}

async function submitForm() {
  try {
    const subscriptionStore = useSubscriptionStore();
    const subscriptions = ref<Subscription[]>([]);

    const emailArray = emails.value.split(',').map(email => email.trim());

    const notificationURL = `${import.meta.env.VITE_URL_NOTIFICATION}emails=${encodeURIComponent(emailArray.join(','))}`;

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
                "distance",
                "name"
            ],
        format: "normalized",
        endpoint: {
          uri: notificationURL ,
          accept: "application/json",
        },
        status: "ok",
      },
    }).then(async () => {
      swal.fire({
        icon: 'success',
        title: 'Alerte créée avec succès',
      });
    });

    closeModal();
  } catch (error) {
    swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: (error as Error).toString(),
    });
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
