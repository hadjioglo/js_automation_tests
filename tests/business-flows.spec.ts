import { test, expect } from '@playwright/test';

test.describe('Factory Direct - Business Flow Tests', () => {
  
  test.describe('User Journey Tests', () => {
    
    test('Complete factory onboarding journey', async ({ page }) => {
      await page.goto('https://factory-direct.tilda.ws/');
      
      // Step 1: Landing page arrival
      await expect(page).toHaveTitle('Factory direct');
      await expect(page.locator('text=buy directly from Factories')).toBeVisible();
      
      // Step 2: Factory decision point
      const registerFactoryBtn = page.locator('text=Register Factory').first();
      if (await registerFactoryBtn.count() > 0) {
        await registerFactoryBtn.click();
        // Verify navigation to registration section
        await expect(page.locator('form')).toBeInViewport();
      }
      
      // Step 3: Form completion
      await page.locator('input[name="Name"]').fill('Premium Electronics Factory');
      await page.locator('input[name="Email"]').fill('contact@premiumelectronics.com');
      await page.locator('input[name="Phone"]').fill('+86-138-0013-8000');
      
      // Step 4: Account type selection
      const accountSelect = page.locator('select[name="Account type"]');
      if (await accountSelect.count() > 0) {
        await accountSelect.click();
        // Assuming factory option exists
        const factoryOption = page.locator('option:has-text("Factory")').first();
        if (await factoryOption.count() > 0) {
          await factoryOption.click();
        }
      }
      
      // Step 5: Submission readiness
      const submitBtn = page.locator('input[type="submit"]');
      await expect(submitBtn).toBeEnabled();
      
      // Verify all data is correctly entered
      await expect(page.locator('input[name="Name"]')).toHaveValue('Premium Electronics Factory');
      await expect(page.locator('input[name="Email"]')).toHaveValue('contact@premiumelectronics.com');
      await expect(page.locator('input[name="Phone"]')).toHaveValue('+86-138-0013-8000');
    });

    test('Complete buyer onboarding journey', async ({ page }) => {
      await page.goto('https://factory-direct.tilda.ws/');
      
      // Step 1: Landing page evaluation
      await expect(page.locator('text=Find trusted manufacturer')).toBeVisible();
      await expect(page.locator('text=save margins')).toBeVisible();
      
      // Step 2: Buyer decision point
      const registerBuyerBtn = page.locator('text=Register Buyer').first();
      if (await registerBuyerBtn.count() > 0) {
        await registerBuyerBtn.click();
      }
      
      // Step 3: Buyer information entry
      await page.locator('input[name="Name"]').fill('Global Retail Solutions');
      await page.locator('input[name="Email"]').fill('procurement@globalretail.com');
      await page.locator('input[name="Phone"]').fill('+1-555-RETAIL');
      
      // Step 4: Account type selection
      const accountSelect = page.locator('select[name="Account type"]');
      if (await accountSelect.count() > 0) {
        await accountSelect.click();
        const buyerOption = page.locator('option:has-text("Buyer")').first();
        if (await buyerOption.count() > 0) {
          await buyerOption.click();
        }
      }
      
      // Step 5: Final verification
      await expect(page.locator('input[type="submit"]')).toBeEnabled();
      await expect(page.locator('input[name="Name"]')).toHaveValue('Global Retail Solutions');
      await expect(page.locator('input[name="Email"]')).toHaveValue('procurement@globalretail.com');
    });

    test('Information gathering journey (no registration)', async ({ page }) => {
      await page.goto('https://factory-direct.tilda.ws/');
      
      // Step 1: Content consumption
      await expect(page.locator('text=Factory Direct')).toBeVisible();
      await expect(page.locator('text=order batches without intermediaries')).toBeVisible();
      
      // Step 2: Page exploration
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(1000);
      
      // Step 3: Social sharing consideration
      const facebookShare = page.locator('a[href*="facebook.com"]');
      const twitterShare = page.locator('a[href*="twitter.com"]');
      
      if (await facebookShare.count() > 0) {
        await expect(facebookShare).toBeVisible();
      }
      if (await twitterShare.count() > 0) {
        await expect(twitterShare).toBeVisible();
      }
      
      // Step 4: Decision point - leave without registering
      // Verify form is available but not filled
      const nameInput = page.locator('input[name="Name"]');
      await expect(nameInput).toHaveValue('');
      await expect(nameInput).toBeVisible();
    });
  });

  test.describe('Form Validation and Error Handling', () => {
    
    test('Email validation scenarios', async ({ page }) => {
      await page.goto('https://factory-direct.tilda.ws/');
      const emailInput = page.locator('input[name="Email"]');
      
      // Test various email formats
      const emailTests = [
        { email: 'invalid', valid: false },
        { email: 'invalid@', valid: false },
        { email: '@invalid.com', valid: false },
        { email: 'test@.com', valid: false },
        { email: 'valid@example.com', valid: true },
        { email: 'user+tag@domain.co.uk', valid: true },
        { email: 'test.email@subdomain.example.org', valid: true }
      ];
      
      for (const testCase of emailTests) {
        await emailInput.fill(testCase.email);
        const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
        
        if (testCase.valid) {
          expect(validationMessage).toBe('');
        } else {
          expect(validationMessage).toBeTruthy();
        }
      }
    });

    test('Phone number format handling', async ({ page }) => {
      await page.goto('https://factory-direct.tilda.ws/');
      const phoneInput = page.locator('input[name="Phone"]');
      
      // Test various phone number formats
      const phoneFormats = [
        '+1234567890',
        '+1 (555) 123-4567',
        '555-123-4567',
        '+86 138 0013 8000',
        '+44 20 7946 0958',
        '1-800-FACTORY'
      ];
      
      for (const phone of phoneFormats) {
        await phoneInput.fill(phone);
        // Verify input accepts the format
        await expect(phoneInput).toHaveValue(phone);
      }
    });

    test('Name field character limits and validation', async ({ page }) => {
      await page.goto('https://factory-direct.tilda.ws/');
      const nameInput = page.locator('input[name="Name"]');
      
      // Test various name scenarios
      await nameInput.fill('A'); // Very short name
      await expect(nameInput).toHaveValue('A');
      
      await nameInput.fill('João da Silva-O\'Brien'); // International characters
      await expect(nameInput).toHaveValue('João da Silva-O\'Brien');
      
      // Test very long name
      const longName = 'A'.repeat(100);
      await nameInput.fill(longName);
      const actualValue = await nameInput.inputValue();
      // Verify it either accepts or truncates appropriately
      expect(actualValue.length).toBeGreaterThan(0);
    });
  });

  test.describe('Cross-Browser and Device Compatibility', () => {
    
    test('Mobile device simulation', async ({ page }) => {
      // Simulate mobile device
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('https://factory-direct.tilda.ws/');
      
      // Verify mobile layout
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('input[name="Email"]')).toBeVisible();
      
      // Test mobile form interaction
      await page.locator('input[name="Name"]').fill('Mobile User');
      await page.locator('input[name="Email"]').fill('mobile@test.com');
      
      // Verify touch interactions work
      await page.locator('input[name="Phone"]').tap();
      await page.locator('input[name="Phone"]').fill('+1234567890');
      
      await expect(page.locator('input[name="Phone"]')).toHaveValue('+1234567890');
    });

    test('Tablet device simulation', async ({ page }) => {
      // Simulate tablet device
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('https://factory-direct.tilda.ws/');
      
      // Verify tablet layout
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('input[type="submit"]')).toBeVisible();
      
      // Test form completion on tablet
      await page.locator('input[name="Name"]').fill('Tablet Test User');
      await page.locator('input[name="Email"]').fill('tablet@test.com');
      await page.locator('input[name="Phone"]').fill('+1-555-TABLET');
      
      await expect(page.locator('input[name="Email"]')).toHaveValue('tablet@test.com');
    });

    test('Large desktop display', async ({ page }) => {
      // Simulate large desktop
      await page.setViewportSize({ width: 2560, height: 1440 });
      await page.goto('https://factory-direct.tilda.ws/');
      
      // Verify layout scales appropriately
      await expect(page.locator('form')).toBeVisible();
      
      // Test that form remains functional at high resolution
      await page.locator('input[name="Name"]').fill('Desktop User');
      await page.locator('input[name="Email"]').fill('desktop@test.com');
      
      await expect(page.locator('input[name="Name"]')).toHaveValue('Desktop User');
    });
  });

  test.describe('Performance and Load Testing', () => {
    
    test('Page load performance metrics', async ({ page }) => {
      const startTime = performance.now();
      
      await page.goto('https://factory-direct.tilda.ws/');
      await page.locator('form').waitFor();
      
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
      
      // Verify reasonable load time (adjust threshold as needed)
      expect(loadTime).toBeLessThan(5000);
      
      // Verify interactive elements are responsive
      const responseStart = performance.now();
      await page.locator('input[name="Name"]').click();
      await page.locator('input[name="Name"]').fill('Performance Test');
      const responseEnd = performance.now();
      
      console.log(`Form interaction time: ${(responseEnd - responseStart).toFixed(2)}ms`);
      expect(responseEnd - responseStart).toBeLessThan(1000);
    });

    test('Form submission performance', async ({ page }) => {
      await page.goto('https://factory-direct.tilda.ws/');
      
      // Fill form completely
      await page.locator('input[name="Name"]').fill('Performance Test User');
      await page.locator('input[name="Email"]').fill('performance@test.com');
      await page.locator('input[name="Phone"]').fill('+1-555-PERF');
      
      // Measure form submission preparation time
      const submitStart = performance.now();
      
      const submitButton = page.locator('input[type="submit"]');
      await expect(submitButton).toBeEnabled();
      
      const submitEnd = performance.now();
      
      console.log(`Form validation time: ${(submitEnd - submitStart).toFixed(2)}ms`);
      
      // Note: Actual submission testing would require test environment
      // await submitButton.click();
      // await expect(page).toHaveURL(/success|confirmation/);
    });
  });

  test.describe('Accessibility and Usability', () => {
    
    test('Keyboard navigation support', async ({ page }) => {
      await page.goto('https://factory-direct.tilda.ws/');
      
      // Test tab navigation through form
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should reach name input
      const nameInput = page.locator('input[name="Name"]');
      await expect(nameInput).toBeFocused();
      
      await page.keyboard.type('Keyboard User');
      await page.keyboard.press('Tab');
      
      // Should reach email input
      const emailInput = page.locator('input[name="Email"]');
      await expect(emailInput).toBeFocused();
      
      await page.keyboard.type('keyboard@test.com');
      await page.keyboard.press('Tab');
      
      // Should reach phone input
      const phoneInput = page.locator('input[name="Phone"]');
      await expect(phoneInput).toBeFocused();
    });

    test('Screen reader compatibility', async ({ page }) => {
      await page.goto('https://factory-direct.tilda.ws/');
      
      // Check for proper ARIA labels and attributes
      const formInputs = page.locator('form input[type="text"], form input[type="email"], form input[type="tel"]');
      const count = await formInputs.count();
      
      for (let i = 0; i < count; i++) {
        const input = formInputs.nth(i);
        
        // Check for accessibility attributes
        const hasPlaceholder = await input.getAttribute('placeholder');
        const hasAriaLabel = await input.getAttribute('aria-label');
        const hasTitle = await input.getAttribute('title');
        const inputId = await input.getAttribute('id');
        
        // Check for associated label
        let hasLabel = false;
        if (inputId) {
          const label = page.locator(`label[for="${inputId}"]`);
          hasLabel = await label.count() > 0;
        }
        
        // At least one accessibility method should be present
        expect(hasPlaceholder || hasAriaLabel || hasTitle || hasLabel).toBeTruthy();
      }
    });

    test('Color contrast and visual accessibility', async ({ page }) => {
      await page.goto('https://factory-direct.tilda.ws/');
      
      // Take screenshot for manual visual review
      await page.screenshot({ 
        path: 'reports/accessibility-review.png', 
        fullPage: true 
      });
      
      // Test high contrast mode simulation
      await page.addStyleTag({
        content: `
          * {
            filter: contrast(200%) !important;
          }
        `
      });
      
      // Verify form is still visible and usable
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('input[name="Email"]')).toBeVisible();
      await expect(page.locator('input[type="submit"]')).toBeVisible();
    });
  });
});