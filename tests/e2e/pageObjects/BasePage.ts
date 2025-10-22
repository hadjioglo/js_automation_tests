import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../../../utils/logger';

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly logger: Logger;
  protected readonly baseUrl: string;

  constructor(page: Page, baseUrl: string = '') {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
    this.baseUrl = baseUrl;
  }

  // Navigation methods
  async goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    this.logger.info(`Navigating to: ${fullUrl}`);
    await this.page.goto(fullUrl, { waitUntil: 'networkidle', ...options });
  }

  async reload(): Promise<void> {
    this.logger.info('Reloading page');
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  async goBack(): Promise<void> {
    this.logger.info('Going back');
    await this.page.goBack({ waitUntil: 'networkidle' });
  }

  // Wait methods
  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  async waitForSelector(selector: string, options?: { timeout?: number; state?: 'attached' | 'detached' | 'visible' | 'hidden' }): Promise<Locator> {
    await this.page.waitForSelector(selector, { timeout: 10000, ...options });
    return this.page.locator(selector);
  }

  async waitForTimeout(timeout: number): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }

  // Element interaction methods
  async click(locator: string | Locator, options?: { timeout?: number; force?: boolean }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.info(`Clicking element: ${typeof locator === 'string' ? locator : 'locator'}`);
    await element.click({ timeout: 10000, ...options });
  }

  async fill(locator: string | Locator, value: string, options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.info(`Filling element with value: ${value}`);
    await element.fill(value, { timeout: 10000, ...options });
  }

  async type(locator: string | Locator, text: string, options?: { delay?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.info(`Typing in element: ${text}`);
    await element.type(text, { delay: 50, ...options });
  }

  async selectOption(locator: string | Locator, value: string | string[]): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.info(`Selecting option: ${value}`);
    await element.selectOption(value);
  }

  // Assertion methods
  async expectTitle(expected: string | RegExp): Promise<void> {
    this.logger.info(`Expecting title: ${expected}`);
    await expect(this.page).toHaveTitle(expected);
  }

  async expectUrl(expected: string | RegExp): Promise<void> {
    this.logger.info(`Expecting URL: ${expected}`);
    await expect(this.page).toHaveURL(expected);
  }

  async expectElementVisible(locator: string | Locator): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element).toBeVisible();
  }

  async expectElementHidden(locator: string | Locator): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element).toBeHidden();
  }

  async expectElementText(locator: string | Locator, expected: string | RegExp): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element).toHaveText(expected);
  }

  async expectElementValue(locator: string | Locator, expected: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element).toHaveValue(expected);
  }

  // Utility methods
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getText(locator: string | Locator): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.textContent() || '';
  }

  async getValue(locator: string | Locator): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.inputValue();
  }

  async isVisible(locator: string | Locator): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isVisible();
  }

  async isEnabled(locator: string | Locator): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isEnabled();
  }

  async getElementCount(locator: string): Promise<number> {
    return await this.page.locator(locator).count();
  }

  // Screenshot methods
  async takeScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `${this.constructor.name}_${Date.now()}`;
    this.logger.info(`Taking screenshot: ${screenshotName}`);
    return await this.page.screenshot({ 
      path: `test-results/screenshots/${screenshotName}.png`,
      fullPage: true 
    });
  }

  // Scroll methods
  async scrollToElement(locator: string | Locator): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.scrollIntoViewIfNeeded();
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  // Abstract method to be implemented by child classes
  abstract isPageLoaded(): Promise<boolean>;
}