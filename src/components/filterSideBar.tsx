import { useState, useEffect } from 'react';

type FilterSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: FilterState) => void;
};

type FilterState = {
  sortBy: string;
  offers: boolean;
  bestRated: boolean;
  priceRange: string[];
  maxDeliveryFee: number;
  dietaryOptions: string[];
};

function FilterSidebar({ isOpen, onClose, onFiltersChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'default',
    offers: false,
    bestRated: false,
    priceRange: [],
    maxDeliveryFee: 5,
    dietaryOptions: [],
  });

  // Price options
  const priceOptions = ['€', '€€', '€€€', '€€€€'];

  // Dietary options
  const dietaryOptions = ['Végétarien', 'Vegan', 'Sans gluten', 'Halal'];

  // Handle sort by change
  const handleSortChange = (value: string) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
  };

  // Toggle filter
  const handleToggle = (key: 'offers' | 'bestRated') => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle price range selection
  const handlePriceChange = (price: string) => {
    const newPriceRange = [...filters.priceRange];
    const index = newPriceRange.indexOf(price);
    
    if (index === -1) {
      newPriceRange.push(price);
    } else {
      newPriceRange.splice(index, 1);
    }
    
    setFilters(prev => ({ ...prev, priceRange: newPriceRange }));
  };

  // Handle delivery fee slider change
  const handleDeliveryFeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, maxDeliveryFee: parseInt(event.target.value) }));
  };

  // Toggle dietary option
  const handleDietaryChange = (option: string) => {
    const newDietaryOptions = [...filters.dietaryOptions];
    const index = newDietaryOptions.indexOf(option);
    
    if (index === -1) {
      newDietaryOptions.push(option);
    } else {
      newDietaryOptions.splice(index, 1);
    }
    
    setFilters(prev => ({ ...prev, dietaryOptions: newDietaryOptions }));
  };

  // Apply filters
  const applyFilters = () => {
    onFiltersChange(filters);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      sortBy: 'default',
      offers: false,
      bestRated: false,
      priceRange: [],
      maxDeliveryFee: 5,
      dietaryOptions: [],
    });
  };

  // Update parent component when filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:relative top-0 right-0 h-full bg-white w-full max-w-xs md:max-w-none md:w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        } overflow-auto`}
      >
        {/* Header with close button on mobile */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:border-0">
          <h2 className="text-lg font-semibold text-[#02615E]">Filtres</h2>
          <button 
            className="md:hidden p-2 text-gray-500"
            onClick={onClose}
            aria-label="Close filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {/* Sorting options */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-700">Trier</h3>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="sortBy" 
                  value="default"
                  checked={filters.sortBy === 'default'}
                  onChange={() => handleSortChange('default')}
                  className="form-radio h-4 w-4 text-[#02615E] focus:ring-[#02615E]"
                />
                <span className="ml-2 text-sm">Choisi pour vous (par défaut)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="sortBy" 
                  value="popular"
                  checked={filters.sortBy === 'popular'}
                  onChange={() => handleSortChange('popular')}
                  className="form-radio h-4 w-4 text-[#02615E] focus:ring-[#02615E]"
                />
                <span className="ml-2 text-sm">Les plus populaires</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="sortBy" 
                  value="rating"
                  checked={filters.sortBy === 'rating'}
                  onChange={() => handleSortChange('rating')}
                  className="form-radio h-4 w-4 text-[#02615E] focus:ring-[#02615E]"
                />
                <span className="ml-2 text-sm">Note</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="sortBy" 
                  value="delivery"
                  checked={filters.sortBy === 'delivery'}
                  onChange={() => handleSortChange('delivery')}
                  className="form-radio h-4 w-4 text-[#02615E] focus:ring-[#02615E]"
                />
                <span className="ml-2 text-sm">Délai de livraison</span>
              </label>
            </div>
          </div>

          {/* Par BitBack section */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-700">Par BitBack</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Offres</span>
                <div className="relative">
                  <input 
                    type="checkbox"
                    checked={filters.offers}
                    onChange={() => handleToggle('offers')}
                    className="sr-only"
                  />
                  <div className={`block w-10 h-6 rounded-full transition ${filters.offers ? 'bg-[#02615E]' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${filters.offers ? 'translate-x-4' : ''}`}></div>
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Les mieux notés</span>
                <div className="relative">
                  <input 
                    type="checkbox"
                    checked={filters.bestRated}
                    onChange={() => handleToggle('bestRated')}
                    className="sr-only"
                  />
                  <div className={`block w-10 h-6 rounded-full transition ${filters.bestRated ? 'bg-[#02615E]' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${filters.bestRated ? 'translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>

          {/* Price range */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-700">Fourchette de prix</h3>
            <div className="flex space-x-2">
              {priceOptions.map((price) => (
                <button
                  key={price}
                  onClick={() => handlePriceChange(price)}
                  className={`flex-1 py-2 border rounded-md text-sm font-medium transition-colors ${
                    filters.priceRange.includes(price)
                      ? 'bg-[#02615E] text-white border-[#02615E]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery fee slider */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-700">Frais de livraison maximum</h3>
            <div className="px-1">
              <input
                type="range"
                min="3"
                max="7"
                step="1"
                value={filters.maxDeliveryFee}
                onChange={handleDeliveryFeeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>€3</span>
                <span>€4</span>
                <span>€5</span>
                <span>€6</span>
                <span>€7+</span>
              </div>
              <div className="text-center mt-3 text-sm font-medium">
                {filters.maxDeliveryFee === 7 ? '€7+' : `€${filters.maxDeliveryFee}`}
              </div>
            </div>
          </div>

          {/* Dietary options */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-700">Diététique</h3>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleDietaryChange(option)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filters.dietaryOptions.includes(option)
                      ? 'bg-[#02615E] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile action buttons */}
          <div className="md:hidden mt-8 flex space-x-3">
            <button
              onClick={resetFilters}
              className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Réinitialiser
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 py-2.5 px-4 bg-[#02615E] rounded-lg text-sm font-medium text-white hover:bg-[#037d78]"
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterSidebar;