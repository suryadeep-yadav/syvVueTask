<template>
  <div class="app">
    <Sidebar />
    <main style="width: 100%;">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/layout/Sidebar.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


.app {
  display: flex;
  /* min-height: 100vh; */
}

</style>