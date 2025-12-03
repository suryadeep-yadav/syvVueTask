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
   
    <!-- Content editable div -->
    <div
      ref="editor"
      class="editor-content"
      contenteditable="true"
      @input="onInput"
      @keydown="onKeyDown"
      :data-placeholder="placeholder"
      spellcheck="false"
    ></div>
   
    <!-- Character counter (optional) -->
    <div class="editor-footer">
      <span class="char-count">{{ editor?.innerText?.length || 0 }} characters</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

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

const editor = ref<HTMLDivElement>();
const mode = ref(props.mode);
const formats = ref({
  bold: false,
  italic: false,
  underline: false,
  alignCenter: false,
  bulletList: false,
  checkbox: false
});

const commandMap = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  alignCenter: 'justifyCenter',
  bulletList: 'insertUnorderedList'
} as const;

const updateActiveFormats = () => {
  if (!editor.value || typeof document === 'undefined') return;

  // Ensure we're using inline styles, not classes
  document.execCommand('styleWithCSS', false, 'false');
  document.execCommand('defaultParagraphSeparator', false, 'p');

  formats.value = {
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    underline: document.queryCommandState('underline'),
    alignCenter: document.queryCommandState('justifyCenter'),
    bulletList: document.queryCommandState('insertUnorderedList'),
    checkbox: false
  };

  // Update mode based on selection block
  const blockValue = document.queryCommandValue('formatBlock');
  const lowerBlock = blockValue.toLowerCase();
  if (lowerBlock === 'h1') {
    mode.value = 'heading';
  } else if (lowerBlock === 'h2') {
    mode.value = 'subheading';
  } else {
    mode.value = 'normal';
  }

  // Update checkbox based on cursor position
  const sel = window.getSelection();
  if (sel && sel.rangeCount === 1) {
    const range = sel.getRangeAt(0);
    if (range.collapsed) {
      const preRange = range.cloneRange();
      preRange.selectNodeContents(editor.value);
      preRange.setEnd(range.endContainer, range.startOffset);
      const textBefore = preRange.toString();
      if (textBefore.endsWith('☐ ')) {
        formats.value.checkbox = true;
      }
    }
  }
};

const insertCheckbox = () => {
  if (!editor.value) return;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  range.deleteContents();
  const textNode = document.createTextNode('☐ ');
  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
};

const removeCheckbox = () => {
  if (!editor.value) return;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  if (range.collapsed) {
    const preRange = range.cloneRange();
    preRange.selectNodeContents(editor.value);
    preRange.setEnd(range.endContainer, range.startOffset);
    const textBefore = preRange.toString();
    if (textBefore.endsWith('☐ ')) {
      range.setStart(range.startContainer, range.startOffset - 2);
      range.deleteContents();
    }
  }
};

const onInput = () => {
  if (editor.value) {
    emit('update:modelValue', editor.value.innerHTML);
  }
};

const toggleFormat = (format: keyof typeof formats.value) => {
  if (!editor.value) return;

  editor.value.focus();

  if (format === 'checkbox') {
    updateActiveFormats();
    if (formats.value.checkbox) {
      removeCheckbox();
    } else {
      insertCheckbox();
    }
  } else {
    const command = commandMap[format];
    if (command) {
      document.execCommand(command, false, undefined);
    }
  }

  updateActiveFormats();
  emit('format-change', { ...formats.value });
};

const onKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey) {
    let handled = false;
    switch (event.key.toLowerCase()) {
      case 'b':
        toggleFormat('bold');
        handled = true;
        break;
      case 'i':
        toggleFormat('italic');
        handled = true;
        break;
      case 'u':
        toggleFormat('underline');
        handled = true;
        break;
    }
    if (handled) {
      event.preventDefault();
    }
  }
};

// Apply mode changes to selection
watch(mode, (newMode) => {
  if (!editor.value || typeof document === 'undefined') return;
  editor.value.focus();
  const block = newMode === 'heading' ? '<h1>' : newMode === 'subheading' ? '<h2>' : '<p>';
  document.execCommand('formatBlock', false, block);
  emit('mode-change', newMode);
});

// Sync prop changes
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.innerHTML !== newValue) {
    editor.value.innerHTML = newValue || '';
    updateActiveFormats();
  }
}, { immediate: true });

watch(() => props.mode, (newMode) => {
  mode.value = newMode;
});

// Listen to selection changes
onMounted(() => {
  updateActiveFormats();
  window.addEventListener('selectionchange', updateActiveFormats);
});

onUnmounted(() => {
  window.removeEventListener('selectionchange', updateActiveFormats);
});
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
.editor-content {
  width: 100%;
  padding: 12px;
  border: none;
  outline: none;
  min-height: 100px;
  font-family: inherit;
  line-height: 1.5;
  background: transparent;
  overflow-y: auto;
  cursor: text;
}
.editor-content:empty::before {
  content: attr(data-placeholder);
  color: #6c757d;
  display: block;
  padding: 12px;
  opacity: 0.7;
  pointer-events: none;
}
.editor-content[contenteditable]:focus {
  outline: none;
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