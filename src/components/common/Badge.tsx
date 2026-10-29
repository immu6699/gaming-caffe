import React from 'react';

type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'cyan'
  | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/15 text-red-400 border-red-500/30',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const dotColors: Record<BadgeVariant, string> = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
    info: 'bg-blue-400',
    purple: 'bg-purple-400',
    cyan: 'bg-cyan-400',
    neutral: 'bg-slate-400',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {label}
    </span>
  );
};

export const getStationStatusBadge = (status: string) => {
  switch (status) {
    case 'Available':
      return <Badge label="Available" variant="success" dot />;
    case 'In Use':
      return <Badge label="In Use" variant="cyan" dot />;
    case 'Booked':
      return <Badge label="Booked" variant="purple" dot />;
    case 'Maintenance':
      return <Badge label="Maintenance" variant="warning" dot />;
    case 'Offline':
      return <Badge label="Offline" variant="danger" dot />;
    default:
      return <Badge label={status} variant="neutral" />;
  }
};

export const getOrderStatusBadge = (status: string) => {
  switch (status) {
    case 'New':
      return <Badge label="New Order" variant="purple" dot />;
    case 'Accepted':
      return <Badge label="Accepted" variant="cyan" dot />;
    case 'Preparing':
      return <Badge label="Preparing" variant="warning" dot />;
    case 'Ready':
      return <Badge label="Ready to Serve" variant="success" dot />;
    case 'Served / Delivered':
      return <Badge label="Delivered" variant="neutral" />;
    case 'Cancelled':
      return <Badge label="Cancelled" variant="danger" />;
    default:
      return <Badge label={status} variant="neutral" />;
  }
};
