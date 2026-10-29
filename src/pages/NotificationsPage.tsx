import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { formatDateTime } from '../utils/formatters';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCheck,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = notifications.filter((n) => {
    if (filterType === 'ALL') return true;
    return n.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
              NOTIFICATIONS & SYSTEM ALERTS
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-dark-800 text-slate-300 border border-dark-750">
              {notifications.filter((n) => !n.read).length} unread
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time operational alerts for overdue sessions, low inventory levels, and payments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={markAllNotificationsAsRead}
            className="btn-secondary text-xs py-1.5"
          >
            <CheckCheck className="w-4 h-4 text-brand-purple" /> Mark All Read
          </button>
          <button
            onClick={clearNotifications}
            className="btn-danger text-xs py-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'All Alerts', value: 'ALL' },
          { label: 'Hardware & Overdue Alerts', value: 'alert' },
          { label: 'Food & Beverage', value: 'fnb' },
          { label: 'Bookings', value: 'booking' },
          { label: 'Payments', value: 'payment' },
          { label: 'System', value: 'system' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              filterType === tab.value
                ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                : 'bg-dark-900 border-dark-750 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((n) => {
          const icons: Record<string, React.ReactNode> = {
            error: <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
            success: <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
            info: <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />,
          };

          const borders: Record<string, string> = {
            error: 'border-rose-500/30 bg-rose-950/10',
            warning: 'border-amber-500/30 bg-amber-950/10',
            success: 'border-emerald-500/30 bg-emerald-950/10',
            info: 'border-cyan-500/30 bg-cyan-950/10',
          };

          return (
            <div
              key={n.id}
              className={`p-4 rounded-xl border gaming-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                borders[n.severity]
              } ${!n.read ? 'ring-1 ring-brand-purple/40' : 'opacity-85'}`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-dark-850 border border-dark-750 mt-0.5">
                  {icons[n.severity]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{n.title}</h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-purple" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{n.message}</p>
                  <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                    {formatDateTime(n.timestamp)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {n.actionUrl && (
                  <button
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      navigate(n.actionUrl!);
                    }}
                    className="btn-secondary py-1 px-3 text-xs flex items-center gap-1.5"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {!n.read && (
                  <button
                    onClick={() => markNotificationAsRead(n.id)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-800"
                    title="Mark as Read"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
