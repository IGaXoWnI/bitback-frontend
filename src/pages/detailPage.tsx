import { useState, useEffect, JSX } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Interface for food item details
interface FoodItemDetail {
  id: string;
  image: string;
  title: string;
  price: {
    original: number;
    discounted: number;
  };
  rating: number;
  restaurant: {
    name: string;
    address: string;
    image: string;
  };
  pickupTime: string;
  distance: string;
  description: string;
  quantity: {
    available: number;
    reserved: number;
  };
  categoryTags: string[];
  isFavorite?: boolean;
}

// Sample data - in a real app, you'd fetch this from an API
const sampleFoodItems: Record<string, FoodItemDetail> = {
  "1": {
    id: "1",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Surprise Bag - Assorted Bakery Items",
    price: { original: 24.99, discounted: 8.99 },
    rating: 4.8,
    restaurant: {
      name: "Artisan Bakery",
      address: "123 Main St, New York, NY 10001",
      image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    pickupTime: "3:30-4:30 PM",
    distance: "0.8 mi",
    description: "A surprise selection of our freshly baked items from today. May include bread, pastries, cookies, and more. Contents vary, but you'll always get high-quality, delicious baked goods worth much more than you pay!",
    quantity: {
      available: 5,
      reserved: 0
    },
    categoryTags: ["Bakery", "Surprise", "Vegetarian-friendly"],
  },
  "2": {
    id: "2",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Gourmet Pizza Pack - 2 Medium Pizzas",
    price: { original: 32.99, discounted: 12.50 },
    rating: 4.5,
    restaurant: {
      name: "Napoli's Pizza",
      address: "456 Pizza Lane, New York, NY 10002",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    pickupTime: "5:00-6:00 PM",
    distance: "1.2 mi",
    description: "Two of our delicious medium-sized pizzas made with fresh ingredients. Selection depends on today's specials. Perfect for a family dinner or to share with friends!",
    quantity: {
      available: 3,
      reserved: 0
    },
    categoryTags: ["Pizza", "Italian", "Family-sized"],
    isFavorite: true
  },
  // Add more food items if needed
};

function DetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState<FoodItemDetail | null>(null);
  const [isReserving, setIsReserving] = useState<boolean>(false);
  const [reservationSuccess, setReservationSuccess] = useState<boolean>(false);
  const [favorite, setFavorite] = useState<boolean>(false);

  // Calculate discount percentage
  const discountPercentage = foodItem 
    ? Math.round(((foodItem.price.original - foodItem.price.discounted) / foodItem.price.original) * 100)
    : 0;

  // Fetch food item data
  useEffect(() => {
    if (id && id in sampleFoodItems) {
      setFoodItem(sampleFoodItems[id]);
      setFavorite(sampleFoodItems[id].isFavorite || false);
    } else {
      // Handle invalid ID
      navigate('/not-found');
    }
  }, [id, navigate]);

  const handleFavoriteToggle = () => {
    setFavorite(!favorite);
    // In a real app, you'd update this on the server
  };

  const handleReserve = () => {
    // Show reservation in progress
    setIsReserving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsReserving(false);
      setReservationSuccess(true);
      
      // Reset success message after a few seconds
      setTimeout(() => {
        setReservationSuccess(false);
      }, 5000);
    }, 1500);
  };

  if (!foodItem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F9F3F0]">
        <div className="w-16 h-16 border-4 border-[#02615E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F3F0]">
      {/* Header with back button */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 rounded-md text-gray-500 hover:text-[#02615E] hover:bg-gray-100 mr-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-[#02615E]">BitBack</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="hidden md:block px-4 py-2 text-[#02615E] font-medium hover:bg-[#02615E]/10 rounded-md transition">
                Log In
              </button>
              <button className="px-4 py-2 bg-[#02615E] text-white font-medium rounded-md hover:bg-[#024e4b] transition shadow-sm">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Food item hero section */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8">
          {/* Image container with favorite button */}
          <div className="relative">
            <img 
              src={foodItem.image} 
              alt={foodItem.title} 
              className="w-full h-64 md:h-96 object-cover"
            />
            
            {/* Favorite button */}
            <button 
              onClick={handleFavoriteToggle}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              {favorite ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
            
            {/* Discount badge */}
            <div className="absolute top-4 left-4 bg-[#02615E] text-white text-sm font-bold px-3 py-1.5 rounded-lg">
              Save {discountPercentage}%
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Title and basic info */}
            <div className="mb-6">
              <h1 className="font-bold text-2xl text-[#02615E] mb-2">{foodItem.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {foodItem.categoryTags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-700 mb-4">{foodItem.description}</p>
              
              {/* Price */}
              <div className="flex items-center mb-2">
                <span className="font-bold text-2xl">${foodItem.price.discounted.toFixed(2)}</span>
                <span className="text-lg text-gray-500 line-through ml-3">${foodItem.price.original.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Availability and pickup information */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-700">Availability</h3>
                  <p className="text-sm text-gray-500">
                    {foodItem.quantity.available} {foodItem.quantity.available === 1 ? 'item' : 'items'} left
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Pickup Time</h3>
                  <p className="text-sm text-gray-500">{foodItem.pickupTime} today</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Distance</h3>
                  <p className="text-sm text-gray-500">{foodItem.distance}</p>
                </div>
              </div>
              
              {/* Progress bar for quantity */}
              <div className="mb-6">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#02615E]" 
                    style={{ 
                      width: `${Math.min(
                        100, 
                        100 - (foodItem.quantity.available / (foodItem.quantity.available + foodItem.quantity.reserved) * 100)
                      )}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Going fast!</span>
                  <span>{foodItem.quantity.available} left</span>
                </div>
              </div>
            </div>
            
            {/* Restaurant info */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex items-center">
                <img 
                  src={foodItem.restaurant.image} 
                  alt={foodItem.restaurant.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-lg">{foodItem.restaurant.name}</h3>
                  <div className="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1">{foodItem.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-gray-500">{foodItem.restaurant.address}</p>
                </div>
              </div>
            </div>
            
            {/* Reserve button */}
            <div>
              {reservationSuccess ? (
                <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-medium">Reservation successful!</p>
                      <p className="text-sm">Your item is reserved for pickup during {foodItem.pickupTime} today.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleReserve} 
                  disabled={isReserving || foodItem.quantity.available === 0}
                  className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-md
                    ${foodItem.quantity.available === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : isReserving 
                        ? 'bg-[#02615E]/70' 
                        : 'bg-[#02615E] hover:bg-[#024e4b]'
                    }
                  `}
                >
                  {foodItem.quantity.available === 0 
                    ? 'Sold Out' 
                    : isReserving 
                      ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Reserving...
                        </span>
                      ) 
                      : 'Reserve'
                  }
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Map section */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="p-6">
            <h2 className="font-bold text-xl mb-4">Pickup Location</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              {/* Placeholder for map - In a real app, you would use Google Maps or similar */}
              <div className="bg-gray-200 w-full h-64 flex items-center justify-center text-gray-500">
                <p>Map showing {foodItem.restaurant.address}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DetailPage;