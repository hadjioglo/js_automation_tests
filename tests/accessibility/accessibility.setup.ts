import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

setup('Prepare accessibility test environment', async () => {
  // Ensure test results directories exist
  const accessibilityDir = 'test-results/accessibility';
  const screenshotsDir = 'test-results/accessibility-screenshots';
  
  // Create directories if they don't exist
  if (!fs.existsSync(accessibilityDir)) {
    fs.mkdirSync(accessibilityDir, { recursive: true });
  }
  
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  console.log('✅ Accessibility test environment prepared');
  console.log(`📁 Results directory: ${path.resolve(accessibilityDir)}`);
  console.log(`📁 Screenshots directory: ${path.resolve(screenshotsDir)}`);
});