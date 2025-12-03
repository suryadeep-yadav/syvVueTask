import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import type { FormStep, FormElement, FormTemplate, FormElementType } from '@/types/form';
import { v4 as uuidv4 } from 'uuid';

// Define draggable elements
const draggableElements = [
  { type: 'heading' as FormElementType, label: 'Heading', icon: 'H' },
  { type: 'text-box' as FormElementType, label: 'Text Box', icon: 'T' },
  { type: 'short-answer' as FormElementType, label: 'Short Answer', icon: 'SA' },
  { type: 'long-answer' as FormElementType, label: 'Long Answer', icon: 'LA' },
  { type: 'file-upload' as FormElementType, label: 'File Upload', icon: '📎' },
  { type: 'dropdown' as FormElementType, label: 'Dropdown', icon: '▼' },
  { type: 'multi-select' as FormElementType, label: 'Multi Select', icon: '☑' },
  { type: 'radio-button' as FormElementType, label: 'Radio Button', icon: '○' },
  { type: 'checkbox' as FormElementType, label: 'Checkbox', icon: '✓' },
  { type: 'date-range' as FormElementType, label: 'Date Range', icon: '📅' }
];

export const useFormBuilderStore = defineStore('formBuilder', () => {
  // State
  const currentTemplate = ref<FormTemplate>(createNewTemplate());
  const currentStepId = ref<string>(currentTemplate.value.steps[0]?.id || '');
  const isPreviewMode = ref(false);
  const isStepsModalOpen = ref(false);
  const draggableElementsList = ref(draggableElements);

  // Getters - these are computed properties, not functions
  const currentStep = computed(() => {
    return currentTemplate.value.steps.find(step => step.id === currentStepId.value);
  });

  const getDraggableElements = computed(() => draggableElementsList.value);

  // Actions
  function createNewTemplate(): FormTemplate {
    return {
      id: uuidv4(),
      name: 'New Form Template',
      description: '',
      steps: [
        {
          id: uuidv4(),
          title: 'Step 1',
          elements: [],
          order: 1
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  function setCurrentStep(stepId: string) {
    currentStepId.value = stepId;
  }

  function addStep() {
    const newStep: FormStep = {
      id: uuidv4(),
      title: `Step ${currentTemplate.value.steps.length + 1}`,
      elements: [],
      order: currentTemplate.value.steps.length + 1
    };
    currentTemplate.value.steps.push(newStep);
    setCurrentStep(newStep.id);
  }

  function updateStepTitle(stepId: string, title: string) {
    const step = currentTemplate.value.steps.find(s => s.id === stepId);
    if (step) {
      step.title = title;
      updateTimestamp();
    }
  }

  function deleteStep(stepId: string) {
    if (currentTemplate.value.steps.length <= 1) {
      alert('Cannot delete the last step. A form must have at least one step.');
      return;
    }

    const index = currentTemplate.value.steps.findIndex(s => s.id === stepId);
    if (index !== -1) {
      currentTemplate.value.steps.splice(index, 1);

      // Update order
      currentTemplate.value.steps.forEach((step, idx) => {
        step.order = idx + 1;
      });

      // If current step was deleted, switch to first step
      if (stepId === currentStepId.value) {
        if (currentTemplate.value.steps.length > 0) {
          setCurrentStep(currentTemplate.value.steps[0]?.id || '');
        }

      }

      updateTimestamp();
    }
  }

  function duplicateStep(stepId: string) {
    const step = currentTemplate.value.steps.find(s => s.id === stepId);
    if (step) {
      const duplicatedStep: FormStep = {
        id: uuidv4(),
        title: `${step.title} (Copy)`,
        elements: step.elements.map(el => ({
          ...el,
          id: uuidv4(),
          options: el.options ? [...el.options] : undefined
        })),
        order: currentTemplate.value.steps.length + 1
      };
      currentTemplate.value.steps.push(duplicatedStep);
      updateTimestamp();
    }
  }

  function reorderSteps(oldIndex: number, newIndex: number) {
    const steps = currentTemplate.value.steps;
    const [movedStep] = steps.splice(oldIndex, 1);
    if (!movedStep) return;
    steps.splice(newIndex, 0, movedStep);

    // Update order
    steps.forEach((step, idx) => {
      step.order = idx + 1;
    });

    updateTimestamp();
  }

  function addElement(elementType: FormElementType, stepId: string) {
    const step = currentTemplate.value.steps.find(s => s.id === stepId);
    if (!step) return;

    const defaultLabels: Record<FormElementType, string> = {
      'heading': 'Heading',
      'text-box': 'Text Box',
      'short-answer': 'Short Answer',
      'long-answer': 'Long Answer',
      'file-upload': 'File Upload',
      'dropdown': 'Dropdown',
      'multi-select': 'Multi Select',
      'radio-button': 'Radio Buttons',
      'checkbox': 'Checkbox',
      'date-range': 'Date Range'
    };

    const newElement: FormElement = {
      id: uuidv4(),
      type: elementType,
      label: defaultLabels[elementType] || 'New Element',
      required: false,
      settings: {}
    };
    // In store's addElement function, update for text elements:
    if (['long-answer', 'rich-text'].includes(elementType)) {
      newElement.settings = {
        formatting: {
          bold: false,
          italic: false,
          underline: false,
          alignCenter: false,
          bulletList: false,
          checkbox: false
        },
        mode: 'normal',
        validation: {
          required: false
        }
      };
      newElement.content = ''; // Add content field
    }
    if (['dropdown', 'multi-select', 'radio-button'].includes(elementType)) {
      newElement.options = ['Option 1', 'Option 2', 'Option 3'];
    }

    step.elements.push(newElement);
    updateTimestamp();
  }

  function updateElement(elementId: string, updates: Partial<FormElement>) {
    const step = currentStep.value; // Use computed property, not function
    if (!step) return;

    const element = step.elements.find(el => el.id === elementId);
    if (element) {
      Object.assign(element, updates);
      updateTimestamp();
    }
  }

  function deleteElement(elementId: string) {
    const step = currentStep.value; // Use computed property, not function
    if (!step) return;

    const index = step.elements.findIndex(el => el.id === elementId);
    if (index !== -1) {
      step.elements.splice(index, 1);
      updateTimestamp();
    }
  }

  function reorderElements(stepId: string, oldIndex: number, newIndex: number) {
    const step = currentTemplate.value.steps.find(s => s.id === stepId);
    if (!step) return;

    const elements = step.elements;
    const [movedElement] = elements.splice(oldIndex, 1);
    if (!movedElement) return;
    elements.splice(newIndex, 0, movedElement);
    updateTimestamp();
  }

  function saveTemplate() {
    updateTimestamp();
    console.log('Saving template:', JSON.stringify(currentTemplate.value, null, 2));
    alert('Template saved! Check console for JSON output.');

    // In a real app, you would make an API call here
    // Example: await api.saveTemplate(currentTemplate.value);
  }

  function getFormJson() {
    return JSON.stringify(currentTemplate.value, null, 2);
  }

  function updateTimestamp() {
    currentTemplate.value.updatedAt = new Date();
  }

  function resetTemplate() {
    currentTemplate.value = createNewTemplate();
    currentStepId.value = currentTemplate.value.steps[0]?.id || '';
    isPreviewMode.value = false;
  }

  function togglePreview() {
    isPreviewMode.value = !isPreviewMode.value;
  }

  function openStepsModal() {
    isStepsModalOpen.value = true;
  }

  function closeStepsModal() {
    isStepsModalOpen.value = false;
  }

  return {
    // State
    currentTemplate,
    currentStepId,
    isPreviewMode,
    isStepsModalOpen,
    draggableElementsList,

    // Getters (computed properties)
    currentStep, // This is a computed property, not a function
    getDraggableElements,

    // Actions (functions)
    setCurrentStep,
    addStep,
    updateStepTitle,
    deleteStep,
    duplicateStep,
    reorderSteps,
    addElement,
    updateElement,
    deleteElement,
    reorderElements,
    saveTemplate,
    getFormJson,
    resetTemplate,
    togglePreview,
    openStepsModal,
    closeStepsModal
  };
});