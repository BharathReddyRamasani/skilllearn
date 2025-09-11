import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Brain, 
  Home, 
  BarChart3, 
  User, 
  Map, 
  Briefcase, 
  BookOpen, 
  MessageSquare,
  Menu,
  X
} from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthed(!!session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthed(!!session);
    });

    supabase.from('courses').select('id', { count: 'exact', head: true }).then(({ error }) => {
      if (error) {
        console.log('Supabase DB connection failed:', error.message);
      } else {
        console.log('Supabase DB connected');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/roadmap", icon: Map, label: "AI Roadmap" },
    { path: "/jobs", icon: Briefcase, label: "Job Match" },
    { path: "/courses", icon: BookOpen, label: "Courses" },
    { path: "/interview", icon: MessageSquare, label: "Mock Interview" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">LearnSphere</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center space-x-2 ${
                    isActive(item.path) 
                      ? "hero-gradient text-white shadow-primary" 
                      : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthed ? (
              <Button size="sm" onClick={handleSignOut}>
                Logout
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button size="sm" className="hero-gradient text-white shadow-primary" onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start flex items-center space-x-2 ${
                      isActive(item.path) 
                        ? "hero-gradient text-white" 
                        : ""
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
              <div className="pt-4 border-t border-border space-y-2">
                {isAuthed ? (
                  <Button size="sm" className="w-full" onClick={() => { setIsOpen(false); handleSignOut(); }}>
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => { setIsOpen(false); navigate('/auth'); }}>
                      Sign In
                    </Button>
                    <Button size="sm" className="w-full hero-gradient text-white" onClick={() => { setIsOpen(false); navigate('/auth'); }}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;