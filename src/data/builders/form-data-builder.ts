import { UserFormData, AccountType, FormMetadata } from '../models/form-submission.dto';

/**
 * Mutable version of UserFormData for building
 */
interface MutableUserFormData {
  email?: string;
  name?: string;
  phone?: string;
  accountType?: AccountType;
  comments?: string;
}

/**
 * Mutable version of FormMetadata for building
 */
interface MutableFormMetadata {
  formId?: string;
  formsKey?: string;
  versionLib?: string;
  pageId?: string;
  projectId?: string;
  language?: string;
  fingerprint?: string;
  referer?: string;
}

/**
 * Builder pattern for creating UserFormData
 * Provides fluent interface for test data creation
 */
export class UserFormDataBuilder {
  private data: MutableUserFormData = {};

  /**
   * Creates a new builder instance
   */
  static create(): UserFormDataBuilder {
    return new UserFormDataBuilder();
  }

  /**
   * Creates a factory user builder with default values
   */
  static createFactory(): UserFormDataBuilder {
    return new UserFormDataBuilder()
      .withAccountType('Factory')
      .withEmail(this.generateFactoryEmail())
      .withName(this.generateFactoryName())
      .withPhone(this.generatePhone());
  }

  /**
   * Creates a buyer user builder with default values
   */
  static createBuyer(): UserFormDataBuilder {
    return new UserFormDataBuilder()
      .withAccountType('Buyer')
      .withEmail(this.generateBuyerEmail())
      .withName(this.generateBuyerName())
      .withPhone(this.generatePhone());
  }

  /**
   * Sets the email
   */
  withEmail(email: string): UserFormDataBuilder {
    this.data.email = email;
    return this;
  }

  /**
   * Sets the name
   */
  withName(name: string): UserFormDataBuilder {
    this.data.name = name;
    return this;
  }

  /**
   * Sets the phone
   */
  withPhone(phone: string): UserFormDataBuilder {
    this.data.phone = phone;
    return this;
  }

  /**
   * Sets the account type
   */
  withAccountType(accountType: AccountType): UserFormDataBuilder {
    this.data.accountType = accountType;
    return this;
  }

  /**
   * Sets comments
   */
  withComments(comments: string): UserFormDataBuilder {
    this.data.comments = comments;
    return this;
  }

  /**
   * Sets random email for testing
   */
  withRandomEmail(): UserFormDataBuilder {
    this.data.email = this.generateRandomEmail();
    return this;
  }

  /**
   * Sets random name for testing
   */
  withRandomName(): UserFormDataBuilder {
    this.data.name = this.generateRandomName();
    return this;
  }

  /**
   * Sets random phone for testing
   */
  withRandomPhone(): UserFormDataBuilder {
    this.data.phone = UserFormDataBuilder.generatePhone();
    return this;
  }

  /**
   * Sets invalid email for negative testing
   */
  withInvalidEmail(): UserFormDataBuilder {
    this.data.email = 'invalid-email';
    return this;
  }

  /**
   * Sets empty email for validation testing
   */
  withEmptyEmail(): UserFormDataBuilder {
    this.data.email = '';
    return this;
  }

  /**
   * Sets invalid phone for negative testing
   */
  withInvalidPhone(): UserFormDataBuilder {
    this.data.phone = '123';
    return this;
  }

  /**
   * Builds the final UserFormData object
   */
  build(): UserFormData {
    if (!this.data.email) {
      throw new Error('Email is required');
    }
    if (!this.data.name) {
      throw new Error('Name is required');
    }
    if (!this.data.phone) {
      throw new Error('Phone is required');
    }
    if (!this.data.accountType) {
      throw new Error('Account type is required');
    }

    return {
      email: this.data.email,
      name: this.data.name,
      phone: this.data.phone,
      accountType: this.data.accountType,
      comments: this.data.comments
    };
  }

  /**
   * Generates a random factory email
   */
  private static generateFactoryEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `factory.test.${timestamp}.${random}@example.com`;
  }

  /**
   * Generates a random buyer email
   */
  private static generateBuyerEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `buyer.test.${timestamp}.${random}@example.com`;
  }

  /**
   * Generates a random factory name
   */
  private static generateFactoryName(): string {
    const factoryNames = [
      'Advanced Manufacturing Co',
      'Precision Industries Ltd',
      'Quality Production Inc',
      'Modern Factory Solutions',
      'Industrial Excellence Corp',
      'Premier Manufacturing Group',
      'Innovative Production Co',
      'Elite Manufacturing Ltd'
    ];
    return factoryNames[Math.floor(Math.random() * factoryNames.length)];
  }

  /**
   * Generates a random buyer name
   */
  private static generateBuyerName(): string {
    const buyerNames = [
      'Global Procurement Inc',
      'Supply Chain Solutions',
      'Strategic Sourcing Corp',
      'Wholesale Distribution Co',
      'Import Export Partners',
      'Commercial Buyers Group',
      'Trade Solutions Ltd',
      'Business Procurement Inc'
    ];
    return buyerNames[Math.floor(Math.random() * buyerNames.length)];
  }

  /**
   * Generates a random phone number
   */
  private static generatePhone(): string {
    const areaCodes = ['555', '556', '557', '558', '559'];
    const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `+1${areaCode}${exchange}${number}`;
  }

  /**
   * Generates a random email for testing
   */
  private generateRandomEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const domains = ['example.com', 'test.com', 'demo.org'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `test.user.${timestamp}.${random}@${domain}`;
  }

  /**
   * Generates a random name for testing
   */
  private generateRandomName(): string {
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  }
}

/**
 * Builder pattern for creating FormMetadata
 * Useful for testing different form configurations
 */
export class FormMetadataBuilder {
  private data: MutableFormMetadata = {};

  /**
   * Creates a new metadata builder
   */
  static create(): FormMetadataBuilder {
    return new FormMetadataBuilder();
  }

  /**
   * Creates default production metadata
   */
  static createDefault(): FormMetadataBuilder {
    return new FormMetadataBuilder()
      .withFormId('form1389242973')
      .withFormsKey('e6cfbf70985ba815d7b4d333a6284491')
      .withVersionLib('02.001')
      .withPageId('83603536')
      .withProjectId('6284491')
      .withLanguage('EN')
      .withFingerprint('63547c646d387c6863387c6c656e2d55532c656e2c72757c7057696e33327c76476f6f676c6520496e632e7c614d6f7a696c6c617c6e4e657473636170657c706c696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d766965776572696e7465726e616c2d7064662d7669657765727c7072317c773139323068313038307c634432347c744f2d3132307c6d54307c')
      .withReferer('https://factory-direct.tilda.ws/#rec1389242973');
  }

  withFormId(formId: string): FormMetadataBuilder {
    this.data.formId = formId;
    return this;
  }

  withFormsKey(formsKey: string): FormMetadataBuilder {
    this.data.formsKey = formsKey;
    return this;
  }

  withVersionLib(versionLib: string): FormMetadataBuilder {
    this.data.versionLib = versionLib;
    return this;
  }

  withPageId(pageId: string): FormMetadataBuilder {
    this.data.pageId = pageId;
    return this;
  }

  withProjectId(projectId: string): FormMetadataBuilder {
    this.data.projectId = projectId;
    return this;
  }

  withLanguage(language: string): FormMetadataBuilder {
    this.data.language = language;
    return this;
  }

  withFingerprint(fingerprint: string): FormMetadataBuilder {
    this.data.fingerprint = fingerprint;
    return this;
  }

  withReferer(referer: string): FormMetadataBuilder {
    this.data.referer = referer;
    return this;
  }

  build(): FormMetadata {
    const required = ['formId', 'formsKey', 'versionLib', 'pageId', 'projectId', 'language', 'fingerprint', 'referer'];
    for (const field of required) {
      if (!this.data[field as keyof FormMetadata]) {
        throw new Error(`${field} is required for FormMetadata`);
      }
    }

    return this.data as FormMetadata;
  }
}