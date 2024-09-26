<script setup lang="ts">
import { RouterView } from "vue-router";

import NavBar from "@/components/NavBar.vue";
</script>

<template>
    <header class="mb-5">
        <div class="wrapper">
            <NavBar />
        </div>
    </header>
    <RouterView />
</template>
