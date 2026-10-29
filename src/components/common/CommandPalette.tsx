import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/audio';
import {
  Search,
  Monitor,
  Activity,
  Calendar,
  UtensilsCrossed,
  CreditCard,
  Building2,
  Users,
  Settings,
  Flame,
  ChefHat,
  Trophy,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { filteredStations, customers, menuItems } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sound.playClick();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event or parent
          window.dispatchEvent(new CustomEvent('toggle-command-palette'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { label: 'Launch New Gaming Session', path: '/stations', icon: Monitor, color: 'text-cyan-400' },
    { label: 'Open Cashier POS', path: '/fnb/pos', icon: Flame, color: 'text-rose-400' },
    { label: 'Kitchen Display (KDS)', path: '/fnb/kitchen', icon: ChefHat, color: 'text-amber-400' },
    { label: 'Advance Slot Bookings', path: '/bookings', icon: Calendar, color: 'text-purple-400' },
    { label: 'Esports Tournaments', path: '/tournaments', icon: Trophy, color: 'text-yellow-400' },
    { label: 'Shift Handover & Cash Drawer', path: '/shift-register', icon: CreditCard, color: 'text-emerald-400' },
    { label: 'Customer CRM & Loyalty', path: '/customers', icon: Users, color: 'text-indigo-400' },
  ];

  const filteredActions = quickActions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const matchedStations = filteredStations
    .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3);

  const matchedCustomers = customers
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query))
    .slice(0, 3);

  const handleSelect = (path: string) => {
    sound.playClick();
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-dark-900 border border-dark-700/90 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-brand-purple/30">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-dark-800 bg-dark-850/60">
          <Search className="w-5 h-5 text-brand-purple mr-3 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, station name, gamer, or shortcut..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-dark-800 border border-dark-750 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Actions */}
          <div>
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Quick Navigation & Commands
            </span>
            <div className="space-y-1">
              {filteredActions.map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.path}
                    onClick={() => handleSelect(act.path)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-dark-850 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${act.color}`} />
                      <span>{act.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matched Stations if query */}
          {matchedStations.length > 0 && query && (
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1.5">
                Gaming Stations ({matchedStations.length})
              </span>
              <div className="space-y-1">
                {matchedStations.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleSelect('/stations')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-dark-850/50 hover:bg-dark-800 transition-colors text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-white">{st.name}</span>
                      <span className="text-[10px] text-slate-500">({st.type})</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400">
                      {st.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Customers if query */}
          {matchedCustomers.length > 0 && query && (
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1.5">
                Customers ({matchedCustomers.length})
              </span>
              <div className="space-y-1">
                {matchedCustomers.map((cust) => (
                  <button
                    key={cust.id}
                    onClick={() => handleSelect('/customers')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-dark-850/50 hover:bg-dark-800 transition-colors text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-purple" />
                      <span className="font-bold text-white">{cust.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{cust.phone}</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold">
                      {cust.status} Tier
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 px-4 bg-dark-950/80 border-t border-dark-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>ProTip: Press <kbd className="px-1 rounded bg-dark-800 text-slate-300 font-mono">Ctrl + K</kbd> anywhere</span>
          <span>QHAR Enterprise v2.4</span>
        </div>
      </div>
    </div>
  );
};
