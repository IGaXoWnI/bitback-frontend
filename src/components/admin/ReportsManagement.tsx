import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Define the report interface based on actual API response
interface Report {
  id: number;
  box_id: number;
  user_id: number;
  reason: string;
  description: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
  };
  box?: {
    id: number;
    title: string;
    description: string;
    original_price: string;
    discounted_price: string;
    image: string;
    quantity_available: number;
    quantity_reserved: number;
    business_id: number;
    is_active: boolean;
  };
}

function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // Fetch all reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  // Function to fetch reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://127.0.0.1:8000/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        // Access the paginated data properly
        if (response.data.data && Array.isArray(response.data.data.data)) {
          setReports(response.data.data.data);
        } else {
          setReports([]);
          setError('Received invalid data format from server');
        }
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to update report status
  const updateReportStatus = async () => {
    if (!editingReport) return;
    
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `http://127.0.0.1:8000/api/reports/${editingReport.id}`, 
        { 
          status: newStatus,
          admin_notes: adminNotes 
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Update the report in the local state
        setReports(reports.map(report => 
          report.id === editingReport.id 
            ? { ...report, status: newStatus, admin_notes: adminNotes } 
            : report
        ));
        
        toast.success('Report status updated successfully');
        setShowEditModal(false);
        setEditingReport(null);
        setAdminNotes('');
      } else {
        toast.error(response.data.message || 'Failed to update report');
      }
    } catch (error) {
      console.error('Error updating report:', error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error('You don\'t have permission to update this report');
      } else if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Authentication expired. Please log in again.');
      } else {
        toast.error('Failed to update report status');
      }
    } finally {
      setUpdating(false);
    }
  };

  // Open edit modal for a report
  const handleEditClick = (report: Report) => {
    setEditingReport(report);
    setNewStatus(report.status);
    setAdminNotes(report.admin_notes || '');
    setShowEditModal(true);
  };

  // View report details (you can expand this to show a detailed view)
  const handleViewClick = (report: Report) => {
    // For now, we'll just alert the details
    alert(`
      Report ID: ${report.id}
      Box: ${report.box?.title || 'Unknown'}
      Reported by: ${report.user?.name || 'Unknown'}
      Reason: ${report.reason}
      Description: ${report.description}
      Status: ${report.status}
      Created: ${new Date(report.created_at).toLocaleString()}
    `);
  };
  
  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.box?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesReason = reasonFilter === 'all' || report.reason === reasonFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesReason && matchesStatus;
  });

  // Extract unique reasons for the filter dropdown
  const uniqueReasons = Array.from(new Set(reports.map(report => report.reason)));

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage user-submitted reports about boxes
          </p>
        </div>
        <button
          type="button"
          onClick={fetchReports}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#02615E] hover:bg-[#02615E]/90"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Reports
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="w-full md:w-1/3">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm"
                  placeholder="Search reports by reason, box title, or user"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <select
                id="reason"
                name="reason"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm rounded-md"
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
              >
                <option value="all">All Reasons</option>
                {uniqueReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
              <select
                id="status"
                name="status"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02615E]"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || reasonFilter !== 'all' || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'There are no reports to display at this time'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Box
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">Report #{report.id}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{report.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.box?.title || 'Unknown Box'}</div>
                      <div className="text-xs text-gray-500">ID: {report.box_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.user?.name || 'Anonymous'}</div>
                      <div className="text-xs text-gray-500">{report.user?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-[#02615E] hover:text-[#02615E]/80 mr-3"
                        onClick={() => handleViewClick(report)}
                      >
                        View
                      </button>
                      <button 
                        className="text-[#02615E] hover:text-[#02615E]/80"
                        onClick={() => handleEditClick(report)}
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination - simplified for now */}
        {!loading && filteredReports.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredReports.length}</span> reports
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Status Modal */}
      {showEditModal && editingReport && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Update Report Status
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        Update the status for report #{editingReport.id} regarding {editingReport.box?.title || 'a box'}.
                      </p>
                      
                      <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm rounded-md"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="under_review">Under Review</option>
                          <option value="resolved">Resolved</option>
                          <option value="dismissed">Dismissed</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700">
                          Admin Notes
                        </label>
                        <textarea
                          id="adminNotes"
                          name="adminNotes"
                          rows={4}
                          className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm rounded-md"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#02615E] text-base font-medium text-white hover:bg-[#02615E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02615E] sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={updateReportStatus}
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02615E] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowEditModal(false)}
                  disabled={updating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsManagement;