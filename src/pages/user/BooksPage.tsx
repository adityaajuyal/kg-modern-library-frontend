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

const BooksPage: React.FC = () => {
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
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

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
    // Show the issue form to collect user information
    setSelectedBook(books.find(book => book.id === bookId) || null);
    setShowIssueForm(true);
  };

  // Handle submitting the issue form
  const handleSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBook) return;
    
    setIssuingBook(selectedBook.id);
    setError(null);
    
    try {
      // For now, we'll just use the bookId and show a message
      // In a real implementation, you'd modify the backend to handle guest users
      await IssueService.createIssue({ bookId: selectedBook.id });
      
      // Show success message with user info
      alert(`Book issue request submitted successfully for ${userInfo.firstName} ${userInfo.lastName}! Please wait for admin approval.`);
      
      // Reset form and close modal
      setUserInfo({ firstName: '', lastName: '', email: '', phone: '' });
      setShowIssueForm(false);
      setSelectedBook(null);
      
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value === 'All Categories' ? '' : e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
          <div key={book.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Book Cover */}
            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              {book.coverImage ? (
                <img 
                  src={book.coverImage} 
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <BookIcon className="w-16 h-16 text-gray-600" />
              )}
            </div>

            {/* Book Info */}
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                <p className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-full inline-block">
                  {book.category}
                </p>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${book.availableCopies > 0 ? 'bg-gray-600' : 'bg-red-500'}`}></div>
                  <span className={book.availableCopies > 0 ? 'text-gray-700' : 'text-red-700'}>
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
                      ? 'bg-red-600 hover:bg-red-700 text-white'
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
              <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                {selectedBook.coverImage ? (
                  <img 
                    src={selectedBook.coverImage} 
                    alt={selectedBook.title}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <BookIcon className="w-20 h-20 text-gray-600" />
                )}
              </div>

              {/* Book Information */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedBook.title}
                  </h4>
                  <p className="text-lg text-gray-600 mb-2">by {selectedBook.author}</p>
                  <p className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-full inline-block">
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
                    <p className={`${selectedBook.availableCopies > 0 ? 'text-gray-700' : 'text-red-600'}`}>
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
                        ? 'bg-red-600 hover:bg-red-700 text-white'
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

      {/* Issue Form Modal */}
      {showIssueForm && selectedBook && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitIssue}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Issue Book: {selectedBook.title}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={userInfo.firstName}
                            onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={userInfo.lastName}
                            onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={issuingBook === selectedBook.id}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {issuingBook === selectedBook.id ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowIssueForm(false);
                      setSelectedBook(null);
                      setUserInfo({ firstName: '', lastName: '', email: '', phone: '' });
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
