import { APIRequestContext } from '@playwright/test';
import { ApiResponse, RequestOptions } from '../data/models/form-submission.dto';
import { Logger } from '../../utils/logger';

/**
 * Base API Client providing common HTTP operations
 * Follows the Service/Client pattern for API testing
 */
export abstract class BaseApiClient {
  protected readonly logger: Logger;
  protected readonly baseUrl: string;
  protected readonly defaultHeaders: Record<string, string>;
  protected readonly defaultTimeout: number;

  constructor(
    protected readonly request: APIRequestContext,
    baseUrl: string,
    defaultHeaders: Record<string, string> = {},
    timeout: number = 30000
  ) {
    this.logger = new Logger(this.constructor.name);
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
    this.defaultTimeout = timeout;
  }

  /**
   * Performs GET request
   */
  protected async get<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('GET', endpoint, undefined, options);
  }

  /**
   * Performs POST request
   */
  protected async post<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('POST', endpoint, data, options);
  }

  /**
   * Performs PUT request
   */
  protected async put<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('PUT', endpoint, data, options);
  }

  /**
   * Performs DELETE request
   */
  protected async delete<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('DELETE', endpoint, undefined, options);
  }

  /**
   * Performs PATCH request
   */
  protected async patch<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('PATCH', endpoint, data, options);
  }

  /**
   * Core request execution method with retry logic and logging
   */
  private async executeRequest<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const headers = { ...this.defaultHeaders, ...options.headers };
    const timeout = options.timeout || this.defaultTimeout;
    const retries = options.retries || 0;

    const preparedData = this.prepareRequestData(data);
    this.logger.info(`${method} ${url} - Headers: ${JSON.stringify(this.sanitizeHeaders(headers))} - Prepared Data: ${preparedData}`);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const startTime = Date.now();
        
        const response = await this.request.fetch(url, {
          method,
          headers,
          data: preparedData,
          timeout,
        });

        const duration = Date.now() - startTime;
        const responseData = await this.parseResponse<T>(response);
        const responseHeaders = this.extractHeaders(response);

        const apiResponse: ApiResponse<T> = {
          status: response.status(),
          headers: responseHeaders,
          data: responseData,
          success: response.ok(),
        };

        this.logger.info(`${method} ${url} - ${response.status()} (${duration}ms) - Response: ${JSON.stringify(responseData)}`);

        return apiResponse;

      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`${method} ${url} - Attempt ${attempt + 1} failed: ${(error as Error).message}`);
        
        if (attempt === retries) {
          break;
        }
        
        // Wait before retry (exponential backoff with longer delays)
        const delay = Math.min(Math.pow(2, attempt) * 2000, 30000); // Max 30 seconds
        this.logger.info(`Retrying in ${delay}ms...`);
        await this.delay(delay);
      }
    }

    this.logger.error(`${method} ${url} - All attempts failed: ${lastError?.message || 'Unknown error'}`);
    throw lastError;
  }

  /**
   * Builds complete URL from endpoint
   */
  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  }

  /**
   * Prepares request data based on content type
   */
  private prepareRequestData(data: unknown): string | URLSearchParams | undefined {
    if (!data) return undefined;

    const contentType = this.defaultHeaders['content-type'] || this.defaultHeaders['Content-Type'];
    
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      if (data instanceof URLSearchParams) {
        return data.toString(); // Convert URLSearchParams to string
      }
      
      const params = new URLSearchParams();
      const dataObj = data as Record<string, any>;
      
      Object.entries(dataObj).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Convert all values to strings and handle arrays properly
          const stringValue = Array.isArray(value) ? value.join(',') : String(value);
          params.append(key, stringValue);
        }
      });
      
      // Log the prepared data for debugging and return as string
      const formDataString = params.toString();
      this.logger.debug(`Prepared form data: ${formDataString}`);
      return formDataString;
    }

    return typeof data === 'string' ? data : JSON.stringify(data);
  }

  /**
   * Parses response based on content type
   */
  private async parseResponse<T>(response: any): Promise<T> {
    const contentType = response.headers()['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text() as T;
  }

  /**
   * Extracts headers from response
   */
  private extractHeaders(response: any): Record<string, string> {
    return response.headers();
  }

  /**
   * Removes sensitive information from headers for logging
   */
  private sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized = { ...headers };
    const sensitiveKeys = ['authorization', 'x-api-key', 'cookie'];
    
    sensitiveKeys.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '***';
      }
      if (sanitized[key.toLowerCase()]) {
        sanitized[key.toLowerCase()] = '***';
      }
    });
    
    return sanitized;
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}