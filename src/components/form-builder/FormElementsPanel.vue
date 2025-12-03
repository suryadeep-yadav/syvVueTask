<template>
  <div class="elements-panel">
    <div class="panel-header">
      <h3 class="panel-title">Form Elements</h3>
      <p class="panel-subtitle">Drag elements to the editor</p>
    </div>
    <!-- In FormElementsPanel.vue -->
    <div class="search-bar">
      <input type="text" placeholder="Search elements..." v-model="searchQuery"  class="search-input">
    </div>
    <div class="elements-list">
      <div v-for="element in filteredElements" :key="element.type" class="element-item" draggable="true"
        @dragstart="onDragStart($event, element.type)" @dragend="onDragEnd">
        <div class="element-icon">
          {{ getElementIcon(element.type) }}
        </div>
        <div class="element-content">
          <div class="element-label">{{ element.label }}</div>
          <div class="element-desc">{{ getElementDescription(element.type) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref , computed} from 'vue';

interface DraggableElement {
  type: string;
  label: string;
  icon: string;
}
const searchQuery = ref('');
const elements = ref<DraggableElement[]>([
  { type: 'heading', label: 'Heading', icon: 'H' },
  { type: 'text-box', label: 'Text Box', icon: 'T' },
  { type: 'short-answer', label: 'Short Answer', icon: 'SA' },
  { type: 'long-answer', label: 'Long Answer', icon: 'LA' },
  { type: 'file-upload', label: 'File Upload', icon: 'FU' },
  { type: 'dropdown', label: 'Dropdown', icon: 'D' },
  { type: 'multi-select', label: 'Multi Select', icon: 'MS' },
  { type: 'radio-button', label: 'Radio Button', icon: 'RB' },
  { type: 'checkbox', label: 'Checkbox', icon: 'C' },
  { type: 'date-range', label: 'Date Range', icon: 'DR' }
]);
const filteredElements = computed(() => {
  if (!searchQuery.value.trim()) return elements.value;

  const query = searchQuery.value.toLowerCase();

  return elements.value.filter(el =>
    el.label.toLowerCase().includes(query) ||
    el.type.toLowerCase().includes(query)
  );
});

const getElementIcon = (type: string): string => {
  const element = elements.value.find(el => el.type === type);
  return element?.icon || 'E';
};

const getElementDescription = (type: string): string => {
  const descriptions: Record<string, string> = {
    'heading': 'Section heading text',
    'text-box': 'Single line text input',
    'short-answer': 'Short text response',
    'long-answer': 'Multi-line text response',
    'file-upload': 'Upload files or documents',
    'dropdown': 'Select from dropdown list',
    'multi-select': 'Select multiple options',
    'radio-button': 'Single choice from options',
    'checkbox': 'Checkbox toggle',
    'date-range': 'Select date range'
  };
  return descriptions[type] || 'Form element';
};

const onDragStart = (event: DragEvent, elementType: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', elementType);
    event.dataTransfer.effectAllowed = 'copy';

    // Visual feedback
    const element = event.target as HTMLElement;
    element.classList.add('dragging');

    // Set drag image (optional)
    if (event.dataTransfer.setDragImage && element) {
      const dragImage = element.cloneNode(true) as HTMLElement;
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      document.body.appendChild(dragImage);
      event.dataTransfer.setDragImage(dragImage, 20, 20);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  }
};

const onDragEnd = (event: DragEvent) => {
  const element = event.target as HTMLElement;
  element.classList.remove('dragging');
};
</script>

<style scoped>
.elements-panel {
  width: 280px;
  background: #ffffff;
  border-right: 1px solid #e0e0e0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.panel-header {
  padding: 24px 20px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.panel-title {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.panel-subtitle {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
  font-weight: 400;
}

.elements-list {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.element-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
  user-select: none;
  position: relative;
}

.element-item:hover {
  background: #ffffff;
  border-color: #dee2e6;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.element-item:active {
  cursor: grabbing;
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.element-item.dragging {
  opacity: 0.5;
  background: #e9ecef;
}

.element-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  color: white;
  font-weight: bold;
  font-size: 16px;
  flex-shrink: 0;
}

.element-content {
  flex: 1;
  min-width: 0;
}

.element-label {
  font-size: 14px;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.element-desc {
  font-size: 12px;
  color: #6c757d;
  line-height: 1.3;
}

/* Scrollbar styling for elements list */
.elements-list::-webkit-scrollbar {
  width: 6px;
}

.elements-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.elements-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.elements-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Empty state */
.elements-list:empty::after {
  content: 'No elements available';
  display: block;
  text-align: center;
  color: #6c757d;
  font-size: 14px;
  padding: 20px;
  opacity: 0.7;
}
.search-bar {
  padding: 8px;
}

.search-input {
  width: 100%;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
}

.empty-state {
  padding: 12px;
  text-align: center;
  color: #777;
  font-size: 13px;
}
</style>