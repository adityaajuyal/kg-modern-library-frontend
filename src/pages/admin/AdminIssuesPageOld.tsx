import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  BookOpen, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  DollarSign,
  Mail,
  Phone,
  RefreshCw
} from 'lucide-react';

// Mock data - replace with real API calls
const mockIssues = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    userPhone: '+1 (555) 123-4567',
    bookId: '1',
    bookTitle: 'The Great Gatsby',
    bookAuthor: 'F. Scott Fitzgerald',
    bookIsbn: '978-0-7432-7356-5',
    requestDate: '2024-01-20',
    issueDate: '2024-01-21',
    dueDate: '2024-02-04',
    returnDate: null,
    status: 'PENDING',
    fine: 0,
    notes: 'Regular borrowing request'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    userPhone: '+1 (555) 987-6543',
    bookId: '2',
    bookTitle: 'To Kill a Mockingbird',
    bookAuthor: 'Harper Lee',
    bookIsbn: '978-0-06-112008-4',
    requestDate: '2024-01-15',
    issueDate: '2024-01-16',
    dueDate: '2024-01-30',
    returnDate: null,
    status: 'ACTIVE',
    fine: 0,
    notes: 'Approved for academic research'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Bob Johnson',
    userEmail: 'bob@example.com',
    userPhone: '+1 (555) 456-7890',
    bookId: '3',
    bookTitle: '1984',
    bookAuthor: 'George Orwell',
    bookIsbn: '978-0-452-28423-4',
    requestDate: '2024-01-10',
    issueDate: '2024-01-11',
    dueDate: '2024-01-25',
    returnDate: null,
    status: 'OVERDUE',
    fine: 15.50,
    notes: 'Book club selection'
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Alice Brown',
    userEmail: 'alice@example.com',
    userPhone: '+1 (555) 321-9876',
    bookId: '4',
    bookTitle: 'The Psychology of Money',
    bookAuthor: 'Morgan Housel',
    bookIsbn: '978-0-857-19703-6',
    requestDate: '2024-01-18',
    issueDate: null,
    dueDate: null,
    returnDate: null,
    status: 'REJECTED',
    fine: 0,
    notes: 'User has outstanding fines'
  },
  {
    id: '5',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    userPhone: '+1 (555) 123-4567',
    bookId: '5',
    bookTitle: 'Atomic Habits',
    bookAuthor: 'James Clear',
    bookIsbn: '978-0-735-21129-2',
    requestDate: '2024-01-05',
    issueDate: '2024-01-06',
    dueDate: '2024-01-20',
    returnDate: '2024-01-19',
    status: 'RETURNED',
    fine: 0,
    notes: 'Returned on time'
  }
];

const statusOptions = [
  'All Status',
  'PENDING',
  'ACTIVE',
  'OVERDUE',
  'RETURNED',
  'REJECTED'
];

const AdminIssuesPage: React.FC = () => {
  const [issues, setIssues] = useState(mockIssues);
  const [filteredIssues, setFilteredIssues] = useState(mockIssues);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
        issue.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'ACTIVE':
        return 'text-blue-600 bg-blue-100';
      case 'OVERDUE':
        return 'text-red-600 bg-red-100';
      case 'RETURNED':
        return 'text-green-600 bg-green-100';
      case 'REJECTED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'ACTIVE':
        return <BookOpen className="h-4 w-4" />;
      case 'OVERDUE':
        return <AlertCircle className="h-4 w-4" />;
      case 'RETURNED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleApproveIssue = async (issueId: string) => {
    setActionLoading(issueId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update issue status
      setIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === issueId 
            ? { 
                ...issue, 
                status: 'ACTIVE',
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              }
            : issue
        )
      );
      
      alert('Issue approved successfully!');
    } catch (error) {
      console.error('Error approving issue:', error);
      alert('Failed to approve issue. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectIssue = async (issueId: string) => {
    setActionLoading(issueId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update issue status
      setIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === issueId 
            ? { ...issue, status: 'REJECTED' }
            : issue
        )
      );
      
      alert('Issue rejected successfully!');
    } catch (error) {
      console.error('Error rejecting issue:', error);
      alert('Failed to reject issue. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (issue: any) => {
    setSelectedIssue(issue);
    setShowDetailModal(true);
  };

  const getStats = () => {
    const pending = issues.filter(issue => issue.status === 'PENDING').length;
    const active = issues.filter(issue => issue.status === 'ACTIVE').length;
    const overdue = issues.filter(issue => issue.status === 'OVERDUE').length;
    const totalFines = issues.reduce((sum, issue) => sum + issue.fine, 0);
    
    return { pending, active, overdue, totalFines };
  };

  const stats = getStats();

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Issues</h1>
          <p className="mt-2 text-gray-600">
            Review and manage book issue requests and active loans
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Issues</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.overdue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Fines</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.totalFines.toFixed(2)}</p>
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
              placeholder="Search issues, users, or books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredIssues.length} issues found
            </div>
          </div>
        </div>

        {/* Issues Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User & Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-red-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {issue.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {issue.bookTitle}
                          </div>
                          <div className="text-xs text-gray-400">
                            by {issue.bookAuthor}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(issue.requestDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {getStatusIcon(issue.status)}
                        <span className="ml-1">{issue.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.fine > 0 ? (
                        <span className="text-red-600 font-medium">
                          ${issue.fine.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(issue)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {issue.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApproveIssue(issue.id)}
                              disabled={actionLoading === issue.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              {actionLoading === issue.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRejectIssue(issue.id)}
                              disabled={actionLoading === issue.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                : 'No issue requests at the moment'
              }
            </p>
          </div>
        )}

        {/* Issue Detail Modal */}
        {showDetailModal && selectedIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Issue Details</h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>

                {/* User Information */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">User Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900 font-medium">{selectedIssue.userName}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{selectedIssue.userEmail}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{selectedIssue.userPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Book Information */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Book Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900 font-medium">{selectedIssue.bookTitle}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{selectedIssue.bookAuthor}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">ISBN: {selectedIssue.bookIsbn}</span>
                    </div>
                  </div>
                </div>

                {/* Issue Timeline */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Issue Timeline</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Request Date:</span>
                      <span className="text-sm text-gray-900">{new Date(selectedIssue.requestDate).toLocaleDateString()}</span>
                    </div>
                    {selectedIssue.issueDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Issue Date:</span>
                        <span className="text-sm text-gray-900">{new Date(selectedIssue.issueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedIssue.dueDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Due Date:</span>
                        <span className="text-sm text-gray-900">{new Date(selectedIssue.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedIssue.returnDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Return Date:</span>
                        <span className="text-sm text-gray-900">{new Date(selectedIssue.returnDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and Fine */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Status & Fine</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedIssue.status)}`}>
                        {getStatusIcon(selectedIssue.status)}
                        <span className="ml-1">{selectedIssue.status}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Fine:</span>
                      <span className={`text-sm font-medium ${selectedIssue.fine > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        ${selectedIssue.fine.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedIssue.notes && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Notes</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">{selectedIssue.notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedIssue.status === 'PENDING' && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        handleApproveIssue(selectedIssue.id);
                        setShowDetailModal(false);
                      }}
                      className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4 mr-2 inline" />
                      Approve Issue
                    </button>
                    <button
                      onClick={() => {
                        handleRejectIssue(selectedIssue.id);
                        setShowDetailModal(false);
                      }}
                      className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      <XCircle className="h-4 w-4 mr-2 inline" />
                      Reject Issue
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminIssuesPage;
