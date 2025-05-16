<script setup lang="ts">
defineProps<{
  title: string;
  items: any[];
  onItemClick?: (item: any) => void;
}>();
</script>

<template>
  <div class="card border-primary h-100">
    <div class="card-body">
      <h5 class="card-title text-primary">{{ title }}</h5>
      <ul class="list-unstyled">
        <li
          v-for="item in items"
          :key="item.id"
          class="mb-2 p-2 rounded-sm"
          @click="onItemClick?.(item)"
          style="cursor: pointer; transition: background-color 0.3s ease;"
        >
          <div class="d-flex justify-content-between align-items-center">
            <strong class="text-info">{{ item.name || item.id }}</strong>
            <span class="badge bg-secondary ms-2">
              Power: {{ item.currentPowerConsumption !== undefined ? `${item.currentPowerConsumption} W` : 'N/A' }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-title {
  margin-bottom: 1rem;
}

ul {
  padding-left: 0;
}

li {
  border-bottom: 1px solid #e9ecef; 
}

li:last-child {
  border-bottom: none;
}

li:hover {
  background-color: #f8f9fa; 
}

.text-info {
  font-weight: bold;
}

.badge {
  font-size: 0.8em;
}

.rounded-sm {
  border-radius: 0.2rem;
}
</style>