import axios from 'axios';
import type { AxiosResponse } from 'axios';

// Dynamic API URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://kg-modern-library-backend.vercel.app/api');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Token management utilities
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly USER_KEY = 'user';

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): any | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          TokenManager.setTokens(accessToken, newRefreshToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        TokenManager.clearTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Export the TokenManager for use in other components
export { TokenManager };

// User interfaces
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN' | 'LIBRARIAN';
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

// Book interfaces
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  publishYear?: number;
  coverImage?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookCreateData {
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  totalCopies: number;
  publishYear?: number;
  coverImage?: string;
  location?: string;
}

// Issue interfaces
export interface Issue {
  id: string;
  userId: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE' | 'LOST';
  createdAt: string;
  updatedAt: string;
  user?: User;
  book?: Book;
}

export interface IssueCreateData {
  bookId: string;
}

// Authentication Service
export class AuthService {
  static async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { accessToken, refreshToken, user } = response.data.data;
    
    // Store tokens and user data securely
    TokenManager.setTokens(accessToken, refreshToken);
    TokenManager.setUser(user);
    
    return response.data;
  }

  static async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    const { accessToken, refreshToken, user } = response.data.data;
    
    // Store tokens and user data securely
    TokenManager.setTokens(accessToken, refreshToken);
    TokenManager.setUser(user);
    
    return response.data;
  }

  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      TokenManager.clearTokens();
    }
  }

  static async refreshToken(): Promise<string> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    
    TokenManager.setTokens(accessToken, newRefreshToken);
    return accessToken;
  }

  static async getProfile(): Promise<User> {
    const response = await api.get<{ data: User }>('/auth/profile');
    return response.data.data;
  }

  static async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put<{ data: User }>('/auth/profile', userData);
    TokenManager.setUser(response.data.data);
    return response.data.data;
  }

  static async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/password', { oldPassword, newPassword });
  }

  static isAuthenticated(): boolean {
    return !!TokenManager.getAccessToken();
  }

  static getCurrentUser(): User | null {
    return TokenManager.getUser();
  }
}

// Book Service
export class BookService {
  static async getAllBooks(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    category?: string; 
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);

    const response = await api.get(`/books?${queryParams.toString()}`);
    return response.data;
  }

  static async getBookById(id: string): Promise<Book> {
    const response = await api.get<{ data: Book }>(`/books/${id}`);
    return response.data.data;
  }

  static async createBook(bookData: BookCreateData): Promise<Book> {
    const response = await api.post<{ data: Book }>('/books', bookData);
    return response.data.data;
  }

  static async updateBook(id: string, bookData: Partial<BookCreateData>): Promise<Book> {
    const response = await api.put<{ data: Book }>(`/books/${id}`, bookData);
    return response.data.data;
  }

  static async deleteBook(id: string): Promise<void> {
    await api.delete(`/books/${id}`);
  }

  static async searchBooks(query: string) {
    const response = await api.get(`/books?search=${encodeURIComponent(query)}`);
    return response.data;
  }

  static async getBooksByCategory(category: string) {
    const response = await api.get(`/books?category=${encodeURIComponent(category)}`);
    return response.data;
  }
}

// Issue Service
export class IssueService {
  static async getUserIssues(userId?: string) {
    const endpoint = userId ? `/issues/user/${userId}` : '/issues/my';
    const response = await api.get(endpoint);
    return response.data;
  }

  static async getAllIssues(params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    userId?: string; 
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.userId) queryParams.append('userId', params.userId);

    const response = await api.get(`/issues?${queryParams.toString()}`);
    return response.data;
  }

  static async createIssue(issueData: IssueCreateData): Promise<Issue> {
    const response = await api.post<{ data: Issue }>('/issues', issueData);
    return response.data.data;
  }

  static async updateIssueStatus(id: string, status: string): Promise<Issue> {
    const response = await api.put<{ data: Issue }>(`/issues/${id}`, { status });
    return response.data.data;
  }

  static async approveIssue(id: string): Promise<Issue> {
    const response = await api.post<{ data: Issue }>(`/issues/${id}/approve`);
    return response.data.data;
  }

  static async rejectIssue(id: string, reason?: string): Promise<Issue> {
    const response = await api.post<{ data: Issue }>(`/issues/${id}/reject`, { reason });
    return response.data.data;
  }

  static async returnBook(id: string): Promise<Issue> {
    const response = await api.post<{ data: Issue }>(`/issues/${id}/return`);
    return response.data.data;
  }

  static async renewIssue(id: string): Promise<Issue> {
    const response = await api.post<{ data: Issue }>(`/issues/${id}/renew`);
    return response.data.data;
  }
}

// User Service (Admin only)
export class UserService {
  static async getAllUsers(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    role?: string; 
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);

    const response = await api.get(`/users?${queryParams.toString()}`);
    return response.data;
  }

  static async getUserById(id: string): Promise<User> {
    const response = await api.get<{ data: User }>(`/users/${id}`);
    return response.data.data;
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.put<{ data: User }>(`/users/${id}`, userData);
    return response.data.data;
  }

  static async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }

  static async toggleUserStatus(id: string): Promise<User> {
    const response = await api.post<{ data: User }>(`/users/${id}/toggle-status`);
    return response.data.data;
  }
}

// Dashboard Service
export class DashboardService {
  static async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }

  static async getRecentActivity() {
    const response = await api.get('/dashboard/recent-activity');
    return response.data;
  }

  static async getOverdueBooks() {
    const response = await api.get('/dashboard/overdue-books');
    return response.data;
  }

  static async getPopularBooks() {
    const response = await api.get('/dashboard/popular-books');
    return response.data;
  }
}

// Error handling utility
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return new ApiError(
      data.message || 'An error occurred',
      status,
      data
    );
  } else if (error.request) {
    // Network error
    return new ApiError('Network error. Please check your connection.', 0);
  } else {
    // Other error
    return new ApiError(error.message || 'An unexpected error occurred', 0);
  }
};

// Export API instance as default
export default api;
