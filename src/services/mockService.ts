// Mock data service for frontend-only deployment
import type { Book } from './apiService';

// Mock book data
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    category: 'Classic Literature',
    description: 'A classic American novel about the Jazz Age',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41NssxNlPlL.jpg',
    totalCopies: 5,
    availableCopies: 3,
    location: 'A1-B2',
    isActive: true,
    publishYear: 1925,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    category: 'Classic Literature',
    description: 'A gripping tale of racial injustice and childhood innocence',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51IXWZzlgSL.jpg',
    totalCopies: 4,
    availableCopies: 2,
    location: 'A1-B3',
    isActive: true,
    publishYear: 1960,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '978-0-316-76948-0',
    category: 'Classic Literature',
    description: 'A controversial novel about teenage rebellion',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/53%2BNiZM%2BIkL.jpg',
    totalCopies: 3,
    availableCopies: 1,
    location: 'A1-B4',
    isActive: true,
    publishYear: 1951,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock service for frontend-only deployment
export const MockBookService = {
  getAllBooks: async (params?: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredBooks = [...mockBooks];
    
    if (params?.search) {
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(params.search.toLowerCase()) ||
        book.author.toLowerCase().includes(params.search.toLowerCase())
      );
    }
    
    if (params?.category) {
      filteredBooks = filteredBooks.filter(book => book.category === params.category);
    }
    
    return {
      data: filteredBooks,
      total: filteredBooks.length,
      page: 1,
      limit: 20
    };
  },
  
  createBook: async (bookData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newBook = {
      ...bookData,
      id: Date.now().toString(),
      availableCopies: bookData.totalCopies,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockBooks.push(newBook);
    return { data: newBook };
  },
  
  updateBook: async (id: string, bookData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockBooks.findIndex(book => book.id === id);
    if (index !== -1) {
      mockBooks[index] = { ...mockBooks[index], ...bookData, updatedAt: new Date() };
      return { data: mockBooks[index] };
    }
    throw new Error('Book not found');
  },
  
  deleteBook: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockBooks.findIndex(book => book.id === id);
    if (index !== -1) {
      mockBooks.splice(index, 1);
      return { success: true };
    }
    throw new Error('Book not found');
  }
};

// Use this instead of the real API service for demo deployment
export const isDemoMode = import.meta.env.NODE_ENV === 'production' && !import.meta.env.VITE_API_URL;
