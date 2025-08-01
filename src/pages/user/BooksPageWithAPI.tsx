import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Book as BookIcon, 
  Plus, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  BookOpen
} from 'lucide-react';
import { BookService, IssueService, handleApiError } from '../../services/apiService';
import type { Book } from '../../services/apiService';
import { useAuth } from '../../components/auth/AuthContext';

const BooksPageWithAPI: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [issuingBook, setIssuingBook] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookDetails, setShowBookDetails] = useState(false);

  // Fetch books from API
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookService.getAllBooks({
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
      });
      
      setBooks(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch books when filters change
  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchTerm, selectedCategory]);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  // Handle book issue
  const handleIssueBook = async (bookId: string) => {
    if (!user) {
      setError('Please log in to issue books');
      return;
    }

    setIssuingBook(bookId);
    setError(null);
    
    try {
      await IssueService.createIssue({ bookId });
      
      // Show success message (you can replace with toast notification)
      alert('Book issue request submitted successfully! Please wait for admin approval.');
      
      // Refresh books to update availability
      fetchBooks();
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
    } finally {
      setIssuingBook(null);
    }
  };

  // Handle book details view
  const handleViewDetails = async (book: Book) => {
    setSelectedBook(book);
    setShowBookDetails(true);
  };

  const categories = [
    'All Categories',
    'Programming',
    'Computer Science',
    'Web Development',
    'Database',
    'Machine Learning',
    'Fiction',
    'Non-Fiction',
    'Science',
    'Mathematics'
  ];

  if (loading && books.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Books Library</h1>
          <p className="text-gray-600">Discover and issue books from our collection</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-800 hover:text-red-900 underline text-sm mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value === 'All Categories' ? '' : e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Book Cover */}
            <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              {book.coverImage ? (
                <img 
                  src={book.coverImage} 
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <BookIcon className="w-16 h-16 text-blue-600" />
              )}
            </div>

            {/* Book Info */}
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                  {book.category}
                </p>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${book.availableCopies > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={book.availableCopies > 0 ? 'text-green-700' : 'text-red-700'}>
                    {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Not available'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {book.totalCopies} total
                </span>
              </div>

              {/* Book Details */}
              {book.publishYear && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>Published {book.publishYear}</span>
                </div>
              )}

              {book.location && (
                <div className="text-xs text-gray-500 mb-3">
                  📍 {book.location}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(book)}
                  className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Details
                </button>
                
                <button
                  onClick={() => handleIssueBook(book.id)}
                  disabled={book.availableCopies === 0 || issuingBook === book.id}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                    book.availableCopies > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {issuingBook === book.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Issue
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && books.length === 0 && (
        <div className="text-center py-12">
          <BookIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory 
              ? 'Try adjusting your search criteria' 
              : 'No books are currently available in the library'
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">
            Showing page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      {showBookDetails && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Book Details</h3>
              <button
                onClick={() => setShowBookDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Book Cover */}
              <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                {selectedBook.coverImage ? (
                  <img 
                    src={selectedBook.coverImage} 
                    alt={selectedBook.title}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <BookIcon className="w-20 h-20 text-blue-600" />
                )}
              </div>

              {/* Book Information */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedBook.title}
                  </h4>
                  <p className="text-lg text-gray-600 mb-2">by {selectedBook.author}</p>
                  <p className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                    {selectedBook.category}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">ISBN:</span>
                    <p className="text-gray-600">{selectedBook.isbn}</p>
                  </div>
                  {selectedBook.publishYear && (
                    <div>
                      <span className="font-medium text-gray-700">Published:</span>
                      <p className="text-gray-600">{selectedBook.publishYear}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Total Copies:</span>
                    <p className="text-gray-600">{selectedBook.totalCopies}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Available:</span>
                    <p className={`${selectedBook.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedBook.availableCopies}
                    </p>
                  </div>
                </div>

                {selectedBook.location && (
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <p className="text-gray-600">{selectedBook.location}</p>
                  </div>
                )}

                {selectedBook.description && (
                  <div>
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="text-gray-600 mt-1">{selectedBook.description}</p>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      handleIssueBook(selectedBook.id);
                      setShowBookDetails(false);
                    }}
                    disabled={selectedBook.availableCopies === 0 || issuingBook === selectedBook.id}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                      selectedBook.availableCopies > 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {issuingBook === selectedBook.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4" />
                        {selectedBook.availableCopies > 0 ? 'Issue Book' : 'Not Available'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPageWithAPI;
