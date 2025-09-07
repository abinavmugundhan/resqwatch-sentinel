import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Search, 
  MapPin, 
  Clock, 
  Trash2, 
  Download, 
  Eye,
  Filter,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HistoryItem {
  id: string;
  type: 'search' | 'location' | 'report' | 'view';
  query: string;
  location?: { lat: number; lng: number; name: string };
  timestamp: Date;
  metadata?: any;
}

const SearchHistory: React.FC = () => {
  const { toast } = useToast();
  
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: '1',
      type: 'search',
      query: 'flood risk bangalore',
      location: { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      metadata: { results: 12, riskLevel: 'moderate' }
    },
    {
      id: '2',
      type: 'location',
      query: 'Nearest shelter search',
      location: { lat: 12.9285, lng: 77.5946, name: 'Jayanagar' },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      metadata: { shelters: 5, nearestDistance: 0.8 }
    },
    {
      id: '3',
      type: 'report',
      query: 'Road flooding report submitted',
      location: { lat: 12.9279, lng: 77.5835, name: 'Krishna Temple Area' },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      metadata: { severity: 'high', upvotes: 12 }
    },
    {
      id: '4',
      type: 'view',
      query: 'Emergency checklist viewed',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      metadata: { completionRate: 75 }
    },
    {
      id: '5',
      type: 'search',
      query: 'cyclone path prediction',
      location: { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      metadata: { results: 8, riskLevel: 'high' }
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'search' | 'location' | 'report' | 'view'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = searchTerm === '' || 
      item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'search': return <Search className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'report': return <Eye className="h-4 w-4" />;
      case 'view': return <Eye className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'search': return 'bg-primary text-primary-foreground';
      case 'location': return 'bg-risk-safe text-risk-safe-foreground';
      case 'report': return 'bg-risk-moderate text-risk-moderate-foreground';
      case 'view': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const clearHistory = () => {
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "All search history has been deleted.",
    });
  };

  const deleteItem = (itemId: string) => {
    setHistory(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Deleted",
      description: "History item removed successfully.",
    });
  };

  const exportHistory = () => {
    const data = history.map(item => ({
      type: item.type,
      query: item.query,
      location: item.location?.name || 'N/A',
      timestamp: item.timestamp.toISOString(),
      metadata: item.metadata
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resqwatch-history.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "History Exported",
      description: "Search history downloaded as JSON file.",
    });
  };

  const repeatSearch = (item: HistoryItem) => {
    // In a real app, this would trigger the original search/action
    toast({
      title: "Search Repeated",
      description: `Executing: ${item.query}`,
    });
  };

  return (
    <div className="space-y-4 p-4 bg-dashboard-panel h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <History className="h-5 w-5" />
          Search History
        </h2>
        <div className="flex gap-2">
          <Button onClick={exportHistory} variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button onClick={clearHistory} variant="outline" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <Card className="p-3">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border rounded-md text-sm"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {(['all', 'search', 'location', 'report', 'view'] as const).map(type => (
              <Button
                key={type}
                variant={filter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(type)}
                className="text-xs capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* History Items */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <Card className="p-6 text-center">
            <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No history items found</p>
          </Card>
        ) : (
          filteredHistory.map((item) => (
            <Card key={item.id} className="p-3 hover:bg-accent/50 transition-colors">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-1.5 rounded ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.query}</p>
                      {item.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {item.location.name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(item.timestamp)}
                    </div>
                    <Badge variant="outline" className="mt-1 text-xs capitalize">
                      {item.type}
                    </Badge>
                  </div>
                </div>

                {/* Metadata */}
                {item.metadata && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(item.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                        </span>
                        <span className="font-medium">
                          {typeof value === 'string' ? value : JSON.stringify(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => repeatSearch(item)}
                    className="text-xs"
                  >
                    Repeat Action
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="text-xs text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Statistics */}
      <Card className="p-3 bg-secondary/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold">{history.length}</div>
            <div className="text-xs text-muted-foreground">Total Items</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">
              {history.filter(h => h.type === 'search').length}
            </div>
            <div className="text-xs text-muted-foreground">Searches</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-risk-safe">
              {history.filter(h => h.type === 'location').length}
            </div>
            <div className="text-xs text-muted-foreground">Location Queries</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-risk-moderate">
              {history.filter(h => h.type === 'report').length}
            </div>
            <div className="text-xs text-muted-foreground">Reports</div>
          </div>
        </div>
      </Card>

      {/* Privacy Notice */}
      <Card className="p-3 bg-alert-background border border-alert-border">
        <div className="text-xs text-alert-foreground">
          <p className="font-medium mb-1">Privacy Notice:</p>
          <p>Search history is stored locally on your device. Data is not shared with external services unless explicitly requested for emergency response purposes.</p>
        </div>
      </Card>
    </div>
  );
};

export default SearchHistory;