import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FoodItemCard from '../components/box_card';
import FilterSidebar from '../components/filterSideBar';
import Navbar from '../components/Navbar'; 
import LocationModal from '../components/LocationModal';
import SkeletonLoader from '../components/SkeletonLoader';
import api from '../api';

// Define a TypeScript interface for the food item data structure
interface FoodItem {
  id: string | number;
  title: string;
  description?: string;
  original_price: number;
  discounted_price: number;
  image: string;
  quantity_available?: number;
  quantity_reserved?: number;
  pickup_time: string;
  rating: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  business_id?: number;
  distance_in_meters?: number;
  [key: string]: any; // Add an index signature to allow any other properties
}

// Add this interface near your other interfaces at the top of the file
interface NearMeResponseItem {
  box: FoodItem;
  distance_in_meters: number;
}

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]); // Typed array
  const [isLoadingFoodItems, setIsLoadingFoodItems] = useState(true);
  const [filters, setFilters] = useState({
    sortBy: 'default',
    offers: false,
    bestRated: false,
    priceRange: [],
    maxDeliveryFee: 5,
    dietaryOptions: [],
  });
  const [locationUpdated, setLocationUpdated] = useState(0); // Track location changes

  // Check if we should show the location modal
  useEffect(() => {
    const timer = setTimeout(() => {
      const locationSet = localStorage.getItem('userLocation');
      const fromRegistration = location.state?.fromRegistration;

      if (fromRegistration || !locationSet) {
        setShowLocationModal(true);
      }

      setIsPageLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  // Fetch food items when component mounts or location is updated
  useEffect(() => {
    // Get food items from API
    const getFoodItems = async () => {
      setIsLoadingFoodItems(true);
      
      try {
        console.log("Fetching near-me data...");
        const response = await api.get('/near-me');
        console.log("Near-me response:", response.data);
        
        // Check if we have a valid response
        if (response?.data?.success && response?.data?.data) {
          
          // The data format is an array of objects with a "box" property
          if (Array.isArray(response.data.data)) {
            // Extract boxes from the data array
            const boxesData = response.data.data.map((item: NearMeResponseItem) => {
              if (!item || !item.box) {
                console.log("Invalid item in data array:", item);
                return null;
              }
              
              return {
                ...item.box,
                distance_in_meters: item.distance_in_meters
              };
            }).filter(Boolean); // Remove any null items
            
            console.log("Processing boxes:", boxesData.length, "items");
            setFoodItems(boxesData);
          } else {
            console.log("Unexpected data format:", response.data.data);
            setFoodItems([]);
          }
        } else {
          console.log("No success or data in response, setting empty array");
          setFoodItems([]);
        }
      } catch (error) {
        console.error("Error fetching near-me data:", error);
        setFoodItems([]);
      } finally {
        // Always set loading to false when done
        setIsLoadingFoodItems(false);
      }
    };

    getFoodItems();
  }, [locationUpdated]); // This will re-run when location is updated

  // Fallback data in case API fails completely
  useEffect(() => {
    const timer = setTimeout(() => {
      // If after 3 seconds we still have no items, use fallback data
      if (foodItems.length === 0) {
        setFoodItems([
          {
            id: 1,
            title: "Sample Food Box",
            description: "A delicious sample food box",
            original_price: 15.99,
            discounted_price: 5.99,
            image: "https://via.placeholder.com/300",
            pickup_time: "18:00-20:00",
            rating: 4.5,
            is_active: true
          }
        ]);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [foodItems]);

  // Handle filter changes
  const handleFiltersChange = () => {
    // Apply filters to food items
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navbar - this should always show */}
      <Navbar />

      {/* Main content - only show when loaded */}
      {isPageLoaded ? (
        <>
          {/* Premium Hero Section */}
          <div className="relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[#02615E]/90 to-[#02615E]/70 z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836" 
              alt="Food" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Rescue Food, Save Money</h1>
              <p className="text-white/90 text-lg max-w-xl mb-8">
                Discover delicious surplus food from local businesses at amazing prices
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md bg-white rounded-full shadow-lg p-1 pl-4 flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search for food or restaurants..." 
                  className="flex-1 py-2 px-1 focus:outline-none text-gray-700"
                />
                <button className="bg-[#02615E] hover:bg-[#024e4b] text-white rounded-full px-6 py-2 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Enhanced Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center gap-3">
              <div className="flex overflow-x-auto scrollbar-hide">
                <button className="whitespace-nowrap bg-[#02615E] text-white px-4 py-2 rounded-full text-sm font-medium">
                  All Items
                </button>
                <button className="whitespace-nowrap ml-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                  Best Deals
                </button>
                <button className="whitespace-nowrap ml-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                  Top Rated
                </button>
                <button className="whitespace-nowrap ml-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H21M10 12H21M17 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Sort
                </button>
              </div>
              
              <div className="ml-auto">
                <button 
                  onClick={() => setShowFilters(true)} 
                  className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span>Filters</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Filter sidebar - hidden on mobile by default */}
              <div className="md:w-64 md:mr-8">
                <FilterSidebar 
                  isOpen={showFilters} 
                  onClose={() => setShowFilters(false)} 
                  onFiltersChange={handleFiltersChange} 
                />
              </div>

              {/* Food items grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingFoodItems ? (
                  // Show skeleton loaders while loading
                  Array(6).fill(0).map((_, index) => (
                    <SkeletonLoader key={index} />
                  ))
                ) : !foodItems || !Array.isArray(foodItems) || foodItems.length === 0 ? (
                  // Show the empty state if no items found
                  <div className="col-span-3 flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow text-center">
                    <img 
                      src="https://cdn.iconscout.com/icon/free/png-256/free-empty-box-4085075-3378186.png" 
                      alt="No items" 
                      className="w-24 h-24 mb-4 opacity-30"
                    />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Food Boxes Available</h3>
                    <p className="text-gray-500 max-w-md">
                      There are no food boxes available in your area right now. Check back soon for delicious offerings!
                    </p>
                  </div>
                ) : (
                  // Show actual food items when loaded
                  foodItems.map((item) => {
                    try {
                      return (
                        <div 
                          key={item.id || Math.random()}
                          onClick={() => navigate(`/item/${item.id}`)}
                          className="cursor-pointer"
                        >
                          <FoodItemCard
                            id={String(item.id || '')}
                            image={item.image || ''}
                            title={item.title || ''}
                            price={{
                              original: Number(item.original_price) || 0,
                              discounted: Number(item.discounted_price) || 0
                            }}
                            rating={Number(item.rating) || 0}
                            restaurant={item.business?.business_name || item.title || ''}
                            pickupTime={item.pickup_time || ''}
                            distance={item.distance_in_meters 
                              ? `${(item.distance_in_meters / 1000).toFixed(1)} km away` 
                              : 'Nearby'}
                            isFavorite={false}
                            onFavoriteToggle={() => {}}
                          />
                        </div>
                      );
                    } catch (err) {
                      return null;
                    }
                  })
                )}
              </div>
            </div>
          </main>

          {/* Location Modal - this should be inside the isPageLoaded check */}
          <LocationModal 
            isOpen={showLocationModal} 
            onClose={() => {
              setShowLocationModal(false);
              // Trigger a refresh of the food items
              setLocationUpdated(prev => prev + 1);
              
              // Clear registration state
              if (location.state?.fromRegistration) {
                navigate(".", { replace: true, state: {} });
              }
            }} 
          />
        </>
      ) : (
        // Loading animation - full screen
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-[#02615E]/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[#02615E] rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-lg text-[#02615E] font-medium animate-pulse">Finding delicious deals near you...</p>
          </div>
        </div>
      )}

      {isPageLoaded && (
        <div className="fixed bottom-6 right-6 z-30">
          <button 
            onClick={() => setShowLocationModal(true)}
            className="bg-white text-[#02615E] shadow-lg rounded-full p-3.5 flex items-center justify-center hover:bg-[#02615E] hover:text-white transition-colors border border-[#02615E]/10 group"
            aria-label="Change location"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Change Location
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;