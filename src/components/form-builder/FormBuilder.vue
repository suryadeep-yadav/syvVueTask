<template>
  <div class="form-builder">
    <div class="builder-container">
      <FormElementsPanel />
      <FormEditor />
    </div>
    
    <StepsManager />
    <PreviewModal />
  </div>
</template>

<script setup lang="ts">
import FormElementsPanel from './FormElementsPanel.vue';
import FormEditor from './FormEditor.vue';
import StepsManager from './StepsManager.vue';
import PreviewModal from './PreviewModal.vue';
</script>

<style scoped>
.form-builder {
  height: 100vh;
  overflow: hidden;
}

.builder-container {
  display: flex;
  height: 100%;
}
</style>