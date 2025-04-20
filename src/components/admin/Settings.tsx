import React, { useState } from 'react';

function Settings() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'BitBack',
    contactEmail: 'support@bitback.com',
    allowNewRegistrations: true,
    maintenanceMode: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    adminAlerts: true,
    merchantApprovalNotifications: true
  });

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save these settings to your backend
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure platform settings and preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">General Settings</h3>
            <div className="mt-5">
              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    id="siteName"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm"
                    value={generalSettings.siteName}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Support Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    id="contactEmail"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#02615E] focus:border-[#02615E] sm:text-sm"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="allowNewRegistrations"
                      name="allowNewRegistrations"
                      type="checkbox"
                      className="focus:ring-[#02615E] h-4 w-4 text-[#02615E] border-gray-300 rounded"
                      checked={generalSettings.allowNewRegistrations}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="allowNewRegistrations" className="font-medium text-gray-700">
                      Allow New User Registrations
                    </label>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="maintenanceMode"
                      name="maintenanceMode"
                      type="checkbox"
                      className="focus:ring-[#02615E] h-4 w-4 text-[#02615E] border-gray-300 rounded"
                      checked={generalSettings.maintenanceMode}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
                      Maintenance Mode
                    </label>
                    <p className="text-gray-500">
                      When enabled, only administrators can access the platform.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Settings</h3>
            <div className="mt-5">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      className="focus:ring-[#02615E] h-4 w-4 text-[#02615E] border-gray-300 rounded"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationSettingsChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-gray-500">
                      Send email notifications to users and merchants.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="adminAlerts"
                      name="adminAlerts"
                      type="checkbox"
                      className="focus:ring-[#02615E] h-4 w-4 text-[#02615E] border-gray-300 rounded"
                      checked={notificationSettings.adminAlerts}
                      onChange={handleNotificationSettingsChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="adminAlerts" className="font-medium text-gray-700">
                      Admin Alerts
                    </label>
                    <p className="text-gray-500">
                      Receive alerts for important system events.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="merchantApprovalNotifications"
                      name="merchantApprovalNotifications"
                      type="checkbox"
                      className="focus:ring-[#02615E] h-4 w-4 text-[#02615E] border-gray-300 rounded"
                      checked={notificationSettings.merchantApprovalNotifications}
                      onChange={handleNotificationSettingsChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="merchantApprovalNotifications" className="font-medium text-gray-700">
                      Merchant Approval Notifications
                    </label>
                    <p className="text-gray-500">
                      Notify when new merchants register and require approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02615E]"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSaveSettings}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#02615E] hover:bg-[#02615E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02615E]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;