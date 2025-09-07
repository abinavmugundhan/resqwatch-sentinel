import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Shield, 
  Building2, 
  Heart,
  Car,
  Route,
  Info
} from 'lucide-react';

interface SafeLocation {
  id: string;
  name: string;
  type: 'shelter' | 'hospital' | 'police' | 'fire' | 'highground';
  address: string;
  distance: number;
  capacity?: number;
  available?: boolean;
  contact?: string;
  coordinates: [number, number];
  routeTime?: number;
}

interface SafetyAreasProps {
  userLocation?: { lat: number; lng: number } | null;
}

const SafetyAreas: React.FC<SafetyAreasProps> = ({ userLocation }) => {
  const [nearbyLocations, setNearbyLocations] = useState<SafeLocation[]>([
    {
      id: '1',
      name: 'Government Higher Primary School',
      type: 'shelter',
      address: 'Jayanagar 4th Block, Bangalore',
      distance: 0.8,
      capacity: 200,
      available: true,
      contact: '+91-80-2656-7890',
      coordinates: [77.5946, 12.9285],
      routeTime: 12
    },
    {
      id: '2',
      name: 'Fortis Hospital',
      type: 'hospital',
      address: 'Bannerghatta Road, Bangalore',
      distance: 2.1,
      available: true,
      contact: '+91-80-6621-4444',
      coordinates: [77.6068, 12.9298],
      routeTime: 25
    },
    {
      id: '3',
      name: 'Jayanagar Police Station',
      type: 'police',
      address: 'Jayanagar East, Bangalore',
      distance: 1.2,
      available: true,
      contact: '+91-80-2653-4567',
      coordinates: [77.5835, 12.9279],
      routeTime: 15
    },
    {
      id: '4',
      name: 'Fire Station - South Division',
      type: 'fire',
      address: 'BTM Layout, Bangalore',
      distance: 1.8,
      available: true,
      contact: '+91-80-2661-2345',
      coordinates: [77.6109, 12.9165],
      routeTime: 20
    },
    {
      id: '5',
      name: 'Lalbagh Elevated Ground',
      type: 'highground',
      address: 'Lalbagh Botanical Garden',
      distance: 2.5,
      coordinates: [77.5847, 12.9507],
      routeTime: 30
    }
  ]);

  const [selectedLocation, setSelectedLocation] = useState<SafeLocation | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'type'>('distance');

  useEffect(() => {
    // Sort locations based on selected criteria
    const sorted = [...nearbyLocations].sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      return a.type.localeCompare(b.type);
    });
    setNearbyLocations(sorted);
  }, [sortBy]);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'shelter': return <Shield className="h-4 w-4" />;
      case 'hospital': return <Heart className="h-4 w-4" />;
      case 'police': return <Shield className="h-4 w-4" />;
      case 'fire': return <Shield className="h-4 w-4" />;
      case 'highground': return <Building2 className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'shelter': return 'bg-primary text-primary-foreground';
      case 'hospital': return 'bg-risk-high text-risk-high-foreground';
      case 'police': return 'bg-risk-moderate text-risk-moderate-foreground';
      case 'fire': return 'bg-metric-warning text-white';
      case 'highground': return 'bg-risk-safe text-risk-safe-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatType = (type: string) => {
    const typeMap = {
      shelter: 'Emergency Shelter',
      hospital: 'Medical Center',
      police: 'Police Station',
      fire: 'Fire Station',
      highground: 'High Ground'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getDirections = (location: SafeLocation) => {
    // In a real app, this would open maps app or show route on the map
    const url = `https://www.google.com/maps/dir/${userLocation?.lat},${userLocation?.lng}/${location.coordinates[1]},${location.coordinates[0]}`;
    window.open(url, '_blank');
  };

  const callLocation = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="space-y-4 p-4 bg-dashboard-panel h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Nearest Safe Areas</h2>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'distance' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('distance')}
          >
            Distance
          </Button>
          <Button
            variant={sortBy === 'type' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('type')}
          >
            Type
          </Button>
        </div>
      </div>

      {/* Current Location Status */}
      {userLocation ? (
        <Card className="border-l-4 border-l-primary p-3">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            <span className="text-sm">
              Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
            <Badge variant="secondary" className="ml-auto">GPS Active</Badge>
          </div>
        </Card>
      ) : (
        <Card className="border-l-4 border-l-metric-warning p-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-metric-warning" />
            <span className="text-sm">Enable location for accurate directions</span>
            <Button size="sm" variant="outline" className="ml-auto">
              Enable GPS
            </Button>
          </div>
        </Card>
      )}

      {/* Safe Locations List */}
      <div className="space-y-3">
        {nearbyLocations.map((location) => (
          <Card 
            key={location.id} 
            className={`p-3 cursor-pointer transition-all hover:shadow-md ${
              selectedLocation?.id === location.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedLocation(location)}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${getLocationColor(location.type)}`}>
                    {getLocationIcon(location.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{location.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatType(location.type)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{location.distance} km</div>
                  {location.routeTime && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {location.routeTime} min
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <p className="text-xs text-foreground">{location.address}</p>

              {/* Status & Capacity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {location.available !== undefined && (
                    <Badge variant={location.available ? 'default' : 'destructive'}>
                      {location.available ? 'Available' : 'Full'}
                    </Badge>
                  )}
                  {location.capacity && (
                    <span className="text-xs text-muted-foreground">
                      Capacity: {location.capacity}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {location.contact && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        callLocation(location.contact!);
                      }}
                    >
                      <Phone className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      getDirections(location);
                    }}
                  >
                    <Route className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Emergency Contacts */}
      <Card className="p-3 bg-alert-background border border-alert-border">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="destructive" 
              className="text-xs h-8"
              onClick={() => callLocation('112')}
            >
              Emergency: 112
            </Button>
            <Button 
              variant="outline" 
              className="text-xs h-8"
              onClick={() => callLocation('101')}
            >
              Fire: 101
            </Button>
            <Button 
              variant="outline" 
              className="text-xs h-8"
              onClick={() => callLocation('100')}
            >
              Police: 100
            </Button>
            <Button 
              variant="outline" 
              className="text-xs h-8"
              onClick={() => callLocation('108')}
            >
              Ambulance: 108
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="p-3 bg-secondary/50">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-foreground">
            <p className="font-medium mb-1">Safety Tips:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Move to higher ground if flooding</li>
              <li>• Stay away from electrical lines</li>
              <li>• Keep emergency contacts handy</li>
              <li>• Follow local authority instructions</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SafetyAreas;