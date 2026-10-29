import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionButton,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-dark-900/50 border border-dashed border-dark-750 rounded-xl my-4">
      <div className="w-12 h-12 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6 text-brand-purple/80" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-5">{description}</p>
      {actionButton}
    </div>
  );
};
