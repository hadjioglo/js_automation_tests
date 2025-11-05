import { test as baseTest } from '@playwright/test';
import { ApiClientFactory, FormSubmissionClient } from '../../src';

/**
 * Extended test fixtures for API testing
 * Provides pre-configured clients and utilities
 */
export interface ApiTestFixtures {
  formSubmissionClient: FormSubmissionClient;
  prodFormClient: FormSubmissionClient;
  devFormClient: FormSubmissionClient;
  stagingFormClient: FormSubmissionClient;
}

/**
 * Test fixtures with API clients automatically configured
 */
export const test = baseTest.extend<ApiTestFixtures>({
  formSubmissionClient: async ({ request }, use) => {
    // Create environment-aware client
    const client = ApiClientFactory.createProductionFormSubmissionClient(request);
    await use(client);
  },

  prodFormClient: async ({ request }, use) => {
    const client = ApiClientFactory.createProductionFormSubmissionClient(request);
    await use(client);
  },

  devFormClient: async ({ request }, use) => {
    const client = ApiClientFactory.createDevelopmentFormSubmissionClient(request);
    await use(client);
  },

  stagingFormClient: async ({ request }, use) => {
    const client = ApiClientFactory.createStagingFormSubmissionClient(request);
    await use(client);
  }
});

export { expect } from '@playwright/test';