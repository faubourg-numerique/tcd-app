<script setup lang="ts">
import { computed, type ComputedRef, reactive } from "vue";

import DateRangePicker from "@/components/DateRangePicker.vue";

const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;

const to = reactive(new Date());
const from = reactive(new Date(to.getTime() - sevenDaysInMilliseconds));

const urls: ComputedRef<string[]> = computed(() => [import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_1_URL.replace("$from", from.getTime()).replace("$to", to.getTime()), import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_2_URL.replace("$from", from.getTime()).replace("$to", to.getTime()), import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_3_URL.replace("$from", from.getTime()).replace("$to", to.getTime()), import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_4_URL.replace("$from", from.getTime()).replace("$to", to.getTime()), import.meta.env.VITE_INDOOR_AMBIANCE_DASHBOARD_PANEL_5_URL.replace("$from", from.getTime()).replace("$to", to.getTime())]);
</script>

<template>
    <div class="container">
        <DateRangePicker v-model:from="from" v-model:to="to" />
        <h1 class="mb-4">{{ $t("main.indoorAmbiance") }}</h1>
        <div class="row row-cols-1 row-cols-md-2 g-3">
            <div v-for="(url, index) in urls" :key="index" class="col">
                <iframe :src="url" class="w-100" height="300"></iframe>
            </div>
        </div>
    </div>
</template>
