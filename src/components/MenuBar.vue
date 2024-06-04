<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="/">
          <img alt="Vue logo" class="logo" src="@/assets/images.jpg" width="50" height="50" />
        </RouterLink>
        <div class="navbar-text">Territoires Connectés et Durables</div>
        <div class="ms-auto d-flex align-items-center">
          <RouterLink class="nav-link" to="/">Tableau de bord</RouterLink>
          <RouterLink class="nav-link" to="/">Mes responsabilités</RouterLink>
          <RouterLink class="nav-link" to="/">Mon territoire</RouterLink>
          <div class="nav-link d-flex align-items-center">
            <i class="bi bi-person-circle"></i> Vincent.demortier
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup lang="ts">
  import { RouterLink } from 'vue-router'
  </script>
  
  <style scoped>
  .navbar-brand img {
    margin-right: 10px;
  }
  
  .navbar-text {
    font-weight: bold;
    color: #d9534f; 
  }
  
  .ms-auto {
    margin-left: auto;
  }
  
  .nav-link {
    color: #333;
    padding: 0 15px;
  }
  
  .nav-link i {
    margin-right: 5px;
  }
  </style>
  