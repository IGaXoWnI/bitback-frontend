import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon,
  subtitle,
  trend,
  color = 'from-[#02615E] to-[#1A8F7D]'
}) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      style={{ transition: 'all 0.3s ease' }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">{value}</h3>
            
            {subtitle && (
              <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
            )}
            
            {trend && (
              <div className="mt-2 flex items-center">
                <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.isPositive ? '↑' : '↓'} {trend.value}%
                </span>
                <span className="ml-1 text-xs text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          
          <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;