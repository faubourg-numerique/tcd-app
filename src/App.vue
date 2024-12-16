<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";

import NavBar from "@/components/NavBar.vue";

const route = useRoute();
</script>

<template>
    <header class="mb-5" v-if="route.name !== 'demo.somware'">
        <div class="wrapper">
            <NavBar />
        </div>
    </header>
    <RouterView />
</template>
