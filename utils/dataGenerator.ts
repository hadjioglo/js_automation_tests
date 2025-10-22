import { StringHelper } from './helpers';

export interface UserData {
  name: string;
  email: string;
  phone: string;
}

export interface FactoryData extends UserData {
  companyName: string;
  industry: string;
  productCategories: string[];
}

export interface BuyerData extends UserData {
  companyName: string;
  businessType: string;
  targetProducts: string[];
}

export class TestDataGenerator {
  
  // Generate basic user data
  generateUserData(): UserData {
    return {
      name: StringHelper.generateRandomName(),
      email: StringHelper.generateRandomEmail(),
      phone: StringHelper.generateRandomPhone()
    };
  }

  // Generate factory-specific data
  generateFactoryData(): FactoryData {
    const baseData = this.generateUserData();
    const companies = ['Tech Manufacturing', 'Industrial Solutions', 'Global Factory', 'Premium Electronics'];
    const industries = ['Electronics', 'Textiles', 'Automotive', 'Food & Beverage', 'Pharmaceuticals'];
    
    return {
      ...baseData,
      name: this.getRandomElement(companies),
      companyName: this.getRandomElement(companies),
      industry: this.getRandomElement(industries),
      productCategories: this.getRandomElements(['Consumer Electronics', 'Industrial Equipment', 'Raw Materials'], 2)
    };
  }

  // Generate buyer-specific data
  generateBuyerData(): BuyerData {
    const baseData = this.generateUserData();
    const companies = ['Retail Solutions', 'Global Buyers', 'Import Export Co', 'Wholesale Direct'];
    const businessTypes = ['Retailer', 'Wholesaler', 'Distributor', 'E-commerce', 'Import/Export'];
    const products = ['Electronics', 'Clothing', 'Home Goods', 'Industrial Parts'];
    
    return {
      ...baseData,
      name: StringHelper.generateRandomName(),
      companyName: this.getRandomElement(companies),
      businessType: this.getRandomElement(businessTypes),
      targetProducts: this.getRandomElements(products, 2)
    };
  }

  // Generate test data with specific constraints
  generateValidEmail(): string {
    return StringHelper.generateRandomEmail();
  }

  generateInvalidEmail(): string {
    const invalidFormats = [
      'invalid-email',
      'test@',
      '@domain.com',
      'user@.com',
      'user@domain',
      ''
    ];
    return this.getRandomElement(invalidFormats);
  }

  generatePhoneNumber(format: 'US' | 'INTERNATIONAL' | 'FORMATTED' = 'US'): string {
    switch (format) {
      case 'US':
        return `+1${this.generateDigits(10)}`;
      case 'INTERNATIONAL':
        const countryCode = this.getRandomElement(['+86', '+44', '+49', '+33', '+81']);
        return `${countryCode} ${this.generateDigits(9)}`;
      case 'FORMATTED':
        return `+1 (${this.generateDigits(3)}) ${this.generateDigits(3)}-${this.generateDigits(4)}`;
      default:
        return StringHelper.generateRandomPhone();
    }
  }

  private generateDigits(count: number): string {
    let result = '';
    for (let i = 0; i < count; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  generateCompanyName(): string {
    const prefixes = ['Global', 'International', 'Premium', 'Advanced', 'Elite'];
    const suffixes = ['Manufacturing', 'Industries', 'Solutions', 'Corporation', 'Group'];
    return `${this.getRandomElement(prefixes)} ${this.getRandomElement(suffixes)}`;
  }

  generatePersonName(): string {
    return StringHelper.generateRandomName();
  }

  // Generate test data for specific scenarios
  generateSpecialCharacterName(): string {
    const specialNames = [
      'José María García',
      'François O\'Connor-Smith',
      'Li Wei (李维)',
      'Jean-François Müller',
      'María José & Associates',
      'Àlex Çağlar'
    ];
    return this.getRandomElement(specialNames);
  }

  generateLongText(maxLength: number = 500): string {
    const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit'];
    let result = '';
    while (result.length < maxLength) {
      result += this.getRandomElement(words) + ' ';
    }
    return result.substring(0, maxLength);
  }

  // Generate bulk test data
  generateMultipleUsers(count: number): UserData[] {
    return Array.from({ length: count }, () => this.generateUserData());
  }

  generateMultipleFactories(count: number): FactoryData[] {
    return Array.from({ length: count }, () => this.generateFactoryData());
  }

  generateMultipleBuyers(count: number): BuyerData[] {
    return Array.from({ length: count }, () => this.generateBuyerData());
  }

  // Generate data for specific test scenarios
  generateDataForEmailValidationTest(): { valid: string[], invalid: string[] } {
    return {
      valid: [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@subdomain.example.org',
        'name123@test-domain.net',
        'firstname.lastname@company.com'
      ],
      invalid: [
        'invalid-email',
        'test@',
        '@domain.com',
        'user@.com',
        'user@domain',
        'user..double.dot@example.com',
        'user@domain..com',
        ''
      ]
    };
  }

  generateDataForPhoneValidationTest(): string[] {
    return [
      '+1234567890',
      '+1 (555) 123-4567',
      '555-123-4567',
      '+86 138 0013 8000',
      '+44 20 7946 0958',
      '+33 1 42 34 56 78',
      '+49 30 12345678',
      '1-800-FACTORY'
    ];
  }

  // Utility methods
  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  }

  // Static utility methods
  static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  static generateRandomString(length: number): string {
    return StringHelper.generateRandomString(length);
  }

  static generateRandomNumber(min: number = 1, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}