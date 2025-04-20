import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-[#02615E]">BitBack</span>
                <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-[#02615E]/10 text-[#02615E]">
                  Merchant
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative flex items-center space-x-3">
                <span className="text-sm text-gray-700">Artisan Bakery</span>
                <div className="relative">
                  <button
                    id="avatarButton"
                    className="bg-[#02615E] text-white p-2 rounded-full flex items-center justify-center focus:outline-none"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div
                      id="userDropdown"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-[#02615E] text-[#02615E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'offers'
                  ? 'border-[#02615E] text-[#02615E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Offers
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-[#02615E] text-[#02615E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-[#02615E] text-[#02615E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Active Offers */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#02615E]/10 rounded-md p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Offers
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {totalActiveOffers}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Total Orders */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#02615E]/10 rounded-md p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Orders
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {totalOrders}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Revenue */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#02615E]/10 rounded-md p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Revenue
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        ${totalRevenue.toFixed(2)}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Food Waste Saved */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#02615E]/10 rounded-md p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Food Waste Saved
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {foodSaved.toFixed(1)} kg
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Manage Offers</h1>
              <button 
                onClick={() => setShowNewOfferForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#02615E] hover:bg-[#02615E]/90"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Offer
              </button>
            </div>

            {/* New Offer Form */}
            {showNewOfferForm && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Offer</h3>
                  <p className="mt-1 text-sm text-gray-500">Add a new surprise bag or food item to reduce waste</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <form onSubmit={handleNewOfferSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Offer Title
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            value={newOffer.title}
                            onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                            className="shadow-sm focus:ring-[#02615E] focus:border-[#02615E] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={newOffer.description}
                            onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                            className="shadow-sm focus:ring-[#02615E] focus:border-[#02615E] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                          Original Price ($)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="originalPrice"
                            id="originalPrice"
                            required
                            min="0"
                            step="0.01"
                            value={newOffer.originalPrice}
                            onChange={(e) => setNewOffer({...newOffer, originalPrice: e.target.value})}
                            className="shadow-sm focus:ring-[#02615E] focus:border-[#02615E] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700">
                          Discounted Price ($)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="discountedPrice"
                            id="discountedPrice"
                            required
                            min="0"
                            step="0.01"
                            value={newOffer.discountedPrice}
                            onChange={(e) => setNewOffer({...newOffer, discountedPrice: e.target.value})}
                            className="shadow-sm focus:ring-[#02615E] focus:border-[#02615E] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                          Quantity Available
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            required
                            min="1"
                            value={newOffer.quantity}
                            onChange={(e) => setNewOffer({...newOffer, quantity: e.target.value})}
                            className="shadow-sm focus:ring-[#02615E] focus:border-[#02615E] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                          Expiry Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            name="expiryDate"
                            id="expiryDate"
                            required
                            value={newOffer.expiryDate}
                            onChange={(e) => setNewOffer({...newOffer, expiryDate: e.target.value})}
                            className="shadow-sm focus:ring-[#02615E] focus:border-[#02615E] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="expiryTime" className="block text-sm font-medium text-gray-700">
                          Expiry Time
                        </label>
                        <div className="mt-1">
                          <input
                            type="time"
                            name="expiryTime"
                            id="expiryTime"
                            required
                            value={newOffer.expiryTime}
                            onChange={(e) => setNewOffer({...newOffer, expiryTime: e.target.value})}
                            className="shadow-sm focus:ring-[#02615E] focus:border-[#02615E] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowNewOfferForm(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#02615E] hover:bg-[#02615E]/90"
                      >
                        Create Offer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Offers List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Current Offers</h3>
                <p className="mt-1 text-sm text-gray-500">Manage your active and upcoming offers</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Offer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expires
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {offers.map((offer) => {
                      const expiryDate = new Date(offer.expiresAt);
                      const formattedExpiry = expiryDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                      
                      return (
                        <tr key={offer.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${offer.discountedPrice.toFixed(2)}</div>
                            <div className="text-sm text-gray-500 line-through">${offer.originalPrice.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {offer.quantity} available
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formattedExpiry}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${offer.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                offer.status === 'Sold Out' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                              {offer.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {offer.status === 'Active' ? (
                                <>
                                  <button 
                                    onClick={() => handleChangeOfferStatus(offer.id, 'Inactive')}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Deactivate
                                  </button>
                                  <button 
                                    onClick={() => handleChangeOfferStatus(offer.id, 'Sold Out')}
                                    className="text-yellow-600 hover:text-yellow-900"
                                  >
                                    Mark Sold Out
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => handleChangeOfferStatus(offer.id, 'Active')}
                                  className="text-[#02615E] hover:text-[#02615E]/80"
                                  disabled={offer.quantity === 0}
                                >
                                  Activate
                                </button>
                              )}
                              <button className="text-[#02615E] hover:text-[#02615E]/80">
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Manage Orders</h1>
            
            {/* Orders List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">All Orders</h3>
                <p className="mt-1 text-sm text-gray-500">Track and update customer orders</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pickup Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#02615E]">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.item}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.pickupTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {order.status === 'Pending' && (
                            <button 
                              onClick={() => handleChangeOrderStatus(order.id, 'Ready')}
                              className="text-[#02615E] hover:text-[#02615E]/80 mr-2"
                            >
                              Mark Ready
                            </button>
                          )}
                          {order.status === 'Ready' && (
                            <button 
                              onClick={() => handleChangeOrderStatus(order.id, 'Completed')}
                              className="text-[#02615E] hover:text-[#02615E]/80 mr-2"
                            >
                              Complete
                            </button>
                          )}
                          {(order.status === 'Pending' || order.status === 'Ready') && (
                            <button 
                              onClick={() => handleChangeOrderStatus(order.id, 'Cancelled')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h1>
            
            {/* Business Information */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Business Information</h3>
                <p className="mt-1 text-sm text-gray-500">Update your business details</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="business-name" className="block text-sm font-medium text-gray-700">Business name</label>
                      <input
                        type="text"
                        name="business-name"
                        id="business-name"
                        defaultValue="Artisan Bakery"
                        className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="business-type" className="block text-sm font-medium text-gray-700">Business type</label>
                      <select
                        id="business-type"
                        name="business-type"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm"
                      >
                        <option>Bakery</option>
                        <option>Restaurant</option>
                        <option>Cafe</option>
                        <option>Grocery Store</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">Street address</label>
                      <input
                        type="text"
                        name="street-address"
                        id="street-address"
                        defaultValue="123 Main Street"
                        className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        defaultValue="San Francisco"
                        className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        name="state"
                        id="state"
                        defaultValue="CA"
                        className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        defaultValue="94107"
                        className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#02615E] hover:bg-[#02615E]/90"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Profile & Password */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h3>
                <p className="mt-1 text-sm text-gray-500">Manage your account details and password</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        defaultValue="John"
                        className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        defaultValue="Baker"
                        className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
                      <input
                        type="email"
                        name="email-address"
                        id="email-address"
                        defaultValue="john@artisanbakery.com"
                        className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current password</label>
                      <input
                        type="password"
                        name="current-password"
                        id="current-password"
                        className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New password</label>
                      <input
                        type="password"
                        name="new-password"
                        id="new-password"
                        className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#02615E] hover:bg-[#02615E]/90"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MerchantDashboard;