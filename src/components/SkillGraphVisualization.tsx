import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Brain, Lock, CheckCircle, Clock, TrendingUp } from "lucide-react";
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
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: Math.min(600, window.innerHeight * 0.6)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    // Create color scale for mastery
    const colorScale = d3.scaleSequential()
      .domain([0, 100])
      .interpolator(d3.interpolateRgb("#ef4444", "#22c55e"));

    // Create simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Create container group
    const container = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Draw links
    const link = container.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#64748b")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", (d: any) => d.weight * 2);

    // Draw nodes
    const node = container.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add circles for nodes
    node.append("circle")
      .attr("r", (d: any) => d.is_unlocked ? 25 : 20)
      .attr("fill", (d: any) => {
        if (!d.is_unlocked) return "#94a3b8";
        return colorScale(d.mastery);
      })
      .attr("stroke", (d: any) => {
        const isRecommended = recommendations.some(r => r.skill_id === d.id);
        return isRecommended ? "#8b5cf6" : "#fff";
      })
      .attr("stroke-width", (d: any) => {
        const isRecommended = recommendations.some(r => r.skill_id === d.id);
        return isRecommended ? 4 : 2;
      })
      .style("cursor", "pointer")
      .on("click", (event, d: any) => {
        setSelectedNode(d);
        if (onNodeClick) onNodeClick(d);
      });

    // Add text labels
    node.append("text")
      .text((d: any) => d.name.substring(0, 10))
      .attr("x", 0)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#64748b");

    // Add mastery percentage
    node.append("text")
      .text((d: any) => d.is_unlocked ? `${d.mastery}%` : "🔒")
      .attr("x", 0)
      .attr("y", 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#fff");

    // Update positions on simulation tick
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
  }, [nodes, links, dimensions, recommendations, onNodeClick]);

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary" />
            Interactive Skill Graph
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Mastered
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-gray-500" />
              Locked
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-purple-500" />
              Recommended
            </Badge>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden bg-background/50">
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            style={{ background: 'transparent' }}
          />
        </div>

        <div className="mt-4 text-sm text-muted-foreground flex items-center gap-4">
          <span>💡 Click nodes to view details</span>
          <span>🖱️ Drag to rearrange</span>
          <span>🔍 Scroll to zoom</span>
        </div>
      </Card>

      {selectedNode && (
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-semibold mb-2">{selectedNode.name}</h4>
              <div className="flex gap-2">
                <Badge variant="secondary">{selectedNode.category}</Badge>
                <Badge variant="outline">Level {selectedNode.difficulty}</Badge>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {selectedNode.estimated_hours}h
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary mb-1">
                {selectedNode.mastery}%
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedNode.is_unlocked ? "Unlocked" : "Locked"}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-muted-foreground mb-2">Mastery Progress</div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                style={{ width: `${selectedNode.mastery}%` }}
              />
            </div>
          </div>

          {recommendations.some(r => r.skill_id === selectedNode.id) && (
            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">Recommended for You</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                All prerequisites met. Great next step in your learning journey!
              </p>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Button className="flex-1" disabled={!selectedNode.is_unlocked || selectedNode.mastery >= 100}>
              Start Learning
            </Button>
            <Button variant="outline" disabled={!selectedNode.is_unlocked}>
              View Resources
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
