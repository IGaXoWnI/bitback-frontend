import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';

// Define the reservation type
interface Reservation {
  id: number;
  box_id: number;
  user_id: number;
  quantity: number;
  pickup_code: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  box: {
    id: number;
    title: string;
    image: string;
    original_price: number;
    discounted_price: number;
    pickup_time: string;
    business: {
      business_name: string;
      business_address: string;
    }
  }
}

const MyReservations: React.FC = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/reservations');
        if (response.data.success) {
          setReservations(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReservations();
  }, []);
  
  // Filter reservations based on status
  const filteredReservations = filter === 'all' 
    ? reservations
    : reservations.filter(reservation => reservation.status === filter);
  
  // Group reservations by date (today, tomorrow, upcoming)
  const groupedReservations = {
    upcoming: filteredReservations.filter(r => r.status === 'confirmed' || r.status === 'pending'),
    past: filteredReservations.filter(r => r.status === 'completed' || r.status === 'cancelled')
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
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      {/* Hero section */}
      <div className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#02615E]/90 to-[#02615E]/70 z-0"></div>
        <img 
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5" 
          alt="Reserved Food" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Reservations</h1>
          <p className="text-white/90 text-lg max-w-xl">
            Track and manage your food box reservations
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
            All Reservations
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
            onClick={() => setFilter('confirmed')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium mr-2 ${
              filter === 'confirmed' 
                ? 'bg-[#02615E] text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Confirmed
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium mr-2 ${
              filter === 'completed' 
                ? 'bg-[#02615E] text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Completed
          </button>
          <button 
            onClick={() => setFilter('cancelled')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'cancelled' 
                ? 'bg-[#02615E] text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Cancelled
          </button>
        </div>
        
        {isLoading ? (
          // Skeleton loaders for reservations
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-32 bg-gray-200"></div>
                  <div className="p-6 flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex items-center">
                      <div className="h-8 w-20 bg-gray-200 rounded mr-2"></div>
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredReservations.length === 0 ? (
          // Empty state
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <img 
              src="https://cdn.iconscout.com/icon/free/png-256/free-calendar-1439790-1214125.png" 
              alt="No reservations" 
              className="w-24 h-24 mx-auto mb-4 opacity-30"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reservations Found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You don't have any {filter !== 'all' ? filter : ''} reservations yet.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#02615E] hover:bg-[#024e4b] text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Find Food Boxes
            </button>
          </div>
        ) : (
          // Reservation lists
          <div className="space-y-8">
            {/* Upcoming Reservations */}
            {groupedReservations.upcoming.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Reservations</h2>
                <div className="space-y-6">
                  {groupedReservations.upcoming.map(reservation => (
                    <div 
                      key={reservation.id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 relative">
                          <img 
                            src={reservation.box.image} 
                            alt={reservation.box.title} 
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(reservation.status)}`}>
                              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{reservation.box.title}</h3>
                            <p className="text-sm font-medium text-gray-500">
                              {formatDate(reservation.created_at)}
                            </p>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-1">
                            {reservation.box.business.business_name} • {reservation.box.business.business_address}
                          </p>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            Pickup: {reservation.box.pickup_time} • Quantity: {reservation.quantity}
                          </p>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-lg font-bold text-[#02615E]">
                                ${Number(reservation.box.discounted_price).toFixed(2)}
                              </span>
                              <span className="ml-2 text-sm line-through text-gray-500">
                                ${Number(reservation.box.original_price).toFixed(2)}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {reservation.status === 'confirmed' && (
                                <div className="bg-[#02615E]/10 text-[#02615E] px-3 py-1.5 rounded-lg text-sm font-medium">
                                  <span className="mr-1">🔑</span>
                                  {reservation.pickup_code}
                                </div>
                              )}
                              <button 
                                onClick={() => navigate(`/reservations/${reservation.id}`)}
                                className="bg-[#02615E] hover:bg-[#024e4b] text-white font-medium py-1.5 px-4 rounded-lg transition-colors"
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Past Reservations */}
            {groupedReservations.past.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Reservations</h2>
                <div className="space-y-6">
                  {groupedReservations.past.map(reservation => (
                    <div 
                      key={reservation.id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow opacity-80"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 relative">
                          <img 
                            src={reservation.box.image} 
                            alt={reservation.box.title} 
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(reservation.status)}`}>
                              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{reservation.box.title}</h3>
                            <p className="text-sm font-medium text-gray-500">
                              {formatDate(reservation.created_at)}
                            </p>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-1">
                            {reservation.box.business.business_name} • {reservation.box.business.business_address}
                          </p>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            Pickup: {reservation.box.pickup_time} • Quantity: {reservation.quantity}
                          </p>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-lg font-bold text-[#02615E]">
                                ${Number(reservation.box.discounted_price).toFixed(2)}
                              </span>
                              <span className="ml-2 text-sm line-through text-gray-500">
                                ${Number(reservation.box.original_price).toFixed(2)}
                              </span>
                            </div>
                            
                            {reservation.status === 'completed' && (
                              <button 
                                onClick={() => navigate(`/review/${reservation.box_id}`)}
                                className="border border-[#02615E] text-[#02615E] hover:bg-[#02615E]/5 font-medium py-1.5 px-4 rounded-lg transition-colors"
                              >
                                Leave Review
                              </button>
                            )}
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

export default MyReservations;