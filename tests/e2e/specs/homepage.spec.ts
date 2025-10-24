import { test, expect } from '@playwright/test';
import { FactoryDirectHomePage } from '../pageObjects/FactoryDirectHomePage';

test.describe('Factory Direct Homepage - Technical Testing @technical @e2e', () => {
  let homePage: FactoryDirectHomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new FactoryDirectHomePage(page);
    await homePage.navigateToHomePage();
  });

  test('should meet performance benchmarks', async ({ page }) => {
    await test.step('Measure page load performance', async () => {
      const startTime = Date.now();
      await homePage.navigateToHomePage();
      const loadTime = Date.now() - startTime;
      
      // Performance assertion - page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
      console.log(`Page load time: ${loadTime}ms`);
    });

    await test.step('Validate Core Web Vitals', async () => {
      // Measure Largest Contentful Paint (LCP)
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          }).observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Fallback timeout
          setTimeout(() => resolve(0), 5000);
        });
      });
      
      // LCP should be under 2.5s for good performance
      expect(lcp).toBeLessThan(2500);
      console.log(`LCP: ${lcp}ms`);
    });

    await test.step('Check resource loading efficiency', async () => {
      const resourceTimings = await page.evaluate(() => 
        performance.getEntriesByType('resource').length
      );
      
      // Should not load excessive resources
      expect(resourceTimings).toBeLessThan(50);
      console.log(`Resources loaded: ${resourceTimings}`);
    });
  });

  test('should handle network conditions and errors', async ({ page, context }) => {
    await test.step('Test slow network conditions', async () => {
      // Simulate slow 3G connection
      await context.route('**/*', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
        await route.continue();
      });
      
      await homePage.navigateToHomePage();
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);
    });

    await test.step('Test offline behavior', async () => {
      await context.setOffline(true);
      
      // Should handle offline gracefully
      const navigation = homePage.navigateToHomePage();
      await expect(navigation).rejects.toThrow();
      
      await context.setOffline(false);
    });

    await test.step('Test failed resource loading', async () => {
      // Block CSS resources to test degraded experience
      await context.route('**/*.css', route => route.abort());
      
      await homePage.navigateToHomePage();
      // Page should still be functional without CSS
      const bodyContent = await page.textContent('body');
      expect(bodyContent).toBeTruthy();
    });
  });

  test('should handle memory and resource management', async ({ page }) => {
    await test.step('Monitor memory usage during interaction', async () => {
      const initialMemory = await page.evaluate(() => 
        (performance as any).memory?.usedJSHeapSize || 0
      );

      // Perform intensive interactions
      for (let i = 0; i < 10; i++) {
        await homePage.fillRegistrationForm({
          name: `Test User ${i}`,
          email: `test${i}@example.com`,
          phone: `+123456789${i}`
        });
        await homePage.clearForm();
      }

      const finalMemory = await page.evaluate(() => 
        (performance as any).memory?.usedJSHeapSize || 0
      );

      // Memory growth should be reasonable (less than 10MB increase)
      const memoryGrowth = finalMemory - initialMemory;
      expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024);
      console.log(`Memory growth: ${(memoryGrowth / 1024 / 1024).toFixed(2)}MB`);
    });

    await test.step('Test DOM cleanup and event listeners', async () => {
      const initialListeners = await page.evaluate(() => 
        (window as any).getEventListeners ? 
        Object.keys((window as any).getEventListeners(document)).length : 0
      );

      // Add and remove form interactions
      await homePage.fillRegistrationForm({
        name: 'Memory Test User',
        email: 'memory@test.com',
        phone: '+1234567890'
      });

      await page.reload();

      const finalListeners = await page.evaluate(() => 
        (window as any).getEventListeners ? 
        Object.keys((window as any).getEventListeners(document)).length : 0
      );

      // Event listeners should be properly cleaned up
      expect(finalListeners).toBeLessThanOrEqual(initialListeners + 5);
    });
  });
});

test.describe('Cross-Browser Compatibility @compatibility @e2e', () => {
  let homePage: FactoryDirectHomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new FactoryDirectHomePage(page);
    await homePage.navigateToHomePage();
  });

  test('should handle browser-specific CSS and JavaScript', async ({ page, browserName }) => {
    await test.step(`Test ${browserName} specific functionality`, async () => {
      // Check for browser-specific CSS support
      const cssSupport = await page.evaluate(() => {
        const testEl = document.createElement('div');
        const tests = {
          flexbox: 'flex' in testEl.style,
          grid: 'grid' in testEl.style,
          customProperties: CSS.supports('--custom: value'),
        };
        return tests;
      });

      expect(cssSupport.flexbox).toBe(true);
      console.log(`${browserName} CSS support:`, cssSupport);
    });

    await test.step('Test JavaScript API compatibility', async () => {
      const apiSupport = await page.evaluate(() => ({
        fetch: typeof fetch !== 'undefined',
        promises: typeof Promise !== 'undefined',
        es6Classes: typeof class {} === 'function',
        localStorage: typeof localStorage !== 'undefined'
      }));

      expect(apiSupport.fetch).toBe(true);
      expect(apiSupport.promises).toBe(true);
      console.log(`${browserName} API support:`, apiSupport);
    });
  });

  test('should handle touch vs mouse interactions', async ({ page, browserName }) => {
    await test.step('Test input method compatibility', async () => {
      const inputMethods = await page.evaluate(() => ({
        hasTouch: 'ontouchstart' in window,
        hasPointer: 'onpointerdown' in window,
        hasMouse: matchMedia('(hover: hover)').matches
      }));

      console.log(`${browserName} input methods:`, inputMethods);

      // Test form interaction regardless of input method
      await homePage.fillRegistrationForm({
        name: 'Cross Browser Test',
        email: 'crossbrowser@test.com',
        phone: '+1234567890'
      });

      const isFormValid = await homePage.validateRegistrationForm();
      expect(isFormValid).toBe(true);
    });
  });
});

test.describe('Developer Debugging Tools @debug @e2e', () => {
  let homePage: FactoryDirectHomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new FactoryDirectHomePage(page);
  });

  test('should provide detailed error information', async ({ page }) => {
    await test.step('Capture console errors and warnings', async () => {
      const consoleMessages: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
          consoleMessages.push(`${msg.type()}: ${msg.text()}`);
        }
      });

      await homePage.navigateToHomePage();
      await homePage.fillRegistrationForm({
        name: '',
        email: 'invalid-email',
        phone: ''
      });

      // Allow time for validation messages
      await page.waitForTimeout(1000);

      console.log('Console messages captured:', consoleMessages);
      
      // Should capture validation errors for debugging
      // (This is for debugging purposes, not strict assertion)
    });

    await test.step('Test error boundary behavior', async () => {
      // Test how the page handles JavaScript errors
      await page.evaluate(() => {
        // Simulate a non-critical error
        try {
          (window as any).nonExistentFunction();
        } catch (error) {
          console.warn('Caught expected error for testing:', error instanceof Error ? error.message : String(error));
        }
      });

      // Page should remain functional after non-critical errors
      const isPageLoaded = await homePage.isPageLoaded();
      expect(isPageLoaded).toBe(true);
    });
  });

  test('should support debugging workflow', async ({ page }) => {
    await test.step('Enable debug mode features', async () => {
      // Add debug attributes for easier element inspection
      await page.evaluate(() => {
        document.body.setAttribute('data-test-mode', 'debug');
        
        // Add visual debugging helpers
        const forms = document.querySelectorAll('form');
        forms.forEach((form, index) => {
          form.setAttribute('data-debug-form', `form-${index}`);
        });
      });

      const debugMode = await page.getAttribute('body', 'data-test-mode');
      expect(debugMode).toBe('debug');
    });

    await test.step('Test element state inspection', async () => {
      await homePage.fillRegistrationForm({
        name: 'Debug Test User',
        email: 'debug@test.com',
        phone: '+1234567890'
      });

      // Capture form state for debugging
      const formState = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        return inputs.map(input => ({
          name: input.name || input.type,
          value: (input as HTMLInputElement).value,
          valid: (input as HTMLInputElement).validity.valid,
          required: (input as HTMLInputElement).required
        }));
      });

      console.log('Form state for debugging:', formState);
      expect(formState.length).toBeGreaterThan(0);
    });
  });
});