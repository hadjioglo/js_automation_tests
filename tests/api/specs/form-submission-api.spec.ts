import { test, expect } from '@playwright/test';
import { 
  ApiClientFactory,
  UserFormDataBuilder,
  FormSubmissionClient,
  UserFormData,
  FormSubmissionResponse 
} from '../../../src';

/**
 * Form Submission API Tests
 * Testing Factory Direct form submissions using best practices:
 * - Service/Client Pattern
 * - Builder Pattern  
 * - Factory Pattern
 * - DTOs for type safety
 * - Proper separation of concerns
 */
test.describe('Form Submission API Tests @api', () => {
  let formClient: FormSubmissionClient;

  test.beforeEach(async ({ request }) => {
    // Arrange: Create client using Factory pattern
    formClient = ApiClientFactory.createProductionFormSubmissionClient(request);
  });

  test.describe('Factory Registration Form Submission', () => {
    
    test('should successfully submit factory registration with valid data', async () => {
      // Arrange: Build test data using Builder pattern
      const factoryUserData: UserFormData = UserFormDataBuilder
        .createFactory()
        .withRandomEmail()
        .withRandomName()
        .withRandomPhone()
        .build();

      // Act: Submit form using Service/Client pattern
      const response = await formClient.submitForm(factoryUserData);

      // Assert: Validate successful submission
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.data).toBeDefined();
      
      console.log(`✅ Factory registration successful for: ${factoryUserData.email}`);
    });

    test('should successfully submit factory registration with custom data', async () => {
      // Arrange: Build custom test data
      const customFactoryData: UserFormData = UserFormDataBuilder
        .create()
        .withEmail('custom.factory.test@example.com')
        .withName('Custom Manufacturing Corp')
        .withPhone('+15551234567')
        .withAccountType('Factory')
        .withComments('Custom test comments')
        .build();

      // Act: Submit form
      const response = await formClient.submitForm(customFactoryData);

      // Assert: Validate successful submission
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      
      console.log(`✅ Custom factory registration successful`);
    });

    test('should handle factory registration with minimal required fields', async () => {
      // Arrange: Create minimal valid data
      const minimalFactoryData: UserFormData = UserFormDataBuilder
        .create()
        .withEmail(`minimal.factory.${Date.now()}@example.com`)
        .withName('Minimal Factory')
        .withPhone('+15557654321')
        .withAccountType('Factory')
        .build();

      // Act: Submit form
      const response = await formClient.submitForm(minimalFactoryData);

      // Assert: Validate response
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      
      console.log(`✅ Minimal factory registration successful`);
    });
  });

  test.describe('Buyer Registration Form Submission', () => {
    
    test('should successfully submit buyer registration with valid data', async () => {
      // Arrange: Build buyer data using Builder pattern
      const buyerUserData: UserFormData = UserFormDataBuilder
        .createBuyer()
        .withRandomEmail()
        .withRandomName()
        .withRandomPhone()
        .build();

      // Act: Submit form
      const response = await formClient.submitForm(buyerUserData);

      // Assert: Comprehensive validation
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.data).toBeDefined();
      
      console.log(`✅ Buyer registration successful for: ${buyerUserData.email}`);
    });

    test('should successfully submit buyer registration with custom data', async () => {
      // Arrange: Build custom buyer data
      const customBuyerData: UserFormData = UserFormDataBuilder
        .create()
        .withEmail('custom.buyer.test@example.com')
        .withName('Custom Procurement Inc')
        .withPhone('+15559876543')
        .withAccountType('Buyer')
        .withComments('Custom buyer test')
        .build();

      // Act: Submit form
      const response = await formClient.submitForm(customBuyerData);

      // Assert: Validate successful submission
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      
      console.log(`✅ Custom buyer registration successful`);
    });
  });

  test.describe('Form Validation Tests', () => {
    
    test('should validate form data before submission - valid data', async () => {
      // Arrange: Valid user data
      const validData: UserFormData = UserFormDataBuilder
        .createFactory()
        .build();

      // Act: Validate data
      const isValid = await formClient.validateFormData(validData);

      // Assert: Should be valid
      expect(isValid).toBe(true);
    });

    test('should detect invalid email during validation', async () => {
      // Arrange: Invalid email data
      const invalidEmailData: UserFormData = UserFormDataBuilder
        .createFactory()
        .withInvalidEmail()
        .build();

      // Act: Validate data
      const isValid = await formClient.validateFormData(invalidEmailData);

      // Assert: Should be invalid
      expect(isValid).toBe(false);
    });

    test('should detect empty email during validation', async () => {
      // Arrange: Empty email data
      const emptyEmailData: UserFormData = UserFormDataBuilder
        .createFactory()
        .withEmptyEmail()
        .build();

      // Act: Validate data  
      const isValid = await formClient.validateFormData(emptyEmailData);

      // Assert: Should be invalid
      expect(isValid).toBe(false);
    });

    test('should detect invalid phone during validation', async () => {
      // Arrange: Invalid phone data
      const invalidPhoneData: UserFormData = UserFormDataBuilder
        .createBuyer()
        .withInvalidPhone()
        .build();

      // Act: Validate data
      const isValid = await formClient.validateFormData(invalidPhoneData);

      // Assert: Should be invalid
      expect(isValid).toBe(false);
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    
    test('should handle network timeout gracefully', async ({ request }) => {
      // Arrange: Create client with short timeout
      const shortTimeoutClient = ApiClientFactory.createCustomFormSubmissionClient(request, {
        timeout: 1, // 1ms timeout to force failure
        retries: 0
      });

      const userData: UserFormData = UserFormDataBuilder
        .createFactory()
        .build();

      // Act & Assert: Should handle timeout
      await expect(shortTimeoutClient.submitForm(userData)).rejects.toThrow();
    });

    test('should retry failed requests', async ({ request }) => {
      // Arrange: Create client with retry configuration
      const retryClient = ApiClientFactory.createCustomFormSubmissionClient(request, {
        retries: 2,
        timeout: 30000
      });

      const userData: UserFormData = UserFormDataBuilder
        .createBuyer()
        .build();

      // Act: Submit form (should succeed even with retries configured)
      const response = await retryClient.submitForm(userData);

      // Assert: Should eventually succeed
      expect(response.success).toBe(true);
    });
  });

  test.describe('Environment Configuration Tests', () => {
    
    test('should work with development environment client', async ({ request }) => {
      // Arrange: Create development environment client
      const devClient = ApiClientFactory.createDevelopmentFormSubmissionClient(request);
      
      const userData: UserFormData = UserFormDataBuilder
        .createFactory()
        .build();

      // Act: Submit using dev client
      const response = await devClient.submitForm(userData);

      // Assert: Should work same as production
      expect(response.success).toBe(true);
      expect(response.status).toBe(200);
    });

    test('should allow form metadata inspection', async () => {
      // Arrange: Get form metadata
      const metadata = formClient.getFormMetadata();

      // Assert: Validate metadata structure
      expect(metadata).toHaveProperty('formId');
      expect(metadata).toHaveProperty('formsKey');
      expect(metadata).toHaveProperty('versionLib');
      expect(metadata).toHaveProperty('pageId');
      expect(metadata).toHaveProperty('projectId');
      expect(metadata).toHaveProperty('language');
      expect(metadata).toHaveProperty('fingerprint');
      expect(metadata).toHaveProperty('referer');
      
      // Validate specific values
      expect(metadata.formId).toBe('form1389242973');
      expect(metadata.language).toBe('EN');
      expect(metadata.referer).toContain('factory-direct.tilda.ws');
    });
  });

  test.describe('Performance and Response Time Tests', () => {
    
    test('should complete form submission within acceptable time', async () => {
      // Arrange: Track timing
      const userData: UserFormData = UserFormDataBuilder
        .createFactory()
        .build();

      const startTime = Date.now();

      // Act: Submit form
      const response = await formClient.submitForm(userData);
      
      const duration = Date.now() - startTime;

      // Assert: Validate response time (should be under 10 seconds)
      expect(response.success).toBe(true);
      expect(duration).toBeLessThan(10000);
      
      console.log(`⏱️ Form submission completed in ${duration}ms`);
    });
  });
});