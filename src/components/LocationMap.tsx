import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, ZoomControl, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issues
const DefaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to keep map centered and adjust zoom to show circle
function CenterMapWithRadius({ position, radius }: { position: [number, number], radius: number }) {
  const map = useMap();
  
  useEffect(() => {
    // Determine zoom level based on radius
    const zoomLevel = radius <= 2000 ? 14 : 
                      radius <= 5000 ? 13 : 
                      radius <= 10000 ? 12 : 
                      radius <= 15000 ? 11 : 10;
    
    // Set view with calculated zoom
    map.setView(position, zoomLevel);
  }, [position, radius, map]);
  
  return null;
}

interface LocationMapProps {
  isModal?: boolean;
  onLocationSet?: (lat: string, lng: string, radius: string) => void; // Updated this line
  compact?: boolean;
}

const LocationMap: React.FC<LocationMapProps> = ({ 
  isModal = false, 
  onLocationSet,
  compact = false 
}) => {
  const navigate = useNavigate();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState(5000); // default 5km
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Get user location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        
        // Load saved radius if available
        const savedRadius = localStorage.getItem('searchRadius');
        if (savedRadius) {
          setRadius(parseInt(savedRadius));
        }
        
        // Save location
        localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
        setIsLoading(false);
      },
      () => {
        // Default fallback location (Paris)
        setPosition([48.8566, 2.3522]);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);
  
  // Save radius when it changes
  useEffect(() => {
    if (radius) {
      localStorage.setItem('searchRadius', radius.toString());
    }
  }, [radius]);
  
  // Clean up map when component unmounts
  useEffect(() => {
    return () => {
      const mapContainer = document.getElementById('leaflet-map-container');
      if (mapContainer) {
        mapContainer.innerHTML = '';
      }
    };
  }, []);
  
  // Update handleFindFood to send location data
  const handleFindFood = () => {
    if (!position) return;
    
    // Use the radius value (in km) as the zone value
    const radiusKm = (radius / 1000).toFixed(1);
    
    if (onLocationSet) {
      // Pass location data to parent component with radius as zone
      onLocationSet(
        position[0].toString(),
        position[1].toString(),
        radiusKm // Use radius as zone
      );
    } else {
      navigate('/home');
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${isModal ? '' : 'max-w-3xl mx-auto'}`}>
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-medium text-[#02615E]">Your Location</h2>
        <p className="text-xs text-gray-500 mt-1">Set your search radius to find nearby food offers</p>
      </div>

      {/* Map container */}
      <div className="relative" style={{ height: compact ? "250px" : "400px" }}>
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-[#02615E] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : position && (
          <MapContainer
            id="leaflet-map-container"
            key={`map-${position[0]}-${position[1]}-${radius}`}
            center={position}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <Marker position={position} />
            <Circle
              center={position}
              radius={radius}
              pathOptions={{ 
                fillColor: "#02615E", 
                fillOpacity: 0.1, 
                color: "#02615E", 
                weight: 2
              }}
            />
            <ZoomControl position="bottomright" />
            <CenterMapWithRadius position={position} radius={radius} />
          </MapContainer>
        )}
      </div>

      {/* Controls section */}
      <div className="p-4 bg-white">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-800">Search Radius</h3>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">
            {(radius / 1000).toFixed(1)} km
          </span>
        </div>
        
        <input
          type="range"
          min="1000"
          max="20000"
          step="1000"
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
        />
        
        <button 
          onClick={handleFindFood}
          className="w-full py-3 px-4 mt-4 bg-[#02615E] text-white font-medium rounded-lg shadow-sm hover:bg-[#037d78] transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {compact ? 'Find Food' : 'Find Food Near Me'}
        </button>
      </div>
    </div>
  );
};

export default LocationMap;