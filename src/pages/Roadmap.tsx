import { useState } from "react";
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
  Zap,
  Loader2
} from "lucide-react";
import { usePersonalizedData } from "@/hooks/usePersonalizedData";
import { RoadmapGenerationDialog, RoadmapFormData } from "@/components/RoadmapGenerationDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Roadmap = () => {
  const { 
    user, 
    userStats, 
    roadmapWeeks, 
    goals,
    loading, 
    refreshData
  } = usePersonalizedData();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

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
          <p className="text-muted-foreground">Please sign in to view your personalized roadmap.</p>
        </div>
      </div>
    );
  }

  const hasRoadmap = roadmapWeeks?.length > 0;
  const currentGoal = goals?.length > 0 ? goals[0] : null;
  const placementReadiness = userStats?.placement_readiness || 0;
  
  // Calculate progress based on completed weeks
  const completedWeeks = roadmapWeeks?.filter(week => week.status === 'completed').length || 0;
  const totalWeeks = roadmapWeeks?.length || 12;
  const progress = totalWeeks > 0 ? (completedWeeks / totalWeeks) * 100 : 0;

  const handleGenerateRoadmap = async (formData: RoadmapFormData) => {
    if (!user) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-personalization', {
        body: {
          userId: user.id,
          action: 'generate_roadmap',
          data: formData
        }
      });

      if (error) throw error;
      
      // Refresh data and close dialog
      await refreshData();
      setDialogOpen(false);
      
      // Show success message
      toast({
        title: "Success!",
        description: "Your personalized roadmap has been generated successfully!",
      });

      // Scroll to roadmap section after a short delay
      setTimeout(() => {
        const roadmapSection = document.querySelector('.weekly-roadmap-section');
        if (roadmapSection) {
          roadmapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast({
        title: "Error",
        description: "Failed to generate roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
            <Button 
              className="hero-gradient text-white shadow-primary"
              onClick={() => setDialogOpen(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {hasRoadmap ? 'Regenerate Roadmap' : 'Generate Roadmap'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Roadmap Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="learning-card p-6 hero-gradient text-white">
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-4 ai-pulse" />
                <h2 className="text-xl font-bold mb-2">
                  {currentGoal?.title || 'Personalized Career Path'}
                </h2>
                <p className="text-white/90 mb-4">
                  {currentGoal?.description || 'AI-Generated Learning Journey'}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>Week {completedWeeks + 1} of {totalWeeks}</span>
                    </div>
                    <Progress value={progress} className="bg-white/20" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold stats-counter">{Math.round(progress)}%</div>
                      <div className="text-xs text-white/80">Complete</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold stats-counter">{placementReadiness}%</div>
                      <div className="text-xs text-white/80">Readiness</div>
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
              <h3 className="text-lg font-semibold mb-4">Learning Path Status</h3>
              <div className="space-y-3">
                {hasRoadmap ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Active Roadmap</p>
                        <p className="text-xs text-muted-foreground">{totalWeeks} weeks planned</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Placement Readiness</p>
                        <p className="text-xs text-muted-foreground">Current score: {placementReadiness}%</p>
                      </div>
                      <Badge variant={placementReadiness > 70 ? "default" : "secondary"}>
                        {placementReadiness > 70 ? "Good" : "Developing"}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Generate your AI-powered roadmap to start learning!
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Weekly Roadmap */}
          <div className="lg:col-span-2 weekly-roadmap-section">
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

              {hasRoadmap ? (
                <div className="space-y-6">
                  {roadmapWeeks.map((week, index) => (
                    <div key={week.id} className={`relative pl-8 pb-6 ${
                      index < roadmapWeeks.length - 1 ? 'border-l-2 border-muted' : ''
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
                                Week {week.week_number}: {week.title}
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
                                {week.estimated_hours} hours
                              </div>
                              <div className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1" />
                                {week.topics?.length || 0} topics
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

                        <p className="text-sm text-muted-foreground mb-3">{week.description}</p>

                        {week.topics && week.topics.length > 0 && (
                          <div className="grid md:grid-cols-3 gap-2 mb-3">
                            {week.topics.map((topic: string, topicIndex: number) => (
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
                        )}

                        {week.skills_focus && week.skills_focus.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {week.skills_focus.map((skill: string, skillIndex: number) => (
                              <Badge key={skillIndex} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {week.status === 'current' && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Brain className="w-5 h-5 text-primary" />
                              <p className="text-sm">
                                <strong>AI Tip:</strong> Focus on {week.skills_focus?.[0] || 'practical projects'} this week for maximum learning impact.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Roadmap Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Generate your personalized AI roadmap to start your learning journey!
                  </p>
                  <Button 
                    className="hero-gradient text-white"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate My Roadmap
                  </Button>
                </div>
              )}

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

      <RoadmapGenerationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onGenerate={handleGenerateRoadmap}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default Roadmap;