<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {Chart as ChartJS,Title,Tooltip,Legend,BarElement,CategoryScale,LinearScale, ChartOptions} from 'chart.js'
import { computed, defineProps } from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  consumption: number
  production: number
}>()

const chartData = computed(() => ({
  labels: ['Production', 'Consumption'],
  datasets: [
    {
      label: 'Current Energy Analysis',
      backgroundColor: [ '#198754','#0d6efd'],
      data: [props.consumption, props.production],
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Energy Consumption vs Production',
    },
  },
}
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>
