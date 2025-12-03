export interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  settings: Record<string, any>;
  content?: string;
}
export interface TextFormatting {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignCenter: boolean;
  bulletList: boolean;
  checkbox: boolean;
}
export type FormElementType = 
  | 'heading'
  | 'text-box'
  | 'short-answer'
  | 'long-answer'
  | 'file-upload'
  | 'dropdown'
  | 'multi-select'
  | 'radio-button'
  | 'checkbox'
  | 'date-range';

export interface FormStep {
  id: string;
  title: string;
  elements: FormElement[];
  order: number;
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  steps: FormStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DraggableElement {
  type: FormElementType;
  label: string;
  icon?: string;
}