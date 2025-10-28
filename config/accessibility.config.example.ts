// Production accessibility configuration for Factory Direct
// This configuration is optimized for the live Tilda website

export const productionAccessibilityConfig = {
  // Production environment configuration
  production: {
    baseURL: 'https://factory-direct.tilda.ws',
    testPaths: [
      { url: '', name: 'Homepage', description: 'Main landing page' },
      { url: '#products', name: 'Products Section', description: 'Product catalog section' },
      { url: '#contact', name: 'Contact Section', description: 'Contact and support section' },
      { url: '#about', name: 'About Section', description: 'Company information section' },
      { url: '#support', name: 'Support Section', description: 'Customer support section' }
    ],
    // Production should have minimal exclusions - only unavoidable third-party elements
    excludedElements: [
      '[data-testid="third-party-chat"]',
      '.google-recaptcha',
      'iframe[src*="youtube"]',
      'iframe[src*="google"]',
      // Tilda-specific elements that might need exclusion
      '.t-popup',
      '.t-cookie',
      '.t-tooltip'
    ],
    // Strict WCAG AA compliance for production
    wcagLevel: 'AA',
    disabledRules: [] // No disabled rules in production
  }
};

// Example: How to use this configuration
// 
// 1. Import this file in your test:
//    import { productionAccessibilityConfig } from './accessibility.config.example';
//
// 2. Use the production configuration:
//    const config = productionAccessibilityConfig.production;
//    const { baseURL, testPaths, excludedElements } = config;
//
// 3. Use the configuration in your tests:
//    const { baseURL, testPaths, excludedElements } = config;

// Example: Custom viewport configurations for different testing scenarios
export const customViewports = {
  // Accessibility-focused viewports
  accessibility: [
    { width: 1920, height: 1080, name: 'Desktop-Large' },
    { width: 1366, height: 768, name: 'Desktop-Standard' },
    { width: 768, height: 1024, name: 'Tablet-Portrait' },
    { width: 1024, height: 768, name: 'Tablet-Landscape' },
    { width: 375, height: 667, name: 'Mobile-Small' },
    { width: 414, height: 896, name: 'Mobile-Large' }
  ],

  // Quick testing (fewer viewports)
  smoke: [
    { width: 1920, height: 1080, name: 'Desktop' },
    { width: 375, height: 667, name: 'Mobile' }
  ],

  // Comprehensive testing (many viewports)
  comprehensive: [
    { width: 1920, height: 1080, name: 'Desktop-FHD' },
    { width: 1440, height: 900, name: 'Desktop-MacBook' },
    { width: 1366, height: 768, name: 'Desktop-Standard' },
    { width: 1024, height: 768, name: 'Tablet-Landscape' },
    { width: 768, height: 1024, name: 'Tablet-Portrait' },
    { width: 414, height: 896, name: 'Mobile-iPhone' },
    { width: 375, height: 667, name: 'Mobile-Standard' },
    { width: 360, height: 640, name: 'Mobile-Android' }
  ]
};

// Example: Custom rule configurations for different compliance levels
export const complianceConfigurations = {
  // Basic WCAG 2.1 A compliance
  basic: {
    wcagLevel: 'A',
    tags: ['wcag2a'],
    disabledRules: [
      'color-contrast', // Often the hardest to achieve initially
      'focus-order-semantics'
    ]
  },

  // Standard WCAG 2.1 AA compliance (recommended)
  standard: {
    wcagLevel: 'AA',
    tags: ['wcag2a', 'wcag2aa'],
    disabledRules: []
  },

  // Enhanced WCAG 2.1 AAA compliance
  enhanced: {
    wcagLevel: 'AAA',
    tags: ['wcag2a', 'wcag2aa', 'wcag2aaa'],
    disabledRules: []
  },

  // Custom business rules
  business: {
    wcagLevel: 'AA',
    tags: ['wcag2a', 'wcag2aa', 'best-practice'],
    disabledRules: [
      // Example: Disable specific rules based on business requirements
      // 'bypass' - if your business doesn't require skip links
    ]
  }
};