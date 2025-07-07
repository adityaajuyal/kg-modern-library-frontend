import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  BookOpen, 
  Clock, 
  User,
  Calendar,
  Tag,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  X
} from 'lucide-react';

// Mock data - replace with real API calls
const mockBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    category: 'Classic Literature',
    description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
    totalCopies: 5,
    availableCopies: 3,
    publishedYear: 1925,
    rating: 4.2,
    cover: '/api/placeholder/300/400',
    tags: ['Classic', 'American Literature', 'Drama']
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    category: 'Classic Literature',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    totalCopies: 4,
    availableCopies: 0,
    publishedYear: 1960,
    rating: 4.8,
    cover: '/api/placeholder/300/400',
    tags: ['Classic', 'Social Issues', 'Coming of Age']
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0-452-28423-4',
    category: 'Dystopian Fiction',
    description: 'A dystopian masterpiece about totalitarianism and the power of language.',
    totalCopies: 6,
    availableCopies: 2,
    publishedYear: 1949,
    rating: 4.6,
    cover: '/api/placeholder/300/400',
    tags: ['Dystopian', 'Political', 'Science Fiction']
  },
  {
    id: '4',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    isbn: '978-0-857-19703-6',
    category: 'Finance',
    description: 'Timeless lessons on wealth, greed, and happiness from one of the most important financial writers.',
    totalCopies: 3,
    availableCopies: 1,
    publishedYear: 2020,
    rating: 4.5,
    cover: '/api/placeholder/300/400',
    tags: ['Finance', 'Psychology', 'Self-Help']
  },
  {
    id: '5',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0-735-21129-2',
    category: 'Self-Help',
    description: 'An easy & proven way to build good habits & break bad ones.',
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 2018,
    rating: 4.7,
    cover: '/api/placeholder/300/400',
    tags: ['Self-Help', 'Productivity', 'Psychology']
  },
  {
    id: '6',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    isbn: '978-0-062-31609-7',
    category: 'History',
    description: 'A brief history of humankind from the Stone Age to the present.',
    totalCopies: 5,
    availableCopies: 1,
    publishedYear: 2011,
    rating: 4.4,
    cover: '/api/placeholder/300/400',
    tags: ['History', 'Anthropology', 'Science']
  }
];

const categories = [
  'All Categories',
  'Classic Literature',
  'Dystopian Fiction',
  'Finance',
  'Self-Help',
  'History',
  'Science Fiction',
  'Biography',
  'Technology'
];

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState(mockBooks);
  const [filteredBooks, setFilteredBooks] = useState(mockBooks);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueLoading, setIssueLoading] = useState(false);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = books;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All Categories') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  }, [searchTerm, selectedCategory, books]);

  const handleIssueBook = async (book: any) => {
    setSelectedBook(book);
    setShowIssueModal(true);
  };

  const confirmIssueBook = async () => {
    if (!selectedBook) return;
    
    setIssueLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update book availability
      setBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === selectedBook.id 
            ? { ...book, availableCopies: book.availableCopies - 1 }
            : book
        )
      );
      
      setShowIssueModal(false);
      setSelectedBook(null);
      
      // You could show a success message here
      alert('Book issued successfully!');
    } catch (error) {
      console.error('Error issuing book:', error);
      alert('Failed to issue book. Please try again.');
    } finally {
      setIssueLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Books</h1>
            <p className="mt-2 text-gray-600">
              Discover your next favorite book from our collection
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {filteredBooks.length} books found
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search books, authors, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {(searchTerm || selectedCategory !== 'All Categories') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All Categories');
                }}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="h-4 w-4 mr-1" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Book Cover */}
              <div className="aspect-w-3 aspect-h-4 bg-gray-200">
                <div className="flex items-center justify-center h-48 bg-gradient-to-br from-indigo-100 to-purple-100">
                  <BookOpen className="h-16 w-16 text-indigo-400" />
                </div>
              </div>

              {/* Book Details */}
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {renderStars(book.rating)}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    ({book.rating})
                  </span>
                </div>

                {/* Category and Year */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    <Tag className="h-3 w-3 mr-1" />
                    {book.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {book.publishedYear}
                  </span>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm">
                    <BookOpen className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-gray-600">
                      {book.availableCopies}/{book.totalCopies} available
                    </span>
                  </div>
                  {book.availableCopies > 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {book.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleIssueBook(book)}
                  disabled={book.availableCopies === 0}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    book.availableCopies > 0
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {book.availableCopies > 0 ? 'Issue Book' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Issue Book Modal */}
        {showIssueModal && selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Issue Book
                </h3>
                <button
                  onClick={() => setShowIssueModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-indigo-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{selectedBook.title}</h4>
                    <p className="text-sm text-gray-600">{selectedBook.author}</p>
                    <p className="text-sm text-gray-500">ISBN: {selectedBook.isbn}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Issue Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      Issue Date: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      Due Date: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      Available Copies: {selectedBook.availableCopies}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowIssueModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmIssueBook}
                  disabled={issueLoading}
                  className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {issueLoading ? 'Issuing...' : 'Confirm Issue'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;
