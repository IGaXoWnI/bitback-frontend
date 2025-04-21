import React from 'react';
import BusinessInfoForm from './BusinessInfoForm';
import AccountSettingsForm from './AccountSettingsForm';

const SettingsContent: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h1>
      
      {/* Business Information */}
      <BusinessInfoForm />
      
      {/* Profile & Password */}
      <AccountSettingsForm />
    </div>
  );
};

export default SettingsContent;