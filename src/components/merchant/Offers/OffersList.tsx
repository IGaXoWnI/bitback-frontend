import React from 'react';
import { Offer } from '../../../types/merchant';

interface OffersListProps {
  offers: Offer[];
  handleChangeOfferStatus: (id: number, newStatus: 'Active' | 'Inactive' | 'Sold Out') => void;
}

const OffersList: React.FC<OffersListProps> = ({ offers = [], handleChangeOfferStatus }) => {
  if (!offers || offers.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Current Offers</h3>
          <p className="mt-1 text-sm text-gray-500">Manage your active and upcoming offers</p>
        </div>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No offers yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new offer.</p>
        </div>
      </div>
    );
  }

  return (
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
              // Add safety checks for all fields
              const discountedPrice = offer.discountedPrice ? Number(offer.discountedPrice) : 0;
              const originalPrice = offer.originalPrice ? Number(offer.originalPrice) : 0;
              const quantity = offer.quantity || 0;
              const title = offer.title || 'Unnamed Offer';
              const status = offer.status || 'Inactive';

              // Format the expiry date safely
              let formattedExpiry = 'N/A';
              if (offer.expiresAt) {
                try {
                  const expiryDate = new Date(offer.expiresAt);
                  formattedExpiry = expiryDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                } catch (e) {
                  console.error('Invalid date format', offer.expiresAt);
                }
              }
              
              return (
                <tr key={offer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${discountedPrice.toFixed(2)}</div>
                    <div className="text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quantity} available
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formattedExpiry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${status === 'Active' ? 'bg-green-100 text-green-800' : 
                        status === 'Sold Out' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {status === 'Active' ? (
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
                          disabled={quantity === 0}
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
  );
};

export default OffersList;