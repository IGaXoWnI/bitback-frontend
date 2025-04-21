import React from 'react';

interface NewOfferForm {
  title: string;
  description: string;
  originalPrice: string;
  discountedPrice: string;
  quantity: string;
  expiryDate: string;
  expiryTime: string;
}

interface OfferFormProps {
  newOffer: NewOfferForm;
  setNewOffer: React.Dispatch<React.SetStateAction<NewOfferForm>>;
  handleNewOfferSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setShowNewOfferForm: (show: boolean) => void;
}

const OfferForm: React.FC<OfferFormProps> = ({ 
  newOffer, 
  setNewOffer, 
  handleNewOfferSubmit, 
  setShowNewOfferForm 
}) => {
  return (
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
  );
};

export default OfferForm;