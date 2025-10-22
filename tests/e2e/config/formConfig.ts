// Form field configuration for Factory Direct homepage
// This centralized configuration makes it easy to maintain and update selectors

export interface FormFieldConfig {
  name: string;
  selectors: string[];
  required: boolean;
  placeholder?: string;
  validation?: {
    type: 'email' | 'phone' | 'text';
    pattern?: RegExp;
  };
}

export interface FormConfig {
  [key: string]: FormFieldConfig;
}

export const FACTORY_DIRECT_FORM_CONFIG: FormConfig = {
  name: {
    name: 'name',
    selectors: [
      '[data-testid="name-input"]',
      'input[name*="name" i]:not([type="hidden"])',
      'form input[type="text"]:first-of-type',
      'input[placeholder*="name" i]',
      '#name',
      '.name-field input'
    ],
    required: true,
    placeholder: 'Full Name',
    validation: {
      type: 'text'
    }
  },
  email: {
    name: 'email',
    selectors: [
      '[data-testid="email-input"]',
      'input[type="email"]',
      'input[name*="email" i]:not([type="hidden"])',
      'input[placeholder*="email" i]',
      '#email',
      '.email-field input'
    ],
    required: true,
    placeholder: 'Email Address',
    validation: {
      type: 'email',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
  phone: {
    name: 'phone',
    selectors: [
      '[data-testid="phone-input"]',
      'input[type="tel"]',
      'input[name*="phone" i]:not([type="hidden"])',
      'input[placeholder*="phone" i]',
      '#phone',
      '.phone-field input'
    ],
    required: false,
    placeholder: 'Phone Number',
    validation: {
      type: 'phone',
      pattern: /^[\+]?[1-9][\d]{0,15}$/
    }
  }
};

export const SUBMIT_BUTTON_SELECTORS = [
  '[data-testid="submit-button"]',
  'input[type="submit"]',
  'button[type="submit"]',
  'button:has-text("submit")',
  'button:has-text("send")',
  'button:has-text("register")',
  'form button:last-of-type',
  '.submit-btn',
  '#submit'
];

export const FORM_SELECTORS = [
  '[data-testid="registration-form"]',
  'form',
  '.registration-form',
  '#registration-form'
];