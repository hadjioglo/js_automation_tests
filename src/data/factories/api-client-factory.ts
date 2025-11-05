import { APIRequestContext } from '@playwright/test';
import { FormSubmissionClient } from '../../clients/form-submission-client';
import { EnvironmentConfig } from '../models/config.dto';
import { FormMetadata } from '../models/form-submission.dto';

/**
 * Factory pattern for creating API clients
 * Centralizes client instantiation and configuration
 */
export class ApiClientFactory {
  private static readonly DEFAULT_CONFIG: EnvironmentConfig = {
    name: 'default',
    baseUrl: 'https://forms.tildaapi.one',
    formSubmissionUrl: 'https://forms.tildaapi.one/procces/',
    timeout: 60000,
    retries: 3,
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
    },
    metadata: {
      formservices: 'f7bc604652b0ef15e85963ea4fc3f5f6',
      formId: 'form1389242973',
      formsKey: 'e6cfbf70985ba815d7b4d333a6284491',
      versionLib: '02.001',
      pageId: '83603536',
      projectId: '6284491',
      language: 'EN',
      fingerprint: '63547c646d387c6863387c6c656e2d55532c656e2c72757c7057696e33327c76476f6f676c6520496e632e7c614d6f7a696c6c617c6e4e657473636170657c706c696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d7669657765727c7072317c773139323068313038307c634432347c744f2d3132307c6d54307c',
      referer: 'https://factory-direct.tilda.ws/#rec1389242973'
    }
  };

  private static environmentConfigs: Map<string, EnvironmentConfig> = new Map([
    ['production', ApiClientFactory.DEFAULT_CONFIG],
    ['staging', {
      ...ApiClientFactory.DEFAULT_CONFIG,
      name: 'staging',
      // In real scenario, you'd have different staging URLs
      baseUrl: 'https://forms.tildaapi.one'
    }],
    ['development', {
      ...ApiClientFactory.DEFAULT_CONFIG,
      name: 'development',
      // In real scenario, you'd have different dev URLs
      baseUrl: 'https://forms.tildaapi.one',
      timeout: 60000, // Longer timeout for development
      retries: 1
    }]
  ]);

  /**
   * Creates a FormSubmissionClient for the specified environment
   */
  static createFormSubmissionClient(
    request: APIRequestContext,
    environment: string = 'production',
    customConfig?: Partial<EnvironmentConfig>
  ): FormSubmissionClient {
    const config = this.getEnvironmentConfig(environment, customConfig);
    
    const formMetadata: FormMetadata = {
      formId: config.metadata.formId,
      formsKey: config.metadata.formsKey,
      versionLib: config.metadata.versionLib,
      pageId: config.metadata.pageId,
      projectId: config.metadata.projectId,
      language: config.metadata.language,
      fingerprint: config.metadata.fingerprint,
      referer: config.metadata.referer
    };

    return new FormSubmissionClient(request, config.baseUrl, formMetadata, config.timeout);
  }

  /**
   * Creates a client for production environment
   */
  static createProductionFormSubmissionClient(request: APIRequestContext): FormSubmissionClient {
    return this.createFormSubmissionClient(request, 'production');
  }

  /**
   * Creates a client for staging environment
   */
  static createStagingFormSubmissionClient(request: APIRequestContext): FormSubmissionClient {
    return this.createFormSubmissionClient(request, 'staging');
  }

  /**
   * Creates a client for development environment
   */
  static createDevelopmentFormSubmissionClient(request: APIRequestContext): FormSubmissionClient {
    return this.createFormSubmissionClient(request, 'development');
  }

  /**
   * Creates a client with custom configuration
   */
  static createCustomFormSubmissionClient(
    request: APIRequestContext,
    customConfig: Partial<EnvironmentConfig>
  ): FormSubmissionClient {
    return this.createFormSubmissionClient(request, 'production', customConfig);
  }

  /**
   * Registers a new environment configuration
   */
  static registerEnvironment(name: string, config: EnvironmentConfig): void {
    this.environmentConfigs.set(name, config);
  }

  /**
   * Gets available environment names
   */
  static getAvailableEnvironments(): string[] {
    return Array.from(this.environmentConfigs.keys());
  }

  /**
   * Gets configuration for specified environment
   */
  private static getEnvironmentConfig(
    environment: string,
    customConfig?: Partial<EnvironmentConfig>
  ): EnvironmentConfig {
    const baseConfig = this.environmentConfigs.get(environment);
    
    if (!baseConfig) {
      throw new Error(`Environment '${environment}' is not configured. Available environments: ${this.getAvailableEnvironments().join(', ')}`);
    }

    if (customConfig) {
      return {
        ...baseConfig,
        ...customConfig,
        headers: { ...baseConfig.headers, ...customConfig.headers },
        metadata: { ...baseConfig.metadata, ...customConfig.metadata }
      };
    }

    return baseConfig;
  }
}

/**
 * Factory for creating test data builders
 */
export class TestDataFactory {
  /**
   * Creates a factory user data builder
   */
  static createFactoryUserBuilder() {
    // This would import and use the UserFormDataBuilder
    // Keeping it simple for now to avoid circular dependencies
    return {
      withRandomData: () => ({
        email: `factory.test.${Date.now()}@example.com`,
        name: 'Test Factory Inc',
        phone: '+15551234567',
        accountType: 'Factory' as const
      }),
      withCustomData: (data: any) => ({ ...data })
    };
  }

  /**
   * Creates a buyer user data builder
   */
  static createBuyerUserBuilder() {
    return {
      withRandomData: () => ({
        email: `buyer.test.${Date.now()}@example.com`,
        name: 'Test Buyer Corp',
        phone: '+15557654321',
        accountType: 'Buyer' as const
      }),
      withCustomData: (data: any) => ({ ...data })
    };
  }
}

/**
 * Environment-aware factory that reads from environment variables
 */
export class EnvironmentAwareClientFactory {
  private static getCurrentEnvironment(): string {
    return process.env.TEST_ENV || process.env.NODE_ENV || 'production';
  }

  /**
   * Creates a client for the current environment
   */
  static createFormSubmissionClient(request: APIRequestContext): FormSubmissionClient {
    const environment = this.getCurrentEnvironment();
    return ApiClientFactory.createFormSubmissionClient(request, environment);
  }

  /**
   * Creates a client with environment variable overrides
   */
  static createFormSubmissionClientWithEnvOverrides(request: APIRequestContext): FormSubmissionClient {
    const environment = this.getCurrentEnvironment();
    
    const customConfig: any = {};
    
    if (process.env.API_BASE_URL) {
      customConfig.baseUrl = process.env.API_BASE_URL;
    }
    
    if (process.env.API_TIMEOUT) {
      customConfig.timeout = parseInt(process.env.API_TIMEOUT, 10);
    }
    
    if (process.env.API_RETRIES) {
      customConfig.retries = parseInt(process.env.API_RETRIES, 10);
    }

    return ApiClientFactory.createFormSubmissionClient(request, environment, customConfig);
  }
}