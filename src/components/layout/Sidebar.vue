<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <!-- <router-link to="/" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">Dashboard</span>
      </router-link> -->
      
      <router-link to="/form-templates" class="nav-item">
        <span class="nav-icon">📋</span>
        <span class="nav-text">Form Templates</span>
      </router-link>
      
      <router-link to="/forms" class="nav-item">
        <span class="nav-icon">📝</span>
        <span class="nav-text">Forms</span>
      </router-link>
      
      <router-link to="/submissions" class="nav-item">
        <span class="nav-icon">📊</span>
        <span class="nav-text">Submissions</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 16px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #ecf0f1;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #34495e;
  color: white;
}

.nav-item.router-link-active {
  background: #3498db;
  color: white;
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}
</style>