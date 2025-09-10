import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Roadmap from "./pages/Roadmap";
import JobMatch from "./pages/JobMatch";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import MockInterview from "./pages/MockInterview";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import RequireAuth from "./components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/roadmap" element={<RequireAuth><Roadmap /></RequireAuth>} />
          <Route path="/jobs" element={<RequireAuth><JobMatch /></RequireAuth>} />
          <Route path="/courses" element={<RequireAuth><Courses /></RequireAuth>} />
          <Route path="/courses/:id" element={<RequireAuth><CourseDetail /></RequireAuth>} />
          <Route path="/interview" element={<RequireAuth><MockInterview /></RequireAuth>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
