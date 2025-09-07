import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Layers, Clock } from 'lucide-react';

interface MapProps {
  onLocationUpdate: (coords: { lat: number; lng: number }) => void;
}

const EmergencyMap: React.FC<MapProps> = ({ onLocationUpdate }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [needsMapboxToken, setNeedsMapboxToken] = useState(true);
  const [mapboxToken, setMapboxToken] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [riskLayers, setRiskLayers] = useState({
    flood: true,
    cyclone: false,
    landslide: false,
    historical: false
  });

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    setNeedsMapboxToken(false);
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [77.5946, 12.9716], // Bangalore coordinates as default
      zoom: 10,
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords: [number, number] = [
          position.coords.longitude, 
          position.coords.latitude
        ];
        setUserLocation(coords);
        map.current?.setCenter(coords);
        
        // Add user location marker
        new mapboxgl.Marker({ color: '#1D4ED8' })
          .setLngLat(coords)
          .addTo(map.current!);

        onLocationUpdate({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }

    // Add sample risk zones
    map.current.on('load', () => {
      // Sample flood risk zone
      map.current?.addSource('flood-risk', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: { risk: 'high', type: 'flood' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [77.58, 12.96],
                [77.61, 12.96], 
                [77.61, 12.99],
                [77.58, 12.99],
                [77.58, 12.96]
              ]]
            }
          }]
        }
      });

      map.current?.addLayer({
        id: 'flood-risk-layer',
        type: 'fill',
        source: 'flood-risk',
        paint: {
          'fill-color': '#DC2626',
          'fill-opacity': 0.3
        }
      });

      // Sample cyclone path
      map.current?.addSource('cyclone-path', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: { type: 'cyclone-path' },
            geometry: {
              type: 'LineString',
              coordinates: [
                [77.55, 12.92],
                [77.58, 12.95],
                [77.62, 12.98]
              ]
            }
          }]
        }
      });

      map.current?.addLayer({
        id: 'cyclone-path-layer',
        type: 'line',
        source: 'cyclone-path',
        paint: {
          'line-color': '#F59E0B',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, onLocationUpdate]);

  const toggleRiskLayer = (layer: keyof typeof riskLayers) => {
    setRiskLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    
    if (map.current) {
      const layerId = `${layer}-layer`;
      const visibility = riskLayers[layer] ? 'none' : 'visible';
      if (map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(layerId, 'visibility', visibility);
      }
    }
  };

  if (needsMapboxToken) {
    return (
      <Card className="p-6 h-full flex flex-col items-center justify-center">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Setup Required</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          Enter your Mapbox public token to enable the emergency map:
        </p>
        <div className="w-full max-w-sm space-y-4">
          <input
            type="text"
            placeholder="pk.eyJ1Ijoiem9..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <p className="text-xs text-muted-foreground">
            Get your token from{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
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
    </div>
  );
};

export default EmergencyMap;