<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";

import NavBar from "@/components/NavBar.vue";

const route = useRoute();
</script>

<template>
    <header v-if="route.name !== 'demo.somware' && route.name !== 'eLecDashboard'" class="mb-5">
        <div class="wrapper">
            <NavBar />
        </div>
    </header>
    <RouterView />
</template>

<style>
td {
    white-space: nowrap;
}
</style>
