import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Offer, Order, NewOfferForm } from '../types/merchant';

// Import components
import Header from '../components/merchant/Layout/Header';
import Navigation from '../components/merchant/Layout/Navigation';
import DashboardContent from '../components/merchant/Dashboard/DashboardContent';
import OffersContent from '../components/merchant/Offers/OffersContent';
import OrdersContent from '../components/merchant/Orders/OrdersContent';
import SettingsContent from '../components/merchant/Settings/SettingsContent';

function MerchantDashboard() {
  const navigate = useNavigate();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Offer form states
  const [showNewOfferForm, setShowNewOfferForm] = useState(false);
  const [newOffer, setNewOffer] = useState<NewOfferForm>({
    title: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    quantity: '',
    is_active: true,
    image: null,
    pickup_time: '-' 
  });
  
  // Data states
  const [offers, setOffers] = useState<Offer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Load data when page loads
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    // Get data from API
    getOffers();
    getOrders();
  }, []);

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Get offers from API
  const getOffers = async () => {
    try {
      const response = await api.get('/merchant/offers/getAll');
      console.log('API Response:', response); // Log the full response
      
      if (response.data.success) {
        let offersData = response.data.data;
        
        // Add more detailed logging
        console.log('Raw offers data:', offersData);
        
        // Check if the data is not in the expected format
        if (offersData && !Array.isArray(offersData)) {
          if (offersData.offers && Array.isArray(offersData.offers)) {
            offersData = offersData.offers; // Maybe it's nested
          } else {
            console.error('Unexpected data format:', offersData);
            offersData = []; // Fallback to empty array
          }
        }
        
        // Normalize the data to match our expected format
        const normalizedOffers = (offersData || []).map((offer: any) => ({
          id: offer.id || Math.random().toString(36).substring(7), // Generate a random ID if none exists
          title: offer.title || '',
          originalPrice: offer.originalPrice || offer.original_price || 0,
          discountedPrice: offer.discountedPrice || offer.discounted_price || 0,
          quantity: offer.quantity || offer.quantity_available || 0,
          expiresAt: offer.expiresAt || offer.expires_at || '',
          status: offer.status || (offer.is_active ? 'Active' : 'Inactive'),
        }));
        
        console.log('Normalized offers:', normalizedOffers);
        setOffers(normalizedOffers);
      } else {
        showError('Could not load offers');
      }
    } catch (error) {
      console.error('Error fetching offers:', error); // Log the error details
      showError('Error loading offers');
    } finally {
      setIsLoading(false);
    }
  };

  // Get orders from API
  const getOrders = async () => {
    try {
      const response = await api.get('/merchant/orders');
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        showError('Could not load orders');
      }
    } catch (error) {
      showError('Error loading orders');
    }
  };

  // Show error message
  const showError = (text: string) => {
    setMessage({ type: 'error', text });
  };

  // Show success message
  const showSuccess = (text: string) => {
    setMessage({ type: 'success', text });
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Create new offer
  const handleNewOfferSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create form data for image upload
      const formData = new FormData();
      formData.append('title', newOffer.title);
      formData.append('description', newOffer.description);
      formData.append('original_price', newOffer.originalPrice);
      formData.append('discounted_price', newOffer.discountedPrice);
      formData.append('quantity_available', newOffer.quantity);
      formData.append('is_active', newOffer.is_active ? '1' : '0');
      formData.append('pickup_time', newOffer.pickup_time);
      
      if (newOffer.image) {
        formData.append('image', newOffer.image);
      }

      // Send to API
      const response = await api.post('/merchant/offers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        // Get updated offers
        getOffers();
        showSuccess('Offer created successfully!');
      } else {
        showError('Failed to create offer');
      }
    } catch (error) {
      showError('Error creating offer');
    } finally {
      // Reset form
      setNewOffer({
        title: '',
        description: '',
        originalPrice: '',
        discountedPrice: '',
        quantity: '',
        is_active: true,
        image: null,
        pickup_time: '-'
      });
      setShowNewOfferForm(false);
      setIsLoading(false);
    }
  };

  // Change offer status (active/inactive/sold out)
  const handleChangeOfferStatus = async (id: number, newStatus: 'Active' | 'Inactive' | 'Sold Out') => {
    try {
      const isActive = newStatus === 'Active' ? 1 : 0;
      const isSoldOut = newStatus === 'Sold Out' ? 1 : 0;
      
      const response = await api.put(`/merchant/offers/${id}`, {
        is_active: isActive,
        is_sold_out: isSoldOut
      });
      
      if (response.data.success) {
        // Update the offer in the list
        setOffers(offers.map(offer =>
          offer.id === id ? { ...offer, status: newStatus } : offer
        ));
        
        showSuccess('Offer updated successfully!');
      } else {
        showError('Failed to update offer');
      }
    } catch (error) {
      showError('Error updating offer');
    }
  };

  // Change order status
  const handleChangeOrderStatus = async (id: string, newStatus: 'Pending' | 'Ready' | 'Completed' | 'Cancelled') => {
    try {
      const response = await api.put(`/merchant/orders/${id}`, {
        status: newStatus
      });
      
      if (response.data.success) {
        // Update the order in the list
        setOrders(orders.map(order =>
          order.id === id ? { ...order, status: newStatus } : order
        ));
        
        showSuccess(`Order marked as ${newStatus}`);
      } else {
        showError('Failed to update order');
      }
    } catch (error) {
      showError('Error updating order');
    }
  };

  // Calculate stats for dashboard
  const stats = {
    totalActiveOffers: offers.filter(offer => offer.status === 'Active').length,
    totalOrders: orders.length,
    completedOrders: orders.filter(order => order.status === 'Completed').length,
    totalRevenue: orders
      .filter(order => order.status === 'Completed')
      .reduce((sum, order) => sum + parseFloat(order.total.replace('$', '')), 0),
    foodSaved: orders.filter(order => order.status === 'Completed').length * 1.2
  };

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9F3F0]">
        <div className="w-12 h-12 border-4 border-[#02615E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F3F0]">
      {/* Show messages */}
      {message && (
        <div 
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{message.text}</p>
            <button
              onClick={() => setMessage(null)}
              className="ml-4 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <Header 
        isDropdownOpen={isDropdownOpen} 
        setIsDropdownOpen={setIsDropdownOpen} 
        handleLogout={handleLogout} 
      />

      {/* Navigation Tabs */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <DashboardContent 
            totalActiveOffers={stats.totalActiveOffers}
            totalOrders={stats.totalOrders}
            totalRevenue={stats.totalRevenue}
            foodSaved={stats.foodSaved}
          />
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <OffersContent 
            showNewOfferForm={showNewOfferForm}
            setShowNewOfferForm={setShowNewOfferForm}
            newOffer={newOffer}
            setNewOffer={setNewOffer}
            handleNewOfferSubmit={handleNewOfferSubmit}
            offers={offers}
            handleChangeOfferStatus={handleChangeOfferStatus}
          />
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <OrdersContent 
            orders={orders}
            handleChangeOrderStatus={handleChangeOrderStatus}
          />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <SettingsContent />
        )}
      </div>
    </div>
  );
}

export default MerchantDashboard;