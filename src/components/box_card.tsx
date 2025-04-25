import React from 'react';
import { motion } from 'framer-motion';

interface FoodItemCardProps {
  id: string;
  image: string;
  title: string;
  price: {
    original: number;
    discounted: number;
  };
  rating: number;
  restaurant: string;
  pickupTime: string;
  distance: string;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({
  id,
  image,
  title,
  price,
  rating,
  restaurant,
  pickupTime,
  distance,
  isFavorite,
  onFavoriteToggle
}) => {
  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((price.original - price.discounted) / price.original) * 100
  );

  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image section */}
      <div className="relative h-48">
        <img
          src={image || 'https://via.placeholder.com/300?text=Food+Box'}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300?text=Food+Box';
          }}
        />
        
        {/* Discount label */}
        {discountPercentage >= 10 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white font-bold px-2 py-1 rounded text-sm shadow-lg">
            {discountPercentage}% OFF
          </div>
        )}
        
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle();
          }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md transition-transform hover:scale-105"
        >
          {isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
        
        {/* Restaurant badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
          {restaurant}
        </div>
      </div>
      
      {/* Content section */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-800 line-clamp-1">{title}</h3>
          
          {/* Rating */}
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Pickup and distance info */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {pickupTime}
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {distance}
          </div>
        </div>
        
        {/* Price and CTA */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-[#02615E] font-bold text-xl">${price.discounted.toFixed(2)}</span>
            <span className="ml-2 text-gray-400 line-through text-sm">${price.original.toFixed(2)}</span>
          </div>
          
          <button className="bg-[#02615E] hover:bg-[#014a48] text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors">
            Reserve
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodItemCard;