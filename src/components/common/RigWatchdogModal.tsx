import React from 'react';
import { GamingStation } from '../../types';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/audio';
import {
  ShieldAlert,
  Flame,
  Thermometer,
  Sparkles,
  Mouse,
  Keyboard,
  Gamepad,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Wrench,
  Clock,
  User,
} from 'lucide-react';

interface RigWatchdogModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: GamingStation | null;
}

export const RigWatchdogModal: React.FC<RigWatchdogModalProps> = ({
  isOpen,
  onClose,
  station,
}) => {
  const { rigHealth, sanitizeStation, updateRigHealth, addToast } = useApp();

  if (!station) return null;

  const health = rigHealth.find((r) => r.stationId === station.id) || {
    stationId: station.id,
    stationName: station.name,
    gpuTemp: 62,
    cpuTemp: 56,
    fanSpeedPercent: 60,
    mouseClicks: 320000,
    lastSanitizedAt: 'Today, 11:30 AM',
    sanitizedBy: 'Shift Staff',
    needsThermalPaste: false,
    controllerBatteryPercent: 85,
    notes: 'Rig benchmarked stable.',
  };

  const isGpuHot = health.gpuTemp >= 80;
  const isHighClickCount = health.mouseClicks > 800000;

  const handleRepasteScheduled = () => {
    sound.playClick();
    updateRigHealth(station.id, { needsThermalPaste: false });
    addToast(
      'Thermal Service Logged',
      `Thermal paste application verified for ${station.name}`,
      'success'
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`RIG TELEMETRY & HEALTH WATCHDOG — ${station.name}`}
      size="lg"
    >
      <div className="space-y-5 animate-in fade-in duration-150">
        {/* Thermals Alert Banner if Hot */}
        {isGpuHot && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-center justify-between text-xs animate-pulse">
            <div className="flex items-center gap-2 text-rose-200">
              <Flame className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div>
                <p className="font-bold">Thermal Throttle Risk Warning!</p>
                <p className="text-[11px] text-rose-300">
                  GPU hotspot temperature is {health.gpuTemp}°C. Clean radiator intake or re-paste GPU.
                </p>
              </div>
            </div>
            <button
              onClick={handleRepasteScheduled}
              className="btn-cyan text-[11px] py-1.5 px-3 flex items-center gap-1"
            >
              <Wrench className="w-3.5 h-3.5" /> Mark Repasted
            </button>
          </div>
        )}

        {/* Live Hardware Vital Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className={`p-3.5 rounded-xl border ${
              isGpuHot ? 'bg-rose-950/30 border-rose-500/50' : 'bg-dark-850 border-dark-800'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold">GPU Core Temp</span>
              <Thermometer
                className={`w-4 h-4 ${isGpuHot ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}
              />
            </div>
            <p
              className={`text-xl font-mono font-black ${
                isGpuHot ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {health.gpuTemp}°C
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Fan: {health.fanSpeedPercent}% RPM</p>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold">CPU Package</span>
              <Thermometer className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xl font-mono font-black text-cyan-400">{health.cpuTemp}°C</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Idle load 8%</p>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold">Mouse Microswitches</span>
              <Mouse className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-lg font-mono font-black text-purple-300 truncate">
              {(health.mouseClicks / 1000).toFixed(0)}k clicks
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {isHighClickCount ? '⚠️ Switch wear alert' : 'Switch contact healthy'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold">
                {station.type === 'Console' ? 'DualSense Battery' : 'Peripherals'}
              </span>
              <Gamepad className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-lg font-mono font-black text-amber-300">
              {station.type === 'Console'
                ? `${health.controllerBatteryPercent || 85}%`
                : 'Braided USB'}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Sanitized & Checked</p>
          </div>
        </div>

        {/* Sanitation & Hygiene Log (Critical LAN Cafe Operation) */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  Cleanliness & Sanitation Verification
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Last wiped with 70% Isopropyl Alcohol: <strong>{health.lastSanitizedAt}</strong> by{' '}
                <span className="text-cyan-300 font-medium">{health.sanitizedBy}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => sanitizeStation(station.id)}
            className="btn-cyan text-xs py-2 px-3.5 flex items-center gap-1.5 flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" /> Log Sanitized Now
          </button>
        </div>

        {/* Hardware Specs & Component Inventory */}
        <div className="p-4 rounded-xl bg-dark-850 border border-dark-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Station Hardware Configuration
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between p-2 rounded bg-dark-900 border border-dark-750">
              <span className="text-slate-400">GPU Unit:</span>
              <span className="font-semibold text-white">{station.specs.gpu || 'N/A'}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-dark-900 border border-dark-750">
              <span className="text-slate-400">Processor:</span>
              <span className="font-semibold text-white">{station.specs.cpu || 'N/A'}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-dark-900 border border-dark-750">
              <span className="text-slate-400">Memory:</span>
              <span className="font-semibold text-white">{station.specs.ram || '32GB DDR5'}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-dark-900 border border-dark-750">
              <span className="text-slate-400">Display:</span>
              <span className="font-semibold text-white">{station.specs.monitor || '144Hz IPS'}</span>
            </div>
          </div>
        </div>

        {/* Technician Notes */}
        <div className="p-3.5 rounded-xl bg-dark-850/60 border border-dark-800">
          <p className="text-[11px] text-slate-400 font-bold uppercase mb-1">
            Hardware Audit & Notes:
          </p>
          <p className="text-xs text-slate-300 italic">
            "{health.notes || 'Operating within standard LAN café thermal tolerance.'}"
          </p>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2 border-t border-dark-800">
          <button onClick={onClose} className="btn-secondary text-xs py-2 px-5 font-bold">
            Close Watchdog
          </button>
        </div>
      </div>
    </Modal>
  );
};
