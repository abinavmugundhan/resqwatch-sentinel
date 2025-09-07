/// <reference types="google.maps" />
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Layers, Clock, Navigation, AlertTriangle, Crosshair } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapProps {
  onLocationUpdate: (coords: { lat: number; lng: number }) => void;
}

interface MapComponentProps {
  center: { lat: number; lng: number };
  zoom: number;
  onLocationUpdate: (coords: { lat: number; lng: number }) => void;
  userLocation: { lat: number; lng: number } | null;
  riskLayers: Record<string, boolean>;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  center, 
  zoom, 
  onLocationUpdate, 
  userLocation,
  riskLayers 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const riskLayersRef = useRef<Record<string, (google.maps.Polygon | google.maps.Polyline)[]>>({});

  useEffect(() => {
    if (!ref.current || !window.google) return;

    // Initialize map
    mapRef.current = new window.google.maps.Map(ref.current, {
      center,
      zoom,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
        }
      ],
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });

    // Add click listener for location updates
    mapRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        onLocationUpdate({ lat, lng });
      }
    });

    // Initialize risk layers
    initializeRiskLayers();
  }, [center, zoom, onLocationUpdate]);

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation || !window.google) return;

    // Remove existing marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    // Add new user location marker
    userMarkerRef.current = new window.google.maps.Marker({
      position: userLocation,
      map: mapRef.current,
      title: 'Your Location',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 8,
      },
    });

    // Center map on user location
    mapRef.current.panTo(userLocation);
  }, [userLocation]);

  const initializeRiskLayers = () => {
    if (!mapRef.current || !window.google) return;

    // Sample flood risk zone
    const floodRiskZone = new window.google.maps.Polygon({
      paths: [
        { lat: 12.96, lng: 77.58 },
        { lat: 12.96, lng: 77.61 },
        { lat: 12.99, lng: 77.61 },
        { lat: 12.99, lng: 77.58 }
      ],
      strokeColor: '#DC2626',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#DC2626',
      fillOpacity: 0.3,
      map: riskLayers.flood ? mapRef.current : null
    });

    // Sample cyclone path
    const cyclonePath = new window.google.maps.Polyline({
      path: [
        { lat: 12.92, lng: 77.55 },
        { lat: 12.95, lng: 77.58 },
        { lat: 12.98, lng: 77.62 }
      ],
      strokeColor: '#F59E0B',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: riskLayers.cyclone ? mapRef.current : null
    });

    // Sample landslide zone
    const landslideZone = new window.google.maps.Polygon({
      paths: [
        { lat: 12.94, lng: 77.56 },
        { lat: 12.94, lng: 77.59 },
        { lat: 12.97, lng: 77.59 },
        { lat: 12.97, lng: 77.56 }
      ],
      strokeColor: '#DC2626',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#7C2D12',
      fillOpacity: 0.4,
      map: riskLayers.landslide ? mapRef.current : null
    });

    riskLayersRef.current = {
      flood: [floodRiskZone],
      cyclone: [cyclonePath],
      landslide: [landslideZone],
      historical: []
    };
  };

  // Update risk layer visibility
  useEffect(() => {
    Object.entries(riskLayersRef.current).forEach(([layerName, layers]) => {
      layers.forEach(layer => {
        layer.setMap(riskLayers[layerName] ? mapRef.current : null);
      });
    });
  }, [riskLayers]);

  return <div ref={ref} className="w-full h-full" />;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <Card className="p-6 h-full flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
        </Card>
      );
    case Status.FAILURE:
      return (
        <Card className="p-6 h-full flex flex-col items-center justify-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Map Loading Failed</h3>
          <p className="text-sm text-muted-foreground text-center">
            Unable to load Google Maps. Please check your API key and internet connection.
          </p>
        </Card>
      );
    default:
      return null;
  }
};

const GoogleEmergencyMap: React.FC<MapProps> = ({ onLocationUpdate }) => {
  const { toast } = useToast();
  const [needsApiKey, setNeedsApiKey] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 }); // Bangalore
  const [locationError, setLocationError] = useState<string>('');
  const [riskLayers, setRiskLayers] = useState({
    flood: true,
    cyclone: false,
    landslide: false,
    historical: false
  });

  useEffect(() => {
    // Check if API key exists in localStorage
    const savedApiKey = localStorage.getItem('google-maps-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setNeedsApiKey(false);
    }
  }, []);

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid Google Maps API key.",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('google-maps-api-key', apiKey);
    setNeedsApiKey(false);
    
    toast({
      title: "API Key Saved",
      description: "Google Maps will now load with your API key.",
    });
  };

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setLocationError('');
    toast({
      title: "Getting Location",
      description: "Requesting your current location...",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUserLocation(coords);
        setMapCenter(coords);
        onLocationUpdate(coords);
        
        toast({
          title: "Location Found",
          description: `Accuracy: ${Math.round(position.coords.accuracy)}m`,
        });
      },
      (error) => {
        let errorMessage = 'Unable to get your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setLocationError(errorMessage);
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, [onLocationUpdate, toast]);

  const toggleRiskLayer = (layer: keyof typeof riskLayers) => {
    setRiskLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const watchLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUserLocation(coords);
        onLocationUpdate(coords);
      },
      (error) => {
        console.error('Watch location error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 60000
      }
    );
  }, [onLocationUpdate]);

  useEffect(() => {
    // Start watching location when component mounts
    if (!needsApiKey) {
      getCurrentLocation();
      watchLocation();
    }
  }, [needsApiKey, getCurrentLocation, watchLocation]);

  if (needsApiKey) {
    return (
      <Card className="p-6 h-full flex flex-col items-center justify-center">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Google Maps Setup</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
          Enter your Google Maps JavaScript API key to enable the emergency map with accurate location features:
        </p>
        <div className="w-full max-w-sm space-y-4">
          <input
            type="text"
            placeholder="AIzaSyB..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <Button onClick={handleApiKeySubmit} className="w-full">
            Enable Google Maps
          </Button>
          <div className="text-xs text-muted-foreground space-y-2">
            <p>
              Get your API key from{' '}
              <a 
                href="https://console.cloud.google.com/apis/credentials" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Cloud Console
              </a>
            </p>
            <p>Enable the "Maps JavaScript API" for your project.</p>
            <p className="text-xs bg-alert-background p-2 rounded border border-alert-border">
              <strong>Note:</strong> This API key will be stored in your browser's local storage for convenience. For production use, consider using domain restrictions for security.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative h-full">
      <Wrapper apiKey={apiKey} render={render}>
        <MapComponent
          center={mapCenter}
          zoom={12}
          onLocationUpdate={onLocationUpdate}
          userLocation={userLocation}
          riskLayers={riskLayers}
        />
      </Wrapper>
      
      {/* Layer Controls */}
      <Card className="absolute top-4 left-4 p-3 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="h-4 w-4" />
          <span className="text-sm font-medium">Risk Layers</span>
        </div>
        
        {Object.entries(riskLayers).map(([layer, active]) => (
          <button
            key={layer}
            onClick={() => toggleRiskLayer(layer as keyof typeof riskLayers)}
            className={`flex items-center gap-2 text-xs px-2 py-1 rounded transition-colors ${
              active 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            <div className={`w-3 h-3 rounded ${
              layer === 'flood' ? 'bg-risk-high' :
              layer === 'cyclone' ? 'bg-metric-warning' :
              layer === 'landslide' ? 'bg-metric-danger' :
              'bg-muted-foreground'
            }`} />
            {layer.charAt(0).toUpperCase() + layer.slice(1)}
          </button>
        ))}
      </Card>

      {/* Location Controls */}
      <Card className="absolute top-4 right-4 p-3 space-y-2">
        <Button
          onClick={getCurrentLocation}
          variant="outline"
          size="sm"
          className="w-full gap-2"
        >
          <Crosshair className="h-4 w-4" />
          Get Location
        </Button>
        
        {userLocation && (
          <div className="text-xs text-muted-foreground text-center">
            <div>Lat: {userLocation.lat.toFixed(6)}</div>
            <div>Lng: {userLocation.lng.toFixed(6)}</div>
          </div>
        )}
        
        {locationError && (
          <div className="text-xs text-destructive text-center">
            {locationError}
          </div>
        )}
      </Card>

      {/* Time Controls */}
      <Card className="absolute bottom-4 left-4 right-4 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Time View</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Now</Button>
            <Button variant="outline" size="sm">+6h</Button>
            <Button variant="outline" size="sm">+24h</Button>
          </div>
        </div>
      </Card>

      {/* Location Status */}
      {userLocation && (
        <Badge className="absolute top-20 left-4 bg-risk-safe text-risk-safe-foreground">
          <Navigation className="h-3 w-3 mr-1" />
          GPS Active
        </Badge>
      )}
    </div>
  );
};

export default GoogleEmergencyMap;