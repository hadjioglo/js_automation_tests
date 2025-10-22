import { test, expect } from '@playwright/test';
import { UserApiService, CreateUserRequest } from '../services/UserApiService';
import { TestDataGenerator } from '../../../utils/dataGenerator';

test.describe('User API Tests @api', () => {
  let userService: UserApiService;
  let testDataGenerator: TestDataGenerator;
  
  test.beforeAll(async () => {
    userService = new UserApiService();
    testDataGenerator = new TestDataGenerator();
  });

  test.describe('Health Check and Service Availability', () => {
    
    test('should respond to health check endpoint', async () => {
      const response = await userService.healthCheck();
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status');
      expect(response.data).toHaveProperty('timestamp');
      expect(response.data.status).toBe('healthy');
    });
  });

  test.describe('User Creation and Validation', () => {
    
    test('should create a factory user successfully', async () => {
      const factoryData = testDataGenerator.generateFactoryData();
      const createRequest: CreateUserRequest = {
        name: factoryData.name,
        email: factoryData.email,
        phone: factoryData.phone,
        accountType: 'Factory'
      };

      const response = await userService.createUser(createRequest);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe(createRequest.name);
      expect(response.data.email).toBe(createRequest.email);
      expect(response.data.phone).toBe(createRequest.phone);
      expect(response.data.accountType).toBe('Factory');
      expect(response.data).toHaveProperty('createdAt');
    });

    test('should create a buyer user successfully', async () => {
      const buyerData = testDataGenerator.generateBuyerData();
      const createRequest: CreateUserRequest = {
        name: buyerData.name,
        email: buyerData.email,
        phone: buyerData.phone,
        accountType: 'Buyer'
      };

      const response = await userService.createUser(createRequest);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe(createRequest.name);
      expect(response.data.email).toBe(createRequest.email);
      expect(response.data.phone).toBe(createRequest.phone);
      expect(response.data.accountType).toBe('Buyer');
    });

    test('should reject user creation with invalid email', async () => {
      const userData = testDataGenerator.generateUserData();
      const createRequest: CreateUserRequest = {
        name: userData.name,
        email: 'invalid-email',
        phone: userData.phone,
        accountType: 'Factory'
      };

      const response = await userService.createUser(createRequest);
      
      expect(response.status).toBe(400);
      expect(response.errors).toContain('Invalid email format');
    });

    test('should reject user creation with missing required fields', async () => {
      const createRequest = {
        name: '',
        email: 'test@example.com',
        phone: '',
        accountType: 'Factory' as const
      };

      const response = await userService.createUser(createRequest);
      
      expect(response.status).toBe(400);
      expect(response.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('name'),
          expect.stringContaining('phone')
        ])
      );
    });

    test('should reject duplicate email registration', async () => {
      const userData = testDataGenerator.generateUserData();
      const createRequest: CreateUserRequest = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        accountType: 'Factory'
      };

      // Create first user
      const firstResponse = await userService.createUser(createRequest);
      expect(firstResponse.status).toBe(201);

      // Attempt to create duplicate
      const duplicateRequest: CreateUserRequest = {
        name: 'Different Name',
        email: userData.email, // Same email
        phone: '+1234567890',
        accountType: 'Buyer'
      };

      const duplicateResponse = await userService.createUser(duplicateRequest);
      expect(duplicateResponse.status).toBe(409);
      expect(duplicateResponse.message).toContain('Email already exists');
    });
  });

  test.describe('User Retrieval Operations', () => {
    let createdUser: any;

    test.beforeAll(async () => {
      const userData = testDataGenerator.generateUserData();
      const createRequest: CreateUserRequest = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        accountType: 'Factory'
      };

      const response = await userService.createUser(createRequest);
      createdUser = response.data;
    });

    test('should retrieve user by ID', async () => {
      const response = await userService.getUserById(createdUser.id);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(createdUser.id);
      expect(response.data.email).toBe(createdUser.email);
      expect(response.data.name).toBe(createdUser.name);
    });

    test('should retrieve user by email', async () => {
      const response = await userService.getUserByEmail(createdUser.email);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(createdUser.id);
      expect(response.data.email).toBe(createdUser.email);
    });

    test('should return 404 for non-existent user ID', async () => {
      const response = await userService.getUserById(99999);
      
      expect(response.status).toBe(404);
      expect(response.message).toContain('User not found');
    });

    test('should return 404 for non-existent email', async () => {
      const response = await userService.getUserByEmail('nonexistent@example.com');
      
      expect(response.status).toBe(404);
      expect(response.message).toContain('User not found');
    });
  });

  test.describe('User Listing and Filtering', () => {
    
    test('should retrieve all users with pagination', async () => {
      const response = await userService.getAllUsers({ page: 1, limit: 10 });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('users');
      expect(response.data).toHaveProperty('total');
      expect(response.data).toHaveProperty('page');
      expect(response.data).toHaveProperty('limit');
      expect(Array.isArray(response.data.users)).toBe(true);
      expect(response.data.page).toBe(1);
      expect(response.data.limit).toBe(10);
    });

    test('should filter users by account type - Factory', async () => {
      const response = await userService.getFactories({ page: 1, limit: 5 });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('users');
      
      if (response.data.users.length > 0) {
        response.data.users.forEach(user => {
          expect(user.accountType).toBe('Factory');
        });
      }
    });

    test('should filter users by account type - Buyer', async () => {
      const response = await userService.getBuyers({ page: 1, limit: 5 });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('users');
      
      if (response.data.users.length > 0) {
        response.data.users.forEach(user => {
          expect(user.accountType).toBe('Buyer');
        });
      }
    });

    test('should handle empty results gracefully', async () => {
      const response = await userService.getAllUsers({ 
        page: 999, 
        limit: 10,
        accountType: 'Factory' 
      });
      
      expect(response.status).toBe(200);
      expect(response.data.users).toEqual([]);
      expect(response.data.total).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('User Update Operations', () => {
    let testUser: any;

    test.beforeEach(async () => {
      const userData = testDataGenerator.generateUserData();
      const createRequest: CreateUserRequest = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        accountType: 'Factory'
      };

      const response = await userService.createUser(createRequest);
      testUser = response.data;
    });

    test('should update user name', async () => {
      const updatedName = 'Updated Factory Name';
      const response = await userService.updateUser(testUser.id, { name: updatedName });
      
      expect(response.status).toBe(200);
      expect(response.data.name).toBe(updatedName);
      expect(response.data.email).toBe(testUser.email); // Should remain unchanged
    });

    test('should update user email', async () => {
      const updatedEmail = testDataGenerator.generateValidEmail();
      const response = await userService.updateUser(testUser.id, { email: updatedEmail });
      
      expect(response.status).toBe(200);
      expect(response.data.email).toBe(updatedEmail);
      expect(response.data.name).toBe(testUser.name); // Should remain unchanged
    });

    test('should update user phone', async () => {
      const updatedPhone = testDataGenerator.generatePhoneNumber();
      const response = await userService.updateUser(testUser.id, { phone: updatedPhone });
      
      expect(response.status).toBe(200);
      expect(response.data.phone).toBe(updatedPhone);
    });

    test('should update account type', async () => {
      const response = await userService.updateUser(testUser.id, { accountType: 'Buyer' });
      
      expect(response.status).toBe(200);
      expect(response.data.accountType).toBe('Buyer');
    });

    test('should reject update with invalid email', async () => {
      const response = await userService.updateUser(testUser.id, { email: 'invalid-email' });
      
      expect(response.status).toBe(400);
      expect(response.errors).toContain('Invalid email format');
    });

    test('should return 404 for non-existent user update', async () => {
      const response = await userService.updateUser(99999, { name: 'New Name' });
      
      expect(response.status).toBe(404);
      expect(response.message).toContain('User not found');
    });
  });

  test.describe('User Deletion Operations', () => {
    let testUser: any;

    test.beforeEach(async () => {
      const userData = testDataGenerator.generateUserData();
      const createRequest: CreateUserRequest = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        accountType: 'Factory'
      };

      const response = await userService.createUser(createRequest);
      testUser = response.data;
    });

    test('should delete user successfully', async () => {
      const deleteResponse = await userService.deleteUser(testUser.id);
      
      expect([200, 204]).toContain(deleteResponse.status);

      // Verify user is deleted
      const getResponse = await userService.getUserById(testUser.id);
      expect(getResponse.status).toBe(404);
    });

    test('should return 404 for non-existent user deletion', async () => {
      const response = await userService.deleteUser(99999);
      
      expect(response.status).toBe(404);
      expect(response.message).toContain('User not found');
    });
  });

  test.describe('Validation Endpoints', () => {
    
    test('should validate email format and availability', async () => {
      const validEmail = testDataGenerator.generateValidEmail();
      const response = await userService.validateEmail(validEmail);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('isValid');
      expect(response.data).toHaveProperty('isAvailable');
      expect(response.data.isValid).toBe(true);
    });

    test('should reject invalid email format', async () => {
      const invalidEmail = 'invalid-email';
      const response = await userService.validateEmail(invalidEmail);
      
      expect(response.status).toBe(200);
      expect(response.data.isValid).toBe(false);
    });

    test('should validate phone format and availability', async () => {
      const validPhone = testDataGenerator.generatePhoneNumber();
      const response = await userService.validatePhone(validPhone);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('isValid');
      expect(response.data).toHaveProperty('isAvailable');
      expect(response.data.isValid).toBe(true);
    });
  });
});