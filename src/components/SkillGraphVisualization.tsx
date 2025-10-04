import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Brain, Lock, CheckCircle, Target, Zap, Star, BookOpen, GraduationCap, Trophy, Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

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
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
    if (onNodeClick) onNodeClick(node);
  };

  // Categorize skills into 5 career stages
  const stages = [
    {
      id: 1,
      title: "Foundation",
      subtitle: "Stage 1",
      description: "Acquiring initial skills and experience",
      icon: GraduationCap,
      color: "from-cyan-400 to-blue-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
      borderColor: "border-cyan-500",
      skills: nodes.filter(n => n.difficulty <= 2),
    },
    {
      id: 2,
      title: "Early Professional",
      subtitle: "Stage 2",
      description: "Enhancing job-specific skills and expertise",
      icon: Target,
      color: "from-blue-500 to-purple-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-500",
      skills: nodes.filter(n => n.difficulty > 2 && n.difficulty <= 4),
    },
    {
      id: 3,
      title: "Advancement",
      subtitle: "Stage 3",
      description: "Taking on more responsibility and complex projects",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-500",
      skills: nodes.filter(n => n.difficulty > 4 && n.difficulty <= 6),
    },
    {
      id: 4,
      title: "Leadership",
      subtitle: "Stage 4",
      description: "Driving strategic decisions and leading teams",
      icon: Crown,
      color: "from-pink-500 to-orange-500",
      bgColor: "bg-pink-50 dark:bg-pink-950/30",
      borderColor: "border-pink-500",
      skills: nodes.filter(n => n.difficulty > 6 && n.difficulty <= 8),
    },
    {
      id: 5,
      title: "Influence",
      subtitle: "Stage 5",
      description: "Shaping the organization and industry standards",
      icon: Trophy,
      color: "from-orange-500 to-yellow-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      borderColor: "border-orange-500",
      skills: nodes.filter(n => n.difficulty > 8),
    },
  ];

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

  const totalSkills = nodes.length;
  const masteredSkills = nodes.filter(n => n.mastery >= 80).length;
  const overallProgress = totalSkills > 0 ? Math.round((nodes.reduce((sum, n) => sum + (n.is_unlocked ? n.mastery : 0), 0) / totalSkills)) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6 learning-card bg-gradient-to-br from-background via-primary/5 to-accent/5 border-primary/20">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-3xl font-bold flex items-center mb-2">
                <Brain className="w-8 h-8 mr-3 text-primary ai-pulse" />
                5-Stages Career Development Journey
              </h3>
              <p className="text-muted-foreground">
                Career development is an ongoing journey of self-assessment, skill acquisition, and navigating opportunities
              </p>
            </div>
          </div>

          {/* Stats and Filters */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Progress: </span>
                <span className="font-bold text-primary">{overallProgress}%</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Skills Mastered: </span>
                <span className="font-bold text-success">{masteredSkills}/{totalSkills}</span>
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
              >
                All
              </Button>
              <Button
                variant={activeFilter === "mastered" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("mastered")}
                className={activeFilter === "mastered" ? "bg-success hover:bg-success/90" : ""}
              >
                <Star className="w-3 h-3 mr-1" />
                Mastered
              </Button>
              <Button
                variant={activeFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("completed")}
                className={activeFilter === "completed" ? "bg-warning hover:bg-warning/90" : ""}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Button>
              <Button
                variant={activeFilter === "todo" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("todo")}
              >
                <Target className="w-3 h-3 mr-1" />
                To-Do
              </Button>
              <Button
                variant={activeFilter === "locked" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("locked")}
                className={activeFilter === "locked" ? "bg-muted hover:bg-muted/90" : ""}
              >
                <Lock className="w-3 h-3 mr-1" />
                Locked
              </Button>
            </div>
          </div>
        </div>

        {/* 5-Stage Journey Visualization */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500 opacity-20 hidden lg:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {stages.map((stage, stageIndex) => {
              const filteredSkills = getFilteredNodes(stage.skills);
              const stageProgress = stage.skills.length > 0 
                ? Math.round((stage.skills.reduce((sum, n) => sum + n.mastery, 0) / stage.skills.length))
                : 0;

              return (
                <div key={stage.id} className="relative animate-scale-in" style={{ animationDelay: `${stageIndex * 100}ms` }}>
                  {/* Stage Card */}
                  <div className={`${stage.bgColor} border-2 ${stage.borderColor} rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all relative overflow-hidden`}>
                    {/* Stage Icon Circle */}
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${stage.color} flex items-center justify-center shadow-lg relative z-10`}>
                      <stage.icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Arrow Connector */}
                    {stageIndex < stages.length - 1 && (
                      <div className="hidden lg:block absolute -right-4 top-20 z-20">
                        <div className={`w-8 h-8 bg-gradient-to-r ${stage.color} rounded-full flex items-center justify-center shadow-lg`}>
                          <span className="text-white text-xl">→</span>
                        </div>
                      </div>
                    )}

                    {/* Stage Info */}
                    <div className="text-center mb-4">
                      <Badge className={`bg-gradient-to-r ${stage.color} text-white mb-2`}>
                        {stage.subtitle}
                      </Badge>
                      <h4 className="text-xl font-bold mb-2">{stage.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        {stage.description}
                      </p>
                      
                      {/* Progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{stageProgress}%</span>
                        </div>
                        <Progress value={stageProgress} className="h-2" />
                      </div>
                    </div>

                    {/* Skills in Stage */}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {filteredSkills.length > 0 ? (
                        filteredSkills.map((skill) => {
                          const status = getSkillStatus(skill);
                          return (
                            <button
                              key={skill.id}
                              onClick={() => handleNodeClick(skill)}
                              className="w-full text-left p-3 bg-background/60 hover:bg-background rounded-lg border border-border hover:border-primary transition-all group"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2 flex-1">
                                  <span className="text-lg">{getSkillIcon(skill)}</span>
                                  <span className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                    {skill.name}
                                  </span>
                                </div>
                                <Badge variant={status.variant} className="text-xs shrink-0">
                                  {status.label}
                                </Badge>
                              </div>
                              <Progress value={skill.mastery} className="h-1.5" />
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-xs text-center text-muted-foreground py-4">
                          {activeFilter !== "all" ? "No skills match this filter" : "No skills in this stage yet"}
                        </p>
                      )}
                    </div>

                    {/* Stage Stats */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{filteredSkills.length} skills</span>
                        <span>{filteredSkills.filter(s => s.mastery >= 80).length} mastered</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5 ai-pulse" />
            <div>
              <h4 className="font-semibold mb-1">Interactive Journey Guide</h4>
              <p className="text-sm text-muted-foreground">
                Click on any skill to view detailed information and start learning. Use the filter buttons above to view skills by status. 
                Progress through each stage by mastering skills to advance your career!
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
