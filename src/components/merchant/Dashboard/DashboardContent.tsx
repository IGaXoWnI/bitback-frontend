import React from 'react';
import StatsCard from './StatsCard';

interface DashboardContentProps {
  totalActiveOffers: number;
  totalOrders: number;
  totalRevenue: number;
  foodSaved: number;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  totalActiveOffers, 
  totalOrders, 
  totalRevenue, 
  foodSaved 
}) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Offers */}
        <StatsCard 
          title="Active Offers"
          value={totalActiveOffers}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
            </svg>
          }
        />
        
        {/* Total Orders */}
        <StatsCard 
          title="Total Orders"
          value={totalOrders}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />
        
        {/* Revenue */}
        <StatsCard 
          title="Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        {/* Food Waste Saved */}
        <StatsCard 
          title="Food Waste Saved"
          value={`${foodSaved.toFixed(1)} kg`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#02615E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

export default DashboardContent;