import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star, 
  Trophy,
  CheckCircle,
  ArrowRight,
  Filter,
  Search,
  Brain,
  Code,
  Database,
  Smartphone,
  Globe,
  BarChart3
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Courses = () => {
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: true });
      if (error) {
        console.log('Failed to load courses from DB:', error.message);
      }
      setDbCourses(data || []);
      setLoadingDb(false);
    })();
  }, []);

  const categories = [
    { name: "All Courses", count: 24, active: true },
    { name: "Frontend", count: 8, active: false },
    { name: "Backend", count: 6, active: false }, 
    { name: "Database", count: 4, active: false },
    { name: "AI/ML", count: 6, active: false }
  ];

  const courses = [
    {
      id: 1,
      title: "React.js Complete Masterclass",
      description: "Master React from basics to advanced patterns with hooks, context, and performance optimization",
      instructor: "Sarah Chen",
      rating: 4.8,
      students: 12847,
      duration: "18 hours",
      modules: 8,
      level: "Intermediate",
      category: "Frontend",
      price: "Free",
      progress: 75,
      enrolled: true,
      skills: ["React.js", "JavaScript", "ES6+", "Hooks"],
      icon: Globe,
      color: "text-blue-500"
    },
    {
      id: 2,
      title: "Node.js & Express Backend Development",
      description: "Build scalable backend applications with Node.js, Express, and RESTful API design",
      instructor: "Mike Rodriguez",
      rating: 4.9,
      students: 8934,
      duration: "22 hours",
      modules: 10,
      level: "Intermediate",
      category: "Backend",
      price: "₹1,999",
      progress: 0,
      enrolled: false,
      skills: ["Node.js", "Express", "REST APIs", "MongoDB"],
      icon: Code,
      color: "text-green-500"
    },
    {
      id: 3,
      title: "MongoDB Database Design & Optimization",
      description: "Learn MongoDB from fundamentals to advanced aggregations and performance tuning",
      instructor: "David Kumar",
      rating: 4.7,
      students: 6521,
      duration: "14 hours",
      modules: 6,
      level: "Beginner",
      category: "Database",
      price: "₹1,499",
      progress: 45,
      enrolled: true,
      skills: ["MongoDB", "NoSQL", "Aggregation", "Indexing"],
      icon: Database,
      color: "text-emerald-500"
    },
    {
      id: 4,
      title: "Machine Learning Fundamentals",
      description: "Introduction to ML algorithms, data preprocessing, and model evaluation techniques",
      instructor: "Dr. Priya Sharma",
      rating: 4.9,
      students: 15632,
      duration: "28 hours",
      modules: 12,
      level: "Advanced",
      category: "AI/ML",
      price: "₹2,999", 
      progress: 90,
      enrolled: true,
      skills: ["Python", "Scikit-learn", "Pandas", "NumPy"],
      icon: Brain,
      color: "text-purple-500"
    },
    {
      id: 5,
      title: "Full Stack JavaScript Development",
      description: "Complete full-stack development with MERN stack and modern deployment practices",
      instructor: "Alex Thompson",
      rating: 4.8,
      students: 9876,
      duration: "35 hours",
      modules: 15,
      level: "Advanced",
      category: "Full Stack",
      price: "₹3,499",
      progress: 0,
      enrolled: false,
      skills: ["React", "Node.js", "MongoDB", "Express"],
      icon: Code,
      color: "text-indigo-500"
    },
    {
      id: 6,
      title: "Data Structures & Algorithms Mastery",
      description: "Master DSA concepts with practical coding problems and interview preparation",
      instructor: "Rahul Gupta",
      rating: 4.9,
      students: 18543,
      duration: "32 hours",
      modules: 16,
      level: "Intermediate",
      category: "CS Fundamentals",
      price: "₹2,499",
      progress: 0,
      enrolled: false,
      skills: ["DSA", "Problem Solving", "Algorithms", "Coding"],
      icon: BarChart3,
      color: "text-orange-500"
    }
  ];

  const myEnrolledCourses = courses.filter(course => course.enrolled);
  const recommendedCourses = courses.filter(course => !course.enrolled).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center">
            <BookOpen className="mr-3 w-10 h-10 text-primary" />
            Course <span className="text-gradient ml-2">Library</span>
          </h1>
          <p className="text-muted-foreground">
            Comprehensive B.Tech courses designed for placement readiness
          </p>
        </div>

        {/* Courses from Database */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Available Courses</h2>
          </div>
          {loadingDb ? (
            <p className="text-muted-foreground">Loading from database...</p>
          ) : dbCourses.length === 0 ? (
            <Card className="p-6"><p className="text-muted-foreground">No courses available yet.</p></Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbCourses.map((c) => (
                <Card key={c.id} className="learning-card p-6">
                  <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{c.description}</p>
                  <Link to={`/courses/${c.id}`}>
                    <Button className="w-full hero-gradient text-white">
                      View Modules
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* My Learning Section */}
        {myEnrolledCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Continue Learning</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEnrolledCourses.map((course) => (
                <Card key={course.id} className="learning-card p-6 hover:shadow-elevated transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center`}>
                      <course.icon className={`w-6 h-6 ${course.color}`} />
                    </div>
                    <Badge variant={course.progress === 100 ? "default" : "secondary"}>
                      {course.progress === 100 ? "Completed" : `${course.progress}%`}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="space-y-3">
                    <Progress value={course.progress} />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{course.progress}% Complete</span>
                      <span>{course.modules} modules</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4 hero-gradient text-white">
                    {course.progress === 100 ? "Review Course" : "Continue Learning"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <Brain className="w-6 h-6 mr-2 text-primary ai-pulse" />
              AI Recommended for You
            </h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <Card key={course.id} className="learning-card p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg hero-gradient flex items-center justify-center`}>
                    <course.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white">
                    Recommended
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your learning patterns and career goals
                </p>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-warning fill-warning" />
                    {course.rating}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.students.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {course.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{course.price}</span>
                  <Button size="sm" className="hero-gradient text-white">
                    Enroll Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search courses..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={category.active ? "default" : "outline"}
                size="sm"
                className={category.active ? "hero-gradient text-white" : ""}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* All Courses */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">All Courses</h2>
          <div className="grid gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="learning-card p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Course Info */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 rounded-xl hero-gradient flex items-center justify-center flex-shrink-0`}>
                        <course.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                            <p className="text-muted-foreground">by {course.instructor}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{course.level}</Badge>
                            <Badge variant="secondary">{course.category}</Badge>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{course.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-warning fill-warning" />
                            {course.rating} ({course.students.toLocaleString()} students)
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {course.duration}
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {course.modules} modules
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {course.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="lg:w-48 flex flex-col justify-between">
                    <div className="text-center lg:text-right">
                      <div className="text-2xl font-bold text-primary mb-2">{course.price}</div>
                      {course.enrolled && (
                        <div className="mb-4">
                          <Progress value={course.progress} className="mb-2" />
                          <p className="text-sm text-muted-foreground">{course.progress}% complete</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {course.enrolled ? (
                        <Button className="w-full hero-gradient text-white">
                          {course.progress === 100 ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Continue
                            </>
                          )}
                        </Button>
                      ) : (
                        <>
                          <Button className="w-full hero-gradient text-white">
                            Enroll Now
                          </Button>
                          <Button variant="outline" className="w-full" size="sm">
                            Preview
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;