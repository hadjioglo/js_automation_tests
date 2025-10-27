import { defineConfig, devices } from '@playwright/test';
import { getEnvironmentConfig, envVars } from './config/environments';

// Load environment variables and configuration
const envConfig = getEnvironmentConfig(envVars.ENV);

export default defineConfig({
  // Test discovery
  testDir: './tests',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  testIgnore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  
  // Global test settings
  timeout: envConfig.timeout,
  expect: {
    timeout: 10000,
  },
  
  // Execution settings
  fullyParallel: !envVars.CI,
  workers: envVars.CI ? 2 : envVars.WORKERS,
  retries: envVars.CI ? 2 : envConfig.retries,
  
  // Reporting
  reporter: [
    ['list'],
    ['html', { 
      outputFolder: 'reports/html', 
      open: envVars.CI ? 'never' : 'on-failure',
      host: '0.0.0.0',
      port: 9323
    }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ...(envVars.CI ? [['github'] as const] : [])
  ],
  
  // Global test configuration
  use: {
    // Base URLs
    baseURL: envConfig.baseUrl,
    
    // Browser settings
    headless: envVars.CI || envVars.HEADLESS || envConfig.headless,
    viewport: envConfig.viewport,
    ignoreHTTPSErrors: true,
    
    // Media settings
    video: envConfig.video,
    screenshot: envConfig.screenshot,
    trace: envConfig.trace,
    
    // Performance settings
    actionTimeout: 15000,
    navigationTimeout: 30000,
    
    // Test artifacts
    testIdAttribute: 'data-testid',
    
    // Additional settings
    locale: 'en-US',
    timezoneId: 'America/New_York',
    colorScheme: 'light',
    
    // Browser context settings
    acceptDownloads: true,
    bypassCSP: true,
    
    // Custom headers for API testing
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(envVars.API_TOKEN && { 'Authorization': `Bearer ${envVars.API_TOKEN}` })
    }
  },

  // Project configurations for different browsers and test types
  projects: [
    // E2E Tests - Chromium
    {
      name: 'e2e-chromium',
      testDir: './tests/e2e',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
      dependencies: ['setup'],
      grep: /@e2e|@smoke|@regression/
    },
    
    // E2E Tests - Firefox
    {
      name: 'e2e-firefox',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
      grep: /@e2e|@regression/
    },
    
    // E2E Tests - WebKit
    {
      name: 'e2e-webkit',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
      grep: /@e2e|@regression/
    },
    
    // Mobile Tests
    {
      name: 'mobile-chrome',
      testDir: './tests/e2e',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
      grep: /@mobile|@smoke/
    },
    
    {
      name: 'mobile-safari',
      testDir: './tests/e2e',
      use: { ...devices['iPhone 12'] },
      dependencies: ['setup'],
      grep: /@mobile|@smoke/
    },
    
    // Tablet Tests
    {
      name: 'tablet-chrome',
      testDir: './tests/e2e',
      use: { ...devices['iPad Pro'] },
      dependencies: ['setup'],
      grep: /@tablet|@smoke/
    },
    
    // API Tests
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        baseURL: envConfig.apiBaseUrl,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(envVars.API_TOKEN && { 'Authorization': `Bearer ${envVars.API_TOKEN}` })
        }
      },
      grep: /@api/
    },
    
    // Setup project for authentication and data preparation
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      teardown: 'cleanup'
    },
    
    // Cleanup project
    {
      name: 'cleanup',
      testMatch: /.*\.cleanup\.ts/
    },
    
    // Smoke tests only
    {
      name: 'smoke',
      testDir: './tests',
      use: { ...devices['Desktop Chrome'] },
      grep: /@smoke/,
      retries: 0
    },
    
    // Visual regression tests
    {
      name: 'visual-regression',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
      dependencies: ['setup'],
      grep: /@visual/
    }
  ],
  
  // Output directory
  outputDir: 'test-results'
  
  // Web server for local development (if needed)
  // webServer: envVars.TEST_ENV === 'local' ? {
  //   command: 'npm run dev',
  //   port: 3000,
  //   reuseExistingServer: !envVars.CI,
  //   stdout: 'ignore',
  //   stderr: 'pipe'
  // } : undefined
});
