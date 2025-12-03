<template>
  <div class="simple-text-editor">
    <!-- Toolbar exactly like image -->
    <div class="editor-toolbar">
      <!-- Mode selector -->
      <select v-model="mode" class="mode-selector">
        <option value="normal">Normal</option>
        <option value="heading">Heading</option>
        <option value="subheading">Subheading</option>
      </select>
      
      <!-- Formatting buttons -->
      <div class="formatting-buttons">
        <button 
          @click="toggleFormat('bold')" 
          class="toolbar-btn" 
          :class="{ 'active': formats.bold }"
          title="Bold"
        >
          <span class="bold-text">B</span>
        </button>
        
        <button 
          @click="toggleFormat('italic')" 
          class="toolbar-btn" 
          :class="{ 'active': formats.italic }"
          title="Italic"
        >
          <span class="italic-text">I</span>
        </button>
        
        <button 
          @click="toggleFormat('underline')" 
          class="toolbar-btn" 
          :class="{ 'active': formats.underline }"
          title="Underline"
        >
          <span class="underline-text">U</span>
        </button>
        
        <!-- Equal sign button (probably for alignment) -->
        <button 
          @click="toggleFormat('alignCenter')" 
          class="toolbar-btn" 
          :class="{ 'active': formats.alignCenter }"
          title="Center Align"
        >
          <span class="equal-sign">=</span>
        </button>
        
        <!-- Bullet list button -->
        <button 
          @click="toggleFormat('bulletList')" 
          class="toolbar-btn" 
          :class="{ 'active': formats.bulletList }"
          title="Bullet List"
        >
          <span class="bullet-icon">•</span>
        </button>
        
        <!-- Checkbox button -->
        <button 
          @click="toggleFormat('checkbox')" 
          class="toolbar-btn" 
          :class="{ 'active': formats.checkbox }"
          title="Checkbox"
        >
          <span class="checkbox-icon">☑</span>
        </button>
      </div>
    </div>
    
    <!-- Text area -->
    <textarea
      ref="textarea"
      v-model="content"
      @input="onInput"
      @keydown="onKeyDown"
      class="editor-textarea"
      :placeholder="placeholder"
      :style="textAreaStyles"
      rows="4"
    ></textarea>
    
    <!-- Character counter (optional) -->
    <div class="editor-footer">
      <span class="char-count">{{ content.length }} characters</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  mode?: 'normal' | 'heading' | 'subheading';
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'format-change', formats: any): void;
  (e: 'mode-change', mode: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter content here',
  mode: 'normal'
});

const emit = defineEmits<Emits>();

const textarea = ref<HTMLTextAreaElement>();
const content = ref(props.modelValue);
const mode = ref(props.mode);
const formats = ref({
  bold: false,
  italic: false,
  underline: false,
  alignCenter: false,
  bulletList: false,
  checkbox: false
});

// Compute text area styles based on mode and formats
const textAreaStyles = computed(() => {
  const styles: any = {};
  
  // Mode-based styles
  if (mode.value === 'heading') {
    styles.fontSize = '18px';
    styles.fontWeight = '600';
    styles.color = '#333';
  } else if (mode.value === 'subheading') {
    styles.fontSize = '16px';
    styles.fontWeight = '500';
    styles.color = '#555';
  } else {
    styles.fontSize = '14px';
    styles.fontWeight = '400';
    styles.color = '#333';
  }
  
  // Format-based styles
  if (formats.value.bold) styles.fontWeight = 'bold';
  if (formats.value.italic) styles.fontStyle = 'italic';
  if (formats.value.underline) styles.textDecoration = 'underline';
  if (formats.value.alignCenter) styles.textAlign = 'center';
  
  return styles;
});

watch(() => props.modelValue, (newValue) => {
  content.value = newValue;
});

watch(() => props.mode, (newMode) => {
  mode.value = newMode;
  emit('mode-change', newMode);
});

const onInput = () => {
  emit('update:modelValue', content.value);
};

const toggleFormat = (format: keyof typeof formats.value) => {
  formats.value[format] = !formats.value[format];
  emit('format-change', { ...formats.value });
  
  // If it's a bullet list or checkbox, add the marker
  if (format === 'bulletList' && formats.value.bulletList) {
    const cursorPos = textarea.value?.selectionStart || 0;
    const textBefore = content.value.substring(0, cursorPos);
    const textAfter = content.value.substring(cursorPos);
    
    // Add bullet at cursor position
    content.value = textBefore + '• ' + textAfter;
    emit('update:modelValue', content.value);
    
    // Move cursor after bullet
    setTimeout(() => {
      if (textarea.value) {
        textarea.value.selectionStart = cursorPos + 2;
        textarea.value.selectionEnd = cursorPos + 2;
      }
    }, 0);
  }
  
  if (format === 'checkbox' && formats.value.checkbox) {
    const cursorPos = textarea.value?.selectionStart || 0;
    const textBefore = content.value.substring(0, cursorPos);
    const textAfter = content.value.substring(cursorPos);
    
    // Add checkbox at cursor position
    content.value = textBefore + '☐ ' + textAfter;
    emit('update:modelValue', content.value);
    
    // Move cursor after checkbox
    setTimeout(() => {
      if (textarea.value) {
        textarea.value.selectionStart = cursorPos + 2;
        textarea.value.selectionEnd = cursorPos + 2;
      }
    }, 0);
  }
  
  // Focus back on textarea
  textarea.value?.focus();
};

const onKeyDown = (event: KeyboardEvent) => {
  // Handle formatting with keyboard shortcuts
  if (event.ctrlKey || event.metaKey) {
    switch (event.key.toLowerCase()) {
      case 'b':
        event.preventDefault();
        toggleFormat('bold');
        break;
      case 'i':
        event.preventDefault();
        toggleFormat('italic');
        break;
      case 'u':
        event.preventDefault();
        toggleFormat('underline');
        break;
    }
  }
};
</script>

<style scoped>
.simple-text-editor {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  transition: border-color 0.2s;
}

.simple-text-editor:focus-within {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  min-height: 44px;
}

.mode-selector {
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: white;
  font-size: 13px;
  color: #495057;
  cursor: pointer;
  min-width: 80px;
  height: 28px;
}

.mode-selector:focus {
  outline: none;
  border-color: #007bff;
}

.formatting-buttons {
  display: flex;
  gap: 2px;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 2px;
  margin-left: auto;
}

.toolbar-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  color: #495057;
  transition: all 0.15s;
}

.toolbar-btn:hover {
  background: #e9ecef;
}

.toolbar-btn.active {
  background: #007bff;
  color: white;
}

.toolbar-btn:active {
  transform: scale(0.95);
}

.bold-text {
  font-weight: bold;
}

.italic-text {
  font-style: italic;
}

.underline-text {
  text-decoration: underline;
}

.equal-sign {
  font-weight: bold;
  font-size: 16px;
}

.bullet-icon {
  font-size: 18px;
  line-height: 1;
}

.checkbox-icon {
  font-size: 14px;
}

.editor-textarea {
  width: 100%;
  padding: 12px;
  border: none;
  outline: none;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  line-height: 1.5;
  background: transparent;
}

.editor-textarea::placeholder {
  color: #6c757d;
  opacity: 0.7;
}

.editor-footer {
  padding: 8px 12px;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
  display: flex;
  justify-content: flex-end;
}

.char-count {
  font-size: 12px;
  color: #6c757d;
}
</style>