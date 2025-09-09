import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users,
  ArrowRight,
  Briefcase,
  Star,
  AlertTriangle,
  CheckCircle,
  Brain,
  Filter
} from "lucide-react";

const JobMatch = () => {
  const jobMatches = [
    {
      id: 1,
      title: "Full Stack Developer",
      company: "TechCorp Solutions",
      location: "Bangalore, India",
      salary: "₹12-18 LPA",
      experience: "0-2 years",
      matchScore: 87,
      skills: ["React.js", "Node.js", "MongoDB", "JavaScript"],
      missingSkills: ["Docker", "AWS"],
      type: "Full Time",
      posted: "2 days ago",
      applicants: 124
    },
    {
      id: 2,
      title: "Software Engineer - Frontend",
      company: "InnovateTech",
      location: "Hyderabad, India", 
      salary: "₹10-15 LPA",
      experience: "0-1 years",
      matchScore: 82,
      skills: ["React.js", "TypeScript", "CSS3", "JavaScript"],
      missingSkills: ["Next.js", "GraphQL"],
      type: "Full Time",
      posted: "1 week ago",
      applicants: 89
    },
    {
      id: 3,
      title: "Backend Developer",
      company: "DataFlow Systems",
      location: "Mumbai, India",
      salary: "₹14-20 LPA", 
      experience: "1-3 years",
      matchScore: 75,
      skills: ["Node.js", "MongoDB", "Python", "REST APIs"],
      missingSkills: ["Microservices", "Kubernetes", "Redis"],
      type: "Full Time",
      posted: "3 days ago",
      applicants: 156
    },
    {
      id: 4,
      title: "ML Engineer Intern",
      company: "AI Innovations",
      location: "Pune, India",
      salary: "₹40-60K/month",
      experience: "0-1 years", 
      matchScore: 68,
      skills: ["Python", "Machine Learning", "TensorFlow"],
      missingSkills: ["Deep Learning", "PyTorch", "MLOps"],
      type: "Internship",
      posted: "5 days ago",
      applicants: 203
    }
  ];

  const skillAnalysis = {
    totalSkills: 24,
    masteredSkills: 18,
    inProgressSkills: 4,
    missingSkills: 2,
    placementReadiness: 73
  };

  const topMissingSkills = [
    { skill: "System Design", demand: 89, urgency: "High" },
    { skill: "Docker", demand: 76, urgency: "Medium" },
    { skill: "AWS/Cloud", demand: 82, urgency: "High" },
    { skill: "Microservices", demand: 71, urgency: "Medium" },
    { skill: "GraphQL", demand: 54, urgency: "Low" }
  ];

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getMatchBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "Excellent Match" };
    if (score >= 70) return { variant: "secondary" as const, text: "Good Match" };
    return { variant: "outline" as const, text: "Fair Match" };
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
                <Target className="mr-3 w-10 h-10 text-primary" />
                AI Job <span className="text-gradient ml-2">Matching</span>
              </h1>
              <p className="text-muted-foreground">
                ML-powered cosine similarity matching based on your skill profile
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button className="hero-gradient text-white shadow-primary">
                <TrendingUp className="w-4 h-4 mr-2" />
                Improve Score
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Analytics */}
          <div className="lg:col-span-1 space-y-6">
            {/* Placement Readiness */}
            <Card className="learning-card p-6 hero-gradient text-white">
              <div className="text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-4 ai-pulse" />
                <h2 className="text-xl font-bold mb-2">Placement Readiness</h2>
                <div className="text-4xl font-bold mb-2 stats-counter">
                  {skillAnalysis.placementReadiness}%
                </div>
                <Progress value={skillAnalysis.placementReadiness} className="bg-white/20 mb-4" />
                <p className="text-white/90 text-sm">
                  You're ready for {jobMatches.filter(job => job.matchScore >= 75).length} out of {jobMatches.length} matches
                </p>
              </div>
            </Card>

            {/* Skill Breakdown */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4">Skill Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm">Mastered Skills</span>
                  </div>
                  <span className="font-semibold">{skillAnalysis.masteredSkills}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-warning" />
                    <span className="text-sm">In Progress</span>
                  </div>
                  <span className="font-semibold">{skillAnalysis.inProgressSkills}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <span className="text-sm">Missing Skills</span>
                  </div>
                  <span className="font-semibold">{skillAnalysis.missingSkills}</span>
                </div>
              </div>
            </Card>

            {/* Top Missing Skills */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-primary" />
                Priority Skills
              </h3>
              <div className="space-y-3">
                {topMissingSkills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.skill}</span>
                      <Badge variant={
                        skill.urgency === 'High' ? 'destructive' :
                        skill.urgency === 'Medium' ? 'default' : 'secondary'
                      } className="text-xs">
                        {skill.urgency}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Market Demand</span>
                      <span>{skill.demand}%</span>
                    </div>
                    <Progress value={skill.demand} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4">Market Insights</h3>
              <div className="space-y-4">
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success stats-counter">2.3x</div>
                  <div className="text-xs text-muted-foreground">Higher callback rate</div>
                  <div className="text-xs text-muted-foreground">with 80%+ match</div>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary stats-counter">156</div>
                  <div className="text-xs text-muted-foreground">New jobs this week</div>
                  <div className="text-xs text-muted-foreground">matching your profile</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content - Job Listings */}
          <div className="lg:col-span-2">
            <Card className="learning-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Recommended Jobs</h2>
                <div className="text-sm text-muted-foreground">
                  Updated {Math.floor(Math.random() * 12) + 1} minutes ago
                </div>
              </div>

              <div className="space-y-6">
                {jobMatches.map((job) => {
                  const matchBadge = getMatchBadge(job.matchScore);
                  return (
                    <div key={job.id} className="border border-border rounded-lg p-6 hover:shadow-elevated transition-all">
                      {/* Job Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <Badge {...matchBadge}>{matchBadge.text}</Badge>
                            {job.type === 'Internship' && (
                              <Badge variant="outline">Internship</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground font-medium">{job.company}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {job.salary}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job.experience}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold mb-1 stats-counter ${getMatchColor(job.matchScore)}`}>
                            {job.matchScore}%
                          </div>
                          <div className="text-xs text-muted-foreground">Match Score</div>
                        </div>
                      </div>

                      {/* Skills Match */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Required Skills</span>
                          <span className="text-xs text-muted-foreground">
                            {job.skills.length - job.missingSkills.length}/{job.skills.length} matched
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        {job.missingSkills.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-destructive">Missing Skills:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {job.missingSkills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-destructive text-destructive">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Job Stats & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Posted {job.posted}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {job.applicants} applicants
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm" className="hero-gradient text-white">
                            Apply Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Jobs
                  <TrendingUp className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatch;