import React, { useState, useEffect } from 'react';
import { Offer } from '../../../types/merchant';

interface EditOfferFormProps {
  offer: Offer;
  setOffer: React.Dispatch<React.SetStateAction<Offer | null>>;
  handleEditOfferSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setShowEditForm: (show: boolean) => void;
}

declare module '../../../types/merchant' {
  interface Offer {
    newImage?: File;
  }
}

const EditOfferForm: React.FC<EditOfferFormProps> = ({ 
  offer, 
  setOffer, 
  handleEditOfferSubmit, 
  setShowEditForm 
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (offer.image) {
      setPreviewImage(offer.image);
    }
  }, [offer.image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOffer({...offer, newImage: file});
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white shadow-lg overflow-hidden sm:rounded-xl mb-8">
      <div className="px-6 py-6 sm:px-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent">
        <h3 className="text-xl leading-6 font-semibold text-gray-900">Edit Offer</h3>
        <p className="mt-2 text-sm text-gray-600">Update your offer details</p>
      </div>
      <div className="px-6 py-6 sm:p-8">
        <form onSubmit={handleEditOfferSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">

            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Offer Title
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={offer.title}
                  onChange={(e) => setOffer({...offer, title: e.target.value})}
                  className="block w-full py-3 px-4 border-gray-300 rounded-md focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm placeholder-gray-400"
                />
              </div>
            </div>


            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={offer.description}
                  onChange={(e) => setOffer({...offer, description: e.target.value})}
                  className="block w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm placeholder-gray-400"
                />
              </div>
            </div>


            <div className="sm:col-span-3">
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Original Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="originalPrice"
                  id="originalPrice"
                  required
                  min="0"
                  step="0.01"
                  value={offer.originalPrice}
                  onChange={(e) => setOffer({...offer, originalPrice: e.target.value})}
                  className="block w-full pl-7 py-3 px-4 border-gray-300 rounded-md focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm placeholder-gray-400"
                />
              </div>
            </div>


            <div className="sm:col-span-3">
              <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Discounted Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="discountedPrice"
                  id="discountedPrice"
                  required
                  min="0"
                  step="0.01"
                  value={offer.discountedPrice}
                  onChange={(e) => setOffer({...offer, discountedPrice: e.target.value})}
                  className="block w-full pl-7 py-3 px-4 border-gray-300 rounded-md focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm placeholder-gray-400"
                />
              </div>
            </div>


            <div className="sm:col-span-3">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Available Quantity
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  required
                  min="0"
                  value={offer.quantity}
                  onChange={(e) => setOffer({...offer, quantity: e.target.value})}
                  className="block w-full py-3 px-4 border-gray-300 rounded-md focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm placeholder-gray-400"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="pickup_time" className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Time
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="pickup_time"
                  id="pickup_time"
                  required
                  value={offer.pickup_time}
                  onChange={(e) => setOffer({...offer, pickup_time: e.target.value})}
                  className="block w-full py-3 px-4 border-gray-300 rounded-md focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm placeholder-gray-400"
                  placeholder="e.g. 18:00-20:00"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="mt-1 flex items-center">
                {previewImage && (
                  <div className="mr-4">
                    <img src={previewImage} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="py-2"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Leave empty to keep the current image.</p>
            </div>
          </div>

          <div className="pt-5 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowEditForm(false)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02615E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#02615E] hover:bg-[#025250] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02615E]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOfferForm;