import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FoodItemCard from '../components/box_card';
import FilterSidebar from '../components/filterSideBar';
import LocationModal from '../components/LocationModal';

// Sample data for food items
const foodItems = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Surprise Bag - Assorted Bakery Items",
    price: { original: 24.99, discounted: 8.99 },
    rating: 4.8,
    restaurant: "Artisan Bakery",
    pickupTime: "3:30-4:30 PM",
    distance: "0.8 mi"
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Gourmet Pizza Pack - 2 Medium Pizzas",
    price: { original: 32.99, discounted: 12.50 },
    rating: 4.5,
    restaurant: "Napoli's Pizza",
    pickupTime: "5:00-6:00 PM",
    distance: "1.2 mi",
    isFavorite: true
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Organic Salad Box - Various Salads and Dressings",
    price: { original: 18.99, discounted: 7.50 },
    rating: 4.6,
    restaurant: "Green Leaf Cafe",
    pickupTime: "4:15-5:15 PM",
    distance: "0.5 mi"
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Sushi Surprise Box - Chef's Selection",
    price: { original: 39.99, discounted: 15.99 },
    rating: 4.9,
    restaurant: "Tokyo Sushi",
    pickupTime: "6:30-7:30 PM",
    distance: "1.7 mi"
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Burger & Fries Combo - Family Pack",
    price: { original: 29.99, discounted: 11.99 },
    rating: 4.3,
    restaurant: "Burger Joint",
    pickupTime: "5:45-6:45 PM",
    distance: "0.9 mi"
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Fresh Pastry Assortment - 6 Items",
    price: { original: 21.99, discounted: 8.75 },
    rating: 4.7,
    restaurant: "French Patisserie",
    pickupTime: "3:00-4:00 PM",
    distance: "1.0 mi",
    isFavorite: true
  }
];

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'default',
    offers: false,
    bestRated: false,
    priceRange: [],
    maxDeliveryFee: 5,
    dietaryOptions: [],
  });

  // Check if we should show the location modal - do this after the page renders
  useEffect(() => {
    // Delay this check to ensure page is fully loaded
    const timer = setTimeout(() => {
      const locationSet = localStorage.getItem('userLocation');
      const fromLogin = location.state?.fromLogin;

      // Only show the modal automatically if coming from login and no location is set
      if ((fromLogin && !locationSet) || !locationSet) {
        setShowLocationModal(true);
      }

      setIsPageLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  // Handle filter changes
  const handleFiltersChange = () => {
    // Apply filters to food items
  };

  return (
    <div className="min-h-screen bg-[#F9F3F0]">
      {/* Navbar - Matching the same design as welcome page */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-3xl font-extrabold text-[#02615E]">
                BitBack
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <a href="#" className="text-[#02615E] hover:text-[#037d78] font-medium">How it works</a>
              <a href="#" className="text-[#02615E] hover:text-[#037d78] font-medium">Restaurants</a>
              <a href="#" className="text-[#02615E] hover:text-[#037d78] font-medium">About us</a>
              <a href="#" className="text-[#02615E] hover:text-[#037d78] font-medium">Business</a>
            </div>
            
            <div className="md:flex items-center space-x-4">
              {/* Location button */}
              <button 
                onClick={() => setShowLocationModal(true)}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#02615E]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">Set Location</span>
              </button>
              
              {/* Profile button for logged in user */}
              <button className="hidden md:block p-1 rounded-full text-[#02615E] hover:bg-[#e9e3e0] hover:text-[#037d78]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
            
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-[#02615E]"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-b-xl mx-4 mt-2 p-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <a href="#" className="px-3 py-2 text-[#02615E] hover:bg-[#F9F3F0] rounded-md">How it works</a>
              <a href="#" className="px-3 py-2 text-[#02615E] hover:bg-[#F9F3F0] rounded-md">Restaurants</a>
              <a href="#" className="px-3 py-2 text-[#02615E] hover:bg-[#F9F3F0] rounded-md">About us</a>
              <a href="#" className="px-3 py-2 text-[#02615E] hover:bg-[#F9F3F0] rounded-md">Business</a>
              
              <button 
                onClick={() => setShowLocationModal(true)}
                className="flex items-center px-3 py-2 text-[#02615E] hover:bg-[#F9F3F0] rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Set Location</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Only render content when page is loaded */}
      {isPageLoaded && (
        <>
          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Filter bar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Food Near You</h2>
              <button 
                onClick={() => setShowFilters(true)}
                className="px-4 py-2 bg-white rounded-lg shadow-sm flex items-center space-x-2 md:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-gray-700">Filters</span>
              </button>
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
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {foodItems.map((item) => (
                  <FoodItemCard
                    key={item.id}
                    id={item.id}
                    image={item.image}
                    title={item.title}
                    price={item.price}
                    rating={item.rating}
                    restaurant={item.restaurant}
                    pickupTime={item.pickupTime}
                    distance={item.distance}
                    isFavorite={item.isFavorite}
                    onFavoriteToggle={() => {}}
                  />
                ))}
              </div>
            </div>
          </main>

          {/* Location Modal */}
          <LocationModal 
            isOpen={showLocationModal} 
            onClose={() => setShowLocationModal(false)} 
          />
        </>
      )}

      {/* Show loading indicator while page is loading */}
      {!isPageLoaded && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#F9F3F0]">
          <div className="w-10 h-10 border-4 border-[#02615E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default HomePage;