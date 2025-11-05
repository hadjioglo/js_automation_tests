/**
 * DTOs for Factory Direct Form Submission API
 * Based on real Tilda form submission endpoints
 */

export interface FormSubmissionRequest {
  readonly 'formservices[]': string;
  readonly 'Email': string;
  readonly 'Name': string;
  readonly 'Phone': string;
  readonly 'Account type': AccountType;
  readonly 'form-spec-comments': string;
  readonly 'tildaspec-cookie': string;
  readonly 'tildaspec-referer': string;
  readonly 'tildaspec-formid': string;
  readonly 'tildaspec-formskey': string;
  readonly 'tildaspec-version-lib': string;
  readonly 'tildaspec-pageid': string;
  readonly 'tildaspec-projectid': string;
  readonly 'tildaspec-lang': string;
  readonly 'tildaspec-fp': string;
}

export interface FormSubmissionResponse {
  readonly status: 'success' | 'error';
  readonly message?: string;
  readonly data?: unknown;
  readonly errors?: ValidationError[];
}

export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code?: string;
}

export type AccountType = 'Factory' | 'Buyer';

export interface FormMetadata {
  readonly formId: string;
  readonly formsKey: string;
  readonly versionLib: string;
  readonly pageId: string;
  readonly projectId: string;
  readonly language: string;
  readonly fingerprint: string;
  readonly referer: string;
}

export interface UserFormData {
  readonly email: string;
  readonly name: string;
  readonly phone: string;
  readonly accountType: AccountType;
  readonly comments?: string;
}

/**
 * Standard HTTP response wrapper
 */
export interface ApiResponse<T = unknown> {
  readonly status: number;
  readonly headers: Record<string, string>;
  readonly data: T;
  readonly success: boolean;
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
  readonly timeout?: number;
  readonly retries?: number;
  readonly headers?: Record<string, string>;
}