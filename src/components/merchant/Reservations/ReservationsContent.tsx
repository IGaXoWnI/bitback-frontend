import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface Reservation {
  id: number;
  user_id: number;
  box_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  pickup_deadline: string | null;
  box: {
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
  };
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    address: string;
    status: string;
  };
}

interface ReservationsContentProps {
  reservations: Reservation[];
  handleChangeReservationStatus: (id: number, status: string) => void;
  isLoading?: boolean;
}

const ReservationsContent: React.FC<ReservationsContentProps> = ({ 
  reservations, 
  handleChangeReservationStatus,
  isLoading = false
}) => {
  const [filter, setFilter] = useState('all');
  const [showDetails, setShowDetails] = useState<number | null>(null);
  
  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(res => res.status === filter);
  
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • HH:mm');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'picked_up':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

 
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Box Reservations</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track and manage customer reservations for your food boxes
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap space-x-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#02615E] to-[#1A8F7D] text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFilter('reserved')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              filter === 'reserved'
                ? 'bg-gradient-to-r from-[#02615E] to-[#1A8F7D] text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Reserved
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFilter('picked_up')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              filter === 'picked_up'
                ? 'bg-gradient-to-r from-[#02615E] to-[#1A8F7D] text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Picked Up
          </motion.button>
        </div>
      </div>
      
  
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="w-10 h-10 border-4 border-[#02615E] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reservations found</h3>
            <p className="mt-1 text-sm text-gray-500">There are no reservations matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <motion.table 
              className="min-w-full divide-y divide-gray-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservation 
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Box
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pickup Window
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
                {filteredReservations.map((reservation) => (
                  <motion.tr 
                    key={reservation.id} 
                    variants={itemVariants}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-[#02615E]">
                          #{reservation.id}
                        </div>
                        <div className="ml-2 text-xs text-gray-500">
                          {formatDateTime(reservation.created_at)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-[#02615E] to-[#1A8F7D] rounded-full flex items-center justify-center text-white font-medium">
                          {reservation.user.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {reservation.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={reservation.box.image || 'https://via.placeholder.com/150'} 
                            alt={reservation.box.title} 
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {reservation.box.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${reservation.box.discounted_price}
                      </div>
                      <div className="text-xs line-through text-gray-500">
                        ${reservation.box.original_price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {reservation.box.pickup_time || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(reservation.status)}`}>
                        {reservation.status === 'picked_up' ? 'Picked Up' : 
                          reservation.status === 'reserved' ? 'Reserved' : 
                          reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        {reservation.status === 'reserved' && (
                          <>
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleChangeReservationStatus(reservation.id, 'picked_up')}
                              className="px-3 py-1 text-xs font-medium rounded-md bg-gradient-to-r from-[#02615E] to-[#1A8F7D] text-white shadow-sm"
                            >
                              Mark Picked Up
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleChangeReservationStatus(reservation.id, 'cancelled')}
                              className="px-3 py-1 text-xs font-medium rounded-md bg-white text-red-600 border border-red-200 shadow-sm hover:bg-red-50"
                            >
                              Cancel
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowDetails(showDetails === reservation.id ? null : reservation.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsContent;