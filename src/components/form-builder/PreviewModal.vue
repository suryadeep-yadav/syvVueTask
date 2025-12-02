<template>
  <div class="preview-modal" v-if="store.isPreviewMode" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Form Preview</h2>
        <button @click="closeModal" class="btn-close">×</button>
      </div>
      
      <div class="modal-body">
        <div class="form-preview">
          <div v-for="step in store.currentTemplate.steps" :key="step.id" class="preview-step">
            <h3 class="step-title">{{ step.order }}. {{ step.title }}</h3>
            
            <div v-for="element in step.elements" :key="element.id" class="preview-element">
              <div class="preview-element-header">
                <label class="element-label">
                  {{ element.label }}
                  <span v-if="element.required" class="required-star">*</span>
                </label>
                <span class="element-type">{{ getElementTypeLabel(element.type) }}</span>
              </div>
              
              <div v-if="element.description" class="element-description">
                {{ element.description }}
              </div>
              
              <div class="element-preview">
                <component :is="getPreviewComponent(element.type)" :element="element" />
              </div>
            </div>
          </div>
        </div>
        
        <div class="json-output">
          <h4>JSON Output</h4>
          <pre>{{ store.getFormJson() }}</pre>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="closeModal" class="btn-close-modal">
          Close Preview
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import { useFormBuilderStore } from '@/stores/formBuilder';
import type { FormElement } from '@/types/form';

const store = useFormBuilderStore();

const closeModal = () => {
  store.togglePreview();
};

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

const getPreviewComponent = (type: string) => {
  const components: Record<string, any> = {
    'heading': defineComponent({
      props: ['element'],
      template: '<h3 style="margin: 0; padding: 16px; background: #f8f9fa; border-radius: 4px;">{{ element.label }}</h3>'
    }),
    'text-box': defineComponent({
      props: ['element'],
      template: '<input type="text" :placeholder="element.placeholder || \'Enter text\'" class="preview-input" disabled>'
    }),
    'short-answer': defineComponent({
      props: ['element'],
      template: '<input type="text" :placeholder="element.placeholder || \'Short answer\'" class="preview-input" disabled>'
    }),
    'long-answer': defineComponent({
      props: ['element'],
      template: '<textarea :placeholder="element.placeholder || \'Long answer\'" class="preview-textarea" rows="3" disabled></textarea>'
    }),
    'file-upload': defineComponent({
      props: ['element'],
      template: '<div class="file-upload-preview"><button disabled>Choose File</button><span>No file chosen</span></div>'
    }),
    'dropdown': defineComponent({
      props: ['element'],
      setup(props) {
        return { element: props.element };
      },
      template: '<select class="preview-select" disabled><option value="" disabled selected>Select an option</option><option v-for="option in element.options" :key="option">{{ option }}</option></select>'
    }),
    'multi-select': defineComponent({
      props: ['element'],
      setup(props) {
        return { element: props.element };
      },
      template: '<div class="multi-select-preview"><label v-for="option in element.options" :key="option"><input type="checkbox" disabled> {{ option }}</label></div>'
    }),
    'radio-button': defineComponent({
      props: ['element'],
      setup(props) {
        return { element: props.element };
      },
      template: '<div class="radio-preview"><label v-for="option in element.options" :key="option"><input type="radio" name="radio-group" disabled> {{ option }}</label></div>'
    }),
    'checkbox': defineComponent({
      props: ['element'],
      template: '<label class="checkbox-preview"><input type="checkbox" disabled> {{ element.label }}</label>'
    }),
    'date-range': defineComponent({
      props: ['element'],
      template: '<div class="date-range-preview"><input type="date" class="preview-input" disabled> to <input type="date" class="preview-input" disabled></div>'
    })
  };
  
  return components[type] || defineComponent({
    props: ['element'],
    template: '<div class="unknown-element">Unknown element type: {{ element.type }}</div>'
  });
};
</script>

<style scoped>
/* Keep the same CSS styles from before */
.preview-modal {
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
  width: 800px;
  max-width: 90vw;
  max-height: 90vh;
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

.form-preview {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
}

.preview-step {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
}

.step-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #343a40;
  padding-bottom: 12px;
  border-bottom: 2px solid #007bff;
}

.preview-element {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 12px;
}

.preview-element-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.element-label {
  font-weight: 500;
  color: #343a40;
  font-size: 14px;
}

.required-star {
  color: #dc3545;
  margin-left: 4px;
}

.element-type {
  font-size: 11px;
  text-transform: uppercase;
  color: #6c757d;
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 4px;
}

.element-description {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 12px;
  font-style: italic;
}

.element-preview {
  margin-top: 8px;
}

.preview-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: #f8f9fa;
  color: #6c757d;
}

.preview-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: #f8f9fa;
  color: #6c757d;
  resize: vertical;
}

.preview-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: #f8f9fa;
  color: #6c757d;
}

.file-upload-preview {
  display: flex;
  gap: 12px;
  align-items: center;
}

.file-upload-preview button {
  padding: 6px 12px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: not-allowed;
  opacity: 0.6;
}

.multi-select-preview,
.radio-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.multi-select-preview label,
.radio-preview label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: not-allowed;
  color: #6c757d;
}

.checkbox-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: not-allowed;
  color: #6c757d;
}

.date-range-preview {
  display: flex;
  align-items: center;
  gap: 12px;
}

.json-output {
  margin-top: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.json-output h4 {
  margin: 0 0 12px 0;
  color: #343a40;
  font-size: 16px;
}

.json-output pre {
  margin: 0;
  padding: 12px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 200px;
  overflow-y: auto;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #dee2e6;
  text-align: right;
}

.btn-close-modal {
  padding: 10px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-close-modal:hover {
  background: #0056b3;
}
</style>