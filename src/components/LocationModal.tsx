import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../api';

// Fix Leaflet marker icon issues
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix the icon paths for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Component to handle map center updates
function MapCenterControl({ center }: { center: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

// Add this helper component to handle map clicks with proper type
function EventHandler({ onClick }: { onClick: (e: any) => void }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    map.on('click', onClick);
    
    return () => {
      map.off('click', onClick);
    };
  }, [map, onClick]);
  
  return null;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const [radius, setRadius] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [mapKey, setMapKey] = useState(Date.now());
  const mapRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      requestLocationAccess();
      
      const timer = setTimeout(() => {
        setMapKey(Date.now());
        if (mapRef.current) {
          const map = mapRef.current as any;
          if (map.invalidateSize) {
            map.invalidateSize();
          }
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const requestLocationAccess = () => {
    setStatus('loading');
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setStatus('error');
      setFallbackLocation();
      return;
    }
    
    const geolocationTimeout = setTimeout(() => {
      setError('Location request timed out. Using default location instead.');
      setStatus('error');
      setFallbackLocation();
    }, 15000);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(geolocationTimeout);
        const newPosition: [number, number] = [
          position.coords.latitude,
          position.coords.longitude
        ];
        setPosition(newPosition);
        setMarkerPosition(newPosition);
        setStatus('success');
      },
      (error) => {
        clearTimeout(geolocationTimeout);
        console.error('Geolocation error:', error);
        
        let errorMessage = 'Unable to get your location.';
        
        if (error.code === 1) {
          errorMessage = 'You denied location access. Please adjust your browser settings or enter your location manually.';
        } else if (error.code === 2) {
          errorMessage = 'Your location is currently unavailable. This might be due to network issues or location services being disabled.';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Check your connection or try again later.';
        }
        
        setError(errorMessage);
        setStatus('error');
        setFallbackLocation();
      },
      { 
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };
  
  const setFallbackLocation = () => {
    const fallbackPosition: [number, number] = [33.5731, -7.5898];
    setPosition(fallbackPosition);
    setMarkerPosition(fallbackPosition);
  };
  
  const handleMarkerDragEnd = (event: { target: any }) => {
    const marker = event.target;
    const position = marker.getLatLng();
    const newPosition: [number, number] = [position.lat, position.lng];
    setMarkerPosition(newPosition);
  };

  const handleMapClick = (e:any) => {
    if (status === 'error' || status === 'success') {
      const clickedPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
      setMarkerPosition(clickedPosition);
      
      if (status === 'error') {
        setPosition(clickedPosition);
      }
    }
  };
  
  const handleSave = async () => {
    if (!markerPosition) {
      setError('Please allow location access before saving');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await api.post('/user/update-location', {
        latitude: markerPosition[0],
        longitude: markerPosition[1],
        zone: radius
      });
      
      if (response.data.success) {
        localStorage.setItem('userLocation', JSON.stringify({
          latitude: markerPosition[0],
          longitude: markerPosition[1],
          zone: radius
        }));
        
        onClose();
      } else {
        setError(response.data.message || 'Failed to save location');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      setError('Error saving your location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Set Your Location</h2>
          
          <p className="text-gray-600 mb-4">
            We need your location to find food boxes near you. You can adjust the marker by dragging it.
          </p>
          
          {status === 'loading' && !position && (
            <div className="flex justify-center items-center py-4">
              <div className="w-10 h-10 border-4 border-[#02615E] border-t-transparent rounded-full animate-spin"></div>
              <p className="ml-3 text-gray-600">Detecting your location...</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                onClick={requestLocationAccess}
                className="mt-2 text-sm font-medium text-[#02615E] hover:underline"
              >
                Try again
              </button>
            </div>
          )}
          
          {error && (
            <div className="mb-4 text-xs text-gray-600">
              <p>You can also click anywhere on the map below to set your location manually.</p>
            </div>
          )}
          
          {position && (
            <div className="mb-4 h-60 rounded-lg overflow-hidden border border-gray-200" id="map-container">
              <MapContainer
                key={mapKey}
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markerPosition && (
                  <Marker 
                    position={markerPosition}
                    draggable={true}
                    eventHandlers={{
                      dragend: handleMarkerDragEnd,
                    }}
                  />
                )}
                <MapCenterControl center={position} />
                {markerPosition && (
                  <Circle
                    center={markerPosition}
                    radius={radius * 1000}
                    pathOptions={{
                      fillColor: '#02615E',
                      fillOpacity: 0.1,
                      color: '#02615E',
                      weight: 2
                    }}
                  />
                )}
                <EventHandler onClick={handleMapClick} />
              </MapContainer>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Radius (in kilometers)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
              />
              <span className="w-12 text-center font-medium text-[#02615E]">
                {radius} km
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Only boxes within this distance will be shown to you
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button
              onClick={requestLocationAccess}
              type="button"
              className="order-2 sm:order-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Detect Again
            </button>
            <button
              onClick={handleSave}
              disabled={!markerPosition || isLoading}
              className="order-1 sm:order-2 py-2 px-4 bg-[#02615E] text-white rounded-lg hover:bg-[#024e4b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save & Continue'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;