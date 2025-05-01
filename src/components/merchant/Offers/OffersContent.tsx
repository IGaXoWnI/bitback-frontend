import React from 'react';
import OffersList from './OffersList';
import OfferForm from './OfferForm';
import EditOfferForm from '../Offers/EditOfferForm';
import { Offer, NewOfferForm } from '../../../types/merchant';

interface OffersContentProps {
  showNewOfferForm: boolean;
  setShowNewOfferForm: (show: boolean) => void;
  newOffer: NewOfferForm;
  setNewOffer: React.Dispatch<React.SetStateAction<NewOfferForm>>;
  handleNewOfferSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  offers?: Offer[];
  handleChangeOfferStatus: (id: number, newStatus: 'Active' | 'Inactive' | 'Sold Out') => void;
  showEditForm: boolean;
  setShowEditForm: (show: boolean) => void;
  editingOffer: Offer | null;
  setEditingOffer: React.Dispatch<React.SetStateAction<Offer | null>>;
  handleEditOfferSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleEditOffer: (offer: Offer) => void;
}

const OffersContent: React.FC<OffersContentProps> = ({ 
  showNewOfferForm, 
  setShowNewOfferForm, 
  newOffer, 
  setNewOffer,
  handleNewOfferSubmit,
  offers = [],
  handleChangeOfferStatus,
  showEditForm,
  setShowEditForm,
  editingOffer,
  setEditingOffer,
  handleEditOfferSubmit,
  handleEditOffer
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Offers</h2>
        <button 
          onClick={() => setShowNewOfferForm(!showNewOfferForm)}
          className="px-4 py-2 bg-[#02615E] text-white rounded-md hover:bg-[#025250] transition-colors"
        >
          {showNewOfferForm ? 'Cancel' : '+ New Offer'}
        </button>
      </div>
      
      {showNewOfferForm && (
        <OfferForm 
          newOffer={newOffer} 
          setNewOffer={setNewOffer} 
          handleNewOfferSubmit={handleNewOfferSubmit}
          setShowNewOfferForm={setShowNewOfferForm}
        />
      )}
      
      {showEditForm && editingOffer && (
        <EditOfferForm 
          offer={editingOffer}
          setOffer={setEditingOffer}
          handleEditOfferSubmit={handleEditOfferSubmit}
          setShowEditForm={setShowEditForm}
        />
      )}
      
      {!offers ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#02615E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <OffersList 
          offers={offers}
          handleChangeOfferStatus={handleChangeOfferStatus}
          handleEditOffer={handleEditOffer}
        />
      )}
    </div>
  );
};

export default OffersContent;