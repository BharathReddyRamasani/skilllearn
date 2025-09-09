import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";
import ProgressRing from "@/components/ProgressRing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Target, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Brain,
  Star,
  Play,
  Calendar,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const recentActivities = [
    {
      type: "course",
      title: "Machine Learning Fundamentals",
      action: "Completed Module 3: Neural Networks",
      time: "2 hours ago",
      progress: 75
    },
    {
      type: "quiz",
      title: "Data Structures Quiz",
      action: "Scored 85% - Knowledge reinforced",
      time: "5 hours ago",
      progress: 85
    },
    {
      type: "roadmap",
      title: "AI Career Roadmap",
      action: "New recommendations generated",
      time: "1 day ago",
      progress: null
    }
  ];

  const skillsToReview = [
    { skill: "React Hooks", mastery: 65, trend: -5, urgent: true },
    { skill: "MongoDB Queries", mastery: 72, trend: -3, urgent: false },
    { skill: "Node.js APIs", mastery: 58, trend: -8, urgent: true }
  ];

  const aiRecommendations = [
    {
      type: "course",
      title: "Advanced React Patterns",
      reason: "Based on your low React Hooks mastery",
      difficulty: "Intermediate",
      time: "4 hours"
    },
    {
      type: "quiz",
      title: "System Design Practice",
      reason: "Trending skill for your target companies",
      difficulty: "Advanced", 
      time: "45 min"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="text-gradient">Rahul</span>
          </h1>
          <p className="text-muted-foreground">
            Your AI-powered learning journey continues. Ready to level up your skills today?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Overall Progress"
            value="73"
            subtitle="Placement Ready"
            icon={Target}
            trend={{ value: 12, isPositive: true }}
            gradient={true}
          />
          <StatsCard
            title="Courses Completed"
            value="8"
            subtitle="of 12 enrolled"
            icon={BookOpen}
            trend={{ value: 25, isPositive: true }}
          />
          <StatsCard
            title="Study Hours"
            value="142"
            subtitle="this month"
            icon={Clock}
            trend={{ value: 18, isPositive: true }}
          />
          <StatsCard
            title="Achievement Points"
            value="2,847"
            subtitle="Level 12 Expert"
            icon={Trophy}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <Card className="learning-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-center">
                  <Play className="mr-2 w-6 h-6 text-primary" />
                  Continue Learning
                </h2>
                <Badge variant="secondary" className="learning-gradient text-white">
                  In Progress
                </Badge>
              </div>
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Machine Learning Fundamentals</h3>
                    <p className="text-muted-foreground mb-4">
                      Module 4: Deep Learning Architectures
                    </p>
                    <Progress value={75} className="mb-4" />
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>75% Complete</span>
                      <span>•</span>
                      <span>2 hours remaining</span>
                    </div>
                  </div>
                  <Button className="hero-gradient text-white shadow-primary">
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="learning-card p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Calendar className="mr-2 w-6 h-6 text-primary" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'course' ? 'bg-primary/20 text-primary' :
                      activity.type === 'quiz' ? 'bg-accent/20 text-accent' :
                      'bg-warning/20 text-warning'
                    }`}>
                      {activity.type === 'course' ? <BookOpen className="w-5 h-5" /> :
                       activity.type === 'quiz' ? <Brain className="w-5 h-5" /> :
                       <TrendingUp className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                      {activity.progress && (
                        <p className="text-sm font-semibold text-accent">{activity.progress}%</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Recommendations */}
            <Card className="learning-card p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Zap className="mr-2 w-6 h-6 text-accent ai-pulse" />
                AI Recommendations
              </h2>
              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={rec.type === 'course' ? 'default' : 'secondary'}>
                            {rec.type === 'course' ? 'Course' : 'Quiz'}
                          </Badge>
                          <Badge variant="outline">{rec.difficulty}</Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                        <p className="text-xs text-muted-foreground">{rec.time}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Start Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Ring */}
            <Card className="learning-card p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Placement Readiness</h3>
              <ProgressRing progress={73} />
              <p className="text-sm text-muted-foreground mt-4">
                You're in the top 25% of students! Keep up the great work.
              </p>
            </Card>

            {/* Skills to Review */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertCircle className="mr-2 w-5 h-5 text-warning" />
                Skills to Review
              </h3>
              <div className="space-y-4">
                {skillsToReview.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{skill.skill}</span>
                        {skill.urgent && (
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{skill.mastery}%</span>
                        <span className={`text-xs ${skill.trend < 0 ? 'text-destructive' : 'text-success'}`}>
                          {skill.trend}%
                        </span>
                      </div>
                    </div>
                    <Progress value={skill.mastery} />
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Review All Skills
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/roadmap">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Brain className="mr-2 w-4 h-4" />
                    Generate New Roadmap
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Target className="mr-2 w-4 h-4" />
                    Check Job Matches
                  </Button>
                </Link>
                <Link to="/interview">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="mr-2 w-4 h-4" />
                    Practice Interview
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Achievement */}
            <Card className="learning-card p-6 hero-gradient text-white">
              <div className="text-center">
                <Star className="w-12 h-12 mx-auto mb-3 ai-pulse" />
                <h3 className="font-semibold mb-2">Weekly Champion!</h3>
                <p className="text-sm text-white/90">
                  You've completed more courses than 95% of learners this week.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;