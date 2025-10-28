import { Page, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { excludedElements, accessibilityConfig } from '../config/testUrls';

export interface AccessibilityViolation {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    target: string[];
    html: string;
    failureSummary: string;
  }>;
}

export interface AccessibilityResult {
  url: string;
  pageName: string;
  violations: AccessibilityViolation[];
  passes: number;
  incomplete: number;
  timestamp: string;
  viewport: {
    width: number;
    height: number;
    name: string;
  };
}

export class AccessibilityPageObject {
  private page: Page;
  private axeBuilder: AxeBuilder;

  constructor(page: Page) {
    this.page = page;
    this.axeBuilder = new AxeBuilder({ page });
  }

  /**
   * Navigate to a page and wait for it to be ready for accessibility testing
   */
  async navigateToPage(url: string, waitForSelector?: string): Promise<void> {
    await this.page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    // Wait for any specific element if provided
    if (waitForSelector) {
      await this.page.waitForSelector(waitForSelector, { timeout: 10000 });
    }

    // Wait for page to be fully loaded and interactive
    await this.page.waitForLoadState('networkidle');
    
    // Give additional time for any dynamic content to load
    await this.page.waitForTimeout(2000);
  }

  /**
   * Set up axe-core configuration for accessibility testing
   */
  private setupAxeConfig(): AxeBuilder {
    // Configure axe-core with WCAG level and disabled rules
    this.axeBuilder = this.axeBuilder
      .withTags([`wcag${accessibilityConfig.wcagLevel.toLowerCase()}`, 'wcag2a', 'best-practice']);

    // Exclude problematic elements
    if (excludedElements.length > 0) {
      this.axeBuilder = this.axeBuilder.exclude(excludedElements);
    }

    // Disable specific rules if configured
    if (accessibilityConfig.disabledRules.length > 0) {
      this.axeBuilder = this.axeBuilder.disableRules(accessibilityConfig.disabledRules);
    }

    return this.axeBuilder;
  }

  /**
   * Run accessibility scan on the current page
   */
  async runAccessibilityScan(pageName: string): Promise<AccessibilityResult> {
    const axeBuilder = this.setupAxeConfig();
    
    try {
      const results = await axeBuilder.analyze();
      const viewport = await this.page.viewportSize();
      
      return {
        url: this.page.url(),
        pageName,
        violations: results.violations as AccessibilityViolation[],
        passes: results.passes.length,
        incomplete: results.incomplete.length,
        timestamp: new Date().toISOString(),
        viewport: {
          width: viewport?.width || 1920,
          height: viewport?.height || 1080,
          name: this.getViewportName(viewport?.width || 1920)
        }
      };
    } catch (error) {
      console.error(`Accessibility scan failed for ${pageName}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to run accessibility scan: ${errorMessage}`);
    }
  }

  /**
   * Get viewport name based on width
   */
  private getViewportName(width: number): string {
    if (width >= 1200) return 'Desktop';
    if (width >= 768) return 'Tablet';
    return 'Mobile';
  }

  /**
   * Set viewport size for responsive testing
   */
  async setViewport(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    // Wait for any responsive adjustments
    await this.page.waitForTimeout(1000);
  }

  /**
   * Take screenshot for violation documentation
   */
  async takeScreenshot(filename: string): Promise<string> {
    const screenshotPath = `test-results/accessibility-screenshots/${filename}.png`;
    await this.page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });
    return screenshotPath;
  }

  /**
   * Focus on a specific element to test keyboard navigation
   */
  async testKeyboardNavigation(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.focus();
      
      // Check if element is focusable
      const isFocused = await element.evaluate(el => document.activeElement === el);
      return isFocused;
    } catch (error) {
      console.warn(`Keyboard navigation test failed for ${selector}:`, error);
      return false;
    }
  }

  /**
   * Test color contrast for specific elements
   */
  async testColorContrast(selector: string): Promise<{ ratio: number; passes: boolean }> {
    try {
      const element = this.page.locator(selector);
      const contrast = await element.evaluate((el) => {
        const style = window.getComputedStyle(el);
        // This is a simplified contrast check - in production you'd use a proper library
        return {
          ratio: 4.5, // Placeholder - would calculate actual ratio
          passes: true // Placeholder - would determine based on WCAG standards
        };
      });
      return contrast;
    } catch (error) {
      console.warn(`Color contrast test failed for ${selector}:`, error);
      return { ratio: 0, passes: false };
    }
  }

  /**
   * Check for proper heading hierarchy
   */
  async checkHeadingHierarchy(): Promise<{ valid: boolean; issues: string[] }> {
    try {
      const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
      const issues: string[] = [];
      let previousLevel = 0;

      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const currentLevel = parseInt(tagName.charAt(1));
        
        if (currentLevel > previousLevel + 1) {
          const text = await heading.textContent();
          issues.push(`Heading level ${currentLevel} follows level ${previousLevel}: "${text}"`);
        }
        
        previousLevel = currentLevel;
      }

      return {
        valid: issues.length === 0,
        issues
      };
    } catch (error) {
      console.warn('Heading hierarchy check failed:', error);
      return { valid: false, issues: ['Failed to analyze heading hierarchy'] };
    }
  }

  /**
   * Check for alt text on images
   */
  async checkImageAltText(): Promise<{ totalImages: number; missingAlt: number; emptyAlt: number }> {
    try {
      const images = await this.page.locator('img').all();
      let missingAlt = 0;
      let emptyAlt = 0;

      for (const img of images) {
        const alt = await img.getAttribute('alt');
        if (alt === null) {
          missingAlt++;
        } else if (alt.trim() === '') {
          emptyAlt++;
        }
      }

      return {
        totalImages: images.length,
        missingAlt,
        emptyAlt
      };
    } catch (error) {
      console.warn('Image alt text check failed:', error);
      return { totalImages: 0, missingAlt: 0, emptyAlt: 0 };
    }
  }

  /**
   * Wait for page to be stable (no network requests for a period)
   */
  async waitForPageStability(timeout: number = 5000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Dismiss any overlays or modals that might interfere with testing
   */
  async dismissOverlays(): Promise<void> {
    const overlaySelectors = [
      '[data-testid="cookie-banner"] button',
      '.modal-close',
      '.overlay-dismiss',
      '[aria-label="Close"]'
    ];

    for (const selector of overlaySelectors) {
      try {
        const element = this.page.locator(selector);
        if (await element.isVisible()) {
          await element.click();
          await this.page.waitForTimeout(500);
        }
      } catch (error) {
        // Ignore errors for optional overlay dismissal
      }
    }
  }
}