import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Book, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  DollarSign,
  Eye
} from 'lucide-react';
import { IssueService, handleApiError } from '../../services/apiService';
import type { Issue } from '../../services/apiService';
import { useAuth } from '../../components/auth/AuthContext';

const IssuesPageWithAPI: React.FC = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showIssueDetails, setShowIssueDetails] = useState(false);

  // Fetch user's issues from API
  const fetchIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await IssueService.getUserIssues();
      
      // Filter issues by status if filter is applied
      let filteredIssues = response.data || [];
      if (statusFilter) {
        filteredIssues = filteredIssues.filter((issue: Issue) => issue.status === statusFilter);
      }
      
      // Simple pagination (client-side)
      const startIndex = (currentPage - 1) * 10;
      const endIndex = startIndex + 10;
      const paginatedIssues = filteredIssues.slice(startIndex, endIndex);
      
      setIssues(paginatedIssues);
      setTotalPages(Math.ceil(filteredIssues.length / 10));
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch issues when component mounts or filters change
  useEffect(() => {
    fetchIssues();
  }, [currentPage, statusFilter, user?.id]);

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'ISSUED':
        return { color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Clock };
      case 'RETURNED':
        return { color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle };
      case 'OVERDUE':
        return { color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle };
      case 'LOST':
        return { color: 'text-gray-600', bgColor: 'bg-gray-50', icon: XCircle };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-50', icon: AlertCircle };
    }
  };

  // Calculate fine amount
  const calculateFine = (issue: Issue): number => {
    if (issue.status !== 'OVERDUE' || !issue.dueDate) return 0;
    
    const currentDate = new Date();
    const dueDate = new Date(issue.dueDate);
    
    if (currentDate > dueDate) {
      const daysDiff = Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff * 2; // $2 per day fine
    }
    
    return 0;
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle issue details
  const handleViewDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setShowIssueDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedIssue(null);
    setShowIssueDetails(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Issues</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchIssues}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Issues</h1>
          <p className="text-gray-600">Track your book borrowing history and current issues</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="ISSUED">Issued</option>
                <option value="RETURNED">Returned</option>
                <option value="OVERDUE">Overdue</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchIssues}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Issues Grid */}
        {issues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Book className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Issues Found</h3>
            <p className="text-gray-600">
              {statusFilter 
                ? `No issues found with status "${statusFilter}"`
                : "You haven't borrowed any books yet."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => {
              const statusInfo = getStatusInfo(issue.status);
              const StatusIcon = statusInfo.icon;
              const fine = calculateFine(issue);

              return (
                <div
                  key={issue.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Book className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {issue.book?.title || 'Unknown Book'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          by {issue.book?.author || 'Unknown Author'}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-500">
                            Issue Date: {new Date(issue.issueDate).toLocaleDateString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            Due Date: {new Date(issue.dueDate).toLocaleDateString()}
                          </span>
                          {issue.returnDate && (
                            <span className="text-sm text-gray-500">
                              Return Date: {new Date(issue.returnDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bgColor}`}>
                        <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                        <span className={`text-sm font-medium ${statusInfo.color}`}>
                          {issue.status}
                        </span>
                      </div>
                      {fine > 0 && (
                        <div className="flex items-center gap-1 text-red-600">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm font-medium">${fine}</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleViewDetails(issue)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>

      {/* Issue Details Modal */}
      {showIssueDetails && selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Issue Details</h3>
              <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Book</h4>
                <p className="text-sm text-gray-900">{selectedIssue.book?.title}</p>
                <p className="text-sm text-gray-600">by {selectedIssue.book?.author}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Issue Date</h4>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedIssue.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Status</h4>
                  <p className="text-sm text-gray-900">{selectedIssue.status}</p>
                </div>
              </div>
              
              {selectedIssue.issueDate && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Issue Date</h4>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedIssue.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Due Date</h4>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedIssue.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              
              {selectedIssue.returnDate && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Return Date</h4>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedIssue.returnDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              {calculateFine(selectedIssue) > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Fine</h4>
                  <p className="text-sm text-red-600 font-medium">${calculateFine(selectedIssue)}</p>
                </div>
              )}
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuesPageWithAPI;
