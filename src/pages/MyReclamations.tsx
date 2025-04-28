import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';

// Define the API response shape for reports based on actual API data
interface Report {
  id: number;
  user_id: number;
  box_id: number;
  reason: string;
  description: string;
  status: string; // e.g. 'under_review'
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  box: {
    id: number;
    title: string;
    description: string;
    original_price: string;
    discounted_price: string;
    image: string;
    pickup_time: string;
    business_id: number;
  }
}

const MyReclamations: React.FC = () => {
  const navigate = useNavigate();
  const [reclamations, setReclamations] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    const fetchReclamations = async () => {
      setIsLoading(true);
      try {
        // Use the correct API endpoint
        const response = await api.get('/user/reports');
        
        if (response.data.success && response.data.data && response.data.data.data) {
          // Handle the nested data structure from the pagination
          const reclamationsData = response.data.data.data;
          setReclamations(reclamationsData);
          console.log("Loaded reports:", reclamationsData.length);
        } else {
          console.error("Unexpected API response format");
          setReclamations([]);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReclamations();
  }, []);
  
  // Filter reclamations based on status
  const filteredReclamations = filter === 'all' 
    ? reclamations
    : reclamations.filter(reclamation => reclamation.status === filter);
  
  // Group reclamations by status
  const groupedReclamations = {
    active: filteredReclamations.filter(r => r.status === 'pending' || r.status === 'under_review'),
    resolved: filteredReclamations.filter(r => r.status === 'resolved' || r.status === 'dismissed')
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format status for display
  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      {/* Hero section */}
      <div className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#02615E]/90 to-[#02615E]/70 z-0"></div>
        <img 
          src="https://images.unsplash.com/photo-1553835973-dec43bfddbeb" 
          alt="Support" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Reports</h1>
          <p className="text-white/90 text-lg max-w-xl">
            Track and manage your food box reports and complaints
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setFilter('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium mr-2 ${
              filter === 'all' 
                ? 'bg-[#02615E] text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            All Reports
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium mr-2 ${
              filter === 'pending' 
                ? 'bg-[#02615E] text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('under_review')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium mr-2 ${
              filter === 'under_review' 
                ? 'bg-[#02615E] text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Under Review
          </button>
          <button 
            onClick={() => setFilter('resolved')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium mr-2 ${
              filter === 'resolved' 
                ? 'bg-[#02615E] text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Resolved
          </button>
          <button 
            onClick={() => setFilter('dismissed')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'dismissed' 
                ? 'bg-[#02615E] text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Dismissed
          </button>
        </div>
        
        {isLoading ? (
          // Skeleton loaders for reclamations
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-32 bg-gray-200"></div>
                  <div className="p-6 flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="flex items-center">
                      <div className="h-8 bg-gray-200 rounded mr-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredReclamations.length === 0 ? (
          // Empty state
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <img 
              src="https://cdn.iconscout.com/icon/free/png-256/free-document-1779926-1518345.png" 
              alt="No reports" 
              className="w-24 h-24 mx-auto mb-4 opacity-30"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reports Found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You don't have any {filter !== 'all' ? formatStatus(filter) : ''} reports yet.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#02615E] hover:bg-[#024e4b] text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Return Home
            </button>
          </div>
        ) : (
          // Reclamation lists
          <div className="space-y-8">
            {/* Active Reclamations */}
            {groupedReclamations.active.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Reports</h2>
                <div className="space-y-6">
                  {groupedReclamations.active.map(reclamation => (
                    <div 
                      key={reclamation.id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 relative">
                          <img 
                            src={reclamation.box.image} 
                            alt={reclamation.box.title} 
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(reclamation.status)}`}>
                              {formatStatus(reclamation.status)}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Report #{reclamation.id}</h3>
                            <p className="text-sm font-medium text-gray-500">
                              {formatDate(reclamation.created_at)}
                            </p>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Box:</span> {reclamation.box.title}
                          </p>
                          
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Reason:</span> {reclamation.reason.replace(/-/g, ' ').toUpperCase()}
                          </p>
                          
                          <div className="mt-3 bg-gray-50 p-3 rounded-lg text-gray-700 text-sm mb-4">
                            <p className="font-medium mb-1">Description:</p>
                            <p>{reclamation.description}</p>
                          </div>
                          
                          {reclamation.admin_notes && (
                            <div className="mt-2 bg-[#02615E]/5 p-3 rounded-lg text-gray-700 text-sm mb-4">
                              <p className="font-medium mb-1 text-[#02615E]">Admin Response:</p>
                              <p>{reclamation.admin_notes}</p>
                            </div>
                          )}
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-700 mr-2">Box Price:</span>
                              <span className="text-lg font-bold text-[#02615E]">
                                ${Number(reclamation.box.discounted_price).toFixed(2)}
                              </span>
                            </div>
                            
                            <button 
                              onClick={() => navigate(`/reclamation/${reclamation.id}`)}
                              className="bg-[#02615E] hover:bg-[#024e4b] text-white font-medium py-1.5 px-4 rounded-lg transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Resolved Reclamations */}
            {groupedReclamations.resolved.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Resolved Reports</h2>
                <div className="space-y-6">
                  {groupedReclamations.resolved.map(reclamation => (
                    <div 
                      key={reclamation.id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow opacity-80"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 relative">
                          <img 
                            src={reclamation.box.image} 
                            alt={reclamation.box.title} 
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(reclamation.status)}`}>
                              {formatStatus(reclamation.status)}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Report #{reclamation.id}</h3>
                            <p className="text-sm font-medium text-gray-500">
                              {formatDate(reclamation.created_at)}
                            </p>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Box:</span> {reclamation.box.title}
                          </p>
                          
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Reason:</span> {reclamation.reason.replace(/-/g, ' ').toUpperCase()}
                          </p>
                          
                          <div className="mt-3 bg-gray-50 p-3 rounded-lg text-gray-700 text-sm mb-4">
                            <p className="font-medium mb-1">Description:</p>
                            <p>{reclamation.description}</p>
                          </div>
                          
                          {reclamation.admin_notes && (
                            <div className="mt-2 bg-[#02615E]/5 p-3 rounded-lg text-gray-700 text-sm mb-4">
                              <p className="font-medium mb-1 text-[#02615E]">Admin Response:</p>
                              <p>{reclamation.admin_notes}</p>
                            </div>
                          )}
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-700 mr-2">Box Price:</span>
                              <span className="text-lg font-bold text-[#02615E]">
                                ${Number(reclamation.box.discounted_price).toFixed(2)}
                              </span>
                            </div>
                            
                            <button 
                              onClick={() => navigate(`/reclamation/${reclamation.id}`)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1.5 px-4 rounded-lg transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyReclamations;