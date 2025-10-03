import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Target, Calendar, Zap } from "lucide-react";

interface RoadmapGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: RoadmapFormData) => void;
  isGenerating?: boolean;
}

export interface RoadmapFormData {
  careerGoal: string;
  duration: string;
  experienceLevel: string;
  learningStyle: string;
  timeCommitment: string;
  specificSkills?: string;
}

export const RoadmapGenerationDialog = ({
  open,
  onOpenChange,
  onGenerate,
  isGenerating = false
}: RoadmapGenerationDialogProps) => {
  const [formData, setFormData] = useState<RoadmapFormData>({
    careerGoal: "",
    duration: "12",
    experienceLevel: "intermediate",
    learningStyle: "visual",
    timeCommitment: "10-15"
  });

  const handleGenerate = () => {
    onGenerate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Generate Your AI Roadmap
          </DialogTitle>
          <DialogDescription>
            Provide details to create a personalized learning path tailored to your goals and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Career Goal */}
          <div className="space-y-2">
            <Label htmlFor="careerGoal" className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Career Goal
            </Label>
            <Select
              value={formData.careerGoal}
              onValueChange={(value) => setFormData({ ...formData, careerGoal: value })}
            >
              <SelectTrigger id="careerGoal">
                <SelectValue placeholder="Select your career goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-stack-developer">Full Stack Developer</SelectItem>
                <SelectItem value="frontend-developer">Frontend Developer</SelectItem>
                <SelectItem value="backend-developer">Backend Developer</SelectItem>
                <SelectItem value="data-scientist">Data Scientist</SelectItem>
                <SelectItem value="ml-engineer">ML Engineer</SelectItem>
                <SelectItem value="devops-engineer">DevOps Engineer</SelectItem>
                <SelectItem value="mobile-developer">Mobile Developer</SelectItem>
                <SelectItem value="cloud-architect">Cloud Architect</SelectItem>
                <SelectItem value="security-engineer">Security Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Roadmap Duration (weeks)
            </Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => setFormData({ ...formData, duration: value })}
            >
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8 weeks (Intensive)</SelectItem>
                <SelectItem value="12">12 weeks (Standard)</SelectItem>
                <SelectItem value="16">16 weeks (Extended)</SelectItem>
                <SelectItem value="24">24 weeks (Comprehensive)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Select
              value={formData.experienceLevel}
              onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
            >
              <SelectTrigger id="experienceLevel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner - New to programming</SelectItem>
                <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                <SelectItem value="advanced">Advanced - Strong foundation</SelectItem>
                <SelectItem value="expert">Expert - Industry experience</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Learning Style */}
          <div className="space-y-2">
            <Label htmlFor="learningStyle">Preferred Learning Style</Label>
            <Select
              value={formData.learningStyle}
              onValueChange={(value) => setFormData({ ...formData, learningStyle: value })}
            >
              <SelectTrigger id="learningStyle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visual">Visual - Videos & diagrams</SelectItem>
                <SelectItem value="reading">Reading - Documentation & articles</SelectItem>
                <SelectItem value="hands-on">Hands-on - Projects & practice</SelectItem>
                <SelectItem value="mixed">Mixed - Combination of all</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Commitment */}
          <div className="space-y-2">
            <Label htmlFor="timeCommitment" className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Weekly Time Commitment (hours)
            </Label>
            <Select
              value={formData.timeCommitment}
              onValueChange={(value) => setFormData({ ...formData, timeCommitment: value })}
            >
              <SelectTrigger id="timeCommitment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5-10">5-10 hours (Part-time)</SelectItem>
                <SelectItem value="10-15">10-15 hours (Regular)</SelectItem>
                <SelectItem value="15-25">15-25 hours (Intensive)</SelectItem>
                <SelectItem value="25+">25+ hours (Full-time)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Specific Skills */}
          <div className="space-y-2">
            <Label htmlFor="specificSkills">
              Specific Skills (Optional)
            </Label>
            <Textarea
              id="specificSkills"
              placeholder="e.g., React, Node.js, AWS, Docker..."
              value={formData.specificSkills}
              onChange={(e) => setFormData({ ...formData, specificSkills: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              List any specific technologies or skills you want to focus on
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!formData.careerGoal || isGenerating}
            className="bg-gradient-to-r from-primary to-accent text-white"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Roadmap
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};