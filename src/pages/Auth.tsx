import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Additional sign-up fields
  const [fullName, setFullName] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [careerFocus, setCareerFocus] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [activeHours, setActiveHours] = useState<string[]>([]);

  const skillOptions = [
    "JavaScript", "Python", "React", "Node.js", "Machine Learning", 
    "Data Science", "Mobile Development", "DevOps", "UI/UX Design", 
    "Database Management", "Cloud Computing", "Cybersecurity"
  ];

  const handleInterestChange = (skill: string, checked: boolean) => {
    if (checked) {
      setInterests([...interests, skill]);
    } else {
      setInterests(interests.filter(s => s !== skill));
    }
  };

  const handleActiveHoursChange = (hour: string, checked: boolean) => {
    if (checked) {
      setActiveHours([...activeHours, hour]);
    } else {
      setActiveHours(activeHours.filter(h => h !== hour));
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/dashboard", { replace: true });
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard", { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message?.toLowerCase().includes("confirm")) {
          toast({
            title: "Email confirmation required",
            description: "Disable 'Confirm email' in Supabase Auth settings to allow direct sign in.",
          });
          return;
        }
        throw error;
      }

      if (data.user?.id) {
        // Ensure a profile exists for the user
        await supabase.from("profiles").upsert({ id: data.user.id });
      }

      toast({ title: "Signed in", description: "Welcome back!" });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Sign in failed", description: err.message ?? "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!fullName || !careerGoal || interests.length === 0 || !experienceLevel) {
        toast({ 
          title: "Missing Information", 
          description: "Please fill in all required fields including interests and goals." 
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        const msg = String(error.message || "").toLowerCase();
        if (msg.includes("already") || msg.includes("exists")) {
          toast({ title: "Email already registered", description: "Try signing in instead." });
          return;
        }
        throw error;
      }

      let userId = null;

      // If email confirmation is disabled, session is returned here
      if (data.session?.user) {
        userId = data.session.user.id;
      } else {
        // If confirmation is still enabled, try to sign in immediately
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          if (signInError.message?.toLowerCase().includes("confirm")) {
            toast({
              title: "Email confirmation required",
              description: "Disable 'Confirm email' in Supabase Auth settings to sign in without verification.",
            });
            return;
          }
          throw signInError;
        }
        userId = signInData.user?.id;
      }

      if (userId) {
        // Create profile
        await supabase.from("profiles").upsert({
          id: userId,
          full_name: fullName,
        });

        // Create user preferences with collected data
        await supabase.from("user_preferences").upsert({
          user_id: userId,
          career_focus: careerFocus || 'full-stack-development',
          experience_level: experienceLevel,
          learning_style: learningStyle || 'visual',
          preferred_schedule: preferredSchedule || 'flexible',
          active_hours: activeHours.length > 0 ? activeHours : ['morning', 'evening'],
        });

        // Create initial user goals based on career goal
        await supabase.from("user_goals").insert({
          user_id: userId,
          title: careerGoal,
          description: `Achieve career goal: ${careerGoal}`,
          goal_type: 'career',
          status: 'in_progress',
          priority: 1,
        });

        // Create initial user skills based on interests
        const skillInserts = interests.map(skill => ({
          user_id: userId,
          skill_name: skill,
          category: getSkillCategory(skill),
          level: 0,
          mastery_score: 0.25, // Starting mastery as mentioned in requirements
        }));

        await supabase.from("user_skills").insert(skillInserts);

        // Initialize user stats
        await supabase.from("user_stats").insert({
          user_id: userId,
          total_learning_hours: 0,
          courses_completed: 0,
          skills_mastered: 0,
          consistency_score: 50,
          engagement_trend: 'stable',
          placement_readiness: 0,
          learning_velocity: 0,
          dropout_risk: 'low',
        });

        // Call AI personalization to initialize user data
        await supabase.functions.invoke('ai-personalization', {
          body: { 
            action: 'initialize_user',
            user_id: userId,
            preferences: {
              career_goal: careerGoal,
              interests: interests,
              experience_level: experienceLevel,
              learning_style: learningStyle,
              career_focus: careerFocus
            }
          }
        });
      }

      toast({ title: "Account created", description: "Welcome to LearnSphere! Your personalized journey begins now." });
      navigate("/dashboard");
    } catch (err: any) {
      console.error('Sign up error:', err);
      toast({ title: "Sign up failed", description: err.message ?? "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getSkillCategory = (skill: string): string => {
    const categoryMap: { [key: string]: string } = {
      'JavaScript': 'programming',
      'Python': 'programming',
      'React': 'frontend',
      'Node.js': 'backend',
      'Machine Learning': 'ai-ml',
      'Data Science': 'data',
      'Mobile Development': 'mobile',
      'DevOps': 'devops',
      'UI/UX Design': 'design',
      'Database Management': 'database',
      'Cloud Computing': 'cloud',
      'Cybersecurity': 'security'
    };
    return categoryMap[skill] || 'general';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-md mx-auto px-4 py-10">
        <Card className="p-6 learning-card">
          <h1 className="text-2xl font-bold mb-2">Account</h1>
          <p className="text-muted-foreground mb-6">Sign in or create your account</p>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
                </div>
                <Button className="w-full" disabled={loading} onClick={handleSignIn}>Sign In</Button>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input 
                    id="fullName" 
                    type="text" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="Your full name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email2">Email *</Label>
                  <Input id="email2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password2">Password *</Label>
                  <Input id="password2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="careerGoal">Career Goal *</Label>
                  <Textarea 
                    id="careerGoal" 
                    value={careerGoal} 
                    onChange={(e) => setCareerGoal(e.target.value)} 
                    placeholder="e.g., Become a Full Stack Developer, Data Scientist, etc." 
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Interests & Skills You Want to Learn *</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {skillOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={interests.includes(skill)}
                          onCheckedChange={(checked) => handleInterestChange(skill, checked as boolean)}
                        />
                        <Label htmlFor={skill} className="text-sm">{skill}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level *</Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="careerFocus">Career Focus</Label>
                  <Select value={careerFocus} onValueChange={setCareerFocus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your career focus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-stack-development">Full Stack Development</SelectItem>
                      <SelectItem value="frontend-development">Frontend Development</SelectItem>
                      <SelectItem value="backend-development">Backend Development</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                      <SelectItem value="machine-learning">Machine Learning</SelectItem>
                      <SelectItem value="mobile-development">Mobile Development</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learningStyle">Learning Style</Label>
                  <Select value={learningStyle} onValueChange={setLearningStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="How do you prefer to learn?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual">Visual (videos, diagrams)</SelectItem>
                      <SelectItem value="hands-on">Hands-on (projects, coding)</SelectItem>
                      <SelectItem value="reading">Reading (articles, documentation)</SelectItem>
                      <SelectItem value="mixed">Mixed approach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredSchedule">Preferred Schedule</Label>
                  <Select value={preferredSchedule} onValueChange={setPreferredSchedule}>
                    <SelectTrigger>
                      <SelectValue placeholder="When do you prefer to learn?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="structured">Structured daily schedule</SelectItem>
                      <SelectItem value="weekend-intensive">Weekend intensive</SelectItem>
                      <SelectItem value="evening-only">Evening only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Active Learning Hours</Label>
                  <div className="flex flex-wrap gap-2">
                    {['morning', 'afternoon', 'evening', 'night'].map((hour) => (
                      <div key={hour} className="flex items-center space-x-2">
                        <Checkbox
                          id={hour}
                          checked={activeHours.includes(hour)}
                          onCheckedChange={(checked) => handleActiveHoursChange(hour, checked as boolean)}
                        />
                        <Label htmlFor={hour} className="text-sm capitalize">{hour}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" disabled={loading} onClick={handleSignUp}>
                  Create Personalized Account
                </Button>
                <p className="text-xs text-muted-foreground">
                  * Required fields. Your personalized learning journey will be created based on this information.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default Auth;
