import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from './StatsCard';

interface DashboardContentProps {
  totalActiveOffers: number;
  totalRevenue: number;
  foodSaved: number;
  totalReservations: number;
  monthlyRevenue?: number;
  pickupRate?: number;
  topBoxes?: any[];
  uniqueCustomers?: number;
  returningCustomers?: number;
  customerReturnRate?: number;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  totalActiveOffers, 
  totalRevenue, 
  foodSaved,
  totalReservations,
  monthlyRevenue = 0,
  pickupRate = 0,
  topBoxes = [],
  uniqueCustomers = 0,
  returningCustomers = 0,
  customerReturnRate = 0
}) => {
  
  const formatCurrency = (amount: number) => {
    return '$' + amount.toFixed(2);
  };


  const getTopBoxInfo = () => {
    if (topBoxes.length === 0) return "No data available";
    
    const topBox = topBoxes[0];
    return `Best seller: ${topBox.title}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatsCard 
            title="Revenue"
            value={formatCurrency(totalRevenue)}
            subtitle={`This month: ${formatCurrency(monthlyRevenue)}`}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.4"/>
                <path d="M12.75 9V15C12.75 15.41 12.41 15.75 12 15.75C11.59 15.75 11.25 15.41 11.25 15V9C11.25 8.59 11.59 8.25 12 8.25C12.41 8.25 12.75 8.59 12.75 9Z" fill="currentColor"/>
                <path d="M15.53 10.4703C16.4 11.3403 17 12.5803 17 14.0003C17 16.7603 14.76 19.0003 12 19.0003C9.24 19.0003 7 16.7603 7 14.0003C7 12.5803 7.6 11.3403 8.47 10.4703C8.88 10.0603 9.52 10.0603 9.93 10.4703C10.34 10.8803 10.34 11.5203 9.93 11.9303C9.39 12.4703 9 13.1903 9 14.0003C9 15.6603 10.34 17.0003 12 17.0003C13.66 17.0003 15 15.6603 15 14.0003C15 13.1903 14.61 12.4703 14.07 11.9303C13.66 11.5203 13.66 10.8803 14.07 10.4703C14.48 10.0603 15.12 10.0603 15.53 10.4703Z" fill="currentColor"/>
                <path d="M12.75 5V6C12.75 6.41 12.41 6.75 12 6.75C11.59 6.75 11.25 6.41 11.25 6V5C11.25 4.59 11.59 4.25 12 4.25C12.41 4.25 12.75 4.59 12.75 5Z" fill="currentColor"/>
              </svg>
            }
            color="from-purple-500 to-violet-600"
          />
        </motion.div>
        

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatsCard 
            title="Pickup Rate"
            value={`${pickupRate}%`}
            subtitle={`${totalReservations} total reservations`}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2H8C4 2 2 4 2 8V21C2 21.55 2.45 22 3 22H16C20 22 22 20 22 16V8C22 4 20 2 16 2Z" fill="currentColor" fillOpacity="0.4"/>
                <path d="M12.91 16.2116C12.91 17.9316 11.43 19.4116 9.70996 19.4116C7.98996 19.4116 6.50996 17.9316 6.50996 16.2116C6.50996 14.4916 7.98996 13.0116 9.70996 13.0116C11.43 13.0116 12.91 14.4916 12.91 16.2116Z" fill="currentColor"/>
                <path d="M9.71004 17.1094C8.54004 17.1094 7.59004 16.1594 7.59004 14.9894C7.59004 14.6694 7.85004 14.4094 8.17004 14.4094C8.49004 14.4094 8.75004 14.6694 8.75004 14.9894C8.75004 15.5294 9.17004 15.9494 9.71004 15.9494C10.25 15.9494 10.67 15.5294 10.67 14.9894C10.67 14.6694 10.93 14.4094 11.25 14.4094C11.57 14.4094 11.83 14.6694 11.83 14.9894C11.83 16.1694 10.88 17.1094 9.71004 17.1094Z" fill="currentColor"/>
                <path d="M11.43 9.18125H7.99002C7.67002 9.18125 7.41002 8.92125 7.41002 8.60125C7.41002 8.28125 7.67002 8.02125 7.99002 8.02125H11.43C11.75 8.02125 12.01 8.28125 12.01 8.60125C12.01 8.92125 11.75 9.18125 11.43 9.18125Z" fill="currentColor"/>
                <path d="M16.0001 11.9984H8.00009C7.68009 11.9984 7.42009 11.7384 7.42009 11.4184C7.42009 11.0984 7.68009 10.8384 8.00009 10.8384H16.0001C16.3201 10.8384 16.5801 11.0984 16.5801 11.4184C16.5801 11.7384 16.3201 11.9984 16.0001 11.9984Z" fill="currentColor"/>
              </svg>
            }
            color="from-blue-500 to-indigo-600"
          />
        </motion.div>
        

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatsCard 
            title="Top Boxes"
            value={topBoxes.length > 0 ? topBoxes.length : 0}
            subtitle={getTopBoxInfo()}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.12 16.5V7.5C20.12 6.88 19.62 6.38 19 6.38H17.88V5.25C17.88 4.62 17.38 4.12 16.75 4.12C16.12 4.12 15.62 4.62 15.62 5.25V6.38H8.38V5.25C8.38 4.62 7.88 4.12 7.25 4.12C6.62 4.12 6.12 4.62 6.12 5.25V6.38H5C4.38 6.38 3.88 6.88 3.88 7.5V16.5C3.88 17.12 4.38 17.62 5 17.62H19C19.62 17.62 20.12 17.12 20.12 16.5Z" fill="currentColor"/>
              </svg>
            }
            color="from-emerald-500 to-teal-600"
          />
        </motion.div>
        
   
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <StatsCard 
            title="Customer Retention"
            value={`${customerReturnRate}%`}
            subtitle={`${uniqueCustomers} unique customers`}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                <path d="M12 14.5C6.99 14.5 2.91 17.86 2.91 22C2.91 22.28 3.13 22.5 3.41 22.5H20.59C20.87 22.5 21.09 22.28 21.09 22C21.09 17.86 17.01 14.5 12 14.5Z" fill="currentColor"/>
              </svg>
            }
            color="from-green-500 to-teal-600"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardContent;