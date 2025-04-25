import React from 'react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose, onFiltersChange }) => {
  // Only on mobile, this will be a modal
  const sidebarClass = isOpen 
    ? "fixed inset-0 bg-black bg-opacity-50 z-50 md:relative md:bg-transparent md:z-auto flex md:block"
    : "hidden md:block";

  return (
    <div className={sidebarClass}>
      {/* Mobile overlay */}
      <div className="md:hidden absolute inset-0" onClick={onClose}></div>
      
      {/* Sidebar content */}
      <div className="bg-white p-4 rounded-lg shadow-sm w-80 md:w-full max-h-[90vh] md:max-h-none overflow-auto ml-auto md:ml-0 relative md:static">
        {/* Mobile header */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h3 className="font-semibold text-lg">Filters</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Desktop header */}
        <h3 className="font-semibold text-lg mb-4 hidden md:block">Filter Options</h3>
        
        {/* Sort by */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Sort By</h4>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="sort" className="form-radio text-[#02615E]" defaultChecked />
              <span className="ml-2 text-sm">Recommended</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="sort" className="form-radio text-[#02615E]" />
              <span className="ml-2 text-sm">Price: Low to High</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="sort" className="form-radio text-[#02615E]" />
              <span className="ml-2 text-sm">Price: High to Low</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="sort" className="form-radio text-[#02615E]" />
              <span className="ml-2 text-sm">Biggest Discount</span>
            </label>
          </div>
        </div>
        
        {/* Price Range - Simplified */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-[#02615E]" />
              <span className="ml-2 text-sm">Under $5</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-[#02615E]" />
              <span className="ml-2 text-sm">$5 - $10</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-[#02615E]" />
              <span className="ml-2 text-sm">Over $10</span>
            </label>
          </div>
        </div>
        
        {/* Pickup Time - Simple */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Pickup Time</h4>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-[#02615E]" />
              <span className="ml-2 text-sm">Morning (6AM-12PM)</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-[#02615E]" />
              <span className="ml-2 text-sm">Afternoon (12PM-5PM)</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-[#02615E]" />
              <span className="ml-2 text-sm">Evening (5PM-10PM)</span>
            </label>
          </div>
        </div>
        
        {/* Apply Button - Mobile only */}
        <div className="pt-4 border-t border-gray-200 mt-6 md:hidden">
          <button 
            onClick={onClose}
            className="w-full bg-[#02615E] text-white rounded-lg py-2 font-medium hover:bg-[#024e4b] transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;