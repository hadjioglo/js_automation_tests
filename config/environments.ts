import { config } from 'dotenv';
import path from 'path';

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

// Load environment variables from production config
const envFile = path.join(process.cwd(), 'config', 'prod.env');
config({ path: envFile });

// Production environment configuration
export const environments: Record<string, EnvironmentConfig> = {
  production: {
    name: 'production',
    baseUrl: process.env.BASE_URL || 'https://factory-direct.tilda.ws/',
    apiBaseUrl: process.env.API_BASE_URL || 'https://api.factory-direct.com/v1',
    timeout: parseInt(process.env.TIMEOUT || '60000'),
    retries: parseInt(process.env.RETRIES || '3'),
    headless: process.env.HEADLESS === 'true',
    slowMo: parseInt(process.env.SLOW_MO || '0'),
    viewport: {
      width: parseInt(process.env.VIEWPORT_WIDTH || '1920'),
      height: parseInt(process.env.VIEWPORT_HEIGHT || '1080')
    },
    video: (process.env.VIDEO_MODE as any) || 'off',
    screenshot: (process.env.SCREENSHOT_MODE as any) || 'only-on-failure',
    trace: (process.env.TRACE_MODE as any) || 'off'
  }
};

export function getEnvironmentConfig(envName?: string): EnvironmentConfig {
  const env = envName || process.env.ENV || 'production';
  
  if (!environments[env]) {
    console.warn(`Environment "${env}" not found. Using production configuration.`);
    return environments.production;
  }
  
  return environments[env];
}

// Environment variables helper
export const envVars = {
  // Core settings
  ENV: process.env.ENV || 'production',
  BASE_URL: process.env.BASE_URL || 'https://factory-direct.tilda.ws/',
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.factory-direct.com/v1',
  
  // Test execution
  CI: process.env.CI === 'true',
  HEADLESS: process.env.HEADLESS === 'true',
  WORKERS: parseInt(process.env.PARALLEL_WORKERS || '4'),
  RETRIES: parseInt(process.env.RETRIES || '3'),
  TIMEOUT: parseInt(process.env.TIMEOUT || '60000'),
  
  // Authentication
  API_TOKEN: process.env.API_TOKEN,
  DEFAULT_USER_EMAIL: process.env.DEFAULT_USER_EMAIL || 'test@factory-direct.com',
  DEFAULT_USER_PASSWORD: process.env.DEFAULT_USER_PASSWORD || 'TestPassword123!',
  
  // Feature flags
  ENABLE_API_TESTS: process.env.ENABLE_API_TESTS === 'true',
  ENABLE_VISUAL_TESTS: process.env.ENABLE_VISUAL_TESTS === 'true',
  ENABLE_PERFORMANCE_TESTS: process.env.ENABLE_PERFORMANCE_TESTS === 'true',
  ENABLE_ACCESSIBILITY_TESTS: process.env.ENABLE_ACCESSIBILITY_TESTS === 'true',
  
  // Reporting
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
  ENABLE_SLACK_NOTIFICATIONS: process.env.ENABLE_SLACK_NOTIFICATIONS === 'true',
  ENABLE_EMAIL_REPORTS: process.env.ENABLE_EMAIL_REPORTS === 'true',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'warn',
  LOG_TO_FILE: process.env.LOG_TO_FILE === 'true',
  LOG_FILE: process.env.LOG_FILE || 'logs/test-production.log'
};