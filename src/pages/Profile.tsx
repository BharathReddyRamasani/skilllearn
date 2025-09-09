import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  MapPin, 
  Calendar, 
  Trophy, 
  Target, 
  BookOpen, 
  Code, 
  Database, 
  Brain,
  Edit,
  Award,
  TrendingUp,
  Clock
} from "lucide-react";

const Profile = () => {
  const skills = [
    { name: "React.js", level: 85, category: "Frontend" },
    { name: "Node.js", level: 78, category: "Backend" },
    { name: "MongoDB", level: 72, category: "Database" },
    { name: "Machine Learning", level: 68, category: "AI/ML" },
    { name: "Python", level: 90, category: "Programming" },
    { name: "Data Structures", level: 82, category: "CS Fundamentals" }
  ];

  const achievements = [
    { title: "Course Crusher", description: "Completed 10 courses", icon: BookOpen, earned: true },
    { title: "Quiz Master", description: "100% score on 5 quizzes", icon: Brain, earned: true },
    { title: "Consistency King", description: "30-day learning streak", icon: Calendar, earned: true },
    { title: "AI Expert", description: "Master ML fundamentals", icon: Code, earned: false },
    { title: "Interview Ace", description: "Perfect mock interview", icon: Target, earned: false },
    { title: "Job Ready", description: "80%+ placement readiness", icon: Trophy, earned: false }
  ];

  const learningStats = [
    { label: "Total Hours", value: "142", icon: Clock },
    { label: "Courses Completed", value: "8", icon: BookOpen },
    { label: "Skills Mastered", value: "12", icon: Code },
    { label: "Certificates Earned", value: "5", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="learning-card p-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-2xl hero-gradient text-white">RS</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-2">Rahul Sharma</h2>
                <p className="text-muted-foreground mb-4">B.Tech Computer Science • Final Year</p>
                
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Mumbai, India
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined Jan 2024
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Placement Readiness</span>
                    <span className="font-semibold text-primary">73%</span>
                  </div>
                  <Progress value={73} />
                  <p className="text-xs text-muted-foreground">
                    You're in the top 25% of students!
                  </p>
                </div>

                <Button className="w-full mt-6" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </Card>

            {/* Learning Stats */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4">Learning Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                {learningStats.map((stat, index) => (
                  <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold stats-counter">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Career Goals */}
            <Card className="learning-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Career Goals
              </h3>
              <div className="space-y-3">
                <Badge className="hero-gradient text-white">Full Stack Developer</Badge>
                <Badge variant="outline">Machine Learning Engineer</Badge>
                <Badge variant="outline">Data Scientist</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Target companies: Google, Microsoft, Amazon, Netflix
              </p>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Overview */}
            <Card className="learning-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Skills Portfolio</h2>
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
              
              <div className="grid gap-6">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {skill.category}
                        </Badge>
                      </div>
                      <span className="text-sm font-semibold text-primary">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-primary ai-pulse" />
                  <div>
                    <h4 className="font-semibold">AI Skill Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Focus on System Design and Advanced React patterns to reach 80% placement readiness
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="learning-card p-6">
              <h2 className="text-2xl font-semibold mb-6">Achievements & Badges</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-4 rounded-lg border transition-all ${
                    achievement.earned 
                      ? 'border-primary/20 bg-primary/5' 
                      : 'border-border bg-muted/30 opacity-60'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        achievement.earned 
                          ? 'hero-gradient text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <achievement.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        {achievement.earned && (
                          <Badge className="mt-2 bg-success text-success-foreground">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Learning History */}
            <Card className="learning-card p-6">
              <h2 className="text-2xl font-semibold mb-6">Recent Learning Activity</h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Machine Learning Fundamentals",
                    type: "Course Completed",
                    date: "2 days ago",
                    score: "92%"
                  },
                  {
                    title: "React Advanced Patterns Quiz",
                    type: "Quiz Completed", 
                    date: "5 days ago",
                    score: "85%"
                  },
                  {
                    title: "System Design Basics",
                    type: "Course Started",
                    date: "1 week ago",
                    score: "In Progress"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground">{activity.type} • {activity.date}</p>
                    </div>
                    <Badge variant={activity.score === "In Progress" ? "secondary" : "default"}>
                      {activity.score}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;