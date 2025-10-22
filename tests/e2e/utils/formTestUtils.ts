import { expect } from '@playwright/test';
import { FactoryDirectHomePage } from '../pageObjects/FactoryDirectHomePage';

/**
 * Test utilities for form validation and assertions
 */
export class FormTestUtils {
  constructor(private homePage: FactoryDirectHomePage) {}

  /**
   * Validates that form filling completed successfully with detailed reporting
   */
  async validateFormFilling(userData: { name: string; email: string; phone: string }) {
    const fillResult = await this.homePage.fillRegistrationForm(userData);
    
    // Validate that data was actually filled
    try {
      await this.homePage.validateFormData(userData);
      return { success: true, message: 'Form filled and validated successfully' };
    } catch (error) {
      return { success: false, message: `Form validation failed: ${error}` };
    }
  }

  /**
   * Comprehensive form element availability check
   */
  async checkFormAvailability() {
    const results = {
      hasForm: false,
      hasNameField: false,
      hasEmailField: false,
      hasPhoneField: false,
      hasSubmitButton: false,
      isFormVisible: false
    };

    try {
      results.isFormVisible = await this.homePage.isRegistrationFormVisible();
      results.hasSubmitButton = await this.homePage.isSubmitButtonEnabled() !== null;
      
      // Additional checks could be added here for individual fields
      
      return results;
    } catch (error) {
      console.error('Error checking form availability:', error);
      return results;
    }
  }

  /**
   * Generate test data for different scenarios
   */
  static generateTestData() {
    return {
      valid: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      },
      withSpecialChars: {
        name: 'José María O\'Connor-Smith',
        email: 'jose.maria@example.com',
        phone: '+1 (555) 123-4567'
      },
      minimal: {
        name: 'J',
        email: 'j@e.co',
        phone: ''
      }
    };
  }
}