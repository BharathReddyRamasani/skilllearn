import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Target, Zap, Star, Crown, Medal, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Achievement {
  id: string;
  achievement_title: string;
  achievement_description: string;
  badge_icon: string;
  category: string;
  points_earned: number;
  earned_at: string;
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;

      setAchievements(data || []);
      const points = data?.reduce((sum, achievement) => sum + (achievement.points_earned || 0), 0) || 0;
      setTotalPoints(points);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      trophy: Trophy,
      award: Award,
      target: Target,
      zap: Zap,
      star: Star,
      crown: Crown,
      medal: Medal,
      trending: TrendingUp
    };
    return icons[iconName] || Trophy;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      learning: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      skill: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      milestone: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      streak: "bg-green-500/10 text-green-500 border-green-500/20",
      challenge: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return colors[category] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center">
            <Trophy className="mr-3 w-10 h-10 text-yellow-500" />
            Your Achievements
          </h1>
          <p className="text-muted-foreground">
            Track your learning milestones and celebrate your progress
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Points</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">{totalPoints}</p>
              </div>
              <Crown className="w-12 h-12 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Achievements</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-500">{achievements.length}</p>
              </div>
              <Trophy className="w-12 h-12 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next Milestone</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-500">1000 pts</p>
              </div>
              <Target className="w-12 h-12 text-green-500" />
            </div>
            <Progress value={(totalPoints / 1000) * 100} className="mt-3" />
          </Card>
        </div>

        {/* Achievements Grid */}
        {achievements.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const IconComponent = getIconComponent(achievement.badge_icon);
              return (
                <Card 
                  key={achievement.id} 
                  className="p-6 hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-background to-muted/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-full ${getCategoryColor(achievement.category)}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="font-semibold">
                      +{achievement.points_earned} pts
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold mb-2">{achievement.achievement_title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {achievement.achievement_description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="outline" className={getCategoryColor(achievement.category)}>
                      {achievement.category}
                    </Badge>
                    <span>
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Achievements Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start learning to unlock your first achievement!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Achievements;