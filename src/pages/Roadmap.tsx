import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Target, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  Code,
  Users,
  Trophy,
  Calendar,
  Zap
} from "lucide-react";

const Roadmap = () => {
  const roadmapData = {
    title: "Full Stack Developer + ML Engineer",
    targetRole: "Senior Software Engineer at FAANG",
    timeline: "6 Months",
    currentWeek: 8,
    totalWeeks: 24,
    progress: 33
  };

  const weeks = [
    {
      week: 1,
      title: "JavaScript Fundamentals",
      status: "completed",
      topics: ["ES6+ Features", "Async Programming", "DOM Manipulation"],
      timeSpent: "12 hours",
      resources: 3
    },
    {
      week: 2,
      title: "React.js Mastery",
      status: "completed", 
      topics: ["Components & Props", "State Management", "Hooks Deep Dive"],
      timeSpent: "15 hours",
      resources: 4
    },
    {
      week: 3,
      title: "Node.js & Express",
      status: "completed",
      topics: ["Server Setup", "REST APIs", "Middleware"],
      timeSpent: "14 hours", 
      resources: 3
    },
    {
      week: 4,
      title: "Database Design",
      status: "current",
      topics: ["MongoDB Fundamentals", "Schema Design", "Aggregation"],
      timeSpent: "8 hours",
      resources: 5
    },
    {
      week: 5,
      title: "Authentication & Security", 
      status: "upcoming",
      topics: ["JWT Implementation", "OAuth 2.0", "Security Best Practices"],
      timeSpent: "0 hours",
      resources: 4
    },
    {
      week: 6,
      title: "Testing & Deployment",
      status: "upcoming",
      topics: ["Unit Testing", "Integration Tests", "CI/CD Pipelines"], 
      timeSpent: "0 hours",
      resources: 6
    }
  ];

  const skillGaps = [
    { skill: "System Design", importance: "Critical", timeline: "Week 12-14" },
    { skill: "Docker & Kubernetes", importance: "High", timeline: "Week 16-17" },
    { skill: "Machine Learning", importance: "Medium", timeline: "Week 18-20" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Brain className="mr-3 w-10 h-10 text-primary ai-pulse" />
                AI-Generated <span className="text-gradient ml-2">Career Roadmap</span>
              </h1>
              <p className="text-muted-foreground">
                Personalized learning path powered by advanced AI algorithms
              </p>
            </div>
            <Button className="hero-gradient text-white shadow-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              Regenerate Roadmap
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Roadmap Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="learning-card p-6 hero-gradient text-white">
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-4 ai-pulse" />
                <h2 className="text-xl font-bold mb-2">{roadmapData.title}</h2>
                <p className="text-white/90 mb-4">{roadmapData.targetRole}</p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>Week {roadmapData.currentWeek} of {roadmapData.totalWeeks}</span>
                    </div>
                    <Progress value={roadmapData.progress} className="bg-white/20" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold stats-counter">{roadmapData.progress}%</div>
                      <div className="text-xs text-white/80">Complete</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold stats-counter">{roadmapData.timeline}</div>
                      <div className="text-xs text-white/80">Timeline</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-accent ai-pulse" />
                AI Insights
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm">
                    <strong>Learning Velocity:</strong> You're 15% ahead of schedule! 
                    Consider diving deeper into advanced topics.
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <p className="text-sm">
                    <strong>Skill Gap Alert:</strong> Focus on System Design to match 
                    your target companies' requirements.
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm">
                    <strong>Market Trend:</strong> React + TypeScript combination 
                    is trending 23% higher in job postings.
                  </p>
                </div>
              </div>
            </Card>

            {/* Critical Skills */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4">Critical Skill Gaps</h3>
              <div className="space-y-3">
                {skillGaps.map((gap, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{gap.skill}</p>
                      <p className="text-xs text-muted-foreground">{gap.timeline}</p>
                    </div>
                    <Badge variant={
                      gap.importance === 'Critical' ? 'destructive' :
                      gap.importance === 'High' ? 'default' : 'secondary'
                    }>
                      {gap.importance}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Weekly Roadmap */}
          <div className="lg:col-span-2">
            <Card className="learning-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Weekly Learning Path</h2>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Updated daily by AI
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {weeks.map((week, index) => (
                  <div key={week.week} className={`relative pl-8 pb-6 ${
                    index < weeks.length - 1 ? 'border-l-2 border-muted' : ''
                  }`}>
                    {/* Timeline dot */}
                    <div className={`absolute -left-2 w-4 h-4 rounded-full border-2 ${
                      week.status === 'completed' 
                        ? 'bg-success border-success' 
                        : week.status === 'current'
                        ? 'bg-primary border-primary animate-pulse'
                        : 'bg-background border-muted'
                    }`}>
                      {week.status === 'completed' && (
                        <CheckCircle className="w-3 h-3 text-white absolute -top-0.5 -left-0.5" />
                      )}
                    </div>

                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      week.status === 'current' 
                        ? 'border-primary bg-primary/5 shadow-primary' 
                        : week.status === 'completed'
                        ? 'border-success/30 bg-success/5'
                        : 'border-border bg-muted/30'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              Week {week.week}: {week.title}
                            </h3>
                            <Badge variant={
                              week.status === 'completed' ? 'default' :
                              week.status === 'current' ? 'secondary' : 'outline'
                            }>
                              {week.status === 'completed' ? 'Completed' :
                               week.status === 'current' ? 'In Progress' : 'Upcoming'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {week.timeSpent}
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-1" />
                              {week.resources} resources
                            </div>
                          </div>
                        </div>
                        {week.status === 'current' && (
                          <Button size="sm" className="hero-gradient text-white">
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-3 gap-2">
                        {week.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className={`p-2 rounded text-sm ${
                            week.status === 'completed' 
                              ? 'bg-success/10 text-success-foreground' 
                              : week.status === 'current'
                              ? 'bg-primary/10 text-primary-foreground'
                              : 'bg-muted/50 text-muted-foreground'
                          }`}>
                            {topic}
                          </div>
                        ))}
                      </div>

                      {week.status === 'current' && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Brain className="w-5 h-5 text-primary" />
                            <p className="text-sm">
                              <strong>AI Tip:</strong> Focus on practical projects this week. 
                              Building a CRUD app will solidify these database concepts.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 hero-gradient rounded-lg text-white text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 ai-pulse" />
                <h3 className="text-xl font-semibold mb-2">Career Goal Achievement</h3>
                <p className="text-white/90 mb-4">
                  Complete this roadmap to achieve 85%+ placement readiness score
                </p>
                <Button variant="secondary" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Join Study Group
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;