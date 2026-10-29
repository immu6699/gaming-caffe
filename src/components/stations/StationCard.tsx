import React from 'react';
import { GamingStation } from '../../types';
import { getStationStatusBadge } from '../common/Badge';
import { formatINR, getElapsedDuration } from '../../utils/formatters';
import {
  Monitor,
  Gamepad,
  Glasses,
  Car,
  Clock,
  User,
  Play,
  StopCircle,
  Wrench,
  MoreVertical,
  CheckCircle,
  Wifi,
  Cpu,
  BatteryCharging,
  Thermometer,
} from 'lucide-react';

interface StationCardProps {
  station: GamingStation;
  onStartSession: (station: GamingStation) => void;
  onEndSession: (station: GamingStation) => void;
  onExtendSession?: (station: GamingStation) => void;
  onEditStation: (station: GamingStation) => void;
  onToggleMaintenance: (station: GamingStation) => void;
  onOpenWatchdog?: (station: GamingStation) => void;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  onStartSession,
  onEndSession,
  onExtendSession,
  onEditStation,
  onToggleMaintenance,
  onOpenWatchdog,
}) => {
  const getIcon = () => {
    switch (station.type) {
      case 'PC':
        return <Monitor className="w-5 h-5 text-cyan-400" />;
      case 'Console':
        return <Gamepad className="w-5 h-5 text-purple-400" />;
      case 'VR':
        return <Glasses className="w-5 h-5 text-emerald-400" />;
      case 'Racing Sim':
        return <Car className="w-5 h-5 text-amber-400" />;
    }
  };

  const timing = station.sessionStartTime
    ? getElapsedDuration(station.sessionStartTime, station.scheduledEndTime)
    : null;

  return (
    <div className="gaming-card relative overflow-hidden flex flex-col justify-between border-dark-750/90 hover:border-dark-600">
      {/* Top status bar accent */}
      <div
        className={`h-1 w-full ${
          station.status === 'In Use'
            ? timing?.isOverdue
              ? 'bg-rose-500 animate-pulse'
              : 'bg-cyan-500'
            : station.status === 'Available'
            ? 'bg-emerald-500'
            : station.status === 'Booked'
            ? 'bg-purple-500'
            : 'bg-amber-500'
        }`}
      />

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {/* Header: Name, Type, Status */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-dark-850 border border-dark-750">
                {getIcon()}
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white font-gaming tracking-wide">
                  {station.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400 font-medium">
                    {station.type}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {formatINR(station.hourlyRate)}/hr
                  </span>
                </div>
              </div>
            </div>

            {getStationStatusBadge(station.status)}
          </div>

          {/* Specs Snippet */}
          <div className="my-3 py-2 px-3 rounded-lg bg-dark-850/60 border border-dark-750/40 text-[11px] text-slate-300 space-y-1">
            {station.specs.gpu && (
              <p className="truncate">
                <span className="text-slate-500 font-medium">GPU:</span> {station.specs.gpu}
              </p>
            )}
            {station.specs.consoleModel && (
              <p className="truncate">
                <span className="text-slate-500 font-medium">Model:</span> {station.specs.consoleModel}
              </p>
            )}
            {station.specs.monitor && (
              <p className="truncate">
                <span className="text-slate-500 font-medium">Display:</span> {station.specs.monitor}
              </p>
            )}
          </div>

          {/* Hardware Diagnostics & Telemetry (Clickable Watchdog) */}
          <div
            onClick={() => onOpenWatchdog && onOpenWatchdog(station)}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-dark-900 hover:bg-dark-850 cursor-pointer border border-dark-800 hover:border-cyan-500/50 transition-all text-[10px] text-slate-400 font-mono mb-3 group/telemetry"
            title="Click to view hardware thermals, click health & sanitation watchdog"
          >
            <span className="flex items-center gap-1 text-emerald-400">
              <Wifi className="w-3 h-3" /> 4ms
            </span>
            {station.type === 'PC' || station.type === 'VR' ? (
              <span className="flex items-center gap-1 text-cyan-300 group-hover/telemetry:text-cyan-200">
                <Thermometer className="w-3 h-3 text-cyan-400" /> GPU 58°C
              </span>
            ) : (
              <span className="flex items-center gap-1 text-purple-300 group-hover/telemetry:text-purple-200">
                <BatteryCharging className="w-3 h-3 text-purple-400" /> 88% Batt
              </span>
            )}
            <span className="text-cyan-400 underline opacity-0 group-hover/telemetry:opacity-100 transition-opacity">
              Watchdog
            </span>
          </div>
        </div>

        {/* Live Session Details (If In Use) */}
        {station.status === 'In Use' && timing && (
          <div
            className={`p-3 rounded-xl border mb-3 ${
              timing.isOverdue
                ? 'bg-rose-950/30 border-rose-500/40'
                : 'bg-cyan-950/20 border-cyan-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-slate-200 font-semibold truncate">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                {station.currentCustomerName || 'Active Gamer'}
              </span>
              <span
                className={`font-mono text-xs font-bold ${
                  timing.isOverdue ? 'text-rose-400 animate-pulse' : 'text-cyan-300'
                }`}
              >
                {timing.remainingText}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" /> Elapsed: {timing.elapsedText}
              </span>
              <span className="text-slate-300 font-medium">
                Est: {formatINR(Math.round(((timing.elapsedMinutes || 60) / 60) * station.hourlyRate))}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-dark-800 flex items-center justify-between gap-2">
          {station.status === 'Available' ? (
            <button
              onClick={() => onStartSession(station)}
              className="btn-cyan flex-1 py-1.5 text-xs font-semibold"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Session
            </button>
          ) : station.status === 'In Use' ? (
            <div className="flex items-center gap-2 flex-1">
              {onExtendSession && (
                <button
                  onClick={() => onExtendSession(station)}
                  className="btn-secondary py-1.5 px-2.5 text-xs flex-1"
                >
                  + Extend
                </button>
              )}
              <button
                onClick={() => onEndSession(station)}
                className="btn-danger py-1.5 px-3 text-xs flex-1"
              >
                <StopCircle className="w-3.5 h-3.5" />
                End
              </button>
            </div>
          ) : station.status === 'Maintenance' ? (
            <button
              onClick={() => onToggleMaintenance(station)}
              className="btn-secondary flex-1 py-1.5 text-xs text-amber-300"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Mark Ready
            </button>
          ) : (
            <button
              onClick={() => onStartSession(station)}
              className="btn-primary flex-1 py-1.5 text-xs"
            >
              Check-In Booking
            </button>
          )}

          <button
            onClick={() => onEditStation(station)}
            title="Edit Specs / Hourly Rate"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
          >
            <Wrench className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
