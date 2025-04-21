import React from 'react';

interface Offer {
  id: number;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  expiresAt: string;
  status: 'Active' | 'Inactive' | 'Sold Out';
}

interface OffersListProps {
  offers: Offer[];
  handleChangeOfferStatus: (id: number, newStatus: 'Active' | 'Inactive' | 'Sold Out') => void;
}

const OffersList: React.FC<OffersListProps> = ({ offers, handleChangeOfferStatus }) => {
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
  );
};

export default OffersList;