<template>
  <div class="form-templates-page">
    <div class="page-header">
      <h1>Form Template Builder</h1>
      <p class="page-subtitle">Design multi-step forms by dragging and dropping elements</p>
    </div>
    
    <FormBuilder />
  </div>
</template>

<script setup lang="ts">
import FormBuilder from '@/components/form-builder/FormBuilder.vue';
</script>

<style scoped>
.form-templates-page {
  margin-left: 250px;
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  background: white;
  padding: 24px 32px;
  border-bottom: 1px solid #dee2e6;
}

.page-header h1 {
  margin: 0 0 8px 0;
  color: #343a40;
  font-size: 28px;
}

.page-subtitle {
  margin: 0;
  color: #6c757d;
  font-size: 16px;
}
@media (max-width: 768px) {
  .form-templates-page {
    margin-left: 0;
  }

  .page-header {
    padding: 24px 16px; /* Reduce padding on small screens if needed */
  }

  .page-header h1 {
    font-size: 24px; /* Smaller heading on mobile */
  }
}
</style>