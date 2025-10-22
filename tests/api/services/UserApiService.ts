import { HttpHelper, ApiResponse } from '../../../utils/helpers';
import { Logger } from '../../../utils/logger';

export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  accountType: 'Factory' | 'Buyer';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  accountType: 'Factory' | 'Buyer';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  accountType?: 'Factory' | 'Buyer';
}

export class UserApiService {
  private httpHelper: HttpHelper;
  private logger: Logger;

  constructor(baseUrl: string = process.env.API_BASE_URL || 'https://api.factory-direct.com') {
    this.httpHelper = new HttpHelper(baseUrl, {
      'Authorization': `Bearer ${process.env.API_TOKEN || ''}`,
      'Content-Type': 'application/json'
    });
    this.logger = new Logger('UserApiService');
  }

  // User CRUD operations
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    this.logger.info(`Creating user: ${userData.email}`);
    
    try {
      const response = await this.httpHelper.post<User>('/api/v1/users', userData);
      
      if (response.status === 201) {
        this.logger.success(`User created successfully: ${userData.email}`);
      } else {
        this.logger.warn(`User creation returned status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error}`);
      throw error;
    }
  }

  async getUserById(userId: number): Promise<ApiResponse<User>> {
    this.logger.info(`Fetching user by ID: ${userId}`);
    
    try {
      const response = await this.httpHelper.get<User>(`/api/v1/users/${userId}`);
      
      if (response.status === 200) {
        this.logger.success(`User fetched successfully: ${userId}`);
      } else {
        this.logger.warn(`User fetch returned status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Failed to fetch user: ${error}`);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    this.logger.info(`Fetching user by email: ${email}`);
    
    try {
      const response = await this.httpHelper.get<User>(`/api/v1/users/search?email=${encodeURIComponent(email)}`);
      
      if (response.status === 200) {
        this.logger.success(`User fetched successfully: ${email}`);
      } else {
        this.logger.warn(`User fetch returned status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Failed to fetch user by email: ${error}`);
      throw error;
    }
  }

  async getAllUsers(params?: { 
    page?: number; 
    limit?: number; 
    accountType?: 'Factory' | 'Buyer';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<{ users: User[]; total: number; page: number; limit: number }>> {
    this.logger.info('Fetching all users');
    
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.accountType) queryParams.append('accountType', params.accountType);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const endpoint = `/api/v1/users${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    try {
      const response = await this.httpHelper.get(endpoint);
      
      if (response.status === 200) {
        this.logger.success(`Users fetched successfully. Count: ${response.data?.users?.length || 0}`);
      } else {
        this.logger.warn(`Users fetch returned status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error}`);
      throw error;
    }
  }

  async updateUser(userId: number, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    this.logger.info(`Updating user: ${userId}`);
    
    try {
      const response = await this.httpHelper.post<User>(`/api/v1/users/${userId}`, userData);
      
      if (response.status === 200) {
        this.logger.success(`User updated successfully: ${userId}`);
      } else {
        this.logger.warn(`User update returned status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Failed to update user: ${error}`);
      throw error;
    }
  }

  async deleteUser(userId: number): Promise<ApiResponse<void>> {
    this.logger.info(`Deleting user: ${userId}`);
    
    try {
      const response = await this.httpHelper.request<void>(`/api/v1/users/${userId}`, { method: 'DELETE' });
      
      if (response.status === 200 || response.status === 204) {
        this.logger.success(`User deleted successfully: ${userId}`);
      } else {
        this.logger.warn(`User deletion returned status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Failed to delete user: ${error}`);
      throw error;
    }
  }

  // Factory-specific operations
  async getFactories(params?: { 
    page?: number; 
    limit?: number; 
    industry?: string;
    verified?: boolean;
  }): Promise<ApiResponse<{ users: User[]; total: number }>> {
    this.logger.info('Fetching factories');
    
    const queryParams = new URLSearchParams();
    queryParams.append('accountType', 'Factory');
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.industry) queryParams.append('industry', params.industry);
    if (params?.verified !== undefined) queryParams.append('verified', params.verified.toString());
    
    const endpoint = `/api/v1/users?${queryParams.toString()}`;
    
    try {
      const response = await this.httpHelper.get(endpoint);
      
      if (response.status === 200) {
        this.logger.success(`Factories fetched successfully. Count: ${response.data?.users?.length || 0}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Failed to fetch factories: ${error}`);
      throw error;
    }
  }

  // Buyer-specific operations
  async getBuyers(params?: { 
    page?: number; 
    limit?: number; 
    businessType?: string;
    verified?: boolean;
  }): Promise<ApiResponse<{ users: User[]; total: number }>> {
    this.logger.info('Fetching buyers');
    
    const queryParams = new URLSearchParams();
    queryParams.append('accountType', 'Buyer');
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.businessType) queryParams.append('businessType', params.businessType);
    if (params?.verified !== undefined) queryParams.append('verified', params.verified.toString());
    
    const endpoint = `/api/v1/users?${queryParams.toString()}`;
    
    try {
      const response = await this.httpHelper.get(endpoint);
      
      if (response.status === 200) {
        this.logger.success(`Buyers fetched successfully. Count: ${response.data?.users?.length || 0}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Failed to fetch buyers: ${error}`);
      throw error;
    }
  }

  // Authentication operations
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    this.logger.info(`Attempting login for: ${email}`);
    
    try {
      const response = await this.httpHelper.post<{ user: User; token: string }>('/api/v1/auth/login', {
        email,
        password
      });
      
      if (response.status === 200) {
        this.logger.success(`Login successful for: ${email}`);
      } else {
        this.logger.warn(`Login failed for: ${email}. Status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Login error for ${email}: ${error}`);
      throw error;
    }
  }

  async logout(token: string): Promise<ApiResponse<void>> {
    this.logger.info('Attempting logout');
    
    try {
      const response = await this.httpHelper.post<void>('/api/v1/auth/logout', {}, {
        'Authorization': `Bearer ${token}`
      });
      
      if (response.status === 200) {
        this.logger.success('Logout successful');
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Logout error: ${error}`);
      throw error;
    }
  }

  // Validation operations
  async validateEmail(email: string): Promise<ApiResponse<{ isValid: boolean; isAvailable: boolean }>> {
    this.logger.info(`Validating email: ${email}`);
    
    try {
      const response = await this.httpHelper.get<{ isValid: boolean; isAvailable: boolean }>(
        `/api/v1/users/validate/email?email=${encodeURIComponent(email)}`
      );
      
      return response;
    } catch (error) {
      this.logger.error(`Email validation error: ${error}`);
      throw error;
    }
  }

  async validatePhone(phone: string): Promise<ApiResponse<{ isValid: boolean; isAvailable: boolean }>> {
    this.logger.info(`Validating phone: ${phone}`);
    
    try {
      const response = await this.httpHelper.get<{ isValid: boolean; isAvailable: boolean }>(
        `/api/v1/users/validate/phone?phone=${encodeURIComponent(phone)}`
      );
      
      return response;
    } catch (error) {
      this.logger.error(`Phone validation error: ${error}`);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    this.logger.info('Performing health check');
    
    try {
      const response = await this.httpHelper.get<{ status: string; timestamp: string }>('/api/v1/health');
      
      if (response.status === 200) {
        this.logger.success('Health check passed');
      } else {
        this.logger.warn(`Health check returned status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      this.logger.error(`Health check failed: ${error}`);
      throw error;
    }
  }
}