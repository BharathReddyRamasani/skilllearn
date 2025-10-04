import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Brain, Lock, CheckCircle, Clock, TrendingUp, BookOpen, Target, Zap, Star, Github, MessageSquare, X, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "./ui/progress";
import * as d3 from "d3";

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
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
    if (onNodeClick) onNodeClick(node);
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 600;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // Create gradient definitions
    const defs = svg.append("defs");
    
    // Gradient for mastered nodes
    const masteredGradient = defs.append("radialGradient")
      .attr("id", "mastered-gradient");
    masteredGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#22c55e")
      .attr("stop-opacity", 0.8);
    masteredGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#16a34a")
      .attr("stop-opacity", 1);

    // Gradient for in-progress nodes
    const progressGradient = defs.append("radialGradient")
      .attr("id", "progress-gradient");
    progressGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#fbbf24")
      .attr("stop-opacity", 0.8);
    progressGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#f59e0b")
      .attr("stop-opacity", 1);

    // Gradient for unlocked nodes
    const unlockedGradient = defs.append("radialGradient")
      .attr("id", "unlocked-gradient");
    unlockedGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3b82f6")
      .attr("stop-opacity", 0.8);
    unlockedGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#2563eb")
      .attr("stop-opacity", 1);

    // Create glow filter
    const filter = defs.append("filter")
      .attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Create simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(120)
        .strength(0.5))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Create link elements
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#3b82f6")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", (d: any) => Math.sqrt(d.weight) * 2);

    // Create node groups
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add circles to nodes
    node.append("circle")
      .attr("r", (d: SkillNode) => d.is_unlocked ? 35 : 28)
      .attr("fill", (d: SkillNode) => {
        if (!d.is_unlocked) return "url(#locked-gradient)";
        if (d.mastery >= 80) return "url(#mastered-gradient)";
        if (d.mastery >= 50) return "url(#progress-gradient)";
        return "url(#unlocked-gradient)";
      })
      .attr("stroke", (d: SkillNode) => {
        if (!d.is_unlocked) return "#64748b";
        if (d.mastery >= 80) return "#22c55e";
        if (d.mastery >= 50) return "#fbbf24";
        return "#3b82f6";
      })
      .attr("stroke-width", 3)
      .attr("filter", (d: SkillNode) => d.is_unlocked ? "url(#glow)" : "none")
      .on("click", (event, d: SkillNode) => {
        event.stopPropagation();
        handleNodeClick(d);
      });

    // Add status icons
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", "20px")
      .attr("fill", "white")
      .attr("pointer-events", "none")
      .text((d: SkillNode) => {
        if (!d.is_unlocked) return "🔒";
        if (d.mastery >= 80) return "⭐";
        if (d.mastery >= 50) return "⚡";
        return "🎯";
      });

    // Add text labels
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "50px")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("fill", "currentColor")
      .attr("pointer-events", "none")
      .text((d: SkillNode) => d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name);

    // Add status badge
    node.filter((d: SkillNode) => d.is_unlocked)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "65px")
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .attr("fill", (d: SkillNode) => {
        if (d.mastery >= 80) return "#22c55e";
        if (d.mastery >= 50) return "#fbbf24";
        return "#3b82f6";
      })
      .attr("pointer-events", "none")
      .text((d: SkillNode) => {
        if (d.mastery >= 80) return "Mastered";
        if (d.mastery >= 50) return "In Progress";
        return "To-Do";
      });

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-success';
    if (mastery >= 50) return 'text-warning';
    return 'text-primary';
  };

  const totalSkills = nodes.length;
  const masteredSkills = nodes.filter(n => n.mastery >= 80).length;
  const overallProgress = totalSkills > 0 ? Math.round((nodes.reduce((sum, n) => sum + (n.is_unlocked ? n.mastery : 0), 0) / totalSkills)) : 0;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-background via-primary/5 to-accent/5 border-primary/20">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold flex items-center mb-2">
              <Brain className="w-8 h-8 mr-3 text-primary ai-pulse" />
              Interactive Skill Graph
            </h3>
            <p className="text-muted-foreground">
              Progress: <span className={`font-bold ${getMasteryColor(overallProgress)}`}>{overallProgress}%</span> • 
              Skills Mastered: <span className="font-bold text-success">{masteredSkills}/{totalSkills}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-success/20 text-success">
              <Star className="w-3 h-3" />
              Mastered
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 bg-warning/20 text-warning">
              <CheckCircle className="w-3 h-3" />
              Completed
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 bg-primary/20 text-primary">
              <Target className="w-3 h-3" />
              To-Do
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 bg-muted">
              <Lock className="w-3 h-3" />
              Locked
            </Badge>
          </div>
        </div>

        {/* Graph Visualization */}
        <div className="relative">
          <div 
            ref={containerRef}
            className="w-full bg-gradient-to-br from-background to-muted/30 rounded-lg border-2 border-border overflow-hidden"
            style={{ minHeight: '600px' }}
          >
            {nodes.length > 0 ? (
              <svg ref={svgRef} className="w-full h-full" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No skills data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Side Panel for Selected Node */}
          {selectedNode && (
            <div className="absolute top-4 right-4 w-80 bg-card border-2 border-primary rounded-lg shadow-elevated p-6 animate-in slide-in-from-right">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-bold">{selectedNode.name}</h4>
                    {selectedNode.mastery >= 80 && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                  </div>
                  <Badge variant={
                    selectedNode.mastery >= 80 ? "default" : 
                    selectedNode.mastery >= 50 ? "secondary" : "outline"
                  }>
                    {selectedNode.mastery >= 80 ? "Mastered" : 
                     selectedNode.mastery >= 50 ? "In Progress" : "To-Do"}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedNode.category} • Level {selectedNode.difficulty}
                  </p>
                  <Progress value={selectedNode.mastery} className="h-2 mb-1" />
                  <p className="text-xs text-right font-semibold">{selectedNode.mastery}%</p>
                </div>

                <div>
                  <h5 className="font-semibold mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learning Resources
                  </h5>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => navigate('/courses')}
                    >
                      <BookOpen className="w-3 h-3 mr-2" />
                      [Guide] {selectedNode.name} Fundamentals
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => navigate('/courses')}
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      [Video Tutorial] Advanced Concepts
                    </Button>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Your Task / Evidence
                  </h5>
                  <div className="p-3 bg-muted/50 rounded text-sm">
                    <p className="text-muted-foreground mb-2">
                      Complete practical projects demonstrating {selectedNode.name} mastery
                    </p>
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      <Github className="w-3 h-3 mr-1" />
                      [Link to commit on GitHub]
                    </Button>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Mentor Feedback
                  </h5>
                  <div className="p-3 bg-primary/10 rounded text-sm">
                    <p className="italic">
                      "Great progress! {selectedNode.mastery >= 80 ? 'Excellent mastery achieved!' : 'Keep practicing to improve your skills.'}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Estimated time to mastery: {selectedNode.estimated_hours}h
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => navigate('/courses')}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Start Learning
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/courses')}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Resources
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Interactive Graph Guide</h4>
              <p className="text-sm text-muted-foreground">
                Click on any skill node to view detailed information, learning resources, and tasks. 
                Drag nodes to reorganize the graph. Connected skills show prerequisite relationships.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
