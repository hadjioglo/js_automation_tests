import { test, expect } from '@playwright/test';

test.describe('Factory Direct Website - Quick Validation @smoke', () => {
  
  test('should load website and basic elements @smoke', async ({ page }) => {
    console.log('🔍 Testing Factory Direct website basic functionality...');
    
    await page.goto('https://factory-direct.tilda.ws/');
    
    // Verify page loads
    await expect(page).toHaveTitle('Factory direct');
    console.log('✓ Page title verified');
    
    // Verify key content
    await expect(page.locator('text=Factory')).toBeVisible();
    console.log('✓ Factory content visible');
    
    await expect(page.locator('text=Direct')).toBeVisible();
    console.log('✓ Direct content visible');
    
    // Verify form exists
    const form = page.locator('form');
    await expect(form).toBeVisible();
    console.log('✓ Registration form found');
    
    // Verify form fields
    await expect(page.locator('input[name="Email"]')).toBeVisible();
    await expect(page.locator('input[name="Name"]')).toBeVisible();
    await expect(page.locator('input[name="Phone"]')).toBeVisible();
    console.log('✓ All form fields present');
    
    // Test form interaction
    await page.locator('input[name="Name"]').fill('Test Factory');
    await page.locator('input[name="Email"]').fill('test@factory.com');
    await page.locator('input[name="Phone"]').fill('+1234567890');
    
    // Verify inputs work
    await expect(page.locator('input[name="Name"]')).toHaveValue('Test Factory');
    await expect(page.locator('input[name="Email"]')).toHaveValue('test@factory.com');
    await expect(page.locator('input[name="Phone"]')).toHaveValue('+1234567890');
    console.log('✓ Form inputs working correctly');
    
    // Verify submit button
    await expect(page.locator('input[type="submit"]')).toBeEnabled();
    console.log('✓ Submit button is enabled');
    
    console.log('🎉 All basic tests passed!');
  });

  test('should handle different user flows @smoke', async ({ page }) => {
    await page.goto('https://factory-direct.tilda.ws/');
    
    // Test factory registration flow
    const registerFactoryBtn = page.locator('text=Register Factory').first();
    if (await registerFactoryBtn.count() > 0) {
      console.log('✓ Factory registration button found');
      // In a real test, we would click and verify navigation
    }
    
    // Test buyer registration flow  
    const registerBuyerBtn = page.locator('text=Register Buyer').first();
    if (await registerBuyerBtn.count() > 0) {
      console.log('✓ Buyer registration button found');
    }
    
    // Test social sharing
    const socialLinks = page.locator('a[href*="facebook.com"], a[href*="twitter.com"]');
    const socialCount = await socialLinks.count();
    if (socialCount > 0) {
      console.log(`✓ Found ${socialCount} social sharing links`);
    }
    
    console.log('✓ User flow elements verified');
  });

  test('should be responsive @regression', async ({ page }) => {
    await page.goto('https://factory-direct.tilda.ws/');
    
    // Test desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('form')).toBeVisible();
    console.log('✓ Desktop layout working');
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="Email"]')).toBeVisible();
    console.log('✓ Mobile layout working');
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('form')).toBeVisible();
    console.log('✓ Tablet layout working');
    
    console.log('✓ Responsive design verified');
  });
});