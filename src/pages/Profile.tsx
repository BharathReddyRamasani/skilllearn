import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  MapPin, 
  Calendar, 
  Trophy, 
  Target, 
  BookOpen, 
  Code, 
  Database, 
  Brain,
  Edit,
  Award,
  TrendingUp,
  Clock,
  Loader2
} from "lucide-react";
import { usePersonalizedData } from "@/hooks/usePersonalizedData";
import { SkillGraphVisualization } from "@/components/SkillGraphVisualization";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const { 
    user, 
    userStats, 
    skills, 
    goals,
    activities,
    loading,
    generateAIInsights,
    fetchGraphData,
    getGraphRecommendations
  } = usePersonalizedData();

  const [graphData, setGraphData] = useState<any>({ nodes: [], links: [], clusters: [] });
  const [graphRecommendations, setGraphRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadGraphData();
    }
  }, [user]);

  const loadGraphData = async () => {
    try {
      const data = await fetchGraphData();
      const recs = await getGraphRecommendations();
      setGraphData(data);
      setGraphRecommendations(recs);
    } catch (error) {
      console.error('Error loading graph:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show empty state for new users
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">Welcome to LearnSphere!</h1>
          <p className="text-muted-foreground">Please sign in to view your personalized profile.</p>
        </div>
      </div>
    );
  }

  const displaySkills = skills?.length > 0 ? skills : [];
  const displayGoals = goals?.length > 0 ? goals : [];
  const displayActivities = activities?.length > 0 ? activities : [];
  const placementReadiness = userStats?.placement_readiness || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="learning-card p-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-2xl hero-gradient text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-2">{user.email?.split('@')[0] || 'User'}</h2>
                <p className="text-muted-foreground mb-4">LearnSphere Student</p>
                
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Placement Readiness</span>
                    <span className="font-semibold text-primary">{placementReadiness}%</span>
                  </div>
                  <Progress value={placementReadiness} />
                  <p className="text-xs text-muted-foreground">
                    {placementReadiness > 70 
                      ? "You're doing great! Keep it up!" 
                      : placementReadiness > 30 
                      ? "Making progress! Keep learning!"
                      : "Just getting started - your journey begins here!"}
                  </p>
                </div>

                <Button 
                  className="w-full mt-6" 
                  variant="outline"
                  onClick={() => toast({ title: "Edit Profile", description: "Profile editing feature coming soon!" })}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </Card>

            {/* Learning Stats */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4">Learning Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold stats-counter">{userStats?.total_learning_hours || 0}</div>
                  <div className="text-xs text-muted-foreground">Total Hours</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold stats-counter">{userStats?.courses_completed || 0}</div>
                  <div className="text-xs text-muted-foreground">Courses Completed</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Code className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold stats-counter">{userStats?.skills_mastered || 0}</div>
                  <div className="text-xs text-muted-foreground">Skills Mastered</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold stats-counter">{displayActivities.length}</div>
                  <div className="text-xs text-muted-foreground">Activities</div>
                </div>
              </div>
            </Card>

            {/* Career Goals */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Career Goals
              </h3>
              {displayGoals.length > 0 ? (
                <div className="space-y-3">
                  {displayGoals.map((goal) => (
                    <Badge key={goal.id} className="hero-gradient text-white block w-fit">
                      {goal.title}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Set your career goals to get personalized learning recommendations!
                </p>
              )}
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Overview */}
            <Card className="learning-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Skills Portfolio</h2>
                <Button variant="outline" size="sm" onClick={generateAIInsights}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Insights
                </Button>
              </div>
              
              {displaySkills.length > 0 ? (
                <div className="grid gap-6">
                  {displaySkills.map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{skill.skill_name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                        <span className="text-sm font-semibold text-primary">{Math.round(skill.mastery_score * 100)}%</span>
                      </div>
                      <Progress value={skill.mastery_score * 100} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No skills tracked yet. Complete learning activities to build your skill profile!</p>
                </div>
              )}

              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-primary ai-pulse" />
                  <div>
                    <h4 className="font-semibold">AI Skill Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      {displaySkills.length > 0 
                        ? `Focus on ${displaySkills[0]?.skill_name || 'new skills'} to improve your placement readiness`
                        : "Start learning and practicing to get personalized AI insights!"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Learning History */}
            <Card className="learning-card p-6">
              <h2 className="text-2xl font-semibold mb-6">Recent Learning Activity</h2>
              {displayActivities.length > 0 ? (
                <div className="space-y-4">
                  {displayActivities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {activity.activity_type} • {new Date(activity.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={activity.accuracy_score ? "default" : "secondary"}>
                        {activity.accuracy_score ? `${Math.round(activity.accuracy_score)}%` : "Completed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No learning activities yet. Start your learning journey!</p>
                </div>
              )}
            </Card>

            {/* Skill Graph */}
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
        </div>
      </div>
    </div>
  );
};

export default Profile;