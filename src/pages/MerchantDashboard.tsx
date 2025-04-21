import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import components
import Header from '../components/merchant/Layout/Header';
import Navigation from '../components/merchant/Layout/Navigation';
import DashboardContent from '../components/merchant/Dashboard/DashboardContent';
import OffersContent from '../components/merchant/Offers/OffersContent';
import OrdersContent from '../components/merchant/Orders/OrdersContent';
import SettingsContent from '../components/merchant/Settings/SettingsContent';

// Define type interfaces
interface Offer {
  id: number;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  expiresAt: string;
  status: 'Active' | 'Inactive' | 'Sold Out';
}

interface Order {
  id: string;
  customer: string;
  item: string;
  date: string;
  pickupTime: string;
  status: 'Pending' | 'Ready' | 'Completed' | 'Cancelled';
  total: string;
}

interface NewOfferForm {
  title: string;
  description: string;
  originalPrice: string;
  discountedPrice: string;
  quantity: string;
  expiryDate: string;
  expiryTime: string;
}

// Sample data
const sampleOffers: Offer[] = [
  { id: 1, title: 'Surprise Bag - Bakery', originalPrice: 24.99, discountedPrice: 8.99, quantity: 12, expiresAt: '2025-04-19T18:00:00', status: 'Active' },
  { id: 2, title: 'Pastry Assortment Box', originalPrice: 19.99, discountedPrice: 7.50, quantity: 8, expiresAt: '2025-04-19T19:30:00', status: 'Active' },
  { id: 3, title: 'Sandwich Lunch Pack', originalPrice: 15.99, discountedPrice: 5.99, quantity: 5, expiresAt: '2025-04-19T17:00:00', status: 'Sold Out' },
  { id: 4, title: 'Fresh Bread Basket', originalPrice: 12.99, discountedPrice: 4.50, quantity: 0, expiresAt: '2025-04-19T18:30:00', status: 'Inactive' },
];

const sampleOrders: Order[] = [
  { id: 'ORD-2574', customer: 'John Smith', item: 'Surprise Bag - Bakery', date: '15 Apr, 2025', pickupTime: '18:00-19:00', status: 'Completed', total: '$8.99' },
  { id: 'ORD-2573', customer: 'Emily Johnson', item: 'Pastry Assortment Box', date: '15 Apr, 2025', pickupTime: '17:30-18:30', status: 'Ready', total: '$7.50' },
  { id: 'ORD-2572', customer: 'Michael Brown', item: 'Sandwich Lunch Pack', date: '14 Apr, 2025', pickupTime: '16:00-17:00', status: 'Pending', total: '$5.99' },
  { id: 'ORD-2571', customer: 'Sarah Wilson', item: 'Surprise Bag - Bakery', date: '14 Apr, 2025', pickupTime: '18:00-19:00', status: 'Completed', total: '$8.99' },
  { id: 'ORD-2570', customer: 'Robert Taylor', item: 'Fresh Bread Basket', date: '13 Apr, 2025', pickupTime: '16:30-17:30', status: 'Cancelled', total: '$4.50' },
];

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
    expiryDate: '',
    expiryTime: '',
  });
  const [offers, setOffers] = useState<Offer[]>(sampleOffers);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setUserRole(role);

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');

    setIsLoggedIn(false);
    setUserRole(null);
    setIsDropdownOpen(false);

    navigate('/login');
  };

  // Statistics
  const totalActiveOffers = offers.filter(offer => offer.status === 'Active').length;
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'Completed').length;
  const totalRevenue = orders
    .filter(order => order.status === 'Completed')
    .reduce((sum, order) => sum + parseFloat(order.total.replace('$', '')), 0);
  const foodSaved = completedOrders * 1.2; // assuming 1.2kg per order

  const handleNewOfferSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create new offer with random ID and active status
    const newOfferData: Offer = {
      id: offers.length + 1,
      title: newOffer.title,
      originalPrice: parseFloat(newOffer.originalPrice),
      discountedPrice: parseFloat(newOffer.discountedPrice),
      quantity: parseInt(newOffer.quantity),
      expiresAt: `${newOffer.expiryDate}T${newOffer.expiryTime}:00`,
      status: 'Active'
    };

    // Add to offers list
    setOffers([newOfferData, ...offers]);

    // Reset form
    setNewOffer({
      title: '',
      description: '',
      originalPrice: '',
      discountedPrice: '',
      quantity: '',
      expiryDate: '',
      expiryTime: '',
    });

    // Hide form
    setShowNewOfferForm(false);
  };

  const handleChangeOfferStatus = (id: number, newStatus: 'Active' | 'Inactive' | 'Sold Out') => {
    setOffers(offers.map(offer =>
      offer.id === id ? { ...offer, status: newStatus } : offer
    ));
  };

  const handleChangeOrderStatus = (id: string, newStatus: 'Pending' | 'Ready' | 'Completed' | 'Cancelled') => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9F3F0]">
        <div className="w-12 h-12 border-4 border-[#02615E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F3F0]">
      {/* Header */}
      <Header 
        isDropdownOpen={isDropdownOpen} 
        setIsDropdownOpen={setIsDropdownOpen} 
        handleLogout={handleLogout} 
      />

      {/* Navigation Tabs */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <DashboardContent 
            totalActiveOffers={totalActiveOffers}
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
            foodSaved={foodSaved}
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