<template>
  <div class="app">
    <Sidebar v-if="!isMobile" class="sidebar" />
    <main :class="{ 'full-width': isMobile }">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Sidebar from './components/layout/Sidebar.vue';

const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  flex-shrink: 0;
  width: 250px; /* Fixed width on desktop */
  transition: all 0.3s ease;
}

main {
  flex: 1;
  overflow-y: auto;
  transition: all 0.3s ease;
  width: 100%; /* Ensure it takes full available width */
}

main.full-width {
  flex: none;
  width: 100% !important;
  margin-left: 0 !important;
}

@media (max-width: 768px) {
  .app {
    flex-direction: row; /* Keep row, but sidebar hidden */
  }

  main {
    margin-left: 0 !important;
    padding: 0 !important;
  }
}
@media (max-width: 480px) {
  .app {
    font-size: 14px;
  }
}
</style>