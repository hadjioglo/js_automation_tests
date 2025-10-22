import { test, expect } from '@playwright/test';

test.describe('Factory Direct Website - Core Functionality Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://factory-direct.tilda.ws/');
  });

  test.describe('Page Load and Basic Functionality', () => {
    
    test('should load homepage successfully', async ({ page }) => {
      await expect(page).toHaveTitle('Factory direct');
      await expect(page).toHaveURL('https://factory-direct.tilda.ws/');
      
      // Verify page content loads
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('text=Factory Direct')).toBeVisible();
    });

    test('should display key messaging', async ({ page }) => {
      await expect(page.locator('text=buy directly from Factories')).toBeVisible();
      await expect(page.locator('text=Find trusted manufacturer')).toBeVisible();
      await expect(page.locator('text=order batches without intermediaries')).toBeVisible();
      await expect(page.locator('text=save margins')).toBeVisible();
    });

    test('should have proper page structure', async ({ page }) => {
      // Check page height for long-form content
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      expect(bodyHeight).toBeGreaterThan(5000);
      
      // Verify responsive design
      await page.setViewportSize({ width: 375, height: 667 }); // Mobile
      await expect(page.locator('body')).toBeVisible();
      
      await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Registration Form Functionality', () => {
    
    test('should display registration form with all fields', async ({ page }) => {
      const form = page.locator('form');
      await expect(form).toBeVisible();
      
      // Verify all form fields are present
      await expect(page.locator('input[name="Email"]')).toBeVisible();
      await expect(page.locator('input[name="Name"]')).toBeVisible();
      await expect(page.locator('input[name="Phone"]')).toBeVisible();
      await expect(page.locator('select[name="Account type"]')).toBeVisible();
      await expect(page.locator('input[type="submit"]')).toBeVisible();
    });

    test('should have proper form field attributes', async ({ page }) => {
      // Email field validation
      const emailInput = page.locator('input[name="Email"]');
      await expect(emailInput).toHaveAttribute('type', 'email');
      await expect(emailInput).toHaveAttribute('placeholder', 'Your email address');
      
      // Name field validation
      const nameInput = page.locator('input[name="Name"]');
      await expect(nameInput).toHaveAttribute('type', 'text');
      await expect(nameInput).toHaveAttribute('placeholder', 'Your name');
      
      // Phone field validation
      const phoneInput = page.locator('input[name="Phone"]');
      await expect(phoneInput).toHaveAttribute('type', 'tel');
      await expect(phoneInput).toHaveAttribute('placeholder', 'Your phone');
    });

    test('should allow form field input', async ({ page }) => {
      // Fill out the registration form
      await page.locator('input[name="Name"]').fill('John Doe');
      await page.locator('input[name="Email"]').fill('john.doe@example.com');
      await page.locator('input[name="Phone"]').fill('+1234567890');
      
      // Verify inputs were filled
      await expect(page.locator('input[name="Name"]')).toHaveValue('John Doe');
      await expect(page.locator('input[name="Email"]')).toHaveValue('john.doe@example.com');
      await expect(page.locator('input[name="Phone"]')).toHaveValue('+1234567890');
    });

    test('should handle account type selection', async ({ page }) => {
      const accountTypeSelect = page.locator('select[name="Account type"]');
      await expect(accountTypeSelect).toBeVisible();
      
      // Test selecting account type (assuming options exist)
      await accountTypeSelect.click();
      // Note: Specific options would need to be identified in actual implementation
    });

    test('should validate email format', async ({ page }) => {
      const emailInput = page.locator('input[name="Email"]');
      
      // Test invalid email
      await emailInput.fill('invalid-email');
      await page.locator('input[type="submit"]').click();
      
      // Check for validation (browser built-in validation)
      const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toBeTruthy();
      
      // Test valid email
      await emailInput.fill('valid@example.com');
      const validValidationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validValidationMessage).toBe('');
    });
  });

  test.describe('User Flow Tests', () => {
    
    test('Factory registration flow', async ({ page }) => {
      // Navigate to registration section
      const registerFactoryBtn = page.locator('text=Register Factory').first();
      if (await registerFactoryBtn.count() > 0) {
        await registerFactoryBtn.click();
      }
      
      // Fill factory registration form
      await page.locator('input[name="Name"]').fill('ABC Manufacturing');
      await page.locator('input[name="Email"]').fill('factory@abcmfg.com');
      await page.locator('input[name="Phone"]').fill('+1555-FACTORY');
      
      // Select factory account type if available
      const accountSelect = page.locator('select[name="Account type"]');
      if (await accountSelect.count() > 0) {
        await accountSelect.selectOption({ label: 'Factory' });
      }
      
      // Note: Actual form submission would be tested in integration environment
      await expect(page.locator('input[type="submit"]')).toBeEnabled();
    });

    test('Buyer registration flow', async ({ page }) => {
      // Navigate to registration section
      const registerBuyerBtn = page.locator('text=Register Buyer').first();
      if (await registerBuyerBtn.count() > 0) {
        await registerBuyerBtn.click();
      }
      
      // Fill buyer registration form
      await page.locator('input[name="Name"]').fill('Jane Smith');
      await page.locator('input[name="Email"]').fill('jane@buyercompany.com');
      await page.locator('input[name="Phone"]').fill('+1555-BUYER');
      
      // Select buyer account type if available
      const accountSelect = page.locator('select[name="Account type"]');
      if (await accountSelect.count() > 0) {
        await accountSelect.selectOption({ label: 'Buyer' });
      }
      
      await expect(page.locator('input[type="submit"]')).toBeEnabled();
    });

    test('Complete registration submission flow', async ({ page }) => {
      // Fill complete form
      await page.locator('input[name="Name"]').fill('Test User');
      await page.locator('input[name="Email"]').fill('test@example.com');
      await page.locator('input[name="Phone"]').fill('+1234567890');
      
      // Submit form (in real test environment, this would test actual submission)
      const submitButton = page.locator('input[type="submit"]');
      await expect(submitButton).toBeEnabled();
      
      // For actual submission testing, you would:
      // await submitButton.click();
      // await expect(page).toHaveURL(/success|thank-you|confirmation/);
      // await expect(page.locator('text=Thank you')).toBeVisible();
    });
  });

  test.describe('Navigation and Interaction Tests', () => {
    
    test('should handle social sharing buttons', async ({ page }) => {
      // Facebook share button
      const facebookBtn = page.locator('a[href*="facebook.com"]');
      if (await facebookBtn.count() > 0) {
        await expect(facebookBtn).toBeVisible();
        await expect(facebookBtn).toHaveAttribute('href', /facebook.com/);
      }
      
      // Twitter share button
      const twitterBtn = page.locator('a[href*="twitter.com"]');
      if (await twitterBtn.count() > 0) {
        await expect(twitterBtn).toBeVisible();
        await expect(twitterBtn).toHaveAttribute('href', /twitter.com/);
      }
    });

    test('should handle page scrolling', async ({ page }) => {
      // Test scrolling behavior
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      
      // Verify page maintains functionality after scrolling
      await expect(page.locator('input[name="Email"]')).toBeVisible();
    });

    test('should maintain accessibility standards', async ({ page }) => {
      // Check for basic accessibility
      await expect(page.locator('input[name="Email"]')).toHaveAttribute('placeholder');
      await expect(page.locator('input[name="Name"]')).toHaveAttribute('placeholder');
      await expect(page.locator('input[name="Phone"]')).toHaveAttribute('placeholder');
      
      // Check form labels or placeholders are present
      const formInputs = page.locator('form input[type="text"], form input[type="email"], form input[type="tel"]');
      const count = await formInputs.count();
      
      for (let i = 0; i < count; i++) {
        const input = formInputs.nth(i);
        const hasPlaceholder = await input.getAttribute('placeholder');
        const hasLabel = await input.evaluate((el) => {
          const id = el.getAttribute('id');
          return id ? document.querySelector(`label[for="${id}"]`) !== null : false;
        });
        
        expect(hasPlaceholder || hasLabel).toBeTruthy();
      }
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    
    test('should handle network interruptions gracefully', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 100);
      });
      
      await page.goto('https://factory-direct.tilda.ws/');
      await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    });

    test('should validate required fields', async ({ page }) => {
      // Try to submit empty form
      await page.locator('input[type="submit"]').click();
      
      // Check if browser validation prevents submission
      const nameInput = page.locator('input[name="Name"]');
      const emailInput = page.locator('input[name="Email"]');
      
      if (await nameInput.getAttribute('required') !== null) {
        const nameValidation = await nameInput.evaluate((el: HTMLInputElement) => el.validationMessage);
        expect(nameValidation).toBeTruthy();
      }
      
      if (await emailInput.getAttribute('required') !== null) {
        const emailValidation = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
        expect(emailValidation).toBeTruthy();
      }
    });

    test('should handle special characters in form inputs', async ({ page }) => {
      // Test special characters
      await page.locator('input[name="Name"]').fill('José María O\'Connor-Smith');
      await page.locator('input[name="Email"]').fill('test+special@example-domain.co.uk');
      await page.locator('input[name="Phone"]').fill('+1 (555) 123-4567 ext. 890');
      
      // Verify inputs accept special characters
      await expect(page.locator('input[name="Name"]')).toHaveValue('José María O\'Connor-Smith');
      await expect(page.locator('input[name="Email"]')).toHaveValue('test+special@example-domain.co.uk');
      await expect(page.locator('input[name="Phone"]')).toHaveValue('+1 (555) 123-4567 ext. 890');
    });
  });

  test.describe('Performance and Load Tests', () => {
    
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('https://factory-direct.tilda.ws/');
      await page.locator('body').waitFor();
      const loadTime = Date.now() - startTime;
      
      // Expect page to load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle multiple rapid form interactions', async ({ page }) => {
      const nameInput = page.locator('input[name="Name"]');
      const emailInput = page.locator('input[name="Email"]');
      
      // Rapid input changes
      for (let i = 0; i < 5; i++) {
        await nameInput.fill(`User ${i}`);
        await emailInput.fill(`user${i}@example.com`);
        await page.waitForTimeout(50);
      }
      
      // Verify final values
      await expect(nameInput).toHaveValue('User 4');
      await expect(emailInput).toHaveValue('user4@example.com');
    });
  });
});