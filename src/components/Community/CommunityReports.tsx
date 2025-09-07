import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquarePlus, 
  Camera, 
  MapPin, 
  Clock, 
  ThumbsUp, 
  AlertCircle,
  CheckCircle,
  User,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Report {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: Date;
  upvotes: number;
  verified: boolean;
  images?: string[];
  reporter: string;
}

const CommunityReports: React.FC = () => {
  const { toast } = useToast();
  const [showReportForm, setShowReportForm] = useState(false);
  const [newReport, setNewReport] = useState<{
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>({
    title: '',
    description: '',
    severity: 'medium'
  });
  
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: 'Road flooding near Krishna Temple',
      description: 'Water level reached knee-high, vehicles unable to pass. Local traffic diverted.',
      severity: 'high',
      location: 'Jayanagar, Bangalore',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      upvotes: 12,
      verified: true,
      reporter: 'Local Resident'
    },
    {
      id: '2', 
      title: 'Fallen tree blocking main road',
      description: 'Large tree fell due to strong winds. Emergency services notified.',
      severity: 'medium',
      location: 'MG Road, Bangalore',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      upvotes: 8,
      verified: false,
      reporter: 'Commuter'
    },
    {
      id: '3',
      title: 'Power outage in residential area',
      description: 'Entire block without electricity since 2 hours. Backup generators running.',
      severity: 'medium',
      location: 'Koramangala, Bangalore',
      timestamp: new Date(Date.now() - 120 * 60 * 1000),
      upvotes: 15,
      verified: true,
      reporter: 'BESCOM Official'
    }
  ]);

  const handleSubmitReport = () => {
    if (!newReport.title.trim() || !newReport.description.trim()) {
      toast({
        title: "Incomplete Report",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const report: Report = {
      id: Date.now().toString(),
      ...newReport,
      location: 'Current Location', // Would use GPS in real app
      timestamp: new Date(),
      upvotes: 0,
      verified: false,
      reporter: 'You'
    };

    setReports(prev => [report, ...prev]);
    setNewReport({ title: '', description: '', severity: 'medium' });
    setShowReportForm(false);
    
    toast({
      title: "Report Submitted",
      description: "Thank you for helping the community stay informed.",
    });
  };

  const handleUpvote = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, upvotes: report.upvotes + 1 }
        : report
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-risk-safe text-risk-safe-foreground';
      case 'medium': return 'bg-risk-moderate text-risk-moderate-foreground';
      case 'high': return 'bg-risk-high text-risk-high-foreground';
      case 'critical': return 'bg-risk-critical text-risk-critical-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-4 p-4 bg-dashboard-panel h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Community Reports</h2>
        <Button 
          onClick={() => setShowReportForm(!showReportForm)}
          size="sm"
          className="gap-2"
        >
          <MessageSquarePlus className="h-4 w-4" />
          Report
        </Button>
      </div>

      {/* Report Form */}
      {showReportForm && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-sm">Submit New Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="text"
              placeholder="Report title..."
              value={newReport.title}
              onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            
            <Textarea
              placeholder="Describe what you're observing..."
              value={newReport.description}
              onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
              className="resize-none"
              rows={3}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {(['low', 'medium', 'high', 'critical'] as const).map(severity => (
                  <button
                    key={severity}
                    onClick={() => setNewReport(prev => ({ ...prev, severity }))}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      newReport.severity === severity
                        ? getSeverityColor(severity)
                        : 'bg-secondary text-secondary-foreground hover:bg-accent'
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4" />
                </Button>
                <Button onClick={handleSubmitReport} size="sm" className="gap-2">
                  <Send className="h-4 w-4" />
                  Submit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Reports */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Recent Reports</h3>
        
        {reports.map((report) => (
          <Card key={report.id} className="p-3 hover:bg-accent/50 transition-colors">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium">{report.title}</h4>
                    {report.verified && (
                      <CheckCircle className="h-3 w-3 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {report.reporter}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(report.timestamp)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {report.location}
                    </div>
                  </div>
                </div>
                <Badge className={getSeverityColor(report.severity)}>
                  {report.severity}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground">{report.description}</p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleUpvote(report.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ThumbsUp className="h-3 w-3" />
                  {report.upvotes}
                </button>
                
                <div className="flex gap-2">
                  <button className="text-xs text-primary hover:underline">
                    View on Map
                  </button>
                  <button className="text-xs text-muted-foreground hover:text-foreground">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <Card className="p-3 bg-secondary/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold">{reports.length}</div>
            <div className="text-xs text-muted-foreground">Total Reports</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">
              {reports.filter(r => r.verified).length}
            </div>
            <div className="text-xs text-muted-foreground">Verified</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-metric-warning">
              {reports.filter(r => r.severity === 'high' || r.severity === 'critical').length}
            </div>
            <div className="text-xs text-muted-foreground">High Priority</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CommunityReports;