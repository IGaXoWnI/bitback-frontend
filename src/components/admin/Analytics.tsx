import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiShoppingBag, FiBox, FiDollarSign } from 'react-icons/fi';
import api from '../../api';

interface AnalyticsData {
  totalUsers: number;
  activeMerchants: number;
  itemsSaved: number;
  totalRevenue: number;
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('all');
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    activeMerchants: 0,
    itemsSaved: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Update to use the /stats/key endpoint
        const response = await api.get(`/stats/key?timeRange=${timeRange}`);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color, 
    bgColor 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }) => (
    <motion.div 
      variants={itemVariants}
      className={`relative overflow-hidden rounded-xl p-6 shadow-lg ${bgColor}`}
    >
      <div className="flex items-center">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color} bg-opacity-20`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 h-24 w-24 -m-6 opacity-10">
        {icon}
      </div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Key performance metrics at a glance</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#02615E] focus:ring-[#02615E] text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="rounded-xl bg-gray-100 animate-pulse h-32"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatCard 
            title="Total Users" 
            value={formatNumber(data.totalUsers)} 
            icon={<FiUsers className="h-6 w-6 text-blue-600" />}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          
          <StatCard 
            title="Active Merchants" 
            value={formatNumber(data.activeMerchants)} 
            icon={<FiShoppingBag className="h-6 w-6 text-purple-600" />}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          
          <StatCard 
            title="Items Saved" 
            value={formatNumber(data.itemsSaved)} 
            icon={<FiBox className="h-6 w-6 text-green-600" />}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          
          <StatCard 
            title="Total Revenue" 
            value={formatCurrency(data.totalRevenue)} 
            icon={<FiDollarSign className="h-6 w-6 text-yellow-600" />}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
          />
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;