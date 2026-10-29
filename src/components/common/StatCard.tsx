import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'purple',
  onClick,
}) => {
  const accentStyles = {
    purple: 'from-indigo-500 via-violet-500 to-transparent',
    cyan: 'from-cyan-400 via-teal-400 to-transparent',
    emerald: 'from-emerald-400 via-green-400 to-transparent',
    amber: 'from-amber-400 via-yellow-400 to-transparent',
    rose: 'from-rose-500 via-pink-500 to-transparent',
  };

  const iconBgStyles = {
    purple: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div
      onClick={onClick}
      className={`gaming-card relative overflow-hidden p-4 sm:p-5 transition-all duration-200 group ${
        onClick ? 'cursor-pointer hover:border-zinc-700' : ''
      }`}
    >
      {/* Top subtle accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accentStyles[accentColor]} opacity-40 group-hover:opacity-90 transition-opacity`}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            {title}
          </p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
              {value}
            </span>
            {trend && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  trend.isPositive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-zinc-400 font-normal">{subtitle}</p>
          )}
        </div>

        <div
          className={`p-2.5 rounded-lg border ${iconBgStyles[accentColor]} flex-shrink-0 group-hover:scale-105 transition-transform`}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );
};
