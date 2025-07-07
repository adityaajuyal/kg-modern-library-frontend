import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  RefreshCw,
  Filter,
  Search,
  ArrowUpRight,
  DollarSign
} from 'lucide-react';

// Mock data - replace with real API calls
const mockIssues = [
  {
    id: '1',
    bookId: '1',
    bookTitle: 'The Great Gatsby',
    bookAuthor: 'F. Scott Fitzgerald',
    bookIsbn: '978-0-7432-7356-5',
    issueDate: '2024-01-15',
    dueDate: '2024-01-29',
    returnDate: null,
    status: 'ACTIVE',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    overdueDays: 0
  },
  {
    id: '2',
    bookId: '2',
    bookTitle: 'To Kill a Mockingbird',
    bookAuthor: 'Harper Lee',
    bookIsbn: '978-0-06-112008-4',
    issueDate: '2024-01-05',
    dueDate: '2024-01-19',
    returnDate: null,
    status: 'OVERDUE',
    fine: 15.50,
    renewalCount: 1,
    maxRenewals: 2,
    overdueDays: 8
  },
  {
    id: '3',
    bookId: '3',
    bookTitle: '1984',
    bookAuthor: 'George Orwell',
    bookIsbn: '978-0-452-28423-4',
    issueDate: '2024-01-01',
    dueDate: '2024-01-15',
    returnDate: '2024-01-14',
    status: 'RETURNED',
    fine: 0,
    renewalCount: 0,
    maxRenewals: 2,
    overdueDays: 0
  },
  {
    id: '4',
    bookId: '4',
    bookTitle: 'The Psychology of Money',
    bookAuthor: 'Morgan Housel',
    bookIsbn: '978-0-857-19703-6',
    issueDate: '2024-01-10',
    dueDate: '2024-01-24',
    returnDate: null,
    status: 'ACTIVE',
    fine: 0,
    renewalCount: 1,
    maxRenewals: 2,
    overdueDays: 0
  }
];

const statusOptions = [
  'All Status',
  'ACTIVE',
  'OVERDUE',
  'RETURNED',
  'CANCELLED'
];

const IssuesPage: React.FC = () => {
  const [issues, setIssues] = useState(mockIssues);
  const [filteredIssues, setFilteredIssues] = useState(mockIssues);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [renewLoading, setRenewLoading] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = issues;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(issue => 
        issue.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.bookAuthor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.bookIsbn.includes(searchTerm)
      );
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== 'All Status') {
      filtered = filtered.filter(issue => issue.status === selectedStatus);
    }

    setFilteredIssues(filtered);
  }, [searchTerm, selectedStatus, issues]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-blue-600 bg-blue-100';
      case 'OVERDUE':
        return 'text-red-600 bg-red-100';
      case 'RETURNED':
        return 'text-green-600 bg-green-100';
      case 'CANCELLED':
        return 'text-gray-600 bg-gray-100';
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
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleRenewBook = async (issueId: string) => {
    setRenewLoading(issueId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update issue with new due date and renewal count
      setIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === issueId 
            ? { 
                ...issue, 
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                renewalCount: issue.renewalCount + 1
              }
            : issue
        )
      );
      
      alert('Book renewed successfully!');
    } catch (error) {
      console.error('Error renewing book:', error);
      alert('Failed to renew book. Please try again.');
    } finally {
      setRenewLoading(null);
    }
  };

  const canRenew = (issue: any) => {
    return issue.status === 'ACTIVE' && 
           issue.renewalCount < issue.maxRenewals && 
           issue.fine === 0;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTotalFines = () => {
    return issues.reduce((total, issue) => total + issue.fine, 0);
  };

  const getActiveIssuesCount = () => {
    return issues.filter(issue => issue.status === 'ACTIVE').length;
  };

  const getOverdueIssuesCount = () => {
    return issues.filter(issue => issue.status === 'OVERDUE').length;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Issues</h1>
          <p className="mt-2 text-gray-600">
            Track your borrowed books and manage renewals
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Issues</p>
                <p className="text-2xl font-semibold text-gray-900">{getActiveIssuesCount()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Overdue Books</p>
                <p className="text-2xl font-semibold text-gray-900">{getOverdueIssuesCount()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Fines</p>
                <p className="text-2xl font-semibold text-gray-900">${getTotalFines().toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {issue.bookTitle}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
                      {getStatusIcon(issue.status)}
                      <span className="ml-2">{issue.status}</span>
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{issue.bookAuthor}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        Issued: {new Date(issue.issueDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className={`${issue.status === 'OVERDUE' ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        Due: {new Date(issue.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {issue.returnDate && (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-600">
                          Returned: {new Date(issue.returnDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        Renewals: {issue.renewalCount}/{issue.maxRenewals}
                      </span>
                    </div>
                  </div>

                  {/* Days until due / overdue info */}
                  {issue.status === 'ACTIVE' && (
                    <div className="mt-3">
                      {getDaysUntilDue(issue.dueDate) > 0 ? (
                        <p className="text-sm text-gray-600">
                          {getDaysUntilDue(issue.dueDate)} day(s) remaining
                        </p>
                      ) : (
                        <p className="text-sm text-red-600 font-medium">
                          Overdue by {Math.abs(getDaysUntilDue(issue.dueDate))} day(s)
                        </p>
                      )}
                    </div>
                  )}

                  {/* Fine information */}
                  {issue.fine > 0 && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-sm text-red-800 font-medium">
                          Fine: ${issue.fine.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="ml-6 flex flex-col space-y-2">
                  {canRenew(issue) && (
                    <button
                      onClick={() => handleRenewBook(issue.id)}
                      disabled={renewLoading === issue.id}
                      className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {renewLoading === issue.id ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Renewing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Renew
                        </>
                      )}
                    </button>
                  )}
                  
                  <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Issues */}
        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No issues found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedStatus !== 'All Status' 
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t issued any books yet. Browse our collection to get started!'
              }
            </p>
          </div>
        )}

        {/* Outstanding Fines Alert */}
        {getTotalFines() > 0 && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">
                  Outstanding Fines: ${getTotalFines().toFixed(2)}
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Please pay your fines to continue borrowing books. You can pay online or at the library counter.
                </p>
                <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuesPage;
