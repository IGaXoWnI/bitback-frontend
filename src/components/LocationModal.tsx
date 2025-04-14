import React, { useState, useEffect } from 'react';
import LocationMap from './LocationMap';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const [isMapReady, setIsMapReady] = useState(false);

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
            onLocationSet={onClose} 
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