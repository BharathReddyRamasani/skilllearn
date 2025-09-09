import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: boolean;
  children?: ReactNode;
}

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  gradient = false,
  children 
}: StatsCardProps) => {
  return (
    <Card className={`learning-card p-6 ${gradient ? 'hero-gradient text-white' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-muted-foreground'}`}>
            {title}
          </p>
          <div className="mt-2">
            <p className={`text-3xl font-bold stats-counter ${gradient ? 'text-white' : 'text-foreground'}`}>
              {value}
            </p>
            {subtitle && (
              <p className={`text-sm mt-1 ${gradient ? 'text-white/70' : 'text-muted-foreground'}`}>
                {subtitle}
              </p>
            )}
          </div>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${
                trend.isPositive 
                  ? gradient ? 'text-white' : 'text-success' 
                  : gradient ? 'text-white/80' : 'text-destructive'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className={`text-xs ml-1 ${gradient ? 'text-white/60' : 'text-muted-foreground'}`}>
                vs last week
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          gradient 
            ? 'bg-white/20' 
            : 'bg-primary/10'
        }`}>
          <Icon className={`w-6 h-6 ${
            gradient ? 'text-white' : 'text-primary'
          }`} />
        </div>
      </div>
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </Card>
  );
};

export default StatsCard;