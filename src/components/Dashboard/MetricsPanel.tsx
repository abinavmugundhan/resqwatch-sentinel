import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  TrendingUp,
  Eye,
  Gauge
} from 'lucide-react';

interface MetricData {
  label: string;
  value: string;
  unit: string;
  risk: 'safe' | 'low' | 'moderate' | 'high' | 'critical';
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  icon: React.ReactNode;
}

const MetricsPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      label: 'Rainfall Intensity',
      value: '15.2',
      unit: 'mm/hr',
      risk: 'moderate',
      trend: 'up',
      confidence: 87,
      icon: <CloudRain className="h-4 w-4" />
    },
    {
      label: 'Wind Speed',
      value: '42',
      unit: 'km/h',
      risk: 'low',
      trend: 'stable',
      confidence: 92,
      icon: <Wind className="h-4 w-4" />
    },
    {
      label: 'River Level',
      value: '2.8',
      unit: 'm',
      risk: 'high',
      trend: 'up',
      confidence: 78,
      icon: <Droplets className="h-4 w-4" />
    },
    {
      label: 'Soil Moisture',
      value: '68',
      unit: '%',
      risk: 'moderate',
      trend: 'up',
      confidence: 65,
      icon: <Thermometer className="h-4 w-4" />
    }
  ]);

  const [overallRisk, setOverallRisk] = useState({
    level: 'moderate',
    score: 65,
    message: 'Moderate flood risk in next 6 hours'
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: (parseFloat(metric.value) + (Math.random() - 0.5) * 2).toFixed(1),
        confidence: Math.max(50, Math.min(99, metric.confidence + (Math.random() - 0.5) * 10))
      })));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'safe': return 'text-risk-safe bg-risk-safe';
      case 'low': return 'text-risk-low bg-risk-low';
      case 'moderate': return 'text-risk-moderate bg-risk-moderate';
      case 'high': return 'text-risk-high bg-risk-high';
      case 'critical': return 'text-risk-critical bg-risk-critical';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-metric-warning" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-metric-positive rotate-180" />;
      default: return <div className="w-3 h-3 rounded-full bg-muted" />;
    }
  };

  return (
    <div className="space-y-4 p-4 bg-dashboard-panel border-r border-dashboard-border h-full overflow-y-auto">
      {/* Overall Risk Assessment */}
      <Card className="border-l-4 border-l-risk-moderate">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Current Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge 
                variant="secondary" 
                className={`${getRiskColor(overallRisk.level)} text-white`}
              >
                {overallRisk.level.toUpperCase()} RISK
              </Badge>
              <span className="text-2xl font-bold">{overallRisk.score}/100</span>
            </div>
            <Progress value={overallRisk.score} className="h-2" />
            <p className="text-xs text-muted-foreground">{overallRisk.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Live Metrics */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Live Environmental Data</h3>
        
        {metrics.map((metric, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {metric.icon}
                <span className="text-xs font-medium">{metric.label}</span>
              </div>
              {getTrendIcon(metric.trend)}
            </div>
            
            <div className="flex items-end justify-between mb-2">
              <span className="text-lg font-bold">
                {metric.value}
                <span className="text-xs text-muted-foreground ml-1">{metric.unit}</span>
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getRiskColor(metric.risk).split(' ')[0]} border-current`}
              >
                {metric.risk}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3 text-muted-foreground" />
              <div className="flex-1">
                <Progress value={metric.confidence} className="h-1" />
              </div>
              <span className="text-xs text-muted-foreground">{metric.confidence}%</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-3">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-2">
          <button className="w-full p-2 text-left text-xs bg-alert-background border border-alert-border rounded hover:bg-alert-background/80 transition-colors">
            🚨 Report Emergency
          </button>
          <button className="w-full p-2 text-left text-xs bg-secondary hover:bg-secondary/80 transition-colors rounded">
            📍 Find Nearest Shelter
          </button>
          <button className="w-full p-2 text-left text-xs bg-secondary hover:bg-secondary/80 transition-colors rounded">
            📋 Emergency Checklist
          </button>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        <div className="flex justify-between">
          <span>Last Updated:</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
        <div className="text-xs">
          Sources: IMD, ISRO, Local Sensors
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;