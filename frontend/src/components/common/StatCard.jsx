import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "primary" }) => {
  const colors = {
    primary: "bg-blue-50 text-blue-600",
    success: "bg-green-50 text-green-600",
    warning: "bg-orange-50 text-orange-600",
    danger: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  }

  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
          </div>
          <div className={cn("p-4 rounded-2xl", colors[color])}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
        </div>
        
        {trend && (
           <div className="mt-4 flex items-center gap-1.5">
             <span className={cn(
               "text-xs font-bold px-1.5 py-0.5 rounded-md",
               trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
             )}>
               {trend === "up" ? "+" : "-"}{trendValue}%
             </span>
             <span className="text-xs text-slate-400 font-medium italic">vs last month</span>
           </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
