import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="learning-card p-12 text-center max-w-2xl w-full">
        <div className="w-24 h-24 hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Brain className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-6xl font-bold mb-4 text-gradient">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Oops! The page you're looking for doesn't exist in our learning universe.
          Let's get you back on track to your career goals.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="hero-gradient text-white shadow-primary px-8 py-3">
              <Home className="mr-2 w-5 h-5" />
              Go Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()} className="px-8 py-3">
            <ArrowLeft className="mr-2 w-5 h-5" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Lost? Try exploring our <Link to="/courses" className="text-primary hover:underline">courses</Link> or 
            check your <Link to="/dashboard" className="text-primary hover:underline ml-1">dashboard</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
