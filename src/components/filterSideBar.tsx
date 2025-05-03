import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterState {
  sortBy: string;
  priceRange: number[];
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: FilterState) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose, onFiltersChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'default',
    priceRange: [0, 50],
  });

  const updateFilters = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      sortBy: 'default',
      priceRange: [0, 50],
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button 
                  onClick={onClose} 
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                {renderFilterContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="hidden md:block sticky top-20">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
          {renderFilterContent()}
        </div>
      </div>
    </>
  );

  function renderFilterContent() {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Sort By</h3>
          <select 
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#02615E]/20"
            value={filters.sortBy}
            onChange={(e) => updateFilters('sortBy', e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <h3 className="font-medium text-gray-700">Price Range</h3>
            <span className="text-sm text-[#02615E]">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </span>
          </div>
          <input 
            type="range"
            min="0"
            max="50"
            step="5"
            value={filters.priceRange[1]}
            onChange={(e) => updateFilters('priceRange', [0, parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
          />
        </div>
        
        <button 
          onClick={resetFilters}
          className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    );
  }
};

export default FilterSidebar;