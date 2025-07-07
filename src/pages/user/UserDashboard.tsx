import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Star,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react';

// Mock data - replace with real API calls
const mockUserStats = {
  booksIssued: 12,
  booksReturned: 8,
  currentIssues: 3,
  overdueBooksCount: 1,
  totalFines: 25.50,
  memberSince: '2023-06-15'
};

const mockCurrentIssues = [
  {
    id: '1',
    bookTitle: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    issueDate: '2024-01-15',
    dueDate: '2024-01-29',
    status: 'ACTIVE',
    overdue: false
  },
  {
    id: '2',
    bookTitle: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    issueDate: '2024-01-10',
    dueDate: '2024-01-24',
    status: 'OVERDUE',
    overdue: true
  },
  {
    id: '3',
    bookTitle: '1984',
    author: 'George Orwell',
    issueDate: '2024-01-12',
    dueDate: '2024-01-26',
    status: 'ACTIVE',
    overdue: false
  }
];

const mockRecommendedBooks = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    rating: 4.8,
    category: 'Self-Help',
    available: true
  },
  {
    id: '2',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    rating: 4.6,
    category: 'Finance',
    available: true
  },
  {
    id: '3',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    rating: 4.7,
    category: 'History',
    available: false
  }
];

const UserDashboard: React.FC = () => {
  const [stats] = useState(mockUserStats);
  const [currentIssues] = useState(mockCurrentIssues);
  const [recommendedBooks] = useState(mockRecommendedBooks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-blue-600 bg-blue-100';
      case 'OVERDUE':
        return 'text-red-600 bg-red-100';
      case 'RETURNED':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Clock className="h-4 w-4" />;
      case 'OVERDUE':
        return <AlertCircle className="h-4 w-4" />;
      case 'RETURNED':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
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
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome to KG Modern Library!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Browse and issue books without any login required
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <span className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100">
              <User className="h-4 w-4 mr-2" />
              Member since {new Date(stats.memberSince).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Books Issued
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.booksIssued}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Books Returned
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.booksReturned}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Current Issues
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.currentIssues}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Overdue Books
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.overdueBooksCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Issues and Recommendations */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Current Issues */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Current Issues
                </h3>
                <a href="/issues" className="text-sm text-indigo-600 hover:text-indigo-500">
                  View all
                </a>
              </div>
              <div className="space-y-4">
                {currentIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {issue.bookTitle}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {getStatusIcon(issue.status)}
                          <span className="ml-1">{issue.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{issue.author}</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due: {new Date(issue.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Books */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recommended for You
                </h3>
                <a href="/books" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Explore books
                </a>
              </div>
              <div className="space-y-4">
                {recommendedBooks.map((book) => (
                  <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {book.title}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          book.available ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                        }`}>
                          {book.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{book.author}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center">
                          {renderStars(book.rating)}
                          <span className="ml-1 text-xs text-gray-500">
                            {book.rating}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {book.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="/books"
                className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="h-6 w-6 text-indigo-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Browse Books</span>
              </a>
              <a
                href="/issues"
                className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Clock className="h-6 w-6 text-yellow-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">View Issues</span>
              </a>
              <a
                href="/profile"
                className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="h-6 w-6 text-green-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Update Profile</span>
              </a>
              <a
                href="/books?category=trending"
                className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <TrendingUp className="h-6 w-6 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Trending Books</span>
              </a>
            </div>
          </div>
        </div>

        {/* Fines Section */}
        {stats.totalFines > 0 && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">
                  Outstanding Fines
                </h3>
                <p className="text-sm text-red-700">
                  You have ${stats.totalFines.toFixed(2)} in outstanding fines. Please pay to continue borrowing books.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
