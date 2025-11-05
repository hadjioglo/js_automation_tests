import { test, expect } from '@playwright/test';

/**
 * Simplified Form Submission API Tests demonstrating best practices
 * 
 * This test file showcases:
 * - Proper test organization
 * - Arrange, Act, Assert pattern  
 * - Environment configuration
 * - Data validation
 * - Error handling
 * - Performance testing
 */
test.describe('Form Submission API Tests @api', () => {
  
  // Test configuration
  const BASE_URL = 'https://forms.tildaapi.one';
  const FORM_ENDPOINT = '/procces/';
  const TIMEOUT = 30000;

  // Form metadata (based on real Tilda form)
  const FORM_METADATA = {
    formservices: 'f7bc604652b0ef15e85963ea4fc3f5f6',
    formId: 'form1389242973',
    formsKey: 'e6cfbf70985ba815d7b4d333a6284491',
    versionLib: '02.001',
    pageId: '83603536',
    projectId: '6284491',
    language: 'EN',
    fingerprint: '63547c646d387c6863387c6c656e2d55532c656e2c72757c7057696e33327c76476f6f676c6520496e632e7c614d6f7a696c6c617c6e4e657473636170657c706c696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d7669657765727c7072317c773139323068313038307c634432347c744f2d3132307c6d54307c',
    referer: 'https://factory-direct.tilda.ws/#rec1389242973'
  };

  // Helper function to generate test data (Builder pattern concept)
  function createTestUser(accountType: 'Factory' | 'Buyer', customData?: any) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    
    return {
      email: `test.${accountType.toLowerCase()}.${timestamp}.${random}@example.com`,
      name: `Test ${accountType} Company ${random}`,
      phone: `+1555${String(Math.floor(Math.random() * 900000) + 100000)}`,
      accountType,
      comments: '',
      ...customData
    };
  }

  // Helper function to build form data (Factory pattern concept)
  function buildFormData(userData: any) {
    return new URLSearchParams({
      'formservices[]': FORM_METADATA.formservices,
      'Email': userData.email,
      'Name': userData.name,
      'Phone': userData.phone,
      'Account type': userData.accountType,
      'form-spec-comments': userData.comments || '',
      'tildaspec-cookie': '',
      'tildaspec-referer': FORM_METADATA.referer,
      'tildaspec-formid': FORM_METADATA.formId,
      'tildaspec-formskey': FORM_METADATA.formsKey,
      'tildaspec-version-lib': FORM_METADATA.versionLib,
      'tildaspec-pageid': FORM_METADATA.pageId,
      'tildaspec-projectid': FORM_METADATA.projectId,
      'tildaspec-lang': FORM_METADATA.language,
      'tildaspec-fp': FORM_METADATA.fingerprint
    });
  }

  // Helper function for consistent headers (Service pattern concept)
  function getFormHeaders() {
    return {
      'accept': 'application/json, text/javascript, */*; q=0.01',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9,ru;q=0.8',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'origin': 'https://factory-direct.tilda.ws',
      'pragma': 'no-cache',
      'referer': 'https://factory-direct.tilda.ws/',
      'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
    };
  }

  test.describe('Factory Registration Tests', () => {
    
    test('should successfully submit factory registration form', async ({ request }) => {
      // Arrange: Create test data using helper
      const factoryUser = createTestUser('Factory');
      const formData = buildFormData(factoryUser);
      const headers = getFormHeaders();

      // Act: Submit form
      const response = await request.post(`${BASE_URL}${FORM_ENDPOINT}`, {
        data: formData.toString(),
        headers,
        timeout: TIMEOUT
      });

      // Assert: Validate response
      expect(response.status()).toBe(200);
      
      // Validate headers
      const responseHeaders = response.headers();
      expect(responseHeaders['content-type']).toContain('application/json');
      expect(responseHeaders['access-control-allow-origin']).toBe('*');
      
      // Validate response body
      const responseBody = await response.json();
      expect(responseBody).toBeDefined();
      
      // Log success for monitoring
      console.log(`✅ Factory registration successful for: ${factoryUser.email}`);
      console.log(`📊 Response status: ${response.status()}`);
    });

    test('should handle factory registration with custom company data', async ({ request }) => {
      // Arrange: Create custom factory data
      const customFactoryUser = createTestUser('Factory', {
        name: 'Advanced Manufacturing Solutions Inc',
        comments: 'Specialized in precision manufacturing'
      });
      
      const formData = buildFormData(customFactoryUser);
      const headers = getFormHeaders();

      // Act: Submit form
      const response = await request.post(`${BASE_URL}${FORM_ENDPOINT}`, {
        data: formData.toString(),
        headers,
        timeout: TIMEOUT
      });

      // Assert: Validate successful submission
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
      
      const responseBody = await response.json();
      expect(responseBody).toBeDefined();
      
      console.log(`✅ Custom factory registration successful`);
    });
  });

  test.describe('Buyer Registration Tests', () => {
    
    test('should successfully submit buyer registration form', async ({ request }) => {
      // Arrange: Create buyer test data
      const buyerUser = createTestUser('Buyer');
      const formData = buildFormData(buyerUser);
      const headers = getFormHeaders();

      // Act: Submit form
      const response = await request.post(`${BASE_URL}${FORM_ENDPOINT}`, {
        data: formData.toString(),
        headers,
        timeout: TIMEOUT
      });

      // Assert: Validate response
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
      
      const responseBody = await response.json();
      expect(responseBody).toBeDefined();
      
      console.log(`✅ Buyer registration successful for: ${buyerUser.email}`);
    });

    test('should handle buyer registration with procurement details', async ({ request }) => {
      // Arrange: Create specialized buyer data
      const procurementBuyer = createTestUser('Buyer', {
        name: 'Global Procurement Network LLC',
        comments: 'Looking for electronics manufacturing partners'
      });
      
      const formData = buildFormData(procurementBuyer);
      const headers = getFormHeaders();

      // Act: Submit form
      const response = await request.post(`${BASE_URL}${FORM_ENDPOINT}`, {
        data: formData.toString(),
        headers,
        timeout: TIMEOUT
      });

      // Assert: Validate response
      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      expect(responseBody).toBeDefined();
      
      console.log(`✅ Procurement buyer registration successful`);
    });
  });

  test.describe('Data Validation Tests', () => {
    
    test('should validate required fields are present', async () => {
      // Arrange: Create test data
      const userData = createTestUser('Factory');

      // Act & Assert: Validate required fields
      expect(userData.email).toBeTruthy();
      expect(userData.name).toBeTruthy();
      expect(userData.phone).toBeTruthy();
      expect(userData.accountType).toBeTruthy();
      
      // Validate email format
      expect(userData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      
      // Validate phone format
      expect(userData.phone).toMatch(/^\+1\d{10}$/);
      
      // Validate account type
      expect(['Factory', 'Buyer']).toContain(userData.accountType);
    });

    test('should generate unique test data for each test run', async () => {
      // Arrange: Create multiple users
      const user1 = createTestUser('Factory');
      const user2 = createTestUser('Factory');
      const user3 = createTestUser('Buyer');

      // Act & Assert: Ensure uniqueness
      expect(user1.email).not.toBe(user2.email);
      expect(user1.name).not.toBe(user2.name);
      expect(user2.email).not.toBe(user3.email);
      
      // Validate consistent format
      expect(user1.email).toContain('factory');
      expect(user3.email).toContain('buyer');
    });
  });

  test.describe('Performance and Reliability Tests', () => {
    
    test('should complete form submission within acceptable time', async ({ request }) => {
      // Arrange: Prepare test data and timing
      const userData = createTestUser('Factory');
      const formData = buildFormData(userData);
      const headers = getFormHeaders();
      
      const startTime = Date.now();

      // Act: Submit form
      const response = await request.post(`${BASE_URL}${FORM_ENDPOINT}`, {
        data: formData.toString(),
        headers,
        timeout: TIMEOUT
      });
      
      const duration = Date.now() - startTime;

      // Assert: Validate response and performance
      expect(response.status()).toBe(200);
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
      
      console.log(`⏱️ Form submission completed in ${duration}ms`);
    });

    test('should handle multiple concurrent submissions', async ({ request }) => {
      // Arrange: Create multiple test users
      const users = [
        createTestUser('Factory'),
        createTestUser('Buyer'),
        createTestUser('Factory')
      ];

      const headers = getFormHeaders();

      // Act: Submit all forms concurrently
      const promises = users.map(user => {
        const formData = buildFormData(user);
        return request.post(`${BASE_URL}${FORM_ENDPOINT}`, {
          data: formData.toString(),
          headers,
          timeout: TIMEOUT
        });
      });

      const responses = await Promise.all(promises);

      // Assert: All submissions should succeed
      responses.forEach((response, index) => {
        expect(response.status()).toBe(200);
        console.log(`✅ Concurrent submission ${index + 1} successful`);
      });
    });
  });

  test.describe('Error Handling Tests', () => {
    
    test('should handle malformed data gracefully', async ({ request }) => {
      // Arrange: Create incomplete form data
      const incompleteData = new URLSearchParams({
        'formservices[]': FORM_METADATA.formservices,
        'Email': 'incomplete-test',
        // Missing required fields intentionally
      });

      const headers = getFormHeaders();

      // Act: Submit incomplete form
      const response = await request.post(`${BASE_URL}${FORM_ENDPOINT}`, {
        data: incompleteData.toString(),
        headers,
        timeout: TIMEOUT
      });

      // Assert: Should handle gracefully (may return error or success depending on server validation)
      expect([200, 400, 422]).toContain(response.status());
      
      console.log(`📝 Incomplete data handling test - Status: ${response.status()}`);
    });
  });

  test.describe('Environment Configuration Tests', () => {
    
    test('should work with environment-specific configuration', async ({ request }) => {
      // Arrange: Get environment from environment variable
      const testEnv = process.env.TEST_ENV || 'production';
      const userData = createTestUser('Factory', {
        name: `${testEnv} Test Factory`
      });
      
      const formData = buildFormData(userData);
      const headers = getFormHeaders();

      // Act: Submit form
      const response = await request.post(`${BASE_URL}${FORM_ENDPOINT}`, {
        data: formData.toString(),
        headers,
        timeout: TIMEOUT
      });

      // Assert: Should work regardless of environment
      expect(response.status()).toBe(200);
      
      console.log(`🌍 Environment ${testEnv} test successful`);
    });
  });
});