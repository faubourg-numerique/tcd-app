<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <RouterLink class="navbar-brand d-flex align-items-center" to="/">
        <img alt="Vue logo" class="logo" src="@/assets/images.jpg" width="50" height="50" />
        <span class="ms-2 d-none d-sm-inline text-danger">{{ $t('nav.mainTitle') }}</span>
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        v-if="useOauthStore().countRightRole() > 0"
        class="collapse navbar-collapse justify-content-end"
        id="navbarNav"
      >
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">{{ $t('nav.Dashboard') }}</RouterLink>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ $t('nav.myResponsibilities') }}
            </a>
            <ul class="dropdown-menu">
              <li>
                <RouterLink
                  class="dropdown-item bi bi-houses-fill"
                  to="/responsability/thermostats"
                >
                  {{ $t('nav.Buildings') }}</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  class="dropdown-item bi bi-lightbulb-fill"
                  to="/responsability/streetlights"
                >
                  {{ $t('nav.Lighting') }}</RouterLink
                >
              </li>
              <li>
                <RouterLink class="dropdown-item bi bi-trash3-fill" to="/rubrique3">
                  {{ $t('nav.PAV') }}</RouterLink
                >
              </li>
              <li>
                <RouterLink class="dropdown-item bi bi-water" to="/rubrique4">
                  {{ $t('nav.Watercourse') }}</RouterLink
                >
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">{{ $t('nav.myTerritory') }}</RouterLink>
          </li>
          <li class="nav-item d-flex align-items-center">
            <span class="bi bi-person-circle me-2">{{ useOauthStore().name }} </span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-brand img {
  margin-right: 10px;
}

.navbar-nav .nav-item .nav-link {
  color: #333;
}

.navbar-nav .nav-item .nav-link:hover {
  color: #0056b3;
}

.navbar-nav .nav-item span {
  color: #333;
}
</style>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useOauthStore } from '../stores/oauth-store'
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
