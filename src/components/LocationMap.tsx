import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, ZoomControl, useMap } from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";
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
    // Instead of setting a specific zoom level first, determine the appropriate zoom based on radius
    const zoomLevel = getZoomLevelForRadius(radius);
    
    // Set view with calculated zoom that shows the circle appropriately
    map.setView(position, zoomLevel);
    
    // Only apply bounds fitting for larger radiuses
    if (radius > 10000) {
      const circle = L.circle(position, radius);
      const bounds = circle.getBounds();
      
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 13 // Lower max zoom to ensure circle is visible
      });
    }
  }, [position, radius, map]);
  
  // Helper function to determine appropriate zoom level based on radius
  const getZoomLevelForRadius = (radius: number): number => {
    if (radius <= 2000) return 14;       // 2km or less: zoom level 14
    else if (radius <= 5000) return 13;  // 5km or less: zoom level 13
    else if (radius <= 10000) return 12; // 10km or less: zoom level 12
    else if (radius <= 15000) return 11; // 15km or less: zoom level 11
    else return 10;                       // More than 15km: zoom level 10
  };
  
  return null;
}

interface LocationMapProps {
  isModal?: boolean;
  onLocationSet?: () => void;
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
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null); // Add this state for map errors
  
  useEffect(() => {
    let isComponentMounted = true;
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!isComponentMounted) return;
        
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        
        // Check for existing radius in localStorage
        const savedRadius = localStorage.getItem('searchRadius');
        if (savedRadius) {
          setRadius(parseInt(savedRadius));
        }
        
        // Save to localStorage for future use
        localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
        
        // Add a small delay before marking as loaded (helps with container rendering)
        setTimeout(() => {
          if (isComponentMounted) {
            setIsLoading(false);
          }
        }, 300);
      },
      (err) => {
        if (!isComponentMounted) return;
        console.error(err);
        
        // If geolocation fails, set a default position (e.g., central Paris)
        setPosition([48.8566, 2.3522]);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
    
    // Cleanup function
    return () => {
      isComponentMounted = false;
    };
  }, []);
  
  useEffect(() => {
    // Set map ready after a short delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      setIsMapReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Cleanup function for Leaflet map
    return () => {
      // This helps prevent memory leaks when the component unmounts
      const mapContainer = document.getElementById('leaflet-map-container');
      if (mapContainer) {
        mapContainer.innerHTML = '';
      }
    };
  }, []);

  // When radius changes, save to localStorage
  useEffect(() => {
    if (radius) {
      localStorage.setItem('searchRadius', radius.toString());
    }
  }, [radius]);
  
  const handleFindFood = () => {
    if (onLocationSet) {
      onLocationSet();
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

      {/* Map container - reduced height for compact mode */}
      <div className="relative" style={{ height: compact ? "250px" : "400px" }}>
        {position && !isLoading && isMapReady ? (
          mapError ? (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-6">
              <p className="text-red-500 mb-4">{mapError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#02615E] text-white rounded-md"
              >
                Reload
              </button>
            </div>
          ) : (
            <MapContainer
              id="leaflet-map-container"
              key={`map-${position[0]}-${position[1]}-${radius}`}
              center={position}
              zoom={10} // Start with a lower zoom level
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
              preferCanvas={true} // Better performance for complex objects like circles
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                eventHandlers={{
                  error: () => setMapError("Failed to load map tiles")
                }}
              />
              <Marker position={position} />
              <Circle
                center={position}
                radius={radius}
                pathOptions={{ 
                  fillColor: "#02615E", 
                  fillOpacity: 0.1, 
                  color: "#02615E", 
                  weight: 2 // Slightly thicker border for better visibility
                }}
              />
              <ZoomControl position="bottomright" />
              <CenterMapWithRadius position={position} radius={radius} />
            </MapContainer>
          )
        ) : (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
            <div className={`w-${compact ? '8' : '10'} h-${compact ? '8' : '10'} border-4 border-[#02615E] border-t-transparent rounded-full animate-spin`}></div>
          </div>
        )}
      </div>

      {/* Controls section - simplified for compact mode */}
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
        
        {!compact && (
          <div className="flex justify-between text-xs text-gray-500 mt-2 mb-6">
            <span>1km</span>
            <span>5km</span>
            <span>10km</span>
            <span>15km</span>
            <span>20km</span>
          </div>
        )}
        
        <button 
          onClick={handleFindFood}
          className={`w-full py-${compact ? '2.5' : '3.5'} px-4 bg-[#02615E] text-white font-medium rounded-lg shadow-sm hover:bg-[#037d78] transition-colors flex items-center justify-center mt-${compact ? '3' : '6'}`}
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