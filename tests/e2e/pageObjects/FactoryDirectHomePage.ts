import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FactoryDirectHomePage extends BasePage {
  // Locators
  private readonly emailInput: Locator;
  private readonly nameInput: Locator;
  private readonly phoneInput: Locator;
  private readonly accountTypeSelect: Locator;
  private readonly submitButton: Locator;
  private readonly registerFactoryButton: Locator;
  private readonly registerBuyerButton: Locator;
  private readonly facebookShareButton: Locator;
  private readonly twitterShareButton: Locator;
  private readonly heroTitle: Locator;
  private readonly registrationForm: Locator;

  constructor(page: Page) {
    super(page, 'https://factory-direct.tilda.ws');
    
    // Initialize locators
    this.emailInput = this.page.locator('input[name="Email"]');
    this.nameInput = this.page.locator('input[name="Name"]');
    this.phoneInput = this.page.locator('input[name="Phone"]');
    this.accountTypeSelect = this.page.locator('select[name="Account type"]');
    this.submitButton = this.page.locator('input[type="submit"]');
    this.registerFactoryButton = this.page.locator('text=Register Factory').first();
    this.registerBuyerButton = this.page.locator('text=Register Buyer').first();
    this.facebookShareButton = this.page.locator('a[href*="facebook.com"]');
    this.twitterShareButton = this.page.locator('a[href*="twitter.com"]');
    this.heroTitle = this.page.locator('.t182__title').first();
    this.registrationForm = this.page.locator('form');
  }

  // Navigation methods
  async navigateToHomePage(): Promise<void> {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  private async waitForPageLoad(): Promise<void> {
    await this.registrationForm.waitFor({ state: 'visible' });
    await this.waitForLoadState();
  }

  // Registration form methods
  async fillRegistrationForm(userData: {
    name: string;
    email: string;
    phone: string;
    accountType?: 'Factory' | 'Buyer';
  }): Promise<void> {
    this.logger.step('Filling registration form');
    
    await this.fill(this.nameInput, userData.name);
    await this.fill(this.emailInput, userData.email);
    await this.fill(this.phoneInput, userData.phone);
    
    if (userData.accountType) {
      await this.selectAccountType(userData.accountType);
    }
    
    this.logger.success('Registration form filled successfully');
  }

  async selectAccountType(accountType: 'Factory' | 'Buyer'): Promise<void> {
    this.logger.step(`Selecting account type: ${accountType}`);
    await this.selectOption(this.accountTypeSelect, accountType);
  }

  async submitRegistrationForm(): Promise<void> {
    this.logger.step('Submitting registration form');
    await this.click(this.submitButton);
  }

  async clickRegisterFactory(): Promise<void> {
    this.logger.step('Clicking Register Factory button');
    if (await this.registerFactoryButton.isVisible()) {
      await this.click(this.registerFactoryButton);
      await this.scrollToElement(this.registrationForm);
    }
  }

  async clickRegisterBuyer(): Promise<void> {
    this.logger.step('Clicking Register Buyer button');
    if (await this.registerBuyerButton.isVisible()) {
      await this.click(this.registerBuyerButton);
      await this.scrollToElement(this.registrationForm);
    }
  }

  // Social sharing methods
  async shareOnFacebook(): Promise<void> {
    this.logger.step('Sharing on Facebook');
    await this.click(this.facebookShareButton);
  }

  async shareOnTwitter(): Promise<void> {
    this.logger.step('Sharing on Twitter');
    await this.click(this.twitterShareButton);
  }

  // Validation methods
  async validateHomePage(): Promise<void> {
    await this.expectTitle('Factory direct');
    await this.expectElementVisible(this.heroTitle);
    await this.expectElementVisible(this.registrationForm);
  }

  async validateRegistrationForm(): Promise<void> {
    await this.expectElementVisible(this.emailInput);
    await this.expectElementVisible(this.nameInput);
    await this.expectElementVisible(this.phoneInput);
    await this.expectElementVisible(this.accountTypeSelect);
    await this.expectElementVisible(this.submitButton);
  }

  async validateFormData(expectedData: {
    name: string;
    email: string;
    phone: string;
  }): Promise<void> {
    await this.expectElementValue(this.nameInput, expectedData.name);
    await this.expectElementValue(this.emailInput, expectedData.email);
    await this.expectElementValue(this.phoneInput, expectedData.phone);
  }

  async isSubmitButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.submitButton);
  }

  async isRegistrationFormVisible(): Promise<boolean> {
    return await this.isVisible(this.registrationForm);
  }

  // Content validation methods
  async validateKeyContent(): Promise<void> {
    await this.expectElementText(this.heroTitle, /Factory Direct/i);
    
    // Validate key messaging
    const keyMessages = [
      'buy directly from Factories',
      'Find trusted manufacturer',
      'order batches without intermediaries',
      'save margins'
    ];

    for (const message of keyMessages) {
      await this.expectElementVisible(this.page.locator(`text=${message}`).first());
    }
  }

  async validateSocialSharingButtons(): Promise<void> {
    if (await this.facebookShareButton.count() > 0) {
      await this.expectElementVisible(this.facebookShareButton);
    }
    if (await this.twitterShareButton.count() > 0) {
      await this.expectElementVisible(this.twitterShareButton);
    }
  }

  // Utility methods
  async getFormFieldErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    try {
      const nameValidation = await this.nameInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      if (nameValidation) errors.push(`Name: ${nameValidation}`);
    } catch (e) {
      // Ignore if element is not found
    }

    try {
      const emailValidation = await this.emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      if (emailValidation) errors.push(`Email: ${emailValidation}`);
    } catch (e) {
      // Ignore if element is not found
    }

    try {
      const phoneValidation = await this.phoneInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      if (phoneValidation) errors.push(`Phone: ${phoneValidation}`);
    } catch (e) {
      // Ignore if element is not found
    }

    return errors;
  }

  async clearForm(): Promise<void> {
    this.logger.step('Clearing registration form');
    await this.fill(this.nameInput, '');
    await this.fill(this.emailInput, '');
    await this.fill(this.phoneInput, '');
  }

  // Implementation of abstract method
  async isPageLoaded(): Promise<boolean> {
    try {
      await this.registrationForm.waitFor({ state: 'visible', timeout: 5000 });
      return await this.registrationForm.isVisible();
    } catch {
      return false;
    }
  }
}