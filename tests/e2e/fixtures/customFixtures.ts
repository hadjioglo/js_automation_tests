import { test as base, Page, APIRequestContext } from '@playwright/test';
import { FactoryDirectHomePage } from '../pageObjects/FactoryDirectHomePage';
import { UserApiService } from '../../api/services/UserApiService';
import { TestDataGenerator } from '../../../utils/dataGenerator';
import { Logger } from '../../../utils/logger';
import testData from '../../../data/testData.json';
import users from '../../../data/users.json';

// Extend basic test to include custom fixtures
type TestFixtures = {
  homePage: FactoryDirectHomePage;
  userApiService: UserApiService;
  testDataGenerator: TestDataGenerator;
  logger: Logger;
  testData: typeof testData;
  userData: typeof users;
  authenticatedPage: Page;
  factoryUser: any;
  buyerUser: any;
  apiContext: APIRequestContext;
};

type WorkerFixtures = {
  workerStorageState: string;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Worker-scoped fixtures (shared across tests in the same worker)
  workerStorageState: [async ({ browser }, use) => {
    // Create a temporary directory for this worker's storage state
    const id = test.info().workerIndex;
    const fileName = `storage-state-${id}.json`;
    
    // Setup authentication state if needed
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Perform authentication if required
    // await page.goto('/login');
    // await page.fill('[data-testid="email"]', 'test@example.com');
    // await page.fill('[data-testid="password"]', 'password');
    // await page.click('[data-testid="login-button"]');
    
    // Save storage state
    await context.storageState({ path: fileName });
    await context.close();
    
    await use(fileName);
  }, { scope: 'worker' }],

  // Test-scoped fixtures
  logger: async ({}, use) => {
    const logger = new Logger('TestFixture');
    await use(logger);
  },

  testDataGenerator: async ({}, use) => {
    const generator = new TestDataGenerator();
    await use(generator);
  },

  testData: async ({}, use) => {
    await use(testData);
  },

  userData: async ({}, use) => {
    await use(users);
  },

  userApiService: async ({ playwright }: { playwright: any }, use: (service: UserApiService) => Promise<void>) => {
    const request = await playwright.request.newContext();
    const apiService = new UserApiService(request);
    await use(apiService);
    await request.dispose();
  },

  homePage: async ({ page }, use) => {
    const homePage = new FactoryDirectHomePage(page);
    await use(homePage);
  },

  authenticatedPage: async ({ browser, workerStorageState }, use) => {
    const context = await browser.newContext({ 
      storageState: workerStorageState 
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  factoryUser: async ({ testData }: { testData: any }, use: (user: any) => Promise<void>) => {
    const factory = testData.testUsers.factories[0];
    await use(factory);
  },

  buyerUser: async ({ testData }: { testData: any }, use: (user: any) => Promise<void>) => {
    const buyer = testData.testUsers.buyers[0];
    await use(buyer);
  },

  apiContext: async ({ request }: { request: APIRequestContext }, use: (context: APIRequestContext) => Promise<void>) => {
    // Just use the request context as is since setExtraHTTPHeaders is not available
    await use(request);
  }
});

// Custom fixture for page with specific viewport
export const mobileTest = test.extend<{ mobilePage: Page }>({
  mobilePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  }
});

// Custom fixture for API testing
export const apiTest = test.extend<{
  apiHeaders: Record<string, string>;
}>({
  apiHeaders: async ({}, use) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Factory-Direct-Test-Framework/2.0.0'
    };
    await use(headers);
  }
});

// Custom fixture for database cleanup
export const dbTest = test.extend<{ cleanup: () => Promise<void> }>({
  cleanup: async ({ userApiService }, use) => {
    const createdUsers: number[] = [];
    
    const cleanup = async () => {
      // Clean up any test data created during the test
      for (const userId of createdUsers) {
        try {
          await userApiService.deleteUser(userId);
        } catch (error) {
          console.warn(`Failed to cleanup user ${userId}:`, error);
        }
      }
    };

    await use(cleanup);
    
    // Automatic cleanup after test
    await cleanup();
  }
});

// Export expect for custom matchers
export { expect } from '@playwright/test';