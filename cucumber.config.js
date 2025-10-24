const { setDefaultTimeout, setWorldConstructor } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

// Set default timeout for steps (increased for web navigation)
setDefaultTimeout(30 * 1000);

// World constructor for sharing context between steps
class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.homePage = null;
    this.testData = {};
  }

  async init() {
    this.browser = await chromium.launch({ 
      headless: false, // Set to true for CI/CD
      slowMo: 300 // Slow down for better visibility
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    this.page = await this.context.newPage();
  }

  async cleanup() {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'features/step_definitions/**/*.js',
      'features/support/**/*.js'
    ],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true
  }
};