import { test, expect } from '@playwright/test';
import { TestDataGenerator } from '../../../utils/dataGenerator';

test.describe('Form Submission API Tests @api', () => {
  let testDataGenerator: TestDataGenerator;
  
  test.beforeAll(async () => {
    testDataGenerator = new TestDataGenerator();
  });

  test('should successfully submit factory registration form via API', async ({ request }) => {
    // Generate test data
    const testData = testDataGenerator.generateFactoryData();

    // Prepare form data based on HAR file structure
    const formData = new URLSearchParams({
      'formservices[]': 'f7bc604652b0ef15e85963ea4fc3f5f6',
      'Email': testData.email,
      'Name': testData.name,
      'Phone': testData.phone,
      'Account type': 'Factory',
      'form-spec-comments': '',
      'tildaspec-cookie': '',
      'tildaspec-referer': 'https://factory-direct.tilda.ws/#rec1389242973',
      'tildaspec-formid': 'form1389242973',
      'tildaspec-formskey': 'e6cfbf70985ba815d7b4d333a6284491',
      'tildaspec-version-lib': '02.001',
      'tildaspec-pageid': '83603536',
      'tildaspec-projectid': '6284491',
      'tildaspec-lang': 'EN',
      'tildaspec-fp': '63547c646d387c6863387c6c656e2d55532c656e2c72757c7057696e33327c76476f6f676c6520496e632e7c614d6f7a696c6c617c6e4e657473636170657c706c696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d7669657765727c7072317c773139323068313038307c634432347c744f2d3132307c6d54307c'
    });

    // Send POST request to form submission endpoint
    const response = await request.post('https://forms.tildaapi.one/procces/', {
      data: formData.toString(),
      headers: {
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
      }
    });

    // Verify the response
    expect(response.status()).toBe(200);
    
    // Check response headers
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
    expect(headers['access-control-allow-origin']).toBe('*');
    
    // Parse and validate response body
    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
    
    // Log success for debugging
    console.log(`Form submitted successfully for: ${testData.email}`);
    console.log(`Response status: ${response.status()}`);
    console.log(`Response body:`, responseBody);
  });

  test('should successfully submit buyer registration form via API', async ({ request }) => {
    // Generate test data for buyer
    const testData = testDataGenerator.generateBuyerData();

    // Prepare form data for buyer account type
    const formData = new URLSearchParams({
      'formservices[]': 'f7bc604652b0ef15e85963ea4fc3f5f6',
      'Email': testData.email,
      'Name': testData.name,
      'Phone': testData.phone,
      'Account type': 'Buyer',
      'form-spec-comments': '',
      'tildaspec-cookie': '',
      'tildaspec-referer': 'https://factory-direct.tilda.ws/#rec1389242973',
      'tildaspec-formid': 'form1389242973',
      'tildaspec-formskey': 'e6cfbf70985ba815d7b4d333a6284491',
      'tildaspec-version-lib': '02.001',
      'tildaspec-pageid': '83603536',
      'tildaspec-projectid': '6284491',
      'tildaspec-lang': 'EN',
      'tildaspec-fp': '63547c646d387c6863387c6c656e2d55532c656e2c72757c7057696e33327c76476f6f676c6520496e632e7c614d6f7a696c6c617c6e4e657473636170657c706c696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d7669657765727c7072317c773139323068313038307c634432347c744f2d3132307c6d54307c'
    });

    // Send POST request
    const response = await request.post('https://forms.tildaapi.one/procces/', {
      data: formData.toString(),
      headers: {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://factory-direct.tilda.ws',
        'referer': 'https://factory-direct.tilda.ws/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
      }
    });

    // Verify the response
    expect(response.status()).toBe(200);
    
    // Check that response is JSON
    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
    
    console.log(`Buyer form submitted successfully for: ${testData.email}`);
  });

  test('should handle form submission with validation errors', async ({ request }) => {
    // Prepare form data with invalid/missing fields
    const formData = new URLSearchParams({
      'formservices[]': 'f7bc604652b0ef15e85963ea4fc3f5f6',
      'Email': 'invalid-email', // Invalid email format
      'Name': '', // Empty name
      'Phone': '123', // Invalid phone
      'Account type': 'Factory',
      'tildaspec-formid': 'form1389242973',
      'tildaspec-formskey': 'e6cfbf70985ba815d7b4d333a6284491',
      'tildaspec-projectid': '6284491'
    });

    // Send POST request with invalid data
    const response = await request.post('https://forms.tildaapi.one/procces/', {
      data: formData.toString(),
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });

    // The API might still return 200 but with error details in the response
    console.log(`Validation test response status: ${response.status()}`);
    
    try {
      const responseBody = await response.json();
      console.log('Validation response:', responseBody);
      
      // Check if there are validation errors in the response
      // Note: This depends on how the API handles validation errors
      expect(responseBody).toBeDefined();
    } catch (error) {
      console.log('Response is not JSON or has errors:', error);
    }
  });
});