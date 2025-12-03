<template>
  <div class="form-editor">
    <div class="editor-header">
      <div class="steps-info">
        <span>Current Step:</span>
        <strong>{{ currentStep?.title }}</strong>
        <button @click="openStepsModal" class="btn-steps">
          Manage Steps
        </button>
      </div>
      
      <div class="editor-actions">
        <button @click="togglePreview" class="btn-preview">
          {{ isPreviewMode ? 'Edit Form' : 'Preview Form' }}
        </button>
        <button @click="saveTemplate" class="btn-save">
          Save Template
        </button>
      </div>
    </div>
    
    <div
      class="editor-canvas"
      @dragover.prevent
      @drop="onDrop"
      :class="{ 'preview-mode': isPreviewMode }"
    >
      <div v-if="!currentStep?.elements.length" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No elements added yet</h3>
        <p>Drag form elements from the left panel to get started</p>
      </div>
      
      <template v-else>
        <FormElement
          v-for="(element, index) in currentStep?.elements"
          :key="element.id"
          :element="element"
          :index="index"
          @update:element="updateElement(element.id, $event)"
          @delete="deleteElement"
          @reorder="reorderElements"
          class="editor-element"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFormBuilderStore } from '@/stores/formBuilder';
import FormElement from './FormElement.vue';

const store = useFormBuilderStore();

// Use computed property from store, not a function
const currentStep = computed(() => store.currentStep);
const isPreviewMode = computed(() => store.isPreviewMode);

const onDrop = (event: DragEvent) => {
  const elementType = event.dataTransfer?.getData('text/plain');
  if (elementType && currentStep.value) {
    store.addElement(elementType as any, store.currentStepId);
  }
};

const updateElement = (elementId: string, element: any) => {
  store.updateElement(elementId, element);
};

const deleteElement = (elementId: string) => {
  store.deleteElement(elementId);
};

const reorderElements = (oldIndex: number, newIndex: number) => {
  if (currentStep.value) {
    store.reorderElements(store.currentStepId, oldIndex, newIndex);
  }
};

const togglePreview = () => {
  store.togglePreview();
};

const saveTemplate = () => {
  store.saveTemplate();
};

const openStepsModal = () => {
  store.openStepsModal();
};
</script>

<style scoped>
.form-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.steps-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #6c757d;
}

.steps-info strong {
  color: #343a40;
  font-weight: 600;
}

.btn-steps {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  margin-left: 16px;
}

.btn-steps:hover {
  background: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.editor-actions {
  display: flex;
  gap: 12px;
}

.btn-preview {
  padding: 8px 20px;
  margin-left: 8px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-preview:hover {
  background: #545b62;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-save {
  padding: 8px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-save:hover {
  background: #1e7e34;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.editor-canvas {
  flex: 1;
  padding: 24px;
  background: #f8f9fa;
  overflow-y: auto;
  min-height: 0;
}

.editor-canvas.preview-mode {
  background: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
  background: white;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
  margin: 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #343a40;
  font-size: 20px;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  color: #6c757d;
  font-size: 16px;
}

.editor-element {
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>