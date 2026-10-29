import React from 'react';
import { GamingStation } from '../../types';
import { useApp } from '../../context/AppContext';
import { getElapsedDuration, formatINR } from '../../utils/formatters';
import { sound } from '../../utils/audio';
import {
  Monitor,
  Gamepad,
  Glasses,
  Car,
  Clock,
  User,
  Play,
  StopCircle,
  Coffee,
  Sparkles,
  Wifi,
} from 'lucide-react';

interface FloorPlanViewProps {
  onStartSession: (station: GamingStation) => void;
  onEndSession: (station: GamingStation) => void;
}

export const FloorPlanView: React.FC<FloorPlanViewProps> = ({
  onStartSession,
  onEndSession,
}) => {
  const { filteredStations } = useApp();

  const getStationStyle = (status: string, isOverdue: boolean) => {
    if (status === 'In Use') {
      return isOverdue
        ? 'border-rose-500 bg-rose-950/40 shadow-glow-rose ring-2 ring-rose-500/50 animate-pulse'
        : 'border-cyan-500/80 bg-cyan-950/30 shadow-glow-cyan text-cyan-300';
    }
    if (status === 'Available') {
      return 'border-emerald-500/50 bg-emerald-950/20 hover:border-emerald-400 text-emerald-300';
    }
    if (status === 'Booked') {
      return 'border-purple-500/60 bg-purple-950/20 text-purple-300';
    }
    return 'border-amber-500/50 bg-amber-950/20 text-amber-300';
  };

  const renderStationNode = (station: GamingStation) => {
    const timing = station.sessionStartTime
      ? getElapsedDuration(station.sessionStartTime, station.scheduledEndTime)
      : null;
    const isOverdue = timing?.isOverdue || false;

    return (
      <div
        key={station.id}
        onClick={() => {
          sound.playClick();
          if (station.status === 'Available') onStartSession(station);
          else if (station.status === 'In Use') onEndSession(station);
        }}
        className={`group relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.03] select-none ${getStationStyle(
          station.status,
          isOverdue
        )}`}
      >
        <div className="flex items-center justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-1.5">
            {station.type === 'PC' ? (
              <Monitor className="w-3.5 h-3.5" />
            ) : station.type === 'Console' ? (
              <Gamepad className="w-3.5 h-3.5" />
            ) : (
              <Glasses className="w-3.5 h-3.5" />
            )}
            <span className="font-gaming font-bold text-xs text-white truncate">
              {station.name.split(' ')[0]}
            </span>
          </div>

          <span
            className={`w-2 h-2 rounded-full ${
              station.status === 'In Use'
                ? isOverdue
                  ? 'bg-rose-500 animate-ping'
                  : 'bg-cyan-400 animate-pulse'
                : station.status === 'Available'
                ? 'bg-emerald-400'
                : 'bg-amber-400'
            }`}
          />
        </div>

        {/* Content */}
        {station.status === 'In Use' ? (
          <div className="text-[10px] space-y-0.5">
            <p className="font-semibold text-white truncate flex items-center gap-1">
              <User className="w-2.5 h-2.5 text-cyan-400" />
              {station.currentCustomerName}
            </p>
            <p className="font-mono text-cyan-300 font-bold flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {timing?.remainingText}
            </p>
          </div>
        ) : (
          <div className="text-[10px] space-y-0.5 text-slate-400">
            <p className="text-emerald-400 font-bold font-gaming">
              {formatINR(station.hourlyRate)}/hr
            </p>
            <p className="truncate text-slate-500">
              {station.specs.gpu || station.specs.consoleModel?.split('+')[0] || 'Available'}
            </p>
          </div>
        )}

        {/* Hover Quick Action Cue */}
        <div className="absolute inset-0 bg-dark-900/95 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2 text-center">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider font-gaming">
            {station.status === 'Available'
              ? '▶ Quick Seat'
              : station.status === 'In Use'
              ? '⏹ Settle Bill'
              : 'View Rig'}
          </span>
        </div>
      </div>
    );
  };

  // Group stations by Zone
  const vipStations = filteredStations.filter((s) => s.name.includes('VIP') || s.hourlyRate >= 200);
  const pcStations = filteredStations.filter((s) => s.type === 'PC' && !vipStations.some((v) => v.id === s.id));
  const consoleStations = filteredStations.filter((s) => s.type === 'Console');
  const vrStations = filteredStations.filter((s) => s.type === 'VR' || s.type === 'Racing Sim');

  return (
    <div className="gaming-card p-5 space-y-6 bg-dark-950/80 border-dark-750 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Map Legend & Arena Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-dark-800">
        <div>
          <h3 className="text-sm font-bold text-white font-gaming uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            LIVE 2D ARENA FLOOR PLAN
          </h3>
          <p className="text-xs text-slate-400">
            Interactive spatial layout — Click any seat to instantly launch or settle sessions.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> In Use
          </span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Booked
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> Overdue
          </span>
        </div>
      </div>

      {/* Floor Plan Spatial Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Section: VIP Arena & PC Esports Rows (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* VIP Predator Arena */}
          <div className="p-4 rounded-2xl bg-dark-900/90 border border-brand-purple/30 shadow-glow-purple/5 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple font-gaming">
                ⚡ ZONE A: VIP PREDATOR SUITE (RTX 4090 / 240Hz OLED)
              </span>
              <span className="text-[10px] text-slate-400 bg-dark-800 px-2 py-0.5 rounded">
                High Priority
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {vipStations.map((st) => renderStationNode(st))}
            </div>
          </div>

          {/* Main Esports Floor */}
          <div className="p-4 rounded-2xl bg-dark-900/70 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-gaming">
                🎮 ZONE B: MAIN ESPORTS LAN FLOOR (RTX 4080 Super)
              </span>
              <span className="text-[10px] text-slate-400 bg-dark-800 px-2 py-0.5 rounded">
                Tournament Ready
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {pcStations.map((st) => renderStationNode(st))}
            </div>
          </div>
        </div>

        {/* Right Section: Console Lounge & VR Simulator + Snack Bar (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Console Lounges */}
          <div className="p-4 rounded-2xl bg-dark-900/70 border border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-gaming">
                🛋️ ZONE C: CONSOLE LOUNGE
              </span>
              <span className="text-[10px] text-slate-400">PS5 & Series X</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {consoleStations.map((st) => renderStationNode(st))}
            </div>
          </div>

          {/* VR Simulator & Treadmill */}
          {vrStations.length > 0 && (
            <div className="p-4 rounded-2xl bg-dark-900/70 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-gaming">
                  🕶️ ZONE D: VR TREADMILL POD
                </span>
                <span className="text-[10px] text-slate-400">Meta Quest 3</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {vrStations.map((st) => renderStationNode(st))}
              </div>
            </div>
          )}

          {/* Physical Snack & Café Counter */}
          <div className="p-3.5 rounded-2xl bg-dark-850/60 border border-dark-750/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Café Counter & Snack Bar</p>
                <p className="text-[10px] text-slate-500">Pick-up counter & barista station</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold text-amber-400 bg-amber-950/40 rounded border border-amber-500/30">
              OPEN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
