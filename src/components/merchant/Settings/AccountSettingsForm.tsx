import React from 'react';

const AccountSettingsForm: React.FC = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h3>
        <p className="mt-1 text-sm text-gray-500">Manage your account details and password</p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
              <input
                type="text"
                name="first-name"
                id="first-name"
                defaultValue="John"
                className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
              <input
                type="text"
                name="last-name"
                id="last-name"
                defaultValue="Baker"
                className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div className="col-span-6 sm:col-span-4">
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                defaultValue="john@artisanbakery.com"
                className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current password</label>
              <input
                type="password"
                name="current-password"
                id="current-password"
                className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New password</label>
              <input
                type="password"
                name="new-password"
                id="new-password"
                className="mt-1 focus:ring-[#02615E] focus:border-[#02615E] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#02615E] hover:bg-[#02615E]/90"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettingsForm;