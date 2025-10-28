import { test, expect } from '@playwright/test';
import { AccessibilityPageObject, AccessibilityResult, AccessibilityViolation } from '../../utils/AccessibilityPageObject';
import { AccessibilityReporter } from '../../utils/AccessibilityReporter';
import { baseURL, testPaths, accessibilityConfig } from '../../config/testUrls';

// Global reporter instance to collect all results
let accessibilityReporter: AccessibilityReporter;

test.describe('Accessibility Test Suite', () => {
  test.beforeAll(async () => {
    // Initialize the reporter
    accessibilityReporter = new AccessibilityReporter();
    console.log('🚀 Starting accessibility test suite...');
    console.log(`📍 Base URL: ${baseURL}`);
    console.log(`📄 Testing ${testPaths.length} pages`);
  });

  test.afterAll(async () => {
    // Generate and save the final report
    await accessibilityReporter.saveReport();
    accessibilityReporter.printSummary();
  });

  // Test each page across different viewports
  for (const viewport of accessibilityConfig.viewports) {
    test.describe(`${viewport.name} Viewport (${viewport.width}x${viewport.height})`, () => {
      
      for (const testPath of testPaths) {
        test(`${testPath.name} - Accessibility Compliance`, async ({ page }) => {
          // Set up the accessibility page object
          const accessibilityPage = new AccessibilityPageObject(page);
          
          // Set viewport size
          await accessibilityPage.setViewport(viewport.width, viewport.height);
          
          try {
            // Navigate to the page
            const fullUrl = `${baseURL}${testPath.url}`;
            console.log(`🔍 Testing: ${testPath.name} at ${fullUrl}`);
            
            await accessibilityPage.navigateToPage(fullUrl);
            
            // Wait for page stability
            await accessibilityPage.waitForPageStability();
            
            // Dismiss any overlays that might interfere with testing
            await accessibilityPage.dismissOverlays();
            
            // Run the main accessibility scan
            const result = await accessibilityPage.runAccessibilityScan(testPath.name);
            
            // Add additional manual checks
            const headingCheck = await accessibilityPage.checkHeadingHierarchy();
            const imageCheck = await accessibilityPage.checkImageAltText();
            
            // Log additional information
            console.log(`   📊 Violations: ${result.violations.length}`);
            console.log(`   ✅ Passes: ${result.passes}`);
            console.log(`   📝 Heading issues: ${headingCheck.issues.length}`);
            console.log(`   🖼️  Images without alt: ${imageCheck.missingAlt}/${imageCheck.totalImages}`);
            
            // Take screenshot if there are violations and screenshots are enabled
            if (result.violations.length > 0 && accessibilityConfig.reporting.includeScreenshots) {
              const screenshotName = `${testPath.name.replace(/\s+/g, '-').toLowerCase()}-${viewport.name.toLowerCase()}-violations`;
              await accessibilityPage.takeScreenshot(screenshotName);
            }
            
            // Add result to the reporter
            accessibilityReporter.addResult(result);
            
            // Assert that there are no critical or serious violations
            const criticalViolations = result.violations.filter((v: AccessibilityViolation) => 
              v.impact === 'critical' || v.impact === 'serious'
            );
            
            if (criticalViolations.length > 0) {
              const violationSummary = criticalViolations.map((v: AccessibilityViolation) => 
                `${v.id}: ${v.description} (${v.impact})`
              ).join('\n');
              
              console.error(`❌ Critical/Serious violations found on ${testPath.name}:`);
              console.error(violationSummary);
              
              // Soft assertion - log but don't fail the test immediately
              expect.soft(criticalViolations.length, 
                `Critical/Serious accessibility violations found on ${testPath.name}:\n${violationSummary}`
              ).toBe(0);
            }
            
            // Soft assertion for heading hierarchy
            if (!headingCheck.valid) {
              console.warn(`⚠️  Heading hierarchy issues on ${testPath.name}:`, headingCheck.issues);
              expect.soft(headingCheck.valid, 
                `Heading hierarchy issues: ${headingCheck.issues.join(', ')}`
              ).toBe(true);
            }
            
            // Log success if no major issues
            if (result.violations.length === 0) {
              console.log(`✅ ${testPath.name} passed all accessibility tests!`);
            }
            
          } catch (error) {
            console.error(`❌ Error testing ${testPath.name}:`, error);
            
            // Create a failed result entry
            const failedResult: AccessibilityResult = {
              url: `${baseURL}${testPath.url}`,
              pageName: testPath.name,
              violations: [{
                id: 'test-execution-failed',
                impact: 'critical',
                description: `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                help: 'Fix the underlying issue preventing accessibility testing',
                helpUrl: '',
                nodes: []
              }],
              passes: 0,
              incomplete: 0,
              timestamp: new Date().toISOString(),
              viewport: {
                width: viewport.width,
                height: viewport.height,
                name: viewport.name
              }
            };
            
            accessibilityReporter.addResult(failedResult);
            throw error;
          }
        });
      }
    });
  }
});

// Additional focused accessibility tests
test.describe('Focused Accessibility Tests', () => {
  
  test('Keyboard Navigation - Homepage', async ({ page }) => {
    const accessibilityPage = new AccessibilityPageObject(page);
    await accessibilityPage.navigateToPage(`${baseURL}/home`);
    
    // Test keyboard navigation on key interactive elements
    const keyboardElements = [
      'a[href]',
      'button',
      'input[type="text"]',
      'input[type="email"]',
      'select',
      '[tabindex="0"]'
    ];
    
    console.log('⌨️  Testing keyboard navigation...');
    
    for (const selector of keyboardElements) {
      try {
        const elements = await page.locator(selector).all();
        for (const element of elements.slice(0, 3)) { // Test first 3 of each type
          const isFocusable = await accessibilityPage.testKeyboardNavigation(selector);
          expect.soft(isFocusable, `Element ${selector} should be keyboard focusable`).toBe(true);
        }
      } catch (error) {
        console.warn(`Keyboard test skipped for ${selector}:`, error);
      }
    }
  });
  
  test('Color Contrast - Key Elements', async ({ page }) => {
    const accessibilityPage = new AccessibilityPageObject(page);
    await accessibilityPage.navigateToPage(`${baseURL}/home`);
    
    // Test color contrast on important elements
    const contrastElements = [
      'h1', 'h2', 'h3',
      'p',
      'button',
      'a',
      '.btn',
      '.nav-link'
    ];
    
    console.log('🎨 Testing color contrast...');
    
    for (const selector of contrastElements) {
      try {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          const contrast = await accessibilityPage.testColorContrast(selector);
          expect.soft(contrast.passes, 
            `Color contrast should meet WCAG standards for ${selector}`
          ).toBe(true);
        }
      } catch (error) {
        console.warn(`Contrast test skipped for ${selector}:`, error);
      }
    }
  });
});

// Performance test to ensure accessibility testing doesn't significantly impact test speed
test.describe('Accessibility Performance', () => {
  
  test('Accessibility scan performance', async ({ page }) => {
    const accessibilityPage = new AccessibilityPageObject(page);
    
    const startTime = Date.now();
    await accessibilityPage.navigateToPage(`${baseURL}/home`);
    const scanResult = await accessibilityPage.runAccessibilityScan('Performance Test');
    const endTime = Date.now();
    
    const scanDuration = endTime - startTime;
    console.log(`⏱️  Accessibility scan completed in ${scanDuration}ms`);
    
    // Ensure scan completes within reasonable time (adjust threshold as needed)
    expect(scanDuration).toBeLessThan(30000); // 30 seconds max
    
    // Ensure we get meaningful results
    expect(scanResult.passes).toBeGreaterThan(0);
  });
});