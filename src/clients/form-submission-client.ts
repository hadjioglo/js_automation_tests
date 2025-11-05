import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './base-api-client';
import {
  FormSubmissionRequest,
  FormSubmissionResponse,
  UserFormData,
  FormMetadata,
  ApiResponse,
  RequestOptions
} from '../data/models/form-submission.dto';

/**
 * Form Submission API Client
 * Handles Factory Direct form submissions to Tilda API
 */
export class FormSubmissionClient extends BaseApiClient {
  private readonly formMetadata: FormMetadata;

  constructor(
    request: APIRequestContext,
    baseUrl: string = 'https://forms.tildaapi.one',
    formMetadata?: Partial<FormMetadata>
  ) {
    const defaultHeaders = {
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

    super(request, baseUrl, defaultHeaders, 30000);

    // Default form metadata based on real Tilda form
    this.formMetadata = {
      formId: 'form1389242973',
      formsKey: 'e6cfbf70985ba815d7b4d333a6284491',
      versionLib: '02.001',
      pageId: '83603536',
      projectId: '6284491',
      language: 'EN',
      fingerprint: '63547c646d387c6863387c6c656e2d55532c656e2c72757c7057696e33327c76476f6f676c6520496e632e7c614d6f7a696c6c617c6e4e657473636170657c706c696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d7669657765727c7072317c773139323068313038307c634432347c744f2d3132307c6d54307c',
      referer: 'https://factory-direct.tilda.ws/#rec1389242973',
      ...formMetadata
    };
  }

  /**
   * Submits a form with user data
   */
  async submitForm(
    userData: UserFormData,
    options: RequestOptions = {}
  ): Promise<ApiResponse<FormSubmissionResponse>> {
    this.logger.info(`Submitting form for user: ${userData.email}`);

    const formData = this.buildFormSubmissionRequest(userData);
    
    try {
      const response = await this.post<FormSubmissionResponse>('/procces/', formData, options);
      
      if (response.success) {
        this.logger.info(`Form submitted successfully for: ${userData.email}`);
      } else {
        this.logger.warn(`Form submission failed for: ${userData.email}, Status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Form submission error for: ${userData.email} - ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Validates form data before submission
   */
  async validateFormData(userData: UserFormData): Promise<boolean> {
    const errors: string[] = [];

    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Valid email is required');
    }

    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    if (!userData.phone || !this.isValidPhone(userData.phone)) {
      errors.push('Valid phone number is required');
    }

    if (!userData.accountType || !['Factory', 'Buyer'].includes(userData.accountType)) {
      errors.push('Account type must be Factory or Buyer');
    }

    if (errors.length > 0) {
      this.logger.warn(`Form validation failed: ${errors.join(', ')}`);
      return false;
    }

    return true;
  }

  /**
   * Gets form metadata for debugging
   */
  getFormMetadata(): FormMetadata {
    return { ...this.formMetadata };
  }

  /**
   * Updates form metadata
   */
  updateFormMetadata(metadata: Partial<FormMetadata>): void {
    Object.assign(this.formMetadata, metadata);
  }

  /**
   * Builds the complete form submission request
   */
  private buildFormSubmissionRequest(userData: UserFormData): FormSubmissionRequest {
    return {
      'formservices[]': 'f7bc604652b0ef15e85963ea4fc3f5f6',
      'Email': userData.email,
      'Name': userData.name,
      'Phone': userData.phone,
      'Account type': userData.accountType,
      'form-spec-comments': userData.comments || '',
      'tildaspec-cookie': '',
      'tildaspec-referer': this.formMetadata.referer,
      'tildaspec-formid': this.formMetadata.formId,
      'tildaspec-formskey': this.formMetadata.formsKey,
      'tildaspec-version-lib': this.formMetadata.versionLib,
      'tildaspec-pageid': this.formMetadata.pageId,
      'tildaspec-projectid': this.formMetadata.projectId,
      'tildaspec-lang': this.formMetadata.language,
      'tildaspec-fp': this.formMetadata.fingerprint,
    };
  }

  /**
   * Validates email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates phone format
   */
  private isValidPhone(phone: string): boolean {
    // Allow various phone formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
  }
}