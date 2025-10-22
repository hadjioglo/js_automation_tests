import { test, expect } from '@playwright/test';

test('basic page title test', async ({ page }) => {
  await page.goto('https://factory-direct.tilda.ws/');
  await expect(page).toHaveTitle(/Factory Direct/i);
});
