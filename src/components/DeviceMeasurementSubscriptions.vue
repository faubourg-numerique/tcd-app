<template>
  <div>
    <h2 class="mt-4">Subscriptions</h2>
    <div v-if="subscriptions.length" class="table-responsive">
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Query</th>
            <th>Status</th>
            <th>Emails</th>
            <th>Throttling</th>
            <th>Last Notification</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="subscription in subscriptions" :key="subscription.id">
            <td>{{ subscription.q }}</td>
            <td>{{ subscription.status }}</td>
            <td>
              <ul class="list-unstyled">
                <li v-for="email in extractEmailsFromUrl(subscription.notification.endpoint.uri)" :key="email">
                  {{ email }}
                </li>
              </ul>
            </td>
            <td>{{ subscription.throttling }}</td>
            <td>{{ subscription.lastNotification ?? 'N/A' }}</td>
            <td>
              <button class="btn btn-outline-danger mx-auto" @click="$emit('delete-subscription', subscription.id)">
                <i class="bi bi-trash"></i> Supprimer
              </button> 
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="alert alert-warning" role="alert">
      No subscriptions found for this measurement.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Subscription } from '@/models/Subscription';

const props = defineProps<{
  subscriptions: Subscription[];
}>();

defineEmits(['delete-subscription']); // Add this line to declare the "delete-subscription" event

function extractEmailsFromUrl(url: string): string[] {
  const urlParams = new URL(url).searchParams;
  const emailsParam = urlParams.get('emails');
  return emailsParam ? emailsParam.split(',') : [];
}
</script>
