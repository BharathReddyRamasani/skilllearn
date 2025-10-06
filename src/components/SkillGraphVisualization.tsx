import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Brain, Lock, CheckCircle, Target, Zap, Star, BookOpen, GraduationCap, Trophy, Crown, Sparkles, TrendingUp, Calendar, Award, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SkillNode {
  id: string;
  name: string;
  category: string;
  mastery: number;
  is_unlocked: boolean;
  difficulty: number;
  estimated_hours: number;
  cluster_id?: string;
}

interface SkillLink {
  source: string;
  target: string;
  weight: number;
}

interface SkillGraphProps {
  nodes: SkillNode[];
  links: SkillLink[];
  onNodeClick?: (node: SkillNode) => void;
  recommendations?: any[];
}

type FilterType = "all" | "mastered" | "completed" | "todo" | "locked";

export const SkillGraphVisualization = ({ 
  nodes, 
  links, 
  onNodeClick,
  recommendations = []
}: SkillGraphProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [userCourseProgress, setUserCourseProgress] = useState<any[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  // Fetch user's actual course progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get user's course progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_course_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressError) throw progressError;
        setUserCourseProgress(progressData || []);

        // Get user's skill graph data
        const { data: skillData, error: skillError } = await supabase
          .from('user_skill_graph')
          .select('*, skills(*)')
          .eq('user_id', user.id);

        if (skillError) throw skillError;
        
      } catch (error: any) {
        console.error('Error fetching user progress:', error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    fetchUserProgress();
  }, []);

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
    if (onNodeClick) onNodeClick(node);
  };

  const totalSkills = nodes.length;
  const masteredSkills = nodes.filter(n => n.mastery >= 80).length;
  const inProgressSkills = nodes.filter(n => n.mastery > 0 && n.mastery < 80 && n.is_unlocked).length;
  const lockedSkills = nodes.filter(n => !n.is_unlocked).length;
  const overallProgress = totalSkills > 0 ? Math.round((nodes.reduce((sum, n) => sum + (n.is_unlocked ? n.mastery : 0), 0) / totalSkills)) : 0;

  // Calculate learning velocity (skills mastered recently)
  const recentlyMastered = nodes.filter(n => n.mastery >= 80).length;
  const learningVelocity = recentlyMastered > 0 ? "High" : inProgressSkills > 3 ? "Medium" : "Getting Started";

  // Get next skills to unlock - DYNAMIC based on completed skills
  const getSmartRecommendedSkills = () => {
    // Get skills that are prerequisites for locked skills
    const completedSkillIds = nodes.filter(n => n.mastery >= 80).map(n => n.id);
    const inProgressSkillIds = nodes.filter(n => n.mastery > 0 && n.mastery < 80).map(n => n.id);
    
    // Find locked skills whose prerequisites are mostly completed
    const lockedWithProgress = nodes
      .filter(n => !n.is_unlocked)
      .map(skill => {
        // Check how many prerequisites this skill has from links
        const prerequisites = links.filter(l => l.target === skill.id);
        const completedPrereqs = prerequisites.filter(p => 
          completedSkillIds.includes(p.source)
        ).length;
        
        return {
          skill,
          prereqProgress: prerequisites.length > 0 ? completedPrereqs / prerequisites.length : 0,
          totalPrereqs: prerequisites.length
        };
      })
      .filter(item => item.prereqProgress > 0.5 || item.totalPrereqs === 0) // At least 50% prereqs done or no prereqs
      .sort((a, b) => {
        // Sort by prerequisite completion, then by difficulty
        if (b.prereqProgress !== a.prereqProgress) {
          return b.prereqProgress - a.prereqProgress;
        }
        return a.skill.difficulty - b.skill.difficulty;
      })
      .slice(0, 3)
      .map(item => item.skill);

    // If no smart recommendations, just show easiest locked skills
    if (lockedWithProgress.length === 0) {
      return nodes
        .filter(n => !n.is_unlocked)
        .sort((a, b) => a.difficulty - b.difficulty)
        .slice(0, 3);
    }

    return lockedWithProgress;
  };

  const nextSkills = getSmartRecommendedSkills();

  // Get skills in progress
  const activeSkills = nodes
    .filter(n => n.is_unlocked && n.mastery > 0 && n.mastery < 80)
    .sort((a, b) => b.mastery - a.mastery)
    .slice(0, 4);

  // Get mastered skills
  const masteredSkillsList = nodes
    .filter(n => n.mastery >= 80)
    .sort((a, b) => b.mastery - a.mastery);

  // Determine career milestone
  const getMilestone = () => {
    if (overallProgress >= 80) return { label: "Career Expert", icon: Trophy, color: "from-yellow-500 to-orange-500", desc: "Industry leader level" };
    if (overallProgress >= 60) return { label: "Senior Professional", icon: Crown, color: "from-purple-500 to-pink-500", desc: "Advanced expertise" };
    if (overallProgress >= 40) return { label: "Mid-Level Professional", icon: Zap, color: "from-blue-500 to-purple-500", desc: "Growing capabilities" };
    if (overallProgress >= 20) return { label: "Junior Professional", icon: Target, color: "from-cyan-500 to-blue-500", desc: "Building foundation" };
    return { label: "Career Starter", icon: GraduationCap, color: "from-green-500 to-cyan-500", desc: "Beginning journey" };
  };

  const milestone = getMilestone();
  
  // Estimate time to next milestone
  const timeToNextMilestone = () => {
    const skillsToNextLevel = Math.ceil(totalSkills * 0.2);
    const remainingSkills = skillsToNextLevel - masteredSkills;
    if (remainingSkills <= 0) return "Milestone achieved!";
    return `~${remainingSkills * 2} weeks`;
  };

  // Filter nodes based on active filter
  const getFilteredNodes = (stageSkills: SkillNode[]) => {
    if (activeFilter === "all") return stageSkills;
    if (activeFilter === "mastered") return stageSkills.filter(n => n.mastery >= 80);
    if (activeFilter === "completed") return stageSkills.filter(n => n.mastery >= 50 && n.mastery < 80);
    if (activeFilter === "todo") return stageSkills.filter(n => n.is_unlocked && n.mastery < 50);
    if (activeFilter === "locked") return stageSkills.filter(n => !n.is_unlocked);
    return stageSkills;
  };

  const getSkillIcon = (node: SkillNode) => {
    if (!node.is_unlocked) return "🔒";
    if (node.mastery >= 80) return "⭐";
    if (node.mastery >= 50) return "⚡";
    return "🎯";
  };

  const getSkillStatus = (node: SkillNode) => {
    if (!node.is_unlocked) return { label: "Locked", variant: "secondary" as const };
    if (node.mastery >= 80) return { label: "Mastered", variant: "default" as const };
    if (node.mastery >= 50) return { label: "Completed", variant: "secondary" as const };
    return { label: "To-Do", variant: "outline" as const };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6 learning-card bg-gradient-to-br from-background via-primary/5 to-accent/5 border-primary/20">
        {/* Current Milestone Card */}
        <div className="mb-8">
          <div className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${milestone.color} shadow-elevated`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <milestone.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-white">
                    <div className="text-sm font-medium opacity-90 mb-1">Current Milestone</div>
                    <div className="text-3xl font-bold mb-1">{milestone.label}</div>
                    <div className="text-sm opacity-80">{milestone.desc}</div>
                  </div>
                </div>
                
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">{overallProgress}%</div>
                    <div className="text-sm text-white/80 mt-1">Overall Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">{masteredSkills}</div>
                    <div className="text-sm text-white/80 mt-1">Skills Mastered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{learningVelocity}</div>
                    <div className="text-sm text-white/80 mt-1">Learning Pace</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Path Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Active Learning */}
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold">Active Learning</h4>
                <p className="text-sm text-muted-foreground">{inProgressSkills} skills in progress</p>
              </div>
            </div>

            <div className="space-y-3">
              {activeSkills.length > 0 ? (
                activeSkills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => handleNodeClick(skill)}
                    className="w-full text-left p-4 bg-background/80 hover:bg-background rounded-xl border border-border hover:border-primary transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xl">⚡</span>
                        <span className="font-semibold group-hover:text-primary transition-colors">{skill.name}</span>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300">{skill.mastery}%</Badge>
                    </div>
                    <Progress value={skill.mastery} className="h-2" />
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Start learning to track your progress</p>
                </div>
              )}
            </div>
          </Card>

          {/* Next Steps - DYNAMIC */}
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-pink-500/10 border-orange-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold">Smart Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  {nextSkills.length > 0 ? "Skills recommended based on your progress" : "Keep learning to unlock more skills"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {nextSkills.length > 0 ? (
                nextSkills.map((skill) => {
                  // Calculate readiness based on prerequisites
                  const prerequisites = links.filter(l => l.target === skill.id);
                  const completedPrereqs = prerequisites.filter(p => 
                    nodes.find(n => n.id === p.source && n.mastery >= 80)
                  ).length;
                  const readinessPercent = prerequisites.length > 0 
                    ? Math.round((completedPrereqs / prerequisites.length) * 100)
                    : 100;

                  return (
                    <button
                      key={skill.id}
                      onClick={() => handleNodeClick(skill)}
                      className="w-full text-left p-4 bg-background/80 hover:bg-background rounded-xl border border-border hover:border-primary transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold group-hover:text-primary transition-colors">{skill.name}</span>
                        </div>
                        <Badge variant="outline">Lv {skill.difficulty}</Badge>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Readiness</span>
                          <span className="font-semibold">{readinessPercent}%</span>
                        </div>
                        <Progress value={readinessPercent} className="h-1.5" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {skill.estimated_hours}h to complete • {skill.category}
                      </p>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">All skills unlocked! Start learning to see personalized recommendations.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Achievements Section */}
        {masteredSkillsList.length > 0 && (
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold">Mastered Skills</h4>
                <p className="text-sm text-muted-foreground">{masteredSkillsList.length} skills at expert level</p>
              </div>
              <Button
                variant={activeFilter === "mastered" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(activeFilter === "mastered" ? "all" : "mastered")}
              >
                <Star className="w-4 h-4 mr-2" />
                {activeFilter === "mastered" ? "Show All" : "View All"}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {masteredSkillsList.slice(0, 8).map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => handleNodeClick(skill)}
                  className="p-4 bg-background/80 hover:bg-background rounded-xl border border-border hover:border-green-500 transition-all text-center group"
                >
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="font-semibold text-sm group-hover:text-primary transition-colors mb-1">
                    {skill.name}
                  </div>
                  <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 text-xs">
                    {skill.mastery}%
                  </Badge>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Progress Insights */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 text-center bg-gradient-to-br from-background to-primary/5">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold mb-1">{timeToNextMilestone()}</div>
            <div className="text-sm text-muted-foreground">To Next Milestone</div>
          </Card>
          
          <Card className="p-6 text-center bg-gradient-to-br from-background to-accent/5">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold mb-1">{inProgressSkills}</div>
            <div className="text-sm text-muted-foreground">Skills In Progress</div>
          </Card>
          
          <Card className="p-6 text-center bg-gradient-to-br from-background to-success/5">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold mb-1">{Math.round((masteredSkills / totalSkills) * 100)}%</div>
            <div className="text-sm text-muted-foreground">Career Completion</div>
          </Card>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5 ai-pulse" />
            <div>
              <h4 className="font-semibold mb-1">AI-Powered Learning Path</h4>
              <p className="text-sm text-muted-foreground">
                Your recommendations update automatically as you complete skills. Complete {Math.max(0, Math.ceil(totalSkills * 0.2) - masteredSkills)} more skills to reach your next milestone!
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Skill Detail Dialog */}
      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-2xl">
              <span className="text-3xl">{selectedNode && getSkillIcon(selectedNode)}</span>
              <span>{selectedNode?.name}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedNode?.category} • Level {selectedNode?.difficulty} • {selectedNode?.estimated_hours}h to master
            </DialogDescription>
          </DialogHeader>

          {selectedNode && (
            <div className="space-y-6 py-4">
              {/* Progress Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Mastery Progress</span>
                  <Badge variant={getSkillStatus(selectedNode).variant}>
                    {getSkillStatus(selectedNode).label}
                  </Badge>
                </div>
                <Progress value={selectedNode.mastery} className="h-3 mb-1" />
                <p className="text-xs text-right font-semibold text-primary">{selectedNode.mastery}%</p>
              </div>

              {/* Learning Resources */}
              <div>
                <h5 className="font-semibold mb-3 flex items-center text-lg">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" />
                  Learning Resources
                </h5>
                <div className="grid gap-3">
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <h6 className="font-medium mb-2">📚 Comprehensive Course</h6>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete {selectedNode.name} mastery program with hands-on projects
                    </p>
                    <Button 
                      className="w-full hero-gradient text-white"
                      onClick={() => {
                        setSelectedNode(null);
                        navigate('/courses');
                      }}
                    >
                      {selectedNode.mastery > 0 ? (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Continue Learning
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Start Learning
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <h6 className="font-medium mb-2">🎥 Video Tutorials</h6>
                    <p className="text-sm text-muted-foreground mb-3">
                      Step-by-step video guides and expert demonstrations
                    </p>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedNode(null);
                        navigate('/courses');
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Resources
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                <div className="flex items-start space-x-3">
                  <Brain className="w-5 h-5 text-primary mt-0.5 ai-pulse" />
                  <div>
                    <h5 className="font-semibold mb-1">AI Learning Recommendation</h5>
                    <p className="text-sm text-muted-foreground">
                      {selectedNode.mastery >= 80 
                        ? `Excellent mastery of ${selectedNode.name}! Consider teaching others or exploring advanced applications.`
                        : selectedNode.mastery >= 50
                        ? `You're progressing well with ${selectedNode.name}. Focus on practical projects to reach mastery level.`
                        : `Start with fundamentals of ${selectedNode.name}. Estimated ${selectedNode.estimated_hours}h to reach proficiency.`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold stats-counter">{selectedNode.estimated_hours}h</div>
                  <div className="text-xs text-muted-foreground">Est. Time</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold stats-counter">Lv {selectedNode.difficulty}</div>
                  <div className="text-xs text-muted-foreground">Difficulty</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold stats-counter">{selectedNode.mastery}%</div>
                  <div className="text-xs text-muted-foreground">Mastery</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
