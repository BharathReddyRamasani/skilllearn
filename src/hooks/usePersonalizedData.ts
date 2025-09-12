import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserStats {
  placement_readiness: number;
  learning_velocity: number;
  total_learning_hours: number;
  courses_completed: number;
  skills_mastered: number;
  consistency_score: number;
  dropout_risk: string;
  engagement_trend: string;
}

export interface UserSkill {
  id: string;
  skill_name: string;
  level: number;
  category: string;
  mastery_score: number;
  last_practiced: string;
  decay_rate: number;
  reinforcement_count: number;
}

export interface UserGoal {
  id: string;
  goal_type: string;
  title: string;
  description: string;
  target_date: string;
  status: string;
  priority: number;
}

export interface LearningActivity {
  id: string;
  activity_type: string;
  title: string;
  duration_minutes: number;
  accuracy_score: number;
  difficulty_level: string;
  skills_practiced: string[];
  engagement_score: number;
  completed_at: string;
}

export interface AIRecommendation {
  id: string;
  recommendation_type: string;
  title: string;
  description: string;
  priority: number;
  is_active: boolean;
  metadata: any;
}

export interface RoadmapWeek {
  id: string;
  week_number: number;
  title: string;
  description: string;
  topics: string[];
  estimated_hours: number;
  status: string;
  skills_focus: string[];
  completion_percentage: number;
}

export interface InterviewSession {
  id: string;
  interview_type: string;
  questions: any;
  responses: any;
  overall_score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  duration_minutes: number;
  completed_at: string;
}

export const usePersonalizedData = () => {
  const [user, setUser] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [roadmapWeeks, setRoadmapWeeks] = useState<RoadmapWeek[]>([]);
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        setLoading(false);
        return;
      }

      setUser(authUser);

      // Check if user data exists, if not initialize
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (!existingStats) {
        await initializeNewUser(authUser.id);
      }

      await fetchAllUserData(authUser.id);
    } catch (error) {
      console.error('Error initializing user:', error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeNewUser = async (userId: string) => {
    try {
      await supabase.functions.invoke('ai-personalization', {
        body: {
          userId,
          action: 'initialize_user',
          data: {
            preferences: {
              learning_style: 'visual',
              career_focus: 'full-stack-development',
              experience_level: 'intermediate'
            }
          }
        }
      });
    } catch (error) {
      console.error('Error initializing new user:', error);
    }
  };

  const fetchAllUserData = async (userId: string) => {
    try {
      const [
        statsResponse,
        skillsResponse,
        goalsResponse,
        activitiesResponse,
        recommendationsResponse,
        roadmapResponse,
        interviewsResponse
      ] = await Promise.all([
        supabase.from('user_stats').select('*').eq('user_id', userId).single(),
        supabase.from('user_skills').select('*').eq('user_id', userId),
        supabase.from('user_goals').select('*').eq('user_id', userId),
        supabase.from('learning_activities').select('*').eq('user_id', userId).order('completed_at', { ascending: false }).limit(10),
        supabase.from('ai_recommendations').select('*').eq('user_id', userId).eq('is_active', true),
        supabase.from('roadmap_weeks').select('*').eq('user_id', userId).order('week_number'),
        supabase.from('interview_sessions').select('*').eq('user_id', userId).order('completed_at', { ascending: false }).limit(5)
      ]);

      setUserStats(statsResponse.data);
      setSkills(skillsResponse.data || []);
      setGoals(goalsResponse.data || []);
      setActivities(activitiesResponse.data || []);
      setRecommendations(recommendationsResponse.data || []);
      setRoadmapWeeks(roadmapResponse.data || []);
      setInterviewSessions(interviewsResponse.data || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const generatePersonalizedRoadmap = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-personalization', {
        body: {
          userId: user.id,
          action: 'generate_roadmap',
          data: {}
        }
      });

      if (error) throw error;
      
      await fetchAllUserData(user.id);
      toast({
        title: "Success",
        description: "Personalized roadmap generated!",
      });
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast({
        title: "Error",
        description: "Failed to generate roadmap",
        variant: "destructive",
      });
    }
  };

  const generateJobMatches = async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-personalization', {
        body: {
          userId: user.id,
          action: 'generate_job_matches',
          data: {}
        }
      });

      if (error) throw error;
      return data.jobMatches;
    } catch (error) {
      console.error('Error generating job matches:', error);
      return [];
    }
  };

  const generateAIInsights = async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-personalization', {
        body: {
          userId: user.id,
          action: 'generate_ai_insights',
          data: {}
        }
      });

      if (error) throw error;
      
      await fetchAllUserData(user.id);
      return data;
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return null;
    }
  };

  const trackLearningActivity = async (activityData: Partial<LearningActivity>) => {
    if (!user || !activityData.activity_type || !activityData.title) return;

    try {
      await supabase.from('learning_activities').insert({
        user_id: user.id,
        activity_type: activityData.activity_type,
        title: activityData.title,
        duration_minutes: activityData.duration_minutes,
        accuracy_score: activityData.accuracy_score,
        difficulty_level: activityData.difficulty_level || 'medium',
        skills_practiced: activityData.skills_practiced || [],
        engagement_score: activityData.engagement_score || 50
      });

      // Update user stats
      await supabase.from('user_stats').update({
        total_learning_hours: (userStats?.total_learning_hours || 0) + (activityData.duration_minutes || 0) / 60,
        last_activity: new Date().toISOString()
      }).eq('user_id', user.id);

      await fetchAllUserData(user.id);
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  return {
    user,
    userStats,
    skills,
    goals,
    activities,
    recommendations,
    roadmapWeeks,
    interviewSessions,
    loading,
    generatePersonalizedRoadmap,
    generateJobMatches,
    generateAIInsights,
    trackLearningActivity,
    refreshData: () => user && fetchAllUserData(user.id)
  };
};