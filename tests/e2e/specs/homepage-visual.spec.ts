import { test, expect } from '@playwright/test';
import { FactoryDirectHomePage } from '../pageObjects/FactoryDirectHomePage';

test.describe('Factory Direct Homepage - Visual Regression Tests @visual @e2e', () => {
  let homePage: FactoryDirectHomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new FactoryDirectHomePage(page);
    await homePage.navigateToHomePage();
    
    // Wait for page to be fully loaded for consistent screenshots
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations or dynamic content to settle
    await page.waitForTimeout(2000);
  });

  test('should match homepage layout baseline screenshot', async ({ page }) => {
    await test.step('Take full page screenshot for layout comparison', async () => {
      // Ensure consistent viewport for visual testing
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Hide dynamic content that might cause flaky tests
      await page.addStyleTag({
        content: `
          /* Hide potentially dynamic elements */
          .timestamp, .current-time, .live-chat, .notifications,
          [class*="timestamp"], [id*="timestamp"],
          [class*="live"], [id*="live"] {
            visibility: hidden !important;
          }
          
          /* Ensure consistent font rendering */
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `
      });
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot('homepage-full-layout.png', {
        fullPage: true,
        animations: 'disabled',
        mask: [
          // Mask any elements that might have dynamic content
          page.locator('.timestamp, .current-time, .live-chat'),
          page.locator('[class*="timestamp"], [id*="timestamp"]'),
          page.locator('[class*="live"], [id*="live"]')
        ],
        threshold: 0.3, // Allow for 30% pixel difference tolerance
        maxDiffPixels: 1000 // Allow up to 1000 pixels to be different
      });
    });
  });

  test('should match homepage hero section layout', async ({ page }) => {
    await test.step('Take hero section screenshot for detailed comparison', async () => {
      // Set consistent viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Wait for hero section to be visible
      const heroSection = page.locator('.t182, .hero, [data-testid="hero"], h1').first();
      await heroSection.waitFor({ state: 'visible' });
      
      // Take screenshot of hero section only
      await expect(heroSection).toHaveScreenshot('homepage-hero-section.png', {
        animations: 'disabled',
        threshold: 0.2,
        maxDiffPixels: 500
      });
    });
  });

  test('should match registration form layout', async ({ page }) => {
    await test.step('Take registration form screenshot', async () => {
      // Set consistent viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Find and screenshot the registration form
      const registrationForm = page.locator('form, [data-testid="registration-form"]').first();
      
      if (await registrationForm.count() > 0) {
        await registrationForm.waitFor({ state: 'visible' });
        
        await expect(registrationForm).toHaveScreenshot('homepage-registration-form.png', {
          animations: 'disabled',
          threshold: 0.2,
          maxDiffPixels: 300
        });
      } else {
        // If no form is visible, take screenshot of the area where it should be
        console.log('Registration form not found, taking screenshot of potential form area');
        const formArea = page.locator('body');
        await expect(page).toHaveScreenshot('homepage-form-area.png', {
          animations: 'disabled',
          threshold: 0.2,
          maxDiffPixels: 300,
          clip: { x: 0, y: 400, width: 1920, height: 600 }
        });
      }
    });
  });

  test('should match navigation layout', async ({ page }) => {
    await test.step('Take navigation screenshot', async () => {
      // Set consistent viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Look for navigation elements
      const navigation = page.locator('nav, .navigation, .header, .menu').first();
      
      if (await navigation.count() > 0) {
        await navigation.waitFor({ state: 'visible' });
        
        await expect(navigation).toHaveScreenshot('homepage-navigation.png', {
          animations: 'disabled',
          threshold: 0.2,
          maxDiffPixels: 200
        });
      } else {
        // Take screenshot of top area where navigation typically is
        await expect(page).toHaveScreenshot('homepage-top-area.png', {
          animations: 'disabled',
          threshold: 0.2,
          maxDiffPixels: 200,
          clip: { x: 0, y: 0, width: 1920, height: 150 }
        });
      }
    });
  });

  test('should detect layout changes across different viewports', async ({ page }) => {
    const viewports = [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'laptop', width: 1366, height: 768 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      await test.step(`Take screenshot for ${viewport.name} viewport`, async () => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        // Wait for layout to adjust
        await page.waitForTimeout(1000);
        
        // Take viewport-specific screenshot
        await expect(page).toHaveScreenshot(`homepage-${viewport.name}-layout.png`, {
          fullPage: true,
          animations: 'disabled',
          mask: [
            // Mask dynamic content
            page.locator('.timestamp, .current-time, .live-chat'),
            page.locator('[class*="timestamp"], [id*="timestamp"]')
          ],
          threshold: 0.3,
          maxDiffPixels: 1500 // Allow more pixels for responsive changes
        });
      });
    }
  });

  test('should match footer layout', async ({ page }) => {
    await test.step('Take footer screenshot', async () => {
      // Set consistent viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      
      // Look for footer
      const footer = page.locator('footer, .footer').first();
      
      if (await footer.count() > 0) {
        await footer.waitFor({ state: 'visible' });
        
        await expect(footer).toHaveScreenshot('homepage-footer.png', {
          animations: 'disabled',
          threshold: 0.2,
          maxDiffPixels: 300
        });
      } else {
        // Take screenshot of bottom area
        await expect(page).toHaveScreenshot('homepage-bottom-area.png', {
          animations: 'disabled',
          threshold: 0.2,
          maxDiffPixels: 300,
          clip: { x: 0, y: -200, width: 1920, height: 200 }
        });
      }
    });
  });
});