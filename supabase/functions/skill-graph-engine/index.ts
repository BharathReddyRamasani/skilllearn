import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, action } = await req.json();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    console.log(`Skill Graph Engine: ${action} for user ${userId}`);

    switch (action) {
      case 'get_graph_data':
        return await getGraphData(supabase, userId);
      case 'get_recommendations':
        return await getRecommendations(supabase, userId);
      case 'update_skill_mastery':
        return await updateSkillMastery(supabase, userId);
      case 'unlock_skills':
        return await unlockSkills(supabase, userId);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Skill Graph Engine Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function getGraphData(supabase: any, userId: string) {
  // Fetch all skills and dependencies
  const { data: skills } = await supabase.from('skills').select('*');
  const { data: dependencies } = await supabase.from('skill_dependencies').select('*');
  const { data: userSkills } = await supabase.from('user_skill_graph').select('*').eq('user_id', userId);
  const { data: clusters } = await supabase.from('skill_clusters').select('*');
  const { data: clusterMapping } = await supabase.from('skill_cluster_mapping').select('*');

  // Build graph structure
  const nodes = skills.map((skill: any) => {
    const userSkill = userSkills?.find((us: any) => us.skill_id === skill.id);
    const cluster = clusterMapping?.find((cm: any) => cm.skill_id === skill.id);
    
    return {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      difficulty: skill.difficulty,
      estimated_hours: skill.estimated_hours,
      mastery: userSkill?.mastery_level || 0,
      is_unlocked: userSkill?.is_unlocked || false,
      last_practiced: userSkill?.last_practiced,
      cluster_id: cluster?.cluster_id,
      description: skill.description
    };
  });

  const links = dependencies.map((dep: any) => ({
    source: dep.prerequisite_id,
    target: dep.skill_id,
    weight: dep.weight
  }));

  const clusterData = clusters?.map((c: any) => ({
    id: c.id,
    name: c.name,
    career_path: c.career_path,
    description: c.description
  })) || [];

  return new Response(JSON.stringify({ 
    nodes, 
    links, 
    clusters: clusterData 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getRecommendations(supabase: any, userId: string) {
  // Get user's mastered skills
  const { data: userSkills } = await supabase
    .from('user_skill_graph')
    .select('skill_id, mastery_level')
    .eq('user_id', userId)
    .gte('mastery_level', 70);

  const masteredSkillIds = userSkills?.map((us: any) => us.skill_id) || [];

  // Get all skills with prerequisites
  const { data: skills } = await supabase.from('skills').select('*');
  const { data: dependencies } = await supabase
    .from('skill_dependencies')
    .select('skill_id, prerequisite_id, weight');

  // Build prerequisite map
  const prerequisiteMap: Record<string, string[]> = {};
  dependencies?.forEach((dep: any) => {
    if (!prerequisiteMap[dep.skill_id]) {
      prerequisiteMap[dep.skill_id] = [];
    }
    prerequisiteMap[dep.skill_id].push(dep.prerequisite_id);
  });

  // Find skills where all prerequisites are mastered
  const recommendations = [];
  for (const skill of skills || []) {
    const prerequisites = prerequisiteMap[skill.id] || [];
    
    // Skip if already mastered
    if (masteredSkillIds.includes(skill.id)) continue;
    
    // Check if all prerequisites are mastered
    const allPrereqsMastered = prerequisites.length === 0 || 
      prerequisites.every((prereqId: string) => masteredSkillIds.includes(prereqId));
    
    if (allPrereqsMastered) {
      // Calculate recommendation score
      const score = calculateRecommendationScore(
        skill,
        prerequisites.length,
        masteredSkillIds.length
      );
      
      recommendations.push({
        skill_id: skill.id,
        skill_name: skill.name,
        category: skill.category,
        difficulty: skill.difficulty,
        estimated_hours: skill.estimated_hours,
        score,
        prerequisites_met: prerequisites.length,
        description: skill.description
      });
    }
  }

  // Sort by score and return top 10
  recommendations.sort((a, b) => b.score - a.score);
  const topRecommendations = recommendations.slice(0, 10);

  // Store recommendations in database
  for (const rec of topRecommendations.slice(0, 5)) {
    await supabase.from('graph_recommendations').upsert({
      user_id: userId,
      skill_id: rec.skill_id,
      score: rec.score,
      reason: `Ready to learn: ${rec.prerequisites_met} prerequisites met`,
      is_active: true
    });
  }

  return new Response(JSON.stringify({ recommendations: topRecommendations }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function updateSkillMastery(supabase: any, userId: string) {
  // Get user's current skills
  const { data: userSkills } = await supabase
    .from('user_skill_graph')
    .select('*')
    .eq('user_id', userId);

  // Apply Ebbinghaus forgetting curve
  const now = new Date();
  const updates = [];

  for (const skill of userSkills || []) {
    if (!skill.last_practiced) continue;

    const daysSincePractice = Math.floor(
      (now.getTime() - new Date(skill.last_practiced).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Forgetting curve: R = e^(-t/S)
    const decayRate = 0.05; // Standard decay rate
    const retentionRate = Math.exp(-daysSincePractice * decayRate);
    const newMastery = Math.max(0, Math.floor(skill.mastery_level * retentionRate));

    if (newMastery !== skill.mastery_level) {
      updates.push({
        id: skill.id,
        mastery_level: newMastery,
        updated_at: now.toISOString()
      });
    }
  }

  // Batch update
  if (updates.length > 0) {
    for (const update of updates) {
      await supabase
        .from('user_skill_graph')
        .update({ mastery_level: update.mastery_level, updated_at: update.updated_at })
        .eq('id', update.id);
    }
  }

  // Recalculate placement readiness
  await recalculatePlacementReadiness(supabase, userId);

  return new Response(JSON.stringify({ updated: updates.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function unlockSkills(supabase: any, userId: string) {
  // Get mastered skills
  const { data: masteredSkills } = await supabase
    .from('user_skill_graph')
    .select('skill_id')
    .eq('user_id', userId)
    .gte('mastery_level', 70);

  const masteredIds = masteredSkills?.map((s: any) => s.skill_id) || [];

  // Get dependencies
  const { data: dependencies } = await supabase
    .from('skill_dependencies')
    .select('skill_id, prerequisite_id');

  // Find skills to unlock
  const skillsToUnlock = new Set<string>();
  dependencies?.forEach((dep: any) => {
    if (masteredIds.includes(dep.prerequisite_id)) {
      skillsToUnlock.add(dep.skill_id);
    }
  });

  // Unlock skills
  for (const skillId of skillsToUnlock) {
    await supabase.from('user_skill_graph').upsert({
      user_id: userId,
      skill_id: skillId,
      is_unlocked: true,
      mastery_level: 0,
      last_practiced: new Date().toISOString()
    }, { onConflict: 'user_id,skill_id' });
  }

  return new Response(JSON.stringify({ unlocked: Array.from(skillsToUnlock) }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

function calculateRecommendationScore(
  skill: any,
  prereqCount: number,
  totalMastered: number
): number {
  // Base score on difficulty (easier skills score higher for beginners)
  let score = 100 - (skill.difficulty * 10);
  
  // Bonus for skills with prerequisites met (shows progression)
  score += prereqCount * 5;
  
  // Bonus based on total mastered skills (adaptive difficulty)
  if (totalMastered > 10) score += skill.difficulty * 5; // Recommend harder skills for advanced users
  
  // Category bonus (prioritize core skills)
  if (skill.category === 'Programming') score += 10;
  if (skill.category === 'Frontend' || skill.category === 'Backend') score += 5;
  
  return Math.min(100, Math.max(0, score));
}

async function recalculatePlacementReadiness(supabase: any, userId: string) {
  const { data: userSkills } = await supabase
    .from('user_skill_graph')
    .select('mastery_level')
    .eq('user_id', userId);

  if (!userSkills || userSkills.length === 0) return;

  const avgMastery = userSkills.reduce((sum: number, s: any) => sum + s.mastery_level, 0) / userSkills.length;
  const skillsAbove70 = userSkills.filter((s: any) => s.mastery_level >= 70).length;
  const graphCoverage = (skillsAbove70 / userSkills.length) * 100;

  const { data: activities } = await supabase
    .from('learning_activities')
    .select('completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(10);

  let consistencyScore = 50;
  if (activities && activities.length >= 2) {
    const dates = activities.map((a: any) => new Date(a.completed_at).getTime());
    const avgGap = dates.reduce((sum: number, d: number, i: number, arr: number[]) => 
      i === 0 ? sum : sum + (arr[i-1] - d), 0) / (dates.length - 1);
    const daysGap = avgGap / (1000 * 60 * 60 * 24);
    consistencyScore = Math.max(0, 100 - daysGap * 5);
  }

  const placementReadiness = Math.round(
    avgMastery * 0.35 +
    graphCoverage * 0.25 +
    consistencyScore * 0.2 +
    50 * 0.1 + // Goal progress placeholder
    50 * 0.1   // Interview performance placeholder
  );

  await supabase.from('user_stats').upsert({
    user_id: userId,
    placement_readiness: placementReadiness,
    skills_mastered: skillsAbove70,
    updated_at: new Date().toISOString()
  });
}
