import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UsersManagement from '../components/admin/UsersManagement';
import MerchantsManagement from '../components/admin/MerchantsManagement';
import Analytics from '../components/admin/Analytics';
import ContentManagement from '../components/admin/ContentManagement';
import ReportsManagement from '../components/admin/ReportsManagement';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    setIsLoggedIn(!!token);
    setUserRole(role);
    
    if (!token || role !== 'Admin') {
      navigate('/login');
    }
  }, [navigate]);

  if (!isLoggedIn || userRole !== 'Admin') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center">
          <svg className="w-20 h-20 mb-4" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
            <motion.circle 
              cx="50" cy="50" r="40" stroke="#02615E" strokeWidth="8" fill="none" strokeLinecap="round" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              strokeDasharray="251" strokeDashoffset="251"
            />
          </svg>
          <div className="bg-white shadow-xl rounded-lg px-6 py-4 flex items-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-[#02615E] rounded-full mr-2"
            />
            <span className="text-[#02615E] font-medium">Loading BitBack Admin...</span>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: 'users', label: 'Users', icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { id: 'merchants', label: 'Merchants', icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { id: 'analytics', label: 'Analytics', icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { id: 'reports', label: 'Reports', icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { id: 'content', label: 'Offers', icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
  ];

  const getTabTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'users': return 'User Management';
      case 'merchants': return 'Merchant Management';
      case 'analytics': return 'Analytics & Statistics';
      case 'reports': return 'Reports & Insights';
      case 'content': return 'Offers Management';
      default: return '';
    }
  };

  const getTabContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Analytics />;
      case 'users': return <UsersManagement />;
      case 'merchants': return <MerchantsManagement />;
      case 'analytics': return <Analytics />;
      case 'content': return <ContentManagement />;
      case 'reports': return <ReportsManagement />;
      default: return null;
    }
  };

  return (
    <div className="h-screen flex bg-[#f8fafc] overflow-hidden">
      <motion.div 
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="h-full bg-white border-r border-gray-200 shadow-sm z-20 relative"
      >
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
          className="absolute -right-3 top-16 bg-white border border-gray-200 rounded-full p-1.5 shadow-md z-10"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="h-full flex flex-col">
          <div className="py-6 flex items-center justify-center border-b border-gray-100">
            {sidebarCollapsed ? (
              <div className="bg-gradient-to-r from-[#02615E] to-[#02615E]/90 w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-[#02615E] to-[#02615E]/90 w-10 h-10 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <span className="ml-3 text-xl font-semibold text-gray-800">BitBack</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 py-6 overflow-y-auto">
            {navItems.map(item => (
              <div key={item.id} className={`px-4 mb-2 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`group flex items-center px-3 py-3 rounded-xl w-full transition-all duration-200 hover:bg-[#02615E]/5 ${
                    activeTab === item.id 
                      ? 'bg-[#02615E]/10 text-[#02615E] border-l-4 border-[#02615E]' 
                      : 'text-gray-600'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
                </button>
              </div>
            ))}
          </div>
          
          <div className={`border-t border-gray-100 p-4 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
            {sidebarCollapsed ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">A</span>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">A</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">admin@bitback.com</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{getTabTitle()}</h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-gray-100 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#02615E]/20 w-48 transition-all duration-300 focus:w-64"
                />
                <svg 
                  className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button className="relative p-2 text-gray-500 hover:text-[#02615E] transition-colors rounded-full hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#02615E] to-[#024e4b] flex items-center justify-center text-white font-medium text-sm">
                    A
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500 truncate">admin@bitback.com</p>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-6 bg-[#f8fafc]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {getTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;