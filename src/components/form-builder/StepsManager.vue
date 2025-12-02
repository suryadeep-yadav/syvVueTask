<template>
  <div class="steps-modal" v-if="store.isStepsModalOpen" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Manage Steps</h2>
        <button @click="closeModal" class="btn-close">×</button>
      </div>
      
      <div class="modal-body">
        <div class="steps-list">
          <div
            v-for="(step, index) in store.currentTemplate.steps"
            :key="step.id"
            class="step-item"
            draggable="true"
            @dragstart="onDragStart($event, index)"
            @dragover.prevent
            @drop="onDrop($event, index)"
          >
            <div class="step-drag-handle">⋮⋮</div>
            
            <div class="step-info">
              <input
                type="text"
                v-model="step.title"
                @change="store.updateStepTitle(step.id, step.title)"
                class="step-title-input"
              />
              <span class="step-elements-count">
                {{ step.elements.length }} elements
              </span>
            </div>
            
            <div class="step-actions">
              <button @click="store.duplicateStep(step.id)" class="btn-icon" title="Duplicate">
                ⎘
              </button>
              <button
                @click="deleteStep(step.id)"
                class="btn-icon delete-btn"
                title="Delete"
                :disabled="store.currentTemplate.steps.length <= 1"
              >
                ×
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="store.addStep" class="btn-add-step">
            + Add New Step
          </button>
          <button @click="closeModal" class="btn-close-modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormBuilderStore } from '@/stores/formBuilder';

const store = useFormBuilderStore();

const closeModal = () => {
  store.closeStepsModal();
};

const deleteStep = (stepId: string) => {
  if (confirm('Are you sure you want to delete this step? All elements in this step will be lost.')) {
    store.deleteStep(stepId);
  }
};

const onDragStart = (event: DragEvent, index: number) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('step-index', index.toString());
    event.dataTransfer.effectAllowed = 'move';
  }
};

const onDrop = (event: DragEvent, newIndex: number) => {
  event.preventDefault();
  const oldIndex = event.dataTransfer?.getData('step-index');
  if (oldIndex !== null) {
    store.reorderSteps(parseInt(oldIndex), newIndex);
  }
};
</script>

<style scoped>
/* Keep the same CSS styles from before */
.steps-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #343a40;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.btn-close:hover {
  background: #f8f9fa;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  transition: all 0.2s;
}

.step-item:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.step-drag-handle {
  cursor: move;
  color: #6c757d;
  font-size: 18px;
  user-select: none;
  padding: 0 8px;
}

.step-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step-title-input {
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  background: white;
  transition: border-color 0.15s;
}

.step-title-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.step-elements-count {
  font-size: 12px;
  color: #6c757d;
}

.step-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: 1px solid #ced4da;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon:hover:not(:disabled) {
  background: #e9ecef;
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-btn:hover:not(:disabled) {
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #dc3545;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

.btn-add-step {
  flex: 1;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-add-step:hover {
  background: #0056b3;
}

.btn-close-modal {
  padding: 12px 24px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-close-modal:hover {
  background: #545b62;
}
</style>