import { useState } from 'react';
type FoodItemCardProps = {
  id: string;
  image: string;
  title: string;
  price: {
    original: number;
    discounted: number;
  };
  rating: number;
  restaurant: string;
  pickupTime?: string;
  distance?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
};

function FoodItemCard({
  id,
  image,
  title,
  price,
  rating,
  restaurant,
  pickupTime,
  distance,
  isFavorite = false,
  onFavoriteToggle,
}: FoodItemCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    // Stop the click from propagating to the Link component
    e.preventDefault();
    e.stopPropagation();
    
    const newState = !favorite;
    setFavorite(newState);
    
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((price.original - price.discounted) / price.original) * 100
  );
  
  return (
    <a href={`/item/${id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 mx-2 my-4">
        {/* Image container with favorite button */}
        <div className="relative">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
          
          {/* Favorite button */}
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            {favorite ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
          
          {/* Discount badge */}
          <div className="absolute bottom-3 left-3 bg-[#02615E] text-white text-sm font-bold px-2 py-1 rounded-lg">
            Save {discountPercentage}%
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Restaurant name */}
          <p className="text-sm text-gray-500 mb-1">{restaurant}</p>
          
          {/* Title */}
          <h3 className="font-bold text-lg text-[#02615E] mb-2 line-clamp-2">{title}</h3>
          
          {/* Price */}
          <div className="flex items-center mb-3">
            <span className="font-bold text-lg">${price.discounted.toFixed(2)}</span>
            <span className="text-sm text-gray-500 line-through ml-2">${price.original.toFixed(2)}</span>
          </div>
          
          {/* Rating and additional info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1">{rating.toFixed(1)}</span>
            </div>
            
            {pickupTime && (
              <div className="text-gray-500">
                <span>Pickup: {pickupTime}</span>
              </div>
            )}
            
            {distance && (
              <div className="text-gray-500">
                <span>{distance}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

export default FoodItemCard;