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
    this.browser = await chromium.launch({ 
      headless: process.env.CI === 'true', // Headless in CI, headed locally
      slowMo: process.env.CI === 'true' ? 0 : 300,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true
    });
    
    this.page = await this.context.newPage();
    
    // Initialize page objects
    this.homePage = new FactoryDirectHomePage(this.page);
    this.testData = new TestDataGenerator();
  }

  async cleanup() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);

// Setup hooks
Before(async function () {
  await this.init();
});

After(async function () {
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