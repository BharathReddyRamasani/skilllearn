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

  // Group skills by category for a more personalized view
  const skillsByCategory = nodes.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, SkillNode[]>);

  // Calculate category progress
  const categoryStats = Object.entries(skillsByCategory).map(([category, skills]) => {
    const totalSkills = skills.length;
    const masteredSkills = skills.filter(s => s.mastery >= 80).length;
    const inProgressSkills = skills.filter(s => s.mastery > 0 && s.mastery < 80).length;
    const lockedSkills = skills.filter(s => !s.is_unlocked).length;
    const avgMastery = skills.reduce((sum, s) => sum + (s.is_unlocked ? s.mastery : 0), 0) / totalSkills;
    
    return {
      category,
      skills,
      totalSkills,
      masteredSkills,
      inProgressSkills,
      lockedSkills,
      avgMastery: Math.round(avgMastery),
    };
  }).sort((a, b) => b.avgMastery - a.avgMastery);

  // Determine career progress level
  const getProgressLevel = () => {
    if (overallProgress >= 80) return { label: "Expert", color: "from-yellow-500 to-orange-500", icon: Trophy };
    if (overallProgress >= 60) return { label: "Advanced", color: "from-purple-500 to-pink-500", icon: Crown };
    if (overallProgress >= 40) return { label: "Intermediate", color: "from-blue-500 to-purple-500", icon: Zap };
    if (overallProgress >= 20) return { label: "Developing", color: "from-cyan-500 to-blue-500", icon: Target };
    return { label: "Beginner", color: "from-green-500 to-cyan-500", icon: GraduationCap };
  };

  const progressLevel = getProgressLevel();

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
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex-1">
              <h3 className="text-3xl font-bold flex items-center mb-2">
                <Brain className="w-8 h-8 mr-3 text-primary ai-pulse" />
                Your Learning Journey
              </h3>
              <p className="text-muted-foreground">
                Track your progress and master skills aligned with your career goals
              </p>
            </div>
            
            {/* Progress Level Badge */}
            <div className={`px-6 py-4 rounded-xl bg-gradient-to-r ${progressLevel.color} text-white shadow-lg`}>
              <div className="flex items-center gap-3">
                <progressLevel.icon className="w-8 h-8" />
                <div>
                  <div className="text-sm font-medium opacity-90">Current Level</div>
                  <div className="text-2xl font-bold">{progressLevel.label}</div>
                </div>
              </div>
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

        {/* Skills by Category */}
        <div className="space-y-6">
          {categoryStats.map((category, idx) => {
            const filteredSkills = getFilteredNodes(category.skills);
            
            if (filteredSkills.length === 0) return null;

            return (
              <div 
                key={category.category} 
                className="animate-scale-in bg-gradient-to-br from-background to-muted/30 rounded-2xl p-6 border-2 border-primary/20 shadow-card hover:shadow-elevated transition-all"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold mb-1">{category.category}</h4>
                    <p className="text-sm text-muted-foreground">
                      {category.masteredSkills} mastered • {category.inProgressSkills} in progress • {category.lockedSkills} locked
                    </p>
                  </div>
                  
                  {/* Category Progress Circle */}
                  <div className="relative w-24 h-24">
                    <svg className="transform -rotate-90 w-24 h-24">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - category.avgMastery / 100)}`}
                        className="text-primary transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">{category.avgMastery}%</span>
                    </div>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredSkills.map((skill) => {
                    const status = getSkillStatus(skill);
                    return (
                      <button
                        key={skill.id}
                        onClick={() => handleNodeClick(skill)}
                        className="text-left p-4 bg-background/60 hover:bg-background rounded-xl border border-border hover:border-primary transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2 flex-1">
                            <span className="text-2xl">{getSkillIcon(skill)}</span>
                            <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                              {skill.name}
                            </span>
                          </div>
                          <Badge variant={status.variant} className="text-xs shrink-0 ml-2">
                            {status.label}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Mastery</span>
                            <span className="font-semibold">{skill.mastery}%</span>
                          </div>
                          <Progress value={skill.mastery} className="h-2" />
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span>Lv {skill.difficulty}</span>
                          <span>{skill.estimated_hours}h</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
