import React from 'react';

const BusinessInfoForm: React.FC = () => {
  return (
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
  );
};

export default BusinessInfoForm;