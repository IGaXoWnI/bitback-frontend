import React, { useState } from 'react';
import { NewOfferForm } from '../../../types/merchant';

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewOffer({...newOffer, image: file});
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white shadow-lg overflow-hidden sm:rounded-xl mb-8">
      <div className="px-6 py-6 sm:px-8 border-b border-gray-200 bg-gradient-to-r from-[#02615E]/5 to-transparent">
        <h3 className="text-xl leading-6 font-semibold text-gray-900">Create New Offer</h3>
        <p className="mt-2 text-sm text-gray-600">Add a new surprise bag or food item to reduce waste</p>
      </div>
      <div className="px-6 py-6 sm:p-8">
        <form onSubmit={handleNewOfferSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
            {/* Title field */}
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
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                  className="block w-full py-3 px-4 border-gray-300 rounded-md focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm placeholder-gray-400"
                  placeholder="e.g. Artisan Bread Surprise Bag"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Create a compelling title for your offer</p>
            </div>

            {/* Description field */}
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                  className="block w-full py-3 px-4 border-gray-300 rounded-md focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm placeholder-gray-400"
                  placeholder="Describe what customers will receive in this offer..."
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Be specific about what's included in your offer</p>
            </div>

            {/* Image upload field */}
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Image
              </label>
              <div className="mt-2 flex items-center">
                <div className="flex-shrink-0">
                  {previewImage ? (
                    <div className="relative group">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="h-36 w-36 object-cover rounded-lg shadow-sm border border-gray-200"
                      />
                      <div 
                        className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center"
                        onClick={() => {
                          setPreviewImage(null);
                          setNewOffer({...newOffer, image: null});
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="h-36 w-36 border-2 border-gray-300 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 transition-colors hover:border-[#02615E]/50 hover:text-[#02615E]/50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">No image selected</span>
                    </div>
                  )}
                </div>
                <div className="ml-6">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02615E]">
                    <span>Upload image</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      accept="image/*"
                      className="sr-only" 
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 800 x 600 pixels</p>
                </div>
              </div>
            </div>

            {/* Price and quantity section */}
            <div className="sm:col-span-6">
              <div className="bg-gray-50 px-6 py-5 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Pricing & Availability</h4>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                  {/* Original Price field */}
                  <div>
                    <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price ($)
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
                        value={newOffer.originalPrice}
                        onChange={(e) => setNewOffer({...newOffer, originalPrice: e.target.value})}
                        className="py-3 block w-full pl-7 pr-3 border-gray-300 rounded-md focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Discounted Price field */}
                  <div>
                    <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Sale Price ($)
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
                        value={newOffer.discountedPrice}
                        onChange={(e) => setNewOffer({...newOffer, discountedPrice: e.target.value})}
                        className="py-3 block w-full pl-7 pr-3 border-gray-300 rounded-md focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Quantity field */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="py-3 px-4 block w-full border-gray-300 rounded-md focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm"
                        placeholder="1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pickup Time field - Updated to time inputs */}
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Time Window
              </label>
              <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="pickup_time_start" className="block text-xs font-medium text-gray-500 mb-1">
                    Start Time
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="time"
                      id="pickup_time_start"
                      name="pickup_time_start"
                      required
                      className="py-3 px-4 block w-full border-gray-300 rounded-md focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm"
                      value={newOffer.pickup_time.split('-')[0] || ''}
                      onChange={(e) => {
                        const endTime = newOffer.pickup_time.split('-')[1] || '';
                        setNewOffer({
                          ...newOffer, 
                          pickup_time: `${e.target.value}-${endTime}`
                        });
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="pickup_time_end" className="block text-xs font-medium text-gray-500 mb-1">
                    End Time
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="time"
                      id="pickup_time_end"
                      name="pickup_time_end"
                      required
                      className="py-3 px-4 block w-full border-gray-300 rounded-md focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm"
                      value={newOffer.pickup_time.split('-')[1] || ''}
                      onChange={(e) => {
                        const startTime = newOffer.pickup_time.split('-')[0] || '';
                        setNewOffer({
                          ...newOffer, 
                          pickup_time: `${startTime}-${e.target.value}`
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">Specify the time window when customers can pick up this offer</p>
            </div>

            {/* Is Active toggle */}
            <div className="sm:col-span-6">
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Offer Status</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {newOffer.is_active 
                        ? 'This offer will be visible to customers immediately' 
                        : 'This offer will be saved as a draft'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`${
                      newOffer.is_active ? 'bg-[#02615E]' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#02615E] focus:ring-offset-2`}
                    role="switch"
                    aria-checked={newOffer.is_active}
                    onClick={() => setNewOffer({...newOffer, is_active: !newOffer.is_active})}
                  >
                    <span className="sr-only">Active status</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        newOffer.is_active ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form actions */}
          <div className="pt-3 border-t border-gray-200 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowNewOfferForm(false)}
              className="bg-white py-2.5 px-5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02615E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#02615E] hover:bg-[#02615E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02615E]"
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