import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Offer, NewOfferForm, Reservation } from '../types/merchant';
import { motion, AnimatePresence } from 'framer-motion';

import Header from '../components/merchant/Layout/Header';
import Navigation from '../components/merchant/Layout/Navigation';
import DashboardContent from '../components/merchant/Dashboard/DashboardContent';
import OffersContent from '../components/merchant/Offers/OffersContent';
import ReservationsContent from '../components/merchant/Reservations/ReservationsContent';

interface ApiBox {
  id: number;
  title: string;
  description: string;
  original_price: string;
  discounted_price: string;
  image: string;
  quantity_available: number;
  quantity_reserved: number;
  pickup_time: string;
  rating: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  business_id: number;
  reservations_count: number;
  reviews_avg_rating: string | null;
}

interface ProcessedBox {
  id: number;
  title: string;
  description: string;
  original_price: number;
  discounted_price: number;
  image: string;
  quantity_available: number;
  quantity_reserved: number;
  pickup_time: string;
  rating: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  business_id: number;
  reservations_count: number;
  reviews_avg_rating: number;
}

interface BusinessStats {
  revenue: {
    total: number;
    thisMonth: number;
  };
  pickupRate: number;
  topBoxes: ProcessedBox[];
  customerEngagement: {
    uniqueCustomers: number;
    returningCustomers: number;
    returnRate: number;
  };
}

function MerchantDashboard() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
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

  const [showEditForm, setShowEditForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  

  const [offers, setOffers] = useState<Offer[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [businessStats, setBusinessStats] = useState<BusinessStats>({
    revenue: { total: 0, thisMonth: 0 },
    pickupRate: 0,
    topBoxes: [],
    customerEngagement: { uniqueCustomers: 0, returningCustomers: 0, returnRate: 0 }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }


    getOffers();
    getReservations();
    fetchBusinessStats();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);


  const getOffers = async () => {
    try {
      const response = await api.get('/getAllBusinessBoxes');
      console.log('API Response:', response);
      
      if (response.data.success) {
        const paginatedData = response.data.data;
        const offersData = paginatedData.data || [];
        
        console.log('Raw offers data:', offersData);
        
        const normalizedOffers = offersData.map((offer: any) => ({
          id: offer.id,
          title: offer.title || '',
          description: offer.description || '',
          originalPrice: offer.original_price || 0,
          discountedPrice: offer.discounted_price || 0,
          quantity: offer.quantity_available || 0,
          quantityReserved: offer.quantity_reserved || 0,
          image: offer.image || '',
          pickup_time: offer.pickup_time || '',
          expiresAt: offer.updated_at || '',
          status: offer.is_active ? 'Active' : 'Inactive',
          rating: offer.rating || '0.0',
          businessId: offer.business_id
        }));
        
        console.log('Normalized offers:', normalizedOffers);
        setOffers(normalizedOffers);
      } else {
        showError('Could not load offers');
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      showError('Error loading offers');
    } finally {
      setIsLoading(false);
    }
  };

  const getReservations = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/reservations/business');
      if (response.data.success) {
        const reservationsData = response.data.data.data || [];
        setReservations(reservationsData);
      } else {
        showError('Could not load reservations');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      showError('Error loading reservations');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch business statistics
  const fetchBusinessStats = async () => {
    try {
      const response = await api.get('/business/statistics');
      if (response.data.success) {
        const data = response.data.data;
        
        // Parse string values to numbers with proper typing
        const stats: BusinessStats = {
          revenue: {
            total: parseFloat(data.revenue.total),
            thisMonth: parseFloat(data.revenue.thisMonth)
          },
          pickupRate: data.pickupRate,
          topBoxes: data.topBoxes.map((box: ApiBox) => ({
            ...box,
            discounted_price: parseFloat(box.discounted_price),
            original_price: parseFloat(box.original_price),
            reviews_avg_rating: box.reviews_avg_rating ? parseFloat(box.reviews_avg_rating) : 0
          })),
          customerEngagement: data.customerEngagement
        };
        
        setBusinessStats(stats);
      }
    } catch (error) {
      console.error('Error fetching business statistics:', error);
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

  // Change reservation status
  const handleChangeReservationStatus = async (id: number, newStatus: string) => {
    try {
      const response = await api.post(`/reservations/status/${id}`, {
        status: newStatus
      });
      
      if (response.data.success) {
        // Update the reservation in the state
        setReservations(reservations.map(reservation =>
          reservation.id === id ? { ...reservation, status: newStatus } : reservation
        ));
        
        showSuccess(`Reservation marked as ${newStatus}`);
      } else {
        showError('Failed to update reservation');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      showError('Error updating reservation');
    }
  };

  // Handle opening the edit form
  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setShowEditForm(true);
  };

  // Handle the edit form submission
  const handleEditOfferSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!editingOffer) return;
    setIsLoading(true);

    try {
      // Create form data for image upload
      const formData = new FormData();
      formData.append('title', editingOffer.title);
      formData.append('description', editingOffer.description);
      formData.append('original_price', editingOffer.originalPrice.toString());
      formData.append('discounted_price', editingOffer.discountedPrice.toString());
      formData.append('quantity_available', editingOffer.quantity.toString());
      formData.append('pickup_time', editingOffer.pickup_time);
      
      if (editingOffer.newImage) {
        formData.append('image', editingOffer.newImage);
      }

      // Use the endpoint for editing boxes
      const response = await api.put(`/boxes/business/${editingOffer.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        // Refresh the offers list
        getOffers();
        showSuccess('Offer updated successfully!');
      } else {
        showError(response.data.message || 'Failed to update offer');
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      showError('Error updating offer');
    } finally {
      setShowEditForm(false);
      setEditingOffer(null);
      setIsLoading(false);
    }
  };

  // Calculate stats for dashboard
  const stats = {
    totalActiveOffers: offers.filter(offer => offer.status === 'Active').length,
    totalRevenue: offers.reduce((sum, offer) => sum + (Number(offer.discountedPrice) * offer.quantityReserved), 0),
    foodSaved: reservations.filter(res => res.status === 'picked_up').length,
    totalReservations: reservations.length
  };

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div 
          className="w-16 h-16 border-4 border-[#02615E]/20 border-t-[#02615E] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Show messages */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
              message.type === 'success' 
                ? 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500' 
                : 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500'
            }`}
          >
            {/* Message content - keep as is */}
          </motion.div>
        )}
      </AnimatePresence>

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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <DashboardContent 
                totalActiveOffers={stats.totalActiveOffers}
                totalRevenue={stats.totalRevenue}
                foodSaved={stats.foodSaved}
                totalReservations={stats.totalReservations}
                monthlyRevenue={businessStats.revenue.thisMonth}
                pickupRate={businessStats.pickupRate}
                topBoxes={businessStats.topBoxes}
                uniqueCustomers={businessStats.customerEngagement.uniqueCustomers}
                returningCustomers={businessStats.customerEngagement.returningCustomers}
                customerReturnRate={businessStats.customerEngagement.returnRate}
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
                showEditForm={showEditForm}
                setShowEditForm={setShowEditForm}
                editingOffer={editingOffer}
                setEditingOffer={setEditingOffer}
                handleEditOfferSubmit={handleEditOfferSubmit}
                handleEditOffer={handleEditOffer}
              />
            )}

            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <ReservationsContent 
                reservations={reservations}
                handleChangeReservationStatus={handleChangeReservationStatus}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MerchantDashboard;