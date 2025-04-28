import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Interface for the offer data structure based on actual API response
interface Offer {
  id: number;
  title: string;
  description: string;
  original_price: number | string;
  discounted_price: number | string; // This is the actual field name in API
  image: string; // This is the actual field name in API
  quantity_available: number | string; // This is the actual field name in API
  quantity_reserved: number | string;
  pickup_time: string;
  rating: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  business_id: number;
  business?: {
    id: number;
    user_id: number;
    business_name: string;
    business_type: string;
    business_address: string;
    city: string;
  };
}

function ContentManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://127.0.0.1:8000/api/getAllBoxes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Debug the response structure
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        // Access the paginated data properly
        if (response.data.data && Array.isArray(response.data.data.data)) {
          setOffers(response.data.data.data);
        } else {
          setOffers([]);
          setError('Received invalid data format from server');
        }
        setError('');
      } else {
        setOffers([]);
        setError('Failed to fetch offers');
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      setOffers([]);
      setError('Authentication error. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`http://127.0.0.1:8000/api/boxes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success) {
        setOffers(offers.filter(offer => offer.id !== id));
        toast.success('Offer deleted successfully');
      } else {
        toast.error('Failed to delete offer');
      }
    } catch (err) {
      toast.error('Error deleting offer');
    } finally {
      setShowDeleteModal(false);
      setOfferToDelete(null);
    }
  };

  const handleDeleteClick = (offer: Offer) => {
    setOfferToDelete(offer);
    setShowDeleteModal(true);
  };

  // Filter offers based on active tab and search
  const filteredOffers = Array.isArray(offers) ? offers.filter(offer => {
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'active' && offer.is_active) ||
                       (activeTab === 'expired' && !offer.is_active);
    
    const matchesSearch = 
      offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      offer.business?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      offer.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  }) : [];

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Merchant Offers</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage all merchant offers/boxes on the platform
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>{error}</p>
          <button 
            onClick={() => fetchOffers()} 
            className="mt-2 text-sm font-medium text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 px-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-[#02615E] text-[#02615E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Offers
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-[#02615E] text-[#02615E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'expired'
                  ? 'border-[#02615E] text-[#02615E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Expired
            </button>
          </nav>
        </div>
        
        <div className="p-4 border-b border-gray-200 bg-gray-50">
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
              placeholder="Search offers by title, merchant or description"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid view of offers */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="w-12 h-12 border-4 border-[#02615E]/20 border-t-[#02615E] rounded-full animate-spin"></div>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No offers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No offers match your current filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <div 
                  key={offer.id} 
                  className="border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-full"
                >
                  {/* Offer image */}
                  <div className="h-40 bg-gray-200 relative">
                    {offer.image ? (
                      <img 
                        src={offer.image} 
                        alt={offer.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Status badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${offer.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      `}>
                        {offer.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Offer details */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{offer.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        By {offer.business?.business_name || 'Unknown'}
                      </p>
                      <p className="text-sm mb-4 text-gray-700 line-clamp-2">{offer.description}</p>
                      
                      <div className="flex justify-between mb-2">
                        <div className="text-sm">
                          <span className="font-medium">Original:</span>
                          <span className="ml-1 line-through">
                            ${typeof offer.original_price === 'number' 
                              ? offer.original_price.toFixed(2) 
                              : parseFloat(offer.original_price || '0').toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-[#02615E]">
                          ${typeof offer.discounted_price === 'number'
                            ? offer.discounted_price.toFixed(2)
                            : parseFloat(offer.discounted_price || '0').toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <div className="text-sm">
                          <span className="font-medium">Available:</span>
                          <span className="ml-1">
                            {typeof offer.quantity_available === 'number' 
                              ? offer.quantity_available 
                              : parseInt(offer.quantity_available || '0')}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Pickup:</span>
                          <span className="ml-1">{offer.pickup_time}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-3">
                        Created: {new Date(offer.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-auto pt-3 border-t border-gray-200">
                      <button 
                        onClick={() => handleDeleteClick(offer)}
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && offerToDelete && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Offer</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the offer "{offerToDelete.title}" from {offerToDelete.business?.business_name || 'Unknown'}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => deleteOffer(offerToDelete.id)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setOfferToDelete(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02615E] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default ContentManagement;