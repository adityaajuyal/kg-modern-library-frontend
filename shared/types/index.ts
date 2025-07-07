// Common types shared between frontend and backend

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishYear?: number;
  category: string;
  description?: string;
  coverImage?: string;
  totalCopies: number;
  availableCopies: number;
  location?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IssueRecord {
  id: string;
  userId: string;
  bookId: string;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: IssueStatus;
  renewalCount: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  book?: Book;
}

export interface Fine {
  id: string;
  userId: string;
  issueRecordId: string;
  amount: number;
  reason: string;
  status: FineStatus;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  issueRecord?: IssueRecord;
}

export interface Reservation {
  id: string;
  userId: string;
  bookId: string;
  reservationDate: Date;
  expiryDate: Date;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  book?: Book;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  LIBRARIAN = 'LIBRARIAN'
}

export enum IssueStatus {
  ISSUED = 'ISSUED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
  LOST = 'LOST'
}

export enum FineStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  WAIVED = 'WAIVED'
}

export enum ReservationStatus {
  ACTIVE = 'ACTIVE',
  FULFILLED = 'FULFILLED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

// Book Management Types
export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishYear?: number;
  category: string;
  description?: string;
  coverImage?: string;
  totalCopies: number;
  location?: string;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  id: string;
}

export interface BookSearchFilters {
  title?: string;
  author?: string;
  category?: string;
  isbn?: string;
  page?: number;
  limit?: number;
}

// Issue/Return Types
export interface IssueBookRequest {
  bookId: string;
  userId: string;
  dueDate: Date;
}

export interface ReturnBookRequest {
  issueRecordId: string;
  returnDate?: Date;
}

export interface RenewBookRequest {
  issueRecordId: string;
  newDueDate: Date;
}

// Fine Management Types
export interface CreateFineRequest {
  userId: string;
  issueRecordId: string;
  amount: number;
  reason: string;
}

export interface PayFineRequest {
  fineId: string;
  paymentMethod?: string;
}

// Reservation Types
export interface CreateReservationRequest {
  bookId: string;
  userId: string;
  expiryDate: Date;
}

// Dashboard Types
export interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  totalIssued: number;
  totalOverdue: number;
  totalFines: number;
  recentActivity: any[];
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  author?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRange {
  from: Date;
  to: Date;
}
