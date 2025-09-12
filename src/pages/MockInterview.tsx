import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  Play, 
  Clock, 
  Target, 
  Brain,
  Mic,
  Video,
  BarChart3,
  Trophy,
  AlertCircle,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Zap,
  Loader2
} from "lucide-react";
import { usePersonalizedData } from "@/hooks/usePersonalizedData";

const MockInterview = () => {
  const { 
    user, 
    userStats, 
    skills,
    interviewSessions,
    loading 
  } = usePersonalizedData();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">Welcome to LearnSphere!</h1>
          <p className="text-muted-foreground">Please sign in to access mock interviews.</p>
        </div>
      </div>
    );
  }

  const averageScore = interviewSessions?.length > 0 
    ? Math.round(interviewSessions.reduce((sum, session) => sum + session.overall_score, 0) / interviewSessions.length)
    : 0;
  const totalSessions = interviewSessions?.length || 0;
  const interviewTypes = [
    {
      id: 1,
      title: "Technical Interview",
      description: "Data structures, algorithms, and coding challenges",
      duration: "45-60 min",
      difficulty: "Hard",
      topics: ["DSA", "Problem Solving", "System Design", "Coding"],
      color: "from-blue-500 to-purple-500",
      icon: Brain,
      recommended: true
    },
    {
      id: 2,
      title: "Behavioral Interview", 
      description: "Soft skills, leadership, and situational questions",
      duration: "30-45 min",
      difficulty: "Medium",
      topics: ["Communication", "Leadership", "Teamwork", "Problem Solving"],
      color: "from-green-500 to-emerald-500",
      icon: Users,
      recommended: false
    },
    {
      id: 3,
      title: "System Design Interview",
      description: "Architecture and scalability discussions",
      duration: "60-90 min", 
      difficulty: "Expert",
      topics: ["Architecture", "Scalability", "Database Design", "APIs"],
      color: "from-orange-500 to-red-500",
      icon: BarChart3,
      recommended: false
    }
  ];

  const recentSessions = [
    {
      id: 1,
      type: "Technical",
      date: "2 days ago",
      duration: "52 min",
      score: 87,
      feedback: "Excellent problem-solving approach",
      strengths: ["Algorithm optimization", "Code clarity"],
      improvements: ["Edge case handling", "Time complexity analysis"]
    },
    {
      id: 2,
      type: "Behavioral",
      date: "1 week ago", 
      duration: "38 min",
      score: 92,
      feedback: "Strong communication skills",
      strengths: ["Clear articulation", "Leadership examples"],
      improvements: ["More specific examples", "Structured responses"]
    },
    {
      id: 3,
      type: "Technical",
      date: "2 weeks ago",
      duration: "48 min",
      score: 76,
      feedback: "Good foundation, needs practice",
      strengths: ["Basic concepts", "Logical thinking"],
      improvements: ["Advanced algorithms", "Optimization techniques"]
    }
  ];

  const performanceMetrics = {
    averageScore: 85,
    totalSessions: 12,
    improvementRate: 23,
    strengths: ["Problem Solving", "Communication", "Technical Knowledge"],
    weaknesses: ["System Design", "Advanced Algorithms", "Time Management"]
  };

  const aiInsights = [
    {
      type: "improvement",
      title: "Focus on System Design",
      description: "Your technical scores are strong, but system design needs attention for senior roles.",
      priority: "High"
    },
    {
      type: "strength", 
      title: "Excellent Communication",
      description: "Your ability to explain solutions clearly is above average for your experience level.",
      priority: "Maintain"
    },
    {
      type: "recommendation",
      title: "Practice Advanced Algorithms",
      description: "Companies like Google and Meta emphasize complex algorithmic thinking.",
      priority: "Medium"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-success/10";
    if (score >= 70) return "bg-warning/10";
    return "bg-destructive/10";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center">
            <MessageSquare className="mr-3 w-10 h-10 text-primary" />
            AI-Powered <span className="text-gradient ml-2">Mock Interviews</span>
          </h1>
          <p className="text-muted-foreground">
            Practice interviews with AI feedback and real-time performance analytics
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Interview Types */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Choose Interview Type</h2>
              <div className="grid gap-6">
                {interviewTypes.map((type) => (
                  <Card key={type.id} className={`learning-card p-6 relative overflow-hidden ${
                    type.recommended ? 'border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5' : ''
                  }`}>
                    {type.recommended && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent text-white">
                        <Zap className="w-3 h-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${type.color} flex items-center justify-center`}>
                        <type.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold">{type.title}</h3>
                          <Badge variant="outline">{type.difficulty}</Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{type.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {type.duration}
                          </div>
                          <div className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            {type.topics.length} focus areas
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {type.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex space-x-3">
                          <Button className="hero-gradient text-white shadow-primary">
                            <Play className="w-4 h-4 mr-2" />
                            Start Interview
                          </Button>
                          <Button variant="outline">
                            <Video className="w-4 h-4 mr-2" />
                            Practice Mode
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Recent Interview Sessions</h2>
              {interviewSessions?.length > 0 ? (
                <div className="space-y-4">
                  {interviewSessions.slice(0, 3).map((session) => (
                    <Card key={session.id} className="learning-card p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{session.interview_type} Interview</h3>
                            <Badge variant="outline">{new Date(session.completed_at).toLocaleDateString()}</Badge>
                          </div>
                          <p className="text-muted-foreground">{session.feedback}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold stats-counter ${getScoreColor(session.overall_score)}`}>
                            {session.overall_score}%
                          </div>
                          <div className="text-xs text-muted-foreground">Overall Score</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-success mb-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Strengths
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {session.strengths?.map((strength, index) => (
                              <li key={index}>• {strength}</li>
                            )) || <li>Great overall performance</li>}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-destructive mb-2 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Areas to Improve
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {session.improvements?.map((improvement, index) => (
                              <li key={index}>• {improvement}</li>
                            )) || <li>Continue practicing regularly</li>}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                          Duration: {session.duration_minutes} minutes
                        </div>
                        <Button variant="outline" size="sm">
                          View Detailed Report
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No interview sessions yet. Start practicing to improve your skills!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Overview */}
            <Card className="learning-card p-6 hero-gradient text-white">
              <div className="text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 ai-pulse" />
                <h3 className="text-xl font-bold mb-2">Performance Overview</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-2xl font-bold stats-counter">{averageScore}%</div>
                    <div className="text-xs text-white/80">Avg Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold stats-counter">{totalSessions}</div>
                    <div className="text-xs text-white/80">Sessions</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Improvement Rate</span>
                    <span>+{Math.max(0, averageScore - 60)}%</span>
                  </div>
                  <Progress value={Math.min(100, averageScore)} className="bg-white/20" />
                </div>

                <p className="text-white/90 text-sm">
                  {totalSessions > 0 
                    ? `You're performing better than ${Math.min(95, 50 + averageScore/2)}% of candidates!`
                    : "Complete interviews to track your progress!"}
                </p>
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-primary ai-pulse" />
                AI Insights
              </h3>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    insight.type === 'improvement' ? 'bg-destructive/10' :
                    insight.type === 'strength' ? 'bg-success/10' : 'bg-primary/10'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills Breakdown */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4">Skills Assessment</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-success mb-2">Top Strengths</h4>
                  <div className="space-y-2">
                    {performanceMetrics.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{strength}</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-warning fill-warning mr-1" />
                          <span className="text-xs">Strong</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium text-destructive mb-2">Focus Areas</h4>
                  <div className="space-y-2">
                    {performanceMetrics.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{weakness}</span>
                        <Badge variant="outline" className="text-xs">
                          Improve
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Start</h3>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mic className="w-4 h-4 mr-2" />
                  Voice Practice Mode
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Video className="w-4 h-4 mr-2" />
                  Video Interview Prep
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Performance Analytics
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;