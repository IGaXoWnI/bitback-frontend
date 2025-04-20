import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import UsersManagement from '../components/admin/UsersManagement';
import MerchantsManagement from '../components/admin/MerchantsManagement';
import Analytics from '../components/admin/Analytics';
import Settings from '../components/admin/Settings';
import ContentManagement from '../components/admin/ContentManagement';
import ReportsManagement from '../components/admin/ReportsManagement';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication and admin role
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    setIsLoggedIn(!!token);
    setUserRole(role);
    
    // Redirect if not admin
    if (!token || role !== 'Admin') {
      navigate('/login');
    }
  }, [navigate]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // If not authenticated, show loading until redirect happens
  if (!isLoggedIn || userRole !== 'Admin') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#F9F3F0]">
        <div className="w-10 h-10 border-4 border-[#02615E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {activeTab === 'dashboard' && (
            <Analytics isOverview={true} />
          )}
          
          {activeTab === 'users' && (
            <UsersManagement />
          )}
          
          {activeTab === 'merchants' && (
            <MerchantsManagement />
          )}
          
          {activeTab === 'analytics' && (
            <Analytics isOverview={false} />
          )}
          
          {activeTab === 'content' && (
            <ContentManagement />
          )}
          
          {activeTab === 'reports' && (
            <ReportsManagement />
          )}
          
          {activeTab === 'settings' && (
            <Settings />
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;