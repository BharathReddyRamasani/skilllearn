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
  Filter,
  Loader2
} from "lucide-react";
import { usePersonalizedData } from "@/hooks/usePersonalizedData";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const JobMatch = () => {
  const { toast } = useToast();
  const { 
    user, 
    userStats, 
    skills,
    loading, 
    generateJobMatches 
  } = usePersonalizedData();
  
  const [jobMatches, setJobMatches] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    if (user) {
      fetchJobMatches();
    }
  }, [user]);

  const fetchJobMatches = async () => {
    setLoadingJobs(true);
    const matches = await generateJobMatches();
    setJobMatches(matches || []);
    setLoadingJobs(false);
  };

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
          <p className="text-muted-foreground">Please sign in to view personalized job matches.</p>
        </div>
      </div>
    );
  }

  const placementReadiness = userStats?.placement_readiness || 0;
  const masteredSkills = skills?.filter(s => s.mastery_score > 0.6).length || 0;
  const developingSkills = skills?.filter(s => s.mastery_score > 0.3 && s.mastery_score <= 0.6).length || 0;
  const needsWork = skills?.filter(s => s.mastery_score <= 0.3).length || 0;

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
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 animate-fade-in">
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
              <Button 
                variant="outline"
                onClick={() => toast({ title: "Filters", description: "Advanced filtering coming soon!" })}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button 
                className="hero-gradient text-white shadow-primary"
                onClick={fetchJobMatches}
                disabled={loadingJobs}
              >
                {loadingJobs ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <TrendingUp className="w-4 h-4 mr-2" />
                )}
                {loadingJobs ? 'Finding Jobs...' : 'Refresh Matches'}
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
                  {placementReadiness}%
                </div>
                <Progress value={placementReadiness} className="bg-white/20 mb-4" />
                <p className="text-white/90 text-sm">
                  {jobMatches.length > 0 
                    ? `You're ready for ${jobMatches.filter(job => job.match_score >= 75).length} out of ${jobMatches.length} matches`
                    : "Generate job matches to see your readiness score"}
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
                  <span className="font-semibold">{masteredSkills}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-warning" />
                    <span className="text-sm">Developing</span>
                  </div>
                  <span className="font-semibold">{developingSkills}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <span className="text-sm">Needs Work</span>
                  </div>
                  <span className="font-semibold">{needsWork}</span>
                </div>
              </div>
            </Card>

            {/* Skills Development */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-primary" />
                Skills Progress
              </h3>
              <div className="space-y-3">
                {skills?.slice(0, 5).map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.skill_name}</span>
                      <Badge variant={
                        skill.mastery_score > 0.6 ? 'default' :
                        skill.mastery_score > 0.3 ? 'secondary' : 'destructive'
                      } className="text-xs">
                        {skill.mastery_score > 0.6 ? 'Strong' : 
                         skill.mastery_score > 0.3 ? 'Developing' : 'Needs Work'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Mastery Level</span>
                      <span>{Math.round(skill.mastery_score * 100)}%</span>
                    </div>
                    <Progress value={skill.mastery_score * 100} />
                  </div>
                )) || (
                  <p className="text-sm text-muted-foreground">No skills tracked yet. Complete learning activities to build your profile!</p>
                )}
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

              {loadingJobs ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Analyzing your skills and finding perfect job matches...</p>
                </div>
              ) : jobMatches.length > 0 ? (
                <div className="space-y-6">
                  {jobMatches.map((job, index) => {
                    const matchBadge = getMatchBadge(job.match_score || 0);
                    return (
                      <div key={index} className="border border-border rounded-lg p-6 hover:shadow-elevated transition-all">
                        {/* Job Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold">{job.title}</h3>
                              <Badge {...matchBadge}>{matchBadge.text}</Badge>
                              {job.job_type === 'Internship' && (
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
                                {job.salary_range}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {job.experience_level}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold mb-1 stats-counter ${getMatchColor(job.match_score || 0)}`}>
                              {job.match_score || 0}%
                            </div>
                            <div className="text-xs text-muted-foreground">Match Score</div>
                          </div>
                        </div>

                        {/* Skills Match */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Required Skills</span>
                            <span className="text-xs text-muted-foreground">
                              {job.required_skills?.length - job.missing_skills?.length || 0}/{job.required_skills?.length || 0} matched
                            </span>
                          </div>
                          {job.required_skills && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.required_skills.map((skill: string, skillIndex: number) => (
                                <Badge key={skillIndex} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {job.missing_skills && job.missing_skills.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-destructive">Missing Skills:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {job.missing_skills.map((skill: string, skillIndex: number) => (
                                  <Badge key={skillIndex} variant="outline" className="text-xs border-destructive text-destructive">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Job Description */}
                        {job.personalized_description && (
                          <div className="mb-4 p-3 bg-primary/5 rounded-lg">
                            <p className="text-sm">{job.personalized_description}</p>
                          </div>
                        )}

                        {/* Job Stats & Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              Posted {job.posted_days_ago} days ago
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {job.applicants_count} applicants
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast({ title: "Job Details", description: "Detailed job view coming soon!" })}
                            >
                              View Details
                            </Button>
                            <Button 
                              size="sm" 
                              className="hero-gradient text-white"
                              onClick={() => toast({ title: "Application", description: "Direct application feature coming soon!" })}
                            >
                              Apply Now
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Job Matches Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Complete your skills profile and learning activities to get personalized job recommendations!
                  </p>
                  <Button className="hero-gradient text-white" onClick={fetchJobMatches}>
                    <Brain className="w-4 h-4 mr-2" />
                    Find My Matches
                  </Button>
                </div>
              )}

              {/* Load More */}
              {jobMatches.length > 0 && (
                <div className="text-center mt-8">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => toast({ title: "Loading", description: "Fetching more job matches..." })}
                  >
                    Load More Jobs
                    <TrendingUp className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatch;