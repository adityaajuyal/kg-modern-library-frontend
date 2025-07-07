import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Book, 
  User, 
  Calendar,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Check,
  X
} from 'lucide-react';
import { IssueService, handleApiError } from '../../services/apiService';
import type { Issue } from '../../services/apiService';

const AdminIssuesPageWithAPI: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingIssue, setProcessingIssue] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showIssueDetails, setShowIssueDetails] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Fetch issues from API
  const fetchIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await IssueService.getAllIssues({
        page: currentPage,
        limit: 10,
        status: statusFilter || undefined,
      });
      
      setIssues(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch issues when filters change
  useEffect(() => {
    fetchIssues();
  }, [currentPage, statusFilter]);

  // Handle issue rejection
  const handleRejectIssue = async (issueId: string, reason?: string) => {
    setProcessingIssue(issueId);
    setError(null);
    
    try {
      await IssueService.rejectIssue(issueId, reason);
      
      // Show success message
      alert('Issue rejected successfully!');
      
      // Refresh issues list
      fetchIssues();
      setShowRejectModal(false);
      setRejectReason('');
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
    } finally {
      setProcessingIssue(null);
    }
  };

  // Handle return book
  const handleReturnBook = async (issueId: string) => {
    setProcessingIssue(issueId);
    setError(null);
    
    try {
      await IssueService.returnBook(issueId);
      
      // Show success message
      alert('Book returned successfully!');
      
      // Refresh issues list
      fetchIssues();
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
    } finally {
      setProcessingIssue(null);
    }
  };

  // Handle view issue details
  const handleViewDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setShowIssueDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ISSUED':
        return 'bg-green-100 text-green-800';
      case 'RETURNED':
        return 'bg-blue-100 text-blue-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'LOST':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ISSUED':
        return <CheckCircle className="w-4 h-4" />;
      case 'RETURNED':
        return <CheckCircle className="w-4 h-4" />;
      case 'OVERDUE':
        return <Clock className="w-4 h-4" />;
      case 'LOST':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && issues.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Issue Management</h1>
          <p className="text-gray-600">Manage book issue requests and returns</p>
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by user or book..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="ISSUED">Issued</option>
              <option value="RETURNED">Returned</option>
              <option value="OVERDUE">Overdue</option>
              <option value="LOST">Lost</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Book</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Issue Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {issue.user ? `${issue.user.firstName} ${issue.user.lastName}` : 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500">{issue.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Book className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {issue.book?.title || 'Unknown Book'}
                        </p>
                        <p className="text-sm text-gray-500">{issue.book?.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(issue.issueDate)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(issue.dueDate)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                      {getStatusIcon(issue.status)}
                      {issue.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(issue)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {issue.status === 'ISSUED' && (
                        <>
                          <button
                            onClick={() => handleReturnBook(issue.id)}
                            disabled={processingIssue === issue.id}
                            className="text-green-600 hover:text-green-800 p-1 rounded"
                            title="Mark as Returned"
                          >
                            {processingIssue === issue.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setShowRejectModal(true);
                            }}
                            disabled={processingIssue === issue.id}
                            className="text-red-600 hover:text-red-800 p-1 rounded"
                            title="Reject Issue"
                          >
                            <X className="w-4 h-4" />
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

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {issues.map((issue) => (
            <div key={issue.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {issue.user ? `${issue.user.firstName} ${issue.user.lastName}` : 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-500">{issue.user?.email}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">{issue.book?.title || 'Unknown Book'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Due: {formatDate(issue.dueDate)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                  {getStatusIcon(issue.status)}
                  {issue.status}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewDetails(issue)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {issue.status === 'ISSUED' && (
                    <>
                      <button
                        onClick={() => handleReturnBook(issue.id)}
                        disabled={processingIssue === issue.id}
                        className="text-green-600 hover:text-green-800 p-1 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedIssue(issue);
                          setShowRejectModal(true);
                        }}
                        disabled={processingIssue === issue.id}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {!loading && issues.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-600">
            {statusFilter 
              ? 'No issues match the selected status' 
              : 'No book issues are currently in the system'
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

      {/* Issue Details Modal */}
      {showIssueDetails && selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Issue Details</h3>
              <button
                onClick={() => setShowIssueDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">User Information</h5>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedIssue.user ? `${selectedIssue.user.firstName} ${selectedIssue.user.lastName}` : 'Unknown User'}</p>
                    <p><span className="font-medium">Email:</span> {selectedIssue.user?.email}</p>
                    <p><span className="font-medium">Role:</span> {selectedIssue.user?.role}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Book Information</h5>
                  <div className="space-y-2">
                    <p><span className="font-medium">Title:</span> {selectedIssue.book?.title || 'Unknown Book'}</p>
                    <p><span className="font-medium">Author:</span> {selectedIssue.book?.author}</p>
                    <p><span className="font-medium">ISBN:</span> {selectedIssue.book?.isbn}</p>
                    <p><span className="font-medium">Category:</span> {selectedIssue.book?.category}</p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-3">Issue Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Issue Date:</span>
                    <p className="text-gray-600">{formatDate(selectedIssue.issueDate)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Due Date:</span>
                    <p className="text-gray-600">{formatDate(selectedIssue.dueDate)}</p>
                  </div>
                  {selectedIssue.returnDate && (
                    <div>
                      <span className="font-medium">Return Date:</span>
                      <p className="text-gray-600">{formatDate(selectedIssue.returnDate)}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ml-2 ${getStatusColor(selectedIssue.status)}`}>
                      {getStatusIcon(selectedIssue.status)}
                      {selectedIssue.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedIssue.status === 'ISSUED' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleReturnBook(selectedIssue.id);
                      setShowIssueDetails(false);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                  >
                    Mark as Returned
                  </button>
                  <button
                    onClick={() => {
                      setShowIssueDetails(false);
                      setShowRejectModal(true);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                  >
                    Reject Issue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Issue</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject this issue? Please provide a reason:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectIssue(selectedIssue.id, rejectReason)}
                disabled={processingIssue === selectedIssue.id}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                {processingIssue === selectedIssue.id ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminIssuesPageWithAPI;
