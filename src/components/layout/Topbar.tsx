import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { StaffRole, ArenaAtmosphere, VisualTheme } from '../../types';
import {
  Menu,
  Building2,
  Search,
  Bell,
  Clock,
  ChevronDown,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  User,
  Shield,
  Layers,
  ArrowRight,
  Volume2,
  VolumeX,
  Moon,
  Trophy,
  Sparkles,
  Flame,
  Lock,
  StickyNote,
  Palette,
  Gamepad2,
  Sun,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LostAndFoundDrawer } from '../common/LostAndFoundDrawer';
import { ShiftStickyNotesBoard } from '../common/ShiftStickyNotesBoard';
import { Modal } from '../common/Modal';
import { sound } from '../../utils/audio';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    activeRole,
    setActiveRole,
    currentUser,
    globalSearch,
    setGlobalSearch,
    arenaAtmosphere,
    setArenaAtmosphere,
    soundEnabled,
    setSoundEnabled,
    stickyNotes,
    lostAndFound,
    addToast,
    visualTheme,
    setVisualTheme,
  } = useApp();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLostFoundOpen, setIsLostFoundOpen] = useState(false);
  const [isStickyNotesOpen, setIsStickyNotesOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  // Live Clock updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.read);

  const availableRoles: StaffRole[] = [
    'Super Admin',
    'Cafe Owner',
    'Branch Manager',
    'Cashier',
    'Kitchen Staff',
    'Technician',
  ];

  return (
    <header className="h-16 bg-dark-900/90 backdrop-blur-md border-b border-dark-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Left: Mobile Toggle & Branch Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Branch Selector */}
        <div className="relative flex items-center">
          <div className="flex items-center gap-2 bg-dark-850 border border-dark-750 hover:border-dark-600 rounded-lg px-3 py-1.5 transition-colors">
            <Building2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-100 focus:outline-none cursor-pointer pr-4"
            >
              <option value="ALL" className="bg-dark-900 text-slate-100">
                All Branches (Consolidated)
              </option>
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-dark-900 text-slate-100">
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Middle: Global Quick Search (Never wraps) */}
      <div className="hidden lg:flex flex-1 max-w-[240px] xl:max-w-xs mx-3">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-command-palette'))}
          className="w-full h-9 bg-dark-850 hover:bg-dark-800 border border-white/10 hover:border-indigo-500/40 text-zinc-400 text-xs rounded-xl px-3 flex items-center justify-between transition-all group shadow-sm"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
            <span className="truncate">Search commands, stations...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-dark-900 rounded border border-dark-700 flex-shrink-0 ml-1.5">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: Theme Switcher, Audio, Memos, Locker, Clock, Notifs, Profile */}
      <div className="flex items-center gap-2">
        {/* Direct 1-Click Dark 🌙 / White ☀️ Mode Toggle */}
        <button
          onClick={() => {
            const nextTheme = visualTheme === 'white-clean' ? 'enterprise-dark' : 'white-clean';
            setVisualTheme(nextTheme);
            sound.playClick();
            addToast(
              nextTheme === 'white-clean' ? 'White Theme Activated ☀️' : 'Dark Theme Activated 🌙',
              nextTheme === 'white-clean' ? 'Switched to clean high-contrast light mode' : 'Switched to sleek obsidian dark mode',
              'info'
            );
          }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
            visualTheme === 'white-clean'
              ? 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100 shadow-sm'
              : 'bg-dark-850 border-white/10 text-indigo-400 hover:text-indigo-300 hover:border-indigo-500/40'
          }`}
          title={visualTheme === 'white-clean' ? 'Switch to Dark Theme 🌙' : 'Switch to White Theme ☀️'}
        >
          {visualTheme === 'white-clean' ? <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Dynamic Visual Theme Switcher */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => {
              sound.playClick();
              setIsThemeMenuOpen(!isThemeMenuOpen);
            }}
            className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 hover:border-cyan-500/50 text-xs font-semibold text-slate-200 transition-all shadow-sm"
            title="Switch Aesthetic Theme"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline capitalize text-[11px] text-zinc-200 font-medium">
              {visualTheme === 'white-clean' ? '☀️ White Theme' : visualTheme.replace('-', ' ')}
            </span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-dark-900 border border-dark-800 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 flex items-center justify-between border-b border-dark-800 pb-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Select Visual Aesthetic
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Active
                </span>
              </div>

              <div className="space-y-1">
                {[
                  {
                    id: 'white-clean',
                    name: '☀️ Pure Studio White',
                    desc: 'Clean crisp light theme, soft borders & top readability',
                    badge: 'bg-white border-2 border-slate-300 ring-2 ring-indigo-400/40',
                    tag: 'Light Mode',
                  },
                  {
                    id: 'enterprise-dark',
                    name: '🌙 Minimalist Enterprise',
                    desc: 'Linear & Vercel matte charcoal, clean borders & calm indigo',
                    badge: 'bg-indigo-500 ring-2 ring-indigo-400/40',
                    tag: 'Dark Default',
                  },
                  {
                    id: 'cyber-neon',
                    name: '⚡ Neo-Cyber Tokyo',
                    desc: 'Electric Cyan & Neon Magenta with ambient glow',
                    badge: 'bg-cyan-400',
                  },
                  {
                    id: 'stealth-gold',
                    name: '👑 Stealth Obsidian & Gold',
                    desc: 'Matte Carbon & Imperial Gold luxury esports',
                    badge: 'bg-amber-400',
                  },
                  {
                    id: 'crimson-esports',
                    name: '🔥 Predator Crimson LAN',
                    desc: 'High-adrenaline tournament red & carbon fiber',
                    badge: 'bg-rose-500',
                  },
                  {
                    id: 'nordic-frost',
                    name: '❄️ Nordic Arctic Ice',
                    desc: 'Clean ice blue & mint glassmorphic clarity',
                    badge: 'bg-sky-400',
                  },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setVisualTheme(th.id as VisualTheme);
                      setIsThemeMenuOpen(false);
                      sound.playSessionStart();
                      addToast('Theme Activated', `Visual style switched to ${th.name}`, 'success');
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                      visualTheme === th.id
                        ? 'bg-dark-850 text-white font-bold border border-indigo-500/50 shadow-sm'
                        : 'text-zinc-300 hover:bg-dark-850/70 hover:text-white'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0 ${th.badge}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          {th.name}
                          {th.tag && (
                            <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {th.tag}
                            </span>
                          )}
                        </span>
                        {visualTheme === th.id && <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />}
                      </div>
                      <p className="text-[10px] text-zinc-400 font-normal mt-0.5 leading-snug">{th.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Audio Sound FX Toggle */}
        <button
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) sound.playClick();
          }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
            soundEnabled
              ? 'bg-dark-850 border-white/10 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40'
              : 'bg-dark-900 border-dark-800 text-slate-500 hover:text-slate-400'
          }`}
          title={soundEnabled ? 'Tactile Audio: Enabled (Click to Mute)' : 'Tactile Audio: Muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Shift Sticky Notes Popout Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            setIsStickyNotesOpen(true);
          }}
          className="relative w-9 h-9 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 hover:border-amber-500/40 text-amber-400 flex items-center justify-center transition-all"
          title="Front Desk Shift Sticky Notes & Handover"
        >
          <StickyNote className="w-4 h-4" />
          {stickyNotes.length > 0 && (
            <span className="absolute -top-1 -right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-amber-500 text-dark-950 font-bold text-[9px] flex items-center justify-center shadow-sm">
              {stickyNotes.length}
            </span>
          )}
        </button>

        {/* Safe Locker / Lost & Found Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            setIsLostFoundOpen(true);
          }}
          className="relative w-9 h-9 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/10 hover:border-cyan-500/40 text-cyan-400 flex items-center justify-center transition-all"
          title="Front Desk Lost & Found Safe Locker"
        >
          <Lock className="w-4 h-4" />
          {lostAndFound.filter((i) => i.status === 'In Safe Locker').length > 0 && (
            <span className="absolute -top-1 -right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-cyan-400 text-dark-950 font-bold text-[9px] flex items-center justify-center shadow-sm">
              {lostAndFound.filter((i) => i.status === 'In Safe Locker').length}
            </span>
          )}
        </button>

        {/* Live Clock (Displayed on wide screens) */}
        <div className="hidden 2xl:flex items-center gap-2 text-right border-l border-r border-dark-800 px-3">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <div>
            <div className="text-xs font-semibold text-zinc-200 font-mono tracking-tight leading-none">
              {timeStr}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5 leading-none">{dateStr}</div>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-dark-900 animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-dark-900 border border-dark-700/80 rounded-xl shadow-2xl overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 border-b border-dark-800 flex items-center justify-between bg-dark-850/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-brand-purple hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-dark-800/60">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      if (n.actionUrl) {
                        navigate(n.actionUrl);
                        setIsNotifOpen(false);
                      }
                    }}
                    className={`p-3 text-xs cursor-pointer hover:bg-dark-850 transition-colors flex items-start gap-2.5 ${
                      !n.read ? 'bg-dark-850/40' : ''
                    }`}
                  >
                    {n.severity === 'error' && (
                      <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    )}
                    {n.severity === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    )}
                    {n.severity === 'success' && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    )}
                    {n.severity === 'info' && (
                      <Bell className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-slate-100">{n.title}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-dark-800 text-center bg-dark-850/30">
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setIsNotifOpen(false);
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                >
                  View All Notifications <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Switch to Gamer Portal Button */}
        <button
          onClick={() => {
            sound.playSessionStart();
            navigate('/user');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
          title="Launch Gamer / Customer Facing Portal"
        >
          <Gamepad2 className="w-4 h-4" />
          <span className="hidden sm:inline">Gamer Portal</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-80" />
        </button>

        {/* Profile & Role Persona Tester */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-dark-850 transition-colors border border-transparent hover:border-dark-750"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-cyan-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-brand-purple font-semibold">
                  {activeRole}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-dark-900 border border-dark-700/80 rounded-xl shadow-2xl p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 border-b border-dark-800">
                <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400">{currentUser.email}</p>
              </div>

              {/* Persona Role Switcher */}
              <div className="py-2">
                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Switch Active Role (RBAC Tester)
                </p>
                {availableRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setActiveRole(role);
                      setIsProfileOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                      activeRole === role
                        ? 'bg-brand-purple/20 text-brand-purple font-bold'
                        : 'text-slate-300 hover:bg-dark-800'
                    }`}
                  >
                    <span>{role}</span>
                    {activeRole === role && <CheckCircle className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>

              <div className="border-t border-dark-800 pt-1">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-dark-800 rounded-md"
                >
                  Account Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lost & Found Safe Locker Modal */}
      <LostAndFoundDrawer
        isOpen={isLostFoundOpen}
        onClose={() => setIsLostFoundOpen(false)}
      />

      {/* Shift Sticky Notes Popout Modal */}
      <Modal
        isOpen={isStickyNotesOpen}
        onClose={() => setIsStickyNotesOpen(false)}
        title="FRONT DESK SHIFT MEMOS & STICKY NOTES"
        size="xl"
      >
        <ShiftStickyNotesBoard />
      </Modal>
    </header>
  );
};
