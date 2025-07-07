import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  TrendingUp,
  Plus,
  BookOpen,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign
} from 'lucide-react';

// Mock data - replace with real API calls
const mockStats = {
  totalBooks: 1250,
  totalUsers: 89,
  activeIssues: 156,
  overdueBooks: 12,
  totalRevenue: 2450,
  newUsersToday: 5
};

const mockRecentIssues = [
  {
    id: '1',
    userName: 'John Doe',
    bookTitle: 'The Great Gatsby',
    issueDate: '2024-01-15',
    dueDate: '2024-01-29',
    status: 'ACTIVE',
    overdue: false
  },
  {
    id: '2',
    userName: 'Jane Smith',
    bookTitle: 'To Kill a Mockingbird',
    issueDate: '2024-01-10',
    dueDate: '2024-01-24',
    status: 'OVERDUE',
    overdue: true
  },
  {
    id: '3',
    userName: 'Bob Johnson',
    bookTitle: '1984',
    issueDate: '2024-01-12',
    dueDate: '2024-01-26',
    status: 'RETURNED',
    overdue: false
  }
];

const mockRecentBooks = [
  {
    id: '1',
    title: 'The Psychology of Programming',
    author: 'Gerald M. Weinberg',
    isbn: '978-0932633420',
    copies: 5,
    available: 3,
    addedDate: '2024-01-14'
  },
  {
    id: '2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    copies: 8,
    available: 2,
    addedDate: '2024-01-13'
  }
];

const AdminDashboard: React.FC = () => {
  const [stats] = useState(mockStats);
  const [recentIssues] = useState(mockRecentIssues);
  const [recentBooks] = useState(mockRecentBooks);
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
        return 'text-gray-900 bg-gray-100';
      case 'OVERDUE':
        return 'text-red-600 bg-red-100';
      case 'RETURNED':
        return 'text-gray-600 bg-gray-200';
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
        return <XCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
              Admin Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here's what's happening in your library today.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Quick Add Book
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow-md rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-gray-700" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Books
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalBooks.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-md rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-gray-700" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Users
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalUsers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-md rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-gray-700" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Issues
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.activeIssues}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-md rounded-lg border border-gray-200">
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
                      {stats.overdueBooks}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue and New Users */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="bg-white overflow-hidden shadow-md rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Revenue (Fines)
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      ${stats.totalRevenue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-md rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-gray-700" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      New Users Today
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stats.newUsersToday}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Recent Issues */}
          <div className="bg-white shadow-md rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Issues
              </h3>
              <div className="space-y-4">
                {recentIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
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
                      <p className="text-sm text-gray-500">{issue.userName}</p>
                      <p className="text-xs text-gray-400">
                        Due: {new Date(issue.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recently Added Books */}
          <div className="bg-white shadow-md rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recently Added Books
              </h3>
              <div className="space-y-4">
                {recentBooks.map((book) => (
                  <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {book.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {book.available}/{book.copies} available
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{book.author}</p>
                      <p className="text-xs text-gray-400">
                        Added: {new Date(book.addedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
