import React from 'react';
import { Link } from 'react-router-dom';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white shadow-lg">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-[#02615E]">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-white">BitBack Admin</span>
            </Link>
          </div>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <SidebarItem 
                icon={<DashboardIcon active={activeTab === 'dashboard'} />}
                label="Dashboard"
                active={activeTab === 'dashboard'}
                onClick={() => onTabChange('dashboard')}
              />
              <SidebarItem 
                icon={<UsersIcon active={activeTab === 'users'} />}
                label="User Management"
                active={activeTab === 'users'}
                onClick={() => onTabChange('users')}
              />
              <SidebarItem 
                icon={<MerchantsIcon active={activeTab === 'merchants'} />}
                label="Merchant Management"
                active={activeTab === 'merchants'}
                onClick={() => onTabChange('merchants')}
              />
              <SidebarItem 
                icon={<AnalyticsIcon active={activeTab === 'analytics'} />}
                label="Analytics"
                active={activeTab === 'analytics'}
                onClick={() => onTabChange('analytics')}
              />
              <SidebarItem 
                icon={<ContentIcon active={activeTab === 'content'} />}
                label="Content Management"
                active={activeTab === 'content'}
                onClick={() => onTabChange('content')}
              />
              <SidebarItem 
                icon={<ReportsIcon active={activeTab === 'reports'} />}
                label="Reports"
                active={activeTab === 'reports'}
                onClick={() => onTabChange('reports')}
              />
              <SidebarItem 
                icon={<SettingsIcon active={activeTab === 'settings'} />}
                label="Settings"
                active={activeTab === 'settings'}
                onClick={() => onTabChange('settings')}
              />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
        active
          ? 'bg-[#02615E] text-white'
          : 'text-gray-700 hover:bg-gray-50 hover:text-[#02615E]'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// Icon components
function DashboardIcon({ active }: { active: boolean }) {
  return (
    <svg 
      className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-[#02615E]'}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function UsersIcon({ active }: { active: boolean }) {
  return (
    <svg 
      className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-[#02615E]'}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MerchantsIcon({ active }: { active: boolean }) {
  return (
    <svg 
      className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-[#02615E]'}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function AnalyticsIcon({ active }: { active: boolean }) {
  return (
    <svg 
      className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-[#02615E]'}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function ContentIcon({ active }: { active: boolean }) {
  return (
    <svg 
      className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-[#02615E]'}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  );
}

function ReportsIcon({ active }: { active: boolean }) {
  return (
    <svg 
      className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-[#02615E]'}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg 
      className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-[#02615E]'}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export default AdminSidebar;