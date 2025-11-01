// World setup and global hooks
const { setWorldConstructor, Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const { FactoryDirectHomePage, TestDataGenerator } = require('./page-objects');

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.homePage = null;
    this.testData = null;
    this.lastFormData = null;
    this.lastEmailEntered = null;
  }

  async init() {
    // Improved browser configuration following best practices
    const browserOptions = {
      headless: process.env.CI === 'true',
      slowMo: process.env.CI === 'true' ? 0 : 300,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Prevents crashes in Docker
        '--disable-gpu',
        '--no-first-run',
        '--disable-extensions'
      ]
    };

    this.browser = await chromium.launch(browserOptions);
    
    // Enhanced context with better defaults
    const contextOptions = {
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true,
      acceptDownloads: false, // Security best practice
      bypassCSP: false,       // Don't bypass security by default
      locale: 'en-US',
      timezoneId: 'UTC',      // Consistent timezone for CI
      permissions: [],        // Explicit permissions
      geolocation: undefined, // Don't grant location access
      colorScheme: 'light'
    };
    
    this.context = await this.browser.newContext(contextOptions);
    
    // Add error handling and console logging
    this.page = await this.context.newPage();
    
    // Best practice: Listen for console errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Page console error: ${msg.text()}`);
      }
    });
    
    // Best practice: Listen for page errors
    this.page.on('pageerror', error => {
      console.log(`Page error: ${error.message}`);
    });
    
    // Initialize page objects
    this.homePage = new FactoryDirectHomePage(this.page);
    this.testData = new TestDataGenerator();
  }

  async cleanup() {
    try {
      // Best practice: Close resources in proper order
      if (this.page && !this.page.isClosed()) {
        await this.page.close();
      }
      if (this.context) {
        await this.context.close();
      }
      if (this.browser && this.browser.isConnected()) {
        await this.browser.close();
      }
    } catch (error) {
      console.error('Error during cleanup:', error.message);
      // Don't throw error during cleanup to avoid masking test failures
    }
  }
}

setWorldConstructor(CustomWorld);

// Setup hooks with proper error handling
Before(async function () {
  try {
    await this.init();
  } catch (error) {
    console.error('Failed to initialize browser:', error.message);
    throw new Error(`Browser initialization failed: ${error.message}`);
  }
});

After(async function (scenario) {
  // Best practice: Capture screenshot on failure
  if (scenario.result.status === 'FAILED' && this.page && !this.page.isClosed()) {
    try {
      const screenshot = await this.page.screenshot({
        path: `reports/screenshots/failed-${Date.now()}.png`,
        fullPage: true
      });
      // Attach to Cucumber report if using @cucumber/cucumber
      if (this.attach) {
        this.attach(screenshot, 'image/png');
      }
    } catch (screenshotError) {
      console.warn('Failed to capture screenshot:', screenshotError.message);
    }
  }
  
  await this.cleanup();
});

// Global setup
BeforeAll(async function () {
  console.log('🥒 Starting Cucumber tests...');
});

AfterAll(async function () {
  console.log('🥒 Cucumber tests completed!');
});

module.exports = CustomWorld;