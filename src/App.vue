<script setup lang="ts">
import { RouterView } from 'vue-router'
import MenuBar from '@/components/MenuBar.vue' 
</script>

<template>
  <header>
    <div class="wrapper">
      <MenuBar />
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
