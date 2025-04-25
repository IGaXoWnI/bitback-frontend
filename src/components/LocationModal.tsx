import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationMap from './LocationMap';
import api from '../api'; // Import your API client

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer: number | null = null;
    
    if (isOpen) {
      // Delay map rendering to ensure modal DOM is ready
      timer = window.setTimeout(() => {
        setIsMapReady(true);
      }, 500);
    } else {
      setIsMapReady(false);
    }
    
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [isOpen]);
  
  // Handle location data from the map
  const handleLocationData = async (lat: string, lng: string, radius: string) => {
    setIsLoading(true);
    
    try {
      // Save location data to localStorage first (this is critical)
      const locationData = {
        latitude: lat,
        longitude: lng,
        searchRadius: radius
      };
      
      localStorage.setItem('userLocation', JSON.stringify(locationData));
      
      // Then try to update the server (but don't block on it)
      try {
        await api.post('user/update-location', {
          latitude: lat,
          longitude: lng,
          zone: radius
        });
      } catch (err) {
        console.error('Error updating location on server:', err);
        // Continue even if server update fails
      }
      
      // Update user data in localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        latitude: lat,
        longitude: lng,
        searchRadius: radius
      }));
    } catch (err) {
      console.error('Error saving location:', err);
    } finally {
      setIsLoading(false);
      // Close the modal
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md mx-auto animate-fadeIn">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md"
          aria-label="Close location modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {isMapReady ? (
          <LocationMap 
            isModal={true} 
            onLocationSet={handleLocationData} 
            compact={true} 
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-[#02615E]">Your Location</h2>
              <p className="text-xs text-gray-500 mt-1">Loading map...</p>
            </div>
            <div className="flex items-center justify-center" style={{ height: "250px" }}>
              <div className="w-8 h-8 border-4 border-[#02615E] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationModal;