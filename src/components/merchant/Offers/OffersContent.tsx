import React from 'react';
import OfferForm from './OfferForm';
import OffersList from './OffersList';
import { Offer, NewOfferForm } from '../../../types/merchant';

interface OffersContentProps {
  showNewOfferForm: boolean;
  setShowNewOfferForm: (show: boolean) => void;
  newOffer: NewOfferForm;
  setNewOffer: React.Dispatch<React.SetStateAction<NewOfferForm>>;
  handleNewOfferSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  offers?: Offer[]; // Add optional type for offers
  handleChangeOfferStatus: (id: number, newStatus: 'Active' | 'Inactive' | 'Sold Out') => void;
}

const OffersContent: React.FC<OffersContentProps> = ({ 
  showNewOfferForm, 
  setShowNewOfferForm, 
  newOffer, 
  setNewOffer,
  handleNewOfferSubmit,
  offers = [], // Add default empty array
  handleChangeOfferStatus
}) => {
  return (
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
        <OfferForm 
          newOffer={newOffer} 
          setNewOffer={setNewOffer} 
          handleNewOfferSubmit={handleNewOfferSubmit}
          setShowNewOfferForm={setShowNewOfferForm}
        />
      )}

      {/* Shows a loading indicator if offers is undefined */}
      {!offers ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#02615E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <OffersList 
          offers={offers}
          handleChangeOfferStatus={handleChangeOfferStatus}
        />
      )}
    </div>
  );
};

export default OffersContent;