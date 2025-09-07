import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Search, 
  History, 
  Settings,
  AlertTriangle,
  Wifi,
  Battery
} from 'lucide-react';

import EmergencyMap from '../Map/EmergencyMap';
import MetricsPanel from './MetricsPanel';
import CommunityReports from '../Community/CommunityReports';
import SafetyAreas from '../Safety/SafetyAreas';
import EmergencyAwareness from '../Awareness/EmergencyAwareness';

interface UserLocation {
  lat: number;
  lng: number;
}

const Dashboard: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [activePanel, setActivePanel] = useState<'reports' | 'safety' | 'awareness'>('reports');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');

  useEffect(() => {
    // Check online/offline status
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLocationUpdate = (coords: UserLocation) => {
    setUserLocation(coords);
  };

  const getPanelTitle = () => {
    switch (activePanel) {
      case 'reports': return 'Community Reports';
      case 'safety': return 'Safety Areas';
      case 'awareness': return 'Emergency Awareness';
      default: return 'Community Reports';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Header */}
      <header className="bg-emergency-header text-emergency-header-foreground p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emergency-header-foreground rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-emergency-header" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ResQWatch</h1>
                <p className="text-xs opacity-90">Emergency Response System</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Status Indicators */}
            <div className="hidden md:flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Wifi className={`h-3 w-3 ${connectionStatus === 'online' ? 'text-green-400' : 'text-red-400'}`} />
                <span className="capitalize">{connectionStatus}</span>
              </div>
              <div className="flex items-center gap-1">
                <Battery className="h-3 w-3" />
                <span>Live Data</span>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-emergency-header-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-emergency-header-foreground">
                <History className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-emergency-header-foreground">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Current Alert Banner */}
        <div className="mt-3 p-2 bg-alert-background border border-alert-border rounded text-alert-foreground">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-metric-warning" />
            <span className="font-medium">Active Alert:</span>
            <span>Heavy rainfall expected in next 6 hours - Stay alert</span>
            <Badge variant="secondary" className="ml-auto bg-risk-moderate text-risk-moderate-foreground">
              MODERATE RISK
            </Badge>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden">
          <div className="bg-card p-4 h-full w-64 shadow-lg">
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Navigation</h2>
              <div className="space-y-2">
                <Button
                  variant={activePanel === 'reports' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setActivePanel('reports');
                    setMobileMenuOpen(false);
                  }}
                >
                  Community Reports
                </Button>
                <Button
                  variant={activePanel === 'safety' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setActivePanel('safety');
                    setMobileMenuOpen(false);
                  }}
                >
                  Safety Areas
                </Button>
                <Button
                  variant={activePanel === 'awareness' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setActivePanel('awareness');
                    setMobileMenuOpen(false);
                  }}
                >
                  Emergency Awareness
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Panel - Metrics */}
        <div className="hidden lg:block w-80 border-r border-dashboard-border">
          <MetricsPanel />
        </div>

        {/* Center - Map */}
        <div className="flex-1 relative">
          <EmergencyMap onLocationUpdate={handleLocationUpdate} />
          
          {/* Mobile Metrics Panel (Collapsible) */}
          <div className="lg:hidden absolute top-4 right-4 z-10">
            <Card className="p-2 bg-dashboard-panel/95 backdrop-blur">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Risk Level:</span>
                  <Badge className="bg-risk-moderate text-risk-moderate-foreground">MODERATE</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Rainfall:</span>
                  <span className="font-semibold">15.2 mm/hr</span>
                </div>
                <div className="flex justify-between">
                  <span>Wind:</span>
                  <span className="font-semibold">42 km/h</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Panel - Dynamic Content */}
        <div className="hidden md:block w-80 border-l border-dashboard-border">
          {/* Panel Navigation */}
          <div className="flex border-b border-dashboard-border">
            <Button
              variant={activePanel === 'reports' ? 'default' : 'ghost'}
              className="flex-1 rounded-none text-xs"
              onClick={() => setActivePanel('reports')}
            >
              Reports
            </Button>
            <Button
              variant={activePanel === 'safety' ? 'default' : 'ghost'}
              className="flex-1 rounded-none text-xs"
              onClick={() => setActivePanel('safety')}
            >
              Safety
            </Button>
            <Button
              variant={activePanel === 'awareness' ? 'default' : 'ghost'}
              className="flex-1 rounded-none text-xs"
              onClick={() => setActivePanel('awareness')}
            >
              Awareness
            </Button>
          </div>

          {/* Panel Content */}
          {activePanel === 'reports' && <CommunityReports />}
          {activePanel === 'safety' && <SafetyAreas userLocation={userLocation} />}
          {activePanel === 'awareness' && <EmergencyAwareness />}
        </div>
      </div>

      {/* Mobile Bottom Panel */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-dashboard-border">
        <div className="flex">
          <Button
            variant={activePanel === 'reports' ? 'default' : 'ghost'}
            className="flex-1 rounded-none py-6 flex-col gap-1"
            onClick={() => setActivePanel('reports')}
          >
            <div className="text-xs">Reports</div>
          </Button>
          <Button
            variant={activePanel === 'safety' ? 'default' : 'ghost'}
            className="flex-1 rounded-none py-6 flex-col gap-1"
            onClick={() => setActivePanel('safety')}
          >
            <div className="text-xs">Safety</div>
          </Button>
          <Button
            variant={activePanel === 'awareness' ? 'default' : 'ghost'}
            className="flex-1 rounded-none py-6 flex-col gap-1"
            onClick={() => setActivePanel('awareness')}
          >
            <div className="text-xs">Awareness</div>
          </Button>
        </div>
      </div>

      {/* Mobile Panel Overlay */}
      {(activePanel && window.innerWidth < 768) && (
        <div className="md:hidden fixed inset-x-0 bottom-16 top-32 bg-card z-30 overflow-hidden">
          <div className="p-4 border-b border-dashboard-border bg-secondary/30">
            <h2 className="font-semibold">{getPanelTitle()}</h2>
          </div>
          <div className="h-full overflow-y-auto pb-4">
            {activePanel === 'reports' && <CommunityReports />}
            {activePanel === 'safety' && <SafetyAreas userLocation={userLocation} />}
            {activePanel === 'awareness' && <EmergencyAwareness />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;