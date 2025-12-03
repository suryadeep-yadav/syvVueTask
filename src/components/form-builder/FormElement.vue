<template>
  <div
    class="form-element"
    :class="{ 'is-expanded': isExpanded, 'is-required': element.required }"
    draggable="true"
    @dragstart="onDragStart"
    @dragover.prevent
    @drop="onDrop"
  >
    <div class="element-header">
      <div class="drag-handle" title="Drag to reorder">
        ⋮⋮
      </div>
      
      <div class="element-info" @click="toggleExpand">
        <span class="element-type">{{ getElementTypeLabel(element.type) }}</span>
        <h4 class="element-title">{{ element.label }}</h4>
        <span v-if="element.required" class="required-badge">Required</span>
        <span v-if="element.description" class="description-preview">
          {{ truncateDescription(element.description) }}
        </span>
      </div>
      
      <div class="element-actions">
        <button @click="toggleExpand" class="btn-icon" :title="isExpanded ? 'Collapse' : 'Expand'">
          {{ isExpanded ? '▲' : '▼' }}
        </button>
        <button @click="onDelete" class="btn-icon delete-btn" title="Delete">
          ×
        </button>
      </div>
    </div>
    
    <div v-if="isExpanded" class="element-settings">
      <div class="form-group">
        <label>Label *</label>
        <input
          type="text"
          v-model="localElement.label"
          @input="onUpdate"
          class="form-control"
          placeholder="Enter field label"
          required
        />
      </div>
      
      <div class="form-group">
        <label>Description</label>
        <textarea
          v-model="localElement.description"
          @input="onUpdate"
          class="form-control"
          rows="2"
          placeholder="Add description or instructions"
        />
      </div>
      
      <!-- <div class="form-group">
        <label>Placeholder (Optional)</label>
        <input
          type="text"
          v-model="localElement.placeholder"
          @input="onUpdate"
          class="form-control"
          placeholder="Enter placeholder text"
        />
      </div> -->
      
      <!-- <div class="form-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="localElement.required"
            @change="onUpdate"
          />
          Required field
        </label>
      </div> -->
      
      <div v-if="hasOptions" class="form-group">
        <label>Options</label>
        <div class="options-list">
          <div v-for="(option, index) in localElement.options" :key="index" class="option-item">
            <input
              type="text"
              v-model="localElement.options![index]"
              @input="onOptionsUpdate"
              class="form-control option-input"
              :placeholder="`Option ${index + 1}`"
            />
            <button 
              @click="removeOption(index)" 
              class="btn-icon small delete-btn"
              :disabled="localElement.options!.length <= 2"
              title="Remove option"
            >
              ×
            </button>
          </div>
          <button @click="addOption" class="btn-add">
            + Add Option
          </button>
        </div>
      </div>
      
      <div class="form-group element-id">
        <small>Element ID: {{ element.id }}</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { FormElement } from '@/types/form';

interface Props {
  element: FormElement;
  index: number;
}

interface Emits {
  (e: 'update:element', element: FormElement): void;
  (e: 'delete', id: string): void;
  (e: 'reorder', oldIndex: number, newIndex: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isExpanded = ref(false);
const localElement = ref({ ...props.element });

const hasOptions = computed(() => {
  return ['dropdown', 'multi-select', 'radio-button'].includes(props.element.type);
});

const getElementTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'heading': 'Heading',
    'text-box': 'Text Box',
    'short-answer': 'Short Answer',
    'long-answer': 'Long Answer',
    'file-upload': 'File Upload',
    'dropdown': 'Dropdown',
    'multi-select': 'Multi Select',
    'radio-button': 'Radio Button',
    'checkbox': 'Checkbox',
    'date-range': 'Date Range'
  };
  return labels[type] || type;
};

const truncateDescription = (description: string): string => {
  if (description.length > 50) {
    return description.substring(0, 47) + '...';
  }
  return description;
};

watch(() => props.element, (newVal) => {
  localElement.value = { ...newVal };
}, { deep: true });

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const onUpdate = () => {
  emit('update:element', localElement.value);
};

const addOption = () => {
  if (!localElement.value.options) {
    localElement.value.options = [];
  }
  localElement.value.options.push(`Option ${localElement.value.options.length + 1}`);
  onUpdate();
};

const removeOption = (index: number) => {
  if (localElement.value.options && localElement.value.options.length > 2) {
    localElement.value.options.splice(index, 1);
    onUpdate();
  }
};

const onOptionsUpdate = () => {
  onUpdate();
};

const onDelete = () => {
  if (confirm('Are you sure you want to delete this element?')) {
    emit('delete', props.element.id);
  }
};

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('element-index', props.index.toString());
    event.dataTransfer.effectAllowed = 'move';
    
    // Visual feedback
    const element = event.target as HTMLElement;
    element.classList.add('dragging');
  }
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  const oldIndex = event.dataTransfer?.getData('element-index');
  if (oldIndex !== null && oldIndex !== undefined) {
    const newIndex = props.index;
    if (parseInt(oldIndex) !== newIndex) {
      emit('reorder', parseInt(oldIndex), newIndex);
    }
  }
  
  // Remove dragging class
  const elements = document.querySelectorAll('.form-element.dragging');
  elements.forEach(el => el.classList.remove('dragging'));
};
</script>

<style scoped>
.form-element {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  margin-bottom: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.form-element:hover {
  border-color: #ced4da;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.form-element.is-expanded {
  border-color: #007bff;
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.15);
}

.form-element.is-required {
  border-left: 4px solid #dc3545;
}

.form-element.dragging {
  opacity: 0.5;
  transform: rotate(3deg);
}

.element-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  min-height: 70px;
}

.drag-handle {
  cursor: move;
  padding: 0 16px 0 0;
  color: #6c757d;
  font-size: 20px;
  user-select: none;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.drag-handle:hover {
  opacity: 1;
  color: #007bff;
}

.element-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.element-type {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6c757d;
  background: #e9ecef;
  padding: 3px 8px;
  border-radius: 12px;
  align-self: flex-start;
  font-weight: 600;
}

.element-title {
  margin: 0;
  font-size: 16px;
  color: #343a40;
  font-weight: 600;
  line-height: 1.4;
}

.required-badge {
  font-size: 12px;
  color: #dc3545;
  background: #f8d7da;
  padding: 3px 8px;
  border-radius: 12px;
  align-self: flex-start;
  font-weight: 500;
}

.description-preview {
  font-size: 13px;
  color: #6c757d;
  margin-top: 2px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.element-actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border: 1px solid #dee2e6;
  color: #495057;
}

.btn-icon:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  transform: translateY(-1px);
}

.delete-btn:hover {
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #dc3545;
}

.btn-icon.small {
  width: 30px;
  height: 30px;
  font-size: 14px;
}

.element-settings {
  padding: 24px;
  border-top: 1px solid #e9ecef;
  background: white;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #495057;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
  color: #343a40;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
}

.form-control::placeholder {
  color: #adb5bd;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.checkbox-label:hover {
  background: #f8f9fa;
}

.checkbox-label input {
  margin: 0;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.option-input {
  flex: 1;
}

.btn-add {
  margin-top: 8px;
  padding: 10px 16px;
  background: #e9ecef;
  border: 1px dashed #adb5bd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #495057;
  font-weight: 500;
  transition: all 0.2s;
  width: 100%;
}

.btn-add:hover {
  background: #dee2e6;
  border-color: #6c757d;
  border-style: solid;
}

.element-id {
  padding-top: 16px;
  border-top: 1px dashed #dee2e6;
  color: #6c757d;
  font-size: 12px;
}
</style>