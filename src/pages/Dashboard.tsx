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
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { usePersonalizedData } from "@/hooks/usePersonalizedData";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SkillGraphVisualization } from "@/components/SkillGraphVisualization";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    userStats,
    skills,
    activities,
    recommendations,
    loading,
    generateAIInsights,
    trackLearningActivity,
    fetchGraphData,
    getGraphRecommendations,
    updateSkillMastery
  } = usePersonalizedData();
  
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [graphData, setGraphData] = useState<any>({ nodes: [], links: [], clusters: [] });
  const [graphRecommendations, setGraphRecommendations] = useState<any[]>([]);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user && !aiInsights) {
      handleGenerateInsights();
      loadGraphData();
    }
  }, [loading, user]);

  const loadGraphData = async () => {
    setLoadingGraph(true);
    try {
      const data = await fetchGraphData();
      const recs = await getGraphRecommendations();
      setGraphData(data);
      setGraphRecommendations(recs);
    } catch (error) {
      console.error('Error loading graph:', error);
    } finally {
      setLoadingGraph(false);
    }
  };

  const handleGenerateInsights = async () => {
    setGeneratingInsights(true);
    try {
      const insights = await generateAIInsights();
      setAiInsights(insights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setGeneratingInsights(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading your personalized dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to LearnSphere!</h1>
            <p className="text-muted-foreground mb-4">Please sign in to access your personalized dashboard.</p>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Personalized skill review (skills that need attention based on forgetting curve)
  const skillsToReview = skills
    .filter(skill => skill.mastery_score < 0.7)
    .sort((a, b) => a.mastery_score - b.mastery_score)
    .slice(0, 3)
    .map(skill => ({
      name: skill.skill_name,
      progress: Math.round(skill.mastery_score * 100),
      urgency: skill.mastery_score < 0.4 ? "high" : skill.mastery_score < 0.6 ? "medium" : "low",
      lastStudied: new Date(skill.last_practiced).toLocaleDateString()
    }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Your personalized learning journey continues. You're {userStats?.placement_readiness || 0}% ready for placement!
          </p>
          {aiInsights && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <Brain className="inline h-4 w-4 mr-1" />
                AI Insight: {aiInsights.next_milestone || "Keep up the great work with your consistent learning!"}
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Learning Hours"
            value={Math.round(userStats?.total_learning_hours || 0).toString()}
            subtitle="Total hours"
            icon={Clock}
            trend={{ 
              value: aiInsights?.learning_velocity || userStats?.learning_velocity || 0, 
              isPositive: (userStats?.learning_velocity || 0) > 0 
            }}
          />
          <StatsCard
            title="Courses Completed"
            value={(userStats?.courses_completed || 0).toString()}
            subtitle="Total"
            icon={BookOpen}
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="Skills Mastered"
            value={(userStats?.skills_mastered || skills.filter(s => s.mastery_score > 0.8).length).toString()}
            subtitle={`of ${skills.length} total`}
            icon={Target}
            trend={{ 
              value: skills.filter(s => s.mastery_score > 0.7).length - skills.filter(s => s.mastery_score > 0.8).length, 
              isPositive: true 
            }}
          />
          <StatsCard
            title="Placement Ready"
            value={`${userStats?.placement_readiness || 0}%`}
            subtitle="Industry standard"
            icon={Trophy}
            trend={{ 
              value: Math.max(0, (userStats?.placement_readiness || 0) - 50), 
              isPositive: (userStats?.placement_readiness || 0) > 50 
            }}
            gradient
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Play className="h-5 w-5 mr-2 text-primary" />
                    Continue Learning
                  </h3>
                </div>
                {activities.length > 0 ? (
                  <div className="p-4 border border-border rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{activities[0]?.title || "Resume Learning"}</h4>
                        <p className="text-sm text-muted-foreground">
                          Last activity: {activities[0] ? new Date(activities[0].completed_at).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                      <Link to="/courses">
                        <Button>
                          Continue <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border border-border rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Start Your Learning Journey</h4>
                        <p className="text-sm text-muted-foreground">
                          Explore courses tailored to your goals
                        </p>
                      </div>
                      <Link to="/courses">
                        <Button>
                          Get Started <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Recent Activity
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleGenerateInsights}
                    disabled={generatingInsights}
                  >
                    {generatingInsights ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Refresh"}
                  </Button>
                </div>
                <div className="space-y-4">
                  {activities.length > 0 ? activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                      <div className="flex-shrink-0 mt-1">
                        {activity.activity_type === "course" && <BookOpen className="h-4 w-4 text-blue-500" />}
                        {activity.activity_type === "quiz" && <Brain className="h-4 w-4 text-green-500" />}
                        {activity.activity_type === "interview" && <Target className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.duration_minutes ? `${activity.duration_minutes} minutes` : ''}
                              {activity.accuracy_score ? ` • ${activity.accuracy_score}% accuracy` : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.completed_at).toLocaleDateString()}
                            </p>
                            {activity.accuracy_score && (
                              <div className="flex items-center mt-1">
                                <Progress value={activity.accuracy_score} className="w-16 h-2" />
                                <span className="text-xs ml-2">{Math.round(activity.accuracy_score)}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity yet. Start learning to see your progress here!</p>
                      <Link to="/courses">
                        <Button className="mt-4">Browse Courses</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-primary" />
                    AI Recommendations
                  </h3>
                  <Badge variant="secondary">Personalized</Badge>
                </div>
                <div className="space-y-4">
                  {aiInsights?.recommendations?.length > 0 ? aiInsights.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-primary" />
                          <h4 className="font-medium text-sm">{rec.title}</h4>
                        </div>
                        <Badge 
                          variant={rec.priority === 1 ? "destructive" : rec.priority === 2 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          Priority {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">🎯 AI Generated</span>
                        <Link to="/courses">
                          <Button size="sm" variant="ghost">
                            Take Action <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )) : recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-primary" />
                          <h4 className="font-medium text-sm">{rec.title}</h4>
                        </div>
                        <Badge 
                          variant={rec.priority === 1 ? "destructive" : rec.priority === 2 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          Priority {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">📊 Data Driven</span>
                        <Link to="/roadmap">
                          <Button size="sm" variant="ghost">
                            Take Action <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {(!aiInsights?.recommendations?.length && !recommendations.length) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Generating personalized recommendations...</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={handleGenerateInsights}
                        disabled={generatingInsights}
                      >
                        {generatingInsights ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                        Generate Insights
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Skill Graph Visualization */}
            {graphData.nodes.length > 0 && (
              <SkillGraphVisualization
                nodes={graphData.nodes}
                links={graphData.links}
                recommendations={graphRecommendations}
                onNodeClick={(node) => {
                  console.log('Selected node:', node);
                }}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Ring */}
            <Card>
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-4">Overall Progress</h3>
                <ProgressRing 
                  progress={userStats?.placement_readiness || 0} 
                  size={120} 
                  strokeWidth={8} 
                />
                <p className="text-sm text-muted-foreground mt-4">
                  {userStats?.placement_readiness || 0}% towards your career goal
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Skills Mastered</span>
                    <span>{skills.filter(s => s.mastery_score > 0.8).length}/{skills.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Courses Completed</span>
                    <span>{userStats?.courses_completed || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Learning Velocity</span>
                    <span>{Math.round(userStats?.learning_velocity || 0)}h/week</span>
                  </div>
                  {aiInsights && (
                    <div className="flex justify-between text-sm">
                      <span>Placement Ready</span>
                      <span>{aiInsights.estimated_placement_readiness || userStats?.placement_readiness || 0}%</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Skills to Review */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Skills to Review
                  </h3>
                  <Badge variant="outline" className="text-xs">Decay Alert</Badge>
                </div>
                <div className="space-y-3">
                  {skillsToReview.length > 0 ? skillsToReview.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={skill.urgency === "high" ? "destructive" : skill.urgency === "medium" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {skill.urgency}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">Last: {skill.lastStudied}</p>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">All skills up to date!</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link to="/roadmap" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Roadmap
                    </Button>
                  </Link>
                  <Link to="/jobs" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Job Matches
                    </Button>
                  </Link>
                  <Link to="/interview" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Brain className="h-4 w-4 mr-2" />
                      Mock Interview
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Achievement Highlight */}
            <Card>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="font-semibold mb-2">Learning Streak</h4>
                <p className="text-2xl font-bold text-primary mb-1">
                  {Math.floor((userStats?.total_learning_hours || 0) / 10) || 1}
                </p>
                <p className="text-sm text-muted-foreground">Days consistent learning</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-3"
                  onClick={() => navigate('/achievements')}
                >
                  <Star className="h-3 w-3 mr-1" />
                  View All
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;