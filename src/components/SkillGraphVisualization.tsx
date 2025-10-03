import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Brain, Lock, CheckCircle, Clock, TrendingUp, BookOpen, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "./ui/progress";

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

export const SkillGraphVisualization = ({ 
  nodes, 
  links, 
  onNodeClick,
  recommendations = []
}: SkillGraphProps) => {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');

  // Group skills by category
  const skillsByCategory = nodes.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, SkillNode[]>);

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
    if (onNodeClick) onNodeClick(node);
  };

  const getStatusColor = (node: SkillNode) => {
    if (!node.is_unlocked) return 'border-muted bg-muted/20';
    if (node.mastery >= 80) return 'border-success bg-success/10';
    if (node.mastery >= 50) return 'border-primary bg-primary/10';
    return 'border-accent bg-accent/10';
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-success';
    if (mastery >= 50) return 'text-primary';
    return 'text-accent';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-accent/5 to-background border-primary/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold flex items-center mb-2">
              <Brain className="w-8 h-8 mr-3 text-primary" />
              Your Skill Journey
            </h3>
            <p className="text-muted-foreground">Track your progress across different skill domains</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-success/20 text-success-foreground">
              <CheckCircle className="w-3 h-3" />
              Mastered (80%+)
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 bg-primary/20 text-primary-foreground">
              <TrendingUp className="w-3 h-3" />
              Learning (50-79%)
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 bg-muted">
              <Lock className="w-3 h-3" />
              Locked
            </Badge>
          </div>
        </div>

        {/* Category-based skill display */}
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, categoryNodes]) => {
            const categoryProgress = categoryNodes.reduce((sum, node) => sum + (node.is_unlocked ? node.mastery : 0), 0) / categoryNodes.length;
            const unlockedCount = categoryNodes.filter(n => n.is_unlocked).length;
            
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-primary" />
                    <h4 className="text-xl font-semibold">{category}</h4>
                    <Badge variant="outline">
                      {unlockedCount}/{categoryNodes.length} Unlocked
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Category Progress:</span>
                    <span className={`text-lg font-bold ${getMasteryColor(categoryProgress)}`}>
                      {Math.round(categoryProgress)}%
                    </span>
                  </div>
                </div>

                <Progress value={categoryProgress} className="h-2" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryNodes.map((node) => {
                    const isRecommended = recommendations.some(r => r.skill_id === node.id);
                    const isSelected = selectedNode?.id === node.id;
                    
                    return (
                      <Card
                        key={node.id}
                        className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 ${
                          isSelected ? 'ring-2 ring-primary shadow-xl' : ''
                        } ${getStatusColor(node)} ${
                          isRecommended ? 'border-accent shadow-accent/20' : ''
                        }`}
                        onClick={() => handleNodeClick(node)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {!node.is_unlocked ? (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              ) : node.mastery >= 80 ? (
                                <CheckCircle className="w-4 h-4 text-success" />
                              ) : (
                                <Zap className="w-4 h-4 text-primary" />
                              )}
                              <h5 className="font-semibold text-sm line-clamp-1">{node.name}</h5>
                            </div>
                            {isRecommended && (
                              <Badge variant="secondary" className="mb-2 text-xs bg-accent/20">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <div className={`text-2xl font-bold ${getMasteryColor(node.mastery)}`}>
                            {node.is_unlocked ? `${node.mastery}%` : '🔒'}
                          </div>
                        </div>

                        {node.is_unlocked && (
                          <Progress value={node.mastery} className="h-1.5 mb-3" />
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{node.estimated_hours}h</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Level {node.difficulty}
                          </Badge>
                        </div>

                        {node.is_unlocked && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <Button
                              size="sm"
                              className="w-full"
                              variant={node.mastery >= 100 ? "outline" : "default"}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/courses');
                              }}
                            >
                              <BookOpen className="w-3 h-3 mr-1" />
                              {node.mastery >= 100 ? 'Review' : 'Continue Learning'}
                            </Button>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">AI Learning Tip</h4>
              <p className="text-sm text-muted-foreground">
                Click on any skill card to view detailed information and start your learning journey. 
                Skills marked as "Recommended" are perfect next steps based on your current progress!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
