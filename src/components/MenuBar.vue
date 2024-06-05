<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <RouterLink class="navbar-brand d-flex align-items-center" to="/">
          <img alt="Vue logo" class="logo" src="@/assets/images.jpg" width="50" height="50" />
          <span class="ms-2" style="font-size: small;">Territoires Connectés et Durables</span>
        </RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">Tableau de bord</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">Mes responsabilités</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">Mon territoire</RouterLink>
            </li>
            <li class="nav-item d-flex align-items-center">
              <i class="bi bi-person-circle me-2"></i>
              <span>Vincent.demortier</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup lang="ts">
  import { RouterLink } from 'vue-router'
  </script>
  
  <style scoped>
  .logo {
    margin-right: 10px;
  }
  .navbar-brand span {
    font-weight: bold;
    color: #d9534f; 
  }
  .navbar-nav .nav-link {
    color: #333;
    padding: 0 15px;
  }
  .navbar-nav .nav-link:hover {
    color: #0056b3;
  }
  .navbar-nav .nav-item.d-flex {
    padding: 0 15px;
  }
  </style>
  