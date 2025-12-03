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
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.builder-container {
  display: flex;
  flex: 1;
  height: 100%;
  min-height: 0; /* Allow flex children to shrink */
}

/* Tablet and Desktop */
@media (min-width: 769px) {
  .builder-container {
    height: 100vh;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .form-builder {
    overflow-y: auto; /* Allow scrolling if content overflows */
  }

  .builder-container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  /* Ensure panels take full width on mobile */
  :deep(.elements-panel),
  :deep(.editor-container) {
    width: 100% !important;
    flex: none;
  }

  /* Optional: Adjust for very small screens */
  @media (max-width: 480px) {
    .form-builder {
      font-size: 14px; /* Reduce base font size if needed */
    }
  }
}
</style>