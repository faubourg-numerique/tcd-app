<script setup lang="ts">
import { RouterView } from 'vue-router'
import MenuBar from '@/components/MenuBar.vue' 
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/images.jpg" width="50" height="50" />
    <div> Territoires Connectés et Durables  </div>
    <div> <i class="bi bi-person-circle"></i> Vincent.demortier </div>
    <div class="wrapper">
      <MenuBar />
    </div>
  </header>

  <RouterView />
</template>
