import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, action, data } = await req.json();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    console.log(`AI Personalization request: ${action} for user ${userId}`);

    switch (action) {
      case 'generate_roadmap':
        return await generatePersonalizedRoadmap(supabase, userId, data);
      case 'generate_job_matches':
        return await generateJobMatches(supabase, userId, data);
      case 'generate_ai_insights':
        return await generateAIInsights(supabase, userId, data);
      case 'initialize_user':
        return await initializeUserData(supabase, userId, data);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('AI Personalization Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function generatePersonalizedRoadmap(supabase: any, userId: string, data: any) {
  // Get user profile and skills
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
  const { data: skills } = await supabase.from('user_skills').select('*').eq('user_id', userId);
  const { data: goals } = await supabase.from('user_goals').select('*').eq('user_id', userId);

  const prompt = `Generate a personalized 12-week learning roadmap for a user with:
  Profile: ${JSON.stringify(profile)}
  Current Skills: ${JSON.stringify(skills)}
  Career Goals: ${JSON.stringify(goals)}
  
  Return a JSON array of 12 weeks with: week_number, title, description, topics (array), estimated_hours, status ('not_started'/'current'/'completed'), skills_focus (array)`;

  const aiResponse = await callOpenAI(prompt);
  const roadmapWeeks = JSON.parse(aiResponse);

  // Clear existing roadmap
  await supabase.from('roadmap_weeks').delete().eq('user_id', userId);

  // Insert new roadmap weeks
  const weeksWithUserId = roadmapWeeks.map((week: any) => ({
    ...week,
    user_id: userId,
    status: week.week_number === 1 ? 'current' : 'not_started'
  }));

  await supabase.from('roadmap_weeks').insert(weeksWithUserId);

  return new Response(JSON.stringify({ success: true, roadmap: weeksWithUserId }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function generateJobMatches(supabase: any, userId: string, data: any) {
  const { data: skills } = await supabase.from('user_skills').select('*').eq('user_id', userId);
  const { data: goals } = await supabase.from('user_goals').select('*').eq('user_id', userId);

  const prompt = `Generate 8 personalized job recommendations based on:
  Skills: ${JSON.stringify(skills)}
  Goals: ${JSON.stringify(goals)}
  
  Return JSON array with: title, company, location, salary_range, experience_level, match_score (0-100), required_skills (array), missing_skills (array), job_type, applicants_count, posted_days_ago, description`;

  const aiResponse = await callOpenAI(prompt);
  const jobMatches = JSON.parse(aiResponse);

  return new Response(JSON.stringify({ jobMatches }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function generateAIInsights(supabase: any, userId: string, data: any) {
  const { data: activities } = await supabase.from('learning_activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: skills } = await supabase.from('user_skills').select('*').eq('user_id', userId);

  const prompt = `Based on learning activities: ${JSON.stringify(activities)} and skills: ${JSON.stringify(skills)}, generate AI insights with:
  - learning_velocity: number (hours per week)
  - strength_areas: array of strings
  - improvement_areas: array of strings
  - recommendations: array of recommendation objects with {title, description, priority}
  - next_milestone: string
  - estimated_placement_readiness: number (0-100)`;

  const aiResponse = await callOpenAI(prompt);
  const insights = JSON.parse(aiResponse);

  // Update user stats with AI insights
  await supabase.from('user_stats').upsert({
    user_id: userId,
    placement_readiness: insights.estimated_placement_readiness,
    learning_velocity: insights.learning_velocity,
    updated_at: new Date().toISOString()
  });

  return new Response(JSON.stringify(insights), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function initializeUserData(supabase: any, userId: string, data: any) {
  const { preferences = {} } = data || {};
  
  // Initialize user preferences
  await supabase.from('user_preferences').upsert({
    user_id: userId,
    learning_style: preferences.learning_style || 'visual',
    preferred_schedule: preferences.preferred_schedule || 'flexible',
    career_focus: preferences.career_focus || 'full-stack-development',
    experience_level: preferences.experience_level || 'intermediate'
  });

  // Initialize basic skills
  const defaultSkills = [
    { skill_name: 'JavaScript', level: 60, category: 'Programming' },
    { skill_name: 'React', level: 45, category: 'Frontend' },
    { skill_name: 'Node.js', level: 30, category: 'Backend' },
    { skill_name: 'SQL', level: 25, category: 'Database' }
  ];

  for (const skill of defaultSkills) {
    await supabase.from('user_skills').upsert({
      user_id: userId,
      ...skill
    });
  }

  // Initialize career goals
  await supabase.from('user_goals').upsert({
    user_id: userId,
    goal_type: 'career',
    title: 'Become a Full-Stack Developer',
    description: 'Master both frontend and backend technologies',
    target_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress'
  });

  // Initialize user stats
  await supabase.from('user_stats').upsert({
    user_id: userId,
    placement_readiness: 35,
    learning_velocity: 8,
    total_learning_hours: 0,
    courses_completed: 0,
    skills_mastered: 0
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function callOpenAI(prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an AI career advisor. Always return valid JSON responses only, no additional text or formatting.' 
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}