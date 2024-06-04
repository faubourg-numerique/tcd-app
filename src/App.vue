<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/images.jpg" width="50" height="50" />
    <div> Territoires Connectés et Durables  </div>
    <div> <i class="bi bi-person-circle"></i> Vincent.demortier </div>

    <div class="wrapper">
      
      


      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>


