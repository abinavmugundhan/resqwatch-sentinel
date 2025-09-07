import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Share2, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Phone,
  Backpack,
  Home,
  Heart,
  Droplets
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

const EmergencyAwareness: React.FC = () => {
  const { toast } = useToast();
  
  const [checklists, setChecklists] = useState({
    before: [
      { id: '1', text: 'Prepare emergency kit with water (3 days supply)', completed: false, priority: 'high' as const },
      { id: '2', text: 'Stock non-perishable food items', completed: false, priority: 'high' as const },
      { id: '3', text: 'Charge all electronic devices', completed: false, priority: 'medium' as const },
      { id: '4', text: 'Keep important documents in waterproof bag', completed: false, priority: 'high' as const },
      { id: '5', text: 'Identify evacuation routes', completed: false, priority: 'high' as const },
      { id: '6', text: 'Check emergency radio batteries', completed: false, priority: 'medium' as const }
    ],
    during: [
      { id: '7', text: 'Stay indoors unless evacuation is necessary', completed: false, priority: 'high' as const },
      { id: '8', text: 'Monitor official weather updates', completed: false, priority: 'high' as const },
      { id: '9', text: 'Avoid flooded roads and areas', completed: false, priority: 'high' as const },
      { id: '10', text: 'Keep phone charged for emergencies', completed: false, priority: 'medium' as const },
      { id: '11', text: 'Stay away from electrical equipment if wet', completed: false, priority: 'high' as const }
    ],
    after: [
      { id: '12', text: 'Check for injuries and provide first aid', completed: false, priority: 'high' as const },
      { id: '13', text: 'Inspect property for structural damage', completed: false, priority: 'medium' as const },
      { id: '14', text: 'Document damage with photos', completed: false, priority: 'medium' as const },
      { id: '15', text: 'Contact insurance company if needed', completed: false, priority: 'low' as const },
      { id: '16', text: 'Help neighbors and community if safe', completed: false, priority: 'low' as const }
    ]
  });

  const [activeTab, setActiveTab] = useState('before');

  const toggleChecklistItem = (phase: keyof typeof checklists, itemId: string) => {
    setChecklists(prev => ({
      ...prev,
      [phase]: prev[phase].map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-risk-high text-risk-high-foreground';
      case 'medium': return 'bg-risk-moderate text-risk-moderate-foreground';
      case 'low': return 'bg-risk-safe text-risk-safe-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCompletionStats = (items: ChecklistItem[]) => {
    const completed = items.filter(item => item.completed).length;
    const total = items.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  const exportChecklist = () => {
    const allItems = Object.entries(checklists).flatMap(([phase, items]) =>
      items.map(item => `${phase.toUpperCase()}: ${item.completed ? '✓' : '☐'} ${item.text}`)
    );
    
    const content = `ResQWatch Emergency Checklist\n\n${allItems.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emergency-checklist.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Checklist Exported",
      description: "Emergency checklist downloaded as text file.",
    });
  };

  const shareChecklist = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ResQWatch Emergency Checklist',
          text: 'Stay prepared with this emergency checklist from ResQWatch',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Share link copied to clipboard.",
      });
    }
  };

  const getCurrentAdvisory = () => {
    return {
      level: 'moderate',
      title: 'Heavy Rainfall Alert',
      message: 'Moderate to heavy rainfall expected in the next 6-12 hours. Stay indoors and avoid unnecessary travel.',
      actions: [
        'Keep emergency kit ready',
        'Monitor weather updates',
        'Avoid low-lying areas',
        'Charge electronic devices'
      ]
    };
  };

  const advisory = getCurrentAdvisory();

  return (
    <div className="space-y-4 p-4 bg-dashboard-panel h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Emergency Awareness</h2>
        <div className="flex gap-2">
          <Button onClick={shareChecklist} variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button onClick={exportChecklist} variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current Advisory */}
      <Card className={`border-l-4 ${advisory.level === 'moderate' ? 'border-l-risk-moderate' : 'border-l-risk-high'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Current Advisory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{advisory.title}</h3>
            <Badge className={getPriorityColor(advisory.level)}>
              {advisory.level.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-foreground">{advisory.message}</p>
          <div className="space-y-1">
            <p className="text-xs font-medium">Immediate Actions:</p>
            <ul className="space-y-1">
              {advisory.actions.map((action, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                  <div className="w-1 h-1 bg-current rounded-full" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Checklists */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Emergency Preparedness Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="before" className="text-xs">
                Before
                <Badge variant="secondary" className="ml-2">
                  {getCompletionStats(checklists.before).percentage}%
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="during" className="text-xs">
                During
                <Badge variant="secondary" className="ml-2">
                  {getCompletionStats(checklists.during).percentage}%
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="after" className="text-xs">
                After
                <Badge variant="secondary" className="ml-2">
                  {getCompletionStats(checklists.after).percentage}%
                </Badge>
              </TabsTrigger>
            </TabsList>

            {Object.entries(checklists).map(([phase, items]) => (
              <TabsContent key={phase} value={phase} className="space-y-3 mt-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-2 rounded border transition-colors ${
                        item.completed ? 'bg-secondary/50 border-primary/20' : 'border-border'
                      }`}
                    >
                      <button
                        onClick={() => toggleChecklistItem(phase as keyof typeof checklists, item.id)}
                        className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-primary border-primary'
                            : 'border-input hover:border-primary'
                        }`}
                      >
                        {item.completed && (
                          <CheckCircle className="h-3 w-3 text-primary-foreground" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <span
                          className={`text-sm ${
                            item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {item.text}
                        </span>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(item.priority).split(' ')[0]} border-current`}
                      >
                        {item.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                  <span className="text-xs font-medium">
                    Progress: {getCompletionStats(items).completed}/{getCompletionStats(items).total}
                  </span>
                  <Badge variant="secondary">
                    {getCompletionStats(items).percentage}% Complete
                  </Badge>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Emergency Kit Essentials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Backpack className="h-4 w-4" />
            Emergency Kit Essentials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-2">
              <p className="font-medium flex items-center gap-2">
                <Droplets className="h-3 w-3" />
                Water & Food
              </p>
              <ul className="space-y-1 text-muted-foreground ml-5">
                <li>• 1 gallon water per person/day (3 days)</li>
                <li>• Non-perishable food (3 days)</li>
                <li>• Manual can opener</li>
                <li>• Baby formula (if needed)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium flex items-center gap-2">
                <Heart className="h-3 w-3" />
                Medical Supplies
              </p>
              <ul className="space-y-1 text-muted-foreground ml-5">
                <li>• First aid kit</li>
                <li>• Prescription medications</li>
                <li>• Thermometer</li>
                <li>• Hand sanitizer</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium flex items-center gap-2">
                <Phone className="h-3 w-3" />
                Communication
              </p>
              <ul className="space-y-1 text-muted-foreground ml-5">
                <li>• Battery/crank radio</li>
                <li>• Cell phone chargers</li>
                <li>• Emergency contact list</li>
                <li>• Whistle for signaling</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium flex items-center gap-2">
                <Home className="h-3 w-3" />
                Tools & Supplies
              </p>
              <ul className="space-y-1 text-muted-foreground ml-5">
                <li>• Flashlight & batteries</li>
                <li>• Duct tape & plastic sheets</li>
                <li>• Local maps</li>
                <li>• Cash in small bills</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Numbers */}
      <Card className="bg-alert-background border border-alert-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Emergency Numbers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-lg text-risk-critical">112</div>
              <div className="text-xs">All Emergencies</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-lg text-risk-high">101</div>
              <div className="text-xs">Fire Service</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-lg text-primary">100</div>
              <div className="text-xs">Police</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-lg text-risk-moderate">108</div>
              <div className="text-xs">Ambulance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyAwareness;