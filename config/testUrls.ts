// Configuration file for accessibility testing URLs
export const baseURL = 'https://factory-direct.tilda.ws';

export const testPaths = [
  { 
    url: '', 
    name: 'Homepage',
    description: 'Main landing page with hero section and product highlights'
  },
  { 
    url: '#products', 
    name: 'Products Section',
    description: 'Product catalog and listing section'
  },
  { 
    url: '#contact', 
    name: 'Contact Section',
    description: 'Contact us form and support information'
  },
  { 
    url: '#about', 
    name: 'About Section',
    description: 'Company information and team details'
  },
  { 
    url: '#support', 
    name: 'Support Section',
    description: 'Customer support and help documentation'
  }
];

// Elements to exclude from accessibility testing
export const excludedElements = [
  // Third-party widgets that can't be easily fixed
  '[data-testid="third-party-chat"]',
  '.google-recaptcha',
  'iframe[src*="youtube"]',
  'iframe[src*="google"]',
  
  // Tilda-specific elements that might need exclusion
  '.t-popup',
  '.t-cookie',
  '.t-tooltip',
  '.t-menusub__bg',
  '.t-uptop',
  
  // Known issues pending fix
  '.legacy-component',
  '[data-skip-a11y="true"]',
  
  // Dynamic content that might cause false positives
  '.loading-spinner',
  '.toast-notification'
];

// Accessibility test configuration
export const accessibilityConfig = {
  // WCAG compliance level
  wcagLevel: 'AA',
  
  // Rules to disable (use sparingly and document why)
  disabledRules: [
    // Example: 'color-contrast' - only if you have a specific business need
  ],
  
  // Viewport configurations for responsive testing
  viewports: [
    { width: 1920, height: 1080, name: 'Desktop' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 375, height: 667, name: 'Mobile' }
  ],
  
  // Report configuration
  reporting: {
    includeScreenshots: true,
    detailedViolations: true,
    groupByRule: true
  }
};