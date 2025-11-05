/**
 * Configuration interface for different environments
 */
export interface EnvironmentConfig {
  readonly name: string;
  readonly baseUrl: string;
  readonly formSubmissionUrl: string;
  readonly timeout: number;
  readonly retries: number;
  readonly headers: Record<string, string>;
  readonly metadata: FormMetadataConfig;
}

export interface FormMetadataConfig {
  readonly formservices: string;
  readonly formId: string;
  readonly formsKey: string;
  readonly versionLib: string;
  readonly pageId: string;
  readonly projectId: string;
  readonly language: string;
  readonly fingerprint: string;
  readonly referer: string;
}

/**
 * Test execution configuration
 */
export interface TestConfig {
  readonly parallel: boolean;
  readonly workers: number;
  readonly timeout: number;
  readonly retries: number;
  readonly reporterOptions: {
    outputFolder: string;
    open: string;
  };
}