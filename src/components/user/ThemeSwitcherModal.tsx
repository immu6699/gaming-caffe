import React from 'react';
import { useApp } from '../../context/AppContext';
import { VisualTheme } from '../../types';
import {
  Palette,
  Check,
  X,
  Sparkles,
  Sun,
  Moon,
  Flame,
  Shield,
  Zap,
  Terminal,
  Tv,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface ThemeOption {
  id: VisualTheme;
  name: string;
  subtitle: string;
  badge: string;
  bgPreview: string;
  accentColor: string;
  glowColor: string;
  icon: React.ReactNode;
  tags: string[];
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'vice-city',
    name: '🌴 Vice City Neon 1986',
    subtitle: 'Ocean Drive Synthwave, Palm Sunset & Retro Glow',
    badge: 'POPULAR VINTAGE',
    bgPreview: 'from-fuchsia-950 via-pink-900 to-indigo-950',
    accentColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    icon: <Sparkles className="w-5 h-5 text-pink-400" />,
    tags: ['Hot Pink', 'Electric Cyan', '80s Miami', 'Synthwave'],
  },
  {
    id: 'cyberpunk',
    name: '🤖 Cyberpunk 2077 Overdrive',
    subtitle: 'Night City Cyber Yellow & High-Tech Telemetry',
    badge: 'RTX 4090 SPECIAL',
    bgPreview: 'from-amber-950 via-zinc-900 to-cyan-950',
    accentColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    tags: ['Cyber Yellow', 'Neon Turquoise', 'Path Tracing', 'Dark Slate'],
  },
  {
    id: 'dust2-tactical',
    name: '💥 de_dust2 Tactical Desert',
    subtitle: 'CS2 Competitive Military Sand & Gunmetal Grey',
    badge: 'ESPORTS COMP',
    bgPreview: 'from-amber-950 via-stone-900 to-zinc-950',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    icon: <Shield className="w-5 h-5 text-amber-500" />,
    tags: ['Military Sand', 'AWP Stencil', 'Tactical HUD', 'Matte Carbon'],
  },
  {
    id: 'matrix-1995',
    name: '🕹️ 1995 Retro CRT Matrix',
    subtitle: 'Phosphor Green DOS Terminal & Cyber Cafe Nostalgia',
    badge: 'EST. 1994',
    bgPreview: 'from-emerald-950 via-green-950 to-black',
    accentColor: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    icon: <Terminal className="w-5 h-5 text-emerald-400" />,
    tags: ['DOS Green', 'Monochrome CRT', 'Scanlines', 'Floppy Era'],
  },
  {
    id: 'crimson-esports',
    name: '🥊 Crimson Esports Predator',
    subtitle: 'Blood Red Tournament Arena & Carbon Fiber',
    badge: 'LAN TOURNAMENT',
    bgPreview: 'from-rose-950 via-red-950 to-zinc-950',
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    icon: <Flame className="w-5 h-5 text-rose-500" />,
    tags: ['Blood Red', 'Aggressive ROG', 'Tournament Light', 'High-FPS'],
  },
  {
    id: 'enterprise-dark',
    name: '🌙 Obsidian Stealth Dark',
    subtitle: 'Ultra Clean Minimalist Dark Surface (Vercel Style)',
    badge: 'DEFAULT PRO',
    bgPreview: 'from-zinc-900 via-zinc-950 to-black',
    accentColor: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.25)',
    icon: <Moon className="w-5 h-5 text-indigo-400" />,
    tags: ['Deep Black', 'Indigo Accent', 'Eye Comfort', 'Low Glare'],
  },
  {
    id: 'white-clean',
    name: '☀️ Studio White Light Mode',
    subtitle: 'Bright High-Contrast Daytime Studio Cleanliness',
    badge: 'LIGHT MODE',
    bgPreview: 'from-slate-100 via-white to-zinc-100',
    accentColor: '#4f46e5',
    glowColor: 'rgba(99, 102, 241, 0.15)',
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    tags: ['Pure White', 'High Contrast', 'Daytime Lounge', 'Clean'],
  },
];

interface ThemeSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSwitcherModal: React.FC<ThemeSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { visualTheme, setVisualTheme, addToast } = useApp();

  if (!isOpen) return null;

  const handleSelectTheme = (themeId: VisualTheme, themeName: string) => {
    sound.playClick();
    setVisualTheme(themeId);
    addToast(`Theme Activated! 🎨`, `Switched to ${themeName}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1220] border-2 border-indigo-500/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ARENA ATMOSPHERE ENGINE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Battle Station Theme &amp; Visual Style
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-300 mb-6">
          Transform your gaming cafe portal in real time. Select your favorite aesthetic below &mdash; from Miami 1986 Vice City neon to Night City cyberpunk or authentic 1995 DOS green!
        </p>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEME_OPTIONS.map((theme) => {
            const isSelected = visualTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleSelectTheme(theme.id, theme.name)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 relative group overflow-hidden ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-950/30 shadow-xl shadow-indigo-500/20 scale-[1.02]'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                {/* Background Ambient Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${theme.bgPreview} opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none`}
                />

                <div className="relative z-10 flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-zinc-700 flex items-center justify-center">
                      {theme.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {theme.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        {theme.subtitle}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Color Palette Indicators & Tags */}
                <div className="relative z-10 flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800/80">
                  <span
                    className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-zinc-300">
                    {theme.badge}
                  </span>
                  {theme.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            Selected Theme persists across all your gaming sessions
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider"
          >
            Apply &amp; Done
          </button>
        </div>

      </div>
    </div>
  );
};
