<template>
    <div>
      <h2 class="mt-4">Alerts</h2>
      <div v-if="alerts.length" class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Criteria</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in alerts" :key="alert.id">
              <td>{{ alert.name.value }}</td>
              <td>{{ alert.criteriaType.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="alert alert-warning" role="alert">
        No alerts found for this measurement.
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { AlertSetting } from '@/models/AlertSetting';
  
  const props = defineProps<{
    alerts: AlertSetting[];
  }>();
  </script>
  