export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiBaseUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
  slowMo: number;
  viewport: {
    width: number;
    height: number;
  };
  video: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry';
  screenshot: 'off' | 'only-on-failure' | 'on';
  trace: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry';
}

const commonConfig = {
  timeout: 30000,
  viewport: {
    width: 1920,
    height: 1080
  },
  video: 'retain-on-failure' as const,
  screenshot: 'only-on-failure' as const,
  trace: 'on-first-retry' as const
};

export const environments: Record<string, EnvironmentConfig> = {
  development: {
    name: 'development',
    baseUrl: 'https://dev.factory-direct.tilda.ws',
    apiBaseUrl: 'https://api-dev.factory-direct.com',
    retries: 1,
    headless: false,
    slowMo: 100,
    ...commonConfig
  },
  
  staging: {
    name: 'staging',
    baseUrl: 'https://staging.factory-direct.tilda.ws',
    apiBaseUrl: 'https://api-staging.factory-direct.com',
    retries: 2,
    headless: true,
    slowMo: 0,
    ...commonConfig
  },
  
  production: {
    name: 'production',
    baseUrl: 'https://factory-direct.tilda.ws',
    apiBaseUrl: 'https://api.factory-direct.com',
    retries: 3,
    headless: true,
    slowMo: 0,
    ...commonConfig,
    video: 'off' as const,
    screenshot: 'only-on-failure' as const
  },
  
  local: {
    name: 'local',
    baseUrl: 'http://localhost:3000',
    apiBaseUrl: 'http://localhost:8080/api',
    retries: 0,
    headless: false,
    slowMo: 200,
    ...commonConfig,
    timeout: 10000,
    video: 'on' as const,
    screenshot: 'on' as const,
    trace: 'on' as const
  }
};

export function getEnvironmentConfig(envName?: string): EnvironmentConfig {
  const env = envName || process.env.TEST_ENV || process.env.NODE_ENV || 'development';
  
  if (!environments[env]) {
    console.warn(`Environment "${env}" not found, using development as fallback`);
    return environments.development;
  }
  
  return environments[env];
}

export function getEnvironmentVariables() {
  return {
    TEST_ENV: process.env.TEST_ENV || 'development',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CI: process.env.CI === 'true',
    DEBUG: process.env.DEBUG === 'true',
    HEADLESS: process.env.HEADLESS === 'true',
    API_TOKEN: process.env.API_TOKEN || '',
    API_BASE_URL: process.env.API_BASE_URL || '',
    BASE_URL: process.env.BASE_URL || '',
    BROWSER: process.env.BROWSER || 'chromium',
    WORKERS: parseInt(process.env.WORKERS || '1'),
    RETRIES: parseInt(process.env.RETRIES || '2'),
    TIMEOUT: parseInt(process.env.TIMEOUT || '30000')
  };
}

export const testTags = {
  smoke: '@smoke',
  regression: '@regression',
  api: '@api',
  e2e: '@e2e',
  critical: '@critical',
  slow: '@slow',
  flaky: '@flaky'
};

export const browsers = {
  chromium: 'chromium',
  firefox: 'firefox',
  webkit: 'webkit',
  edge: 'msedge',
  chrome: 'chrome'
};

export const devices = {
  mobile: {
    name: 'Mobile',
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
  },
  tablet: {
    name: 'Tablet',
    viewport: { width: 768, height: 1024 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
  },
  desktop: {
    name: 'Desktop',
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
};