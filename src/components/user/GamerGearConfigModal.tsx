import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GamerGearConfig } from '../../types';
import {
  Mouse,
  Crosshair,
  Sliders,
  Copy,
  Check,
  X,
  Sparkles,
  Zap,
  Volume2,
  HardDrive,
  Cpu,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface GamerGearConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GamerGearConfigModal: React.FC<GamerGearConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    gamerGearConfig,
    updateGamerGearConfig,
    userActiveSession,
    addToast,
  } = useApp();

  const [mouseDpi, setMouseDpi] = useState<number>(gamerGearConfig.mouseDpi || 800);
  const [pollingRate, setPollingRate] = useState<number>(gamerGearConfig.pollingRateHz || 4000);
  const [csCrosshair, setCsCrosshair] = useState<string>(
    gamerGearConfig.csCrosshairCode || 'CSGO-hH6kO-8zYjR-Z44zN-E74kE-s5KPD'
  );
  const [valCrosshair, setValCrosshair] = useState<string>(
    gamerGearConfig.valorantProfile || '0;P;c;5;o;1;0t;1;0l;3;0o;2;0a;1;0f;0;1b;0'
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    sound.playClick();
    addToast(`${label} Copied! 📋`, 'Paste directly into game settings/console.', 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSaveAndSync = () => {
    updateGamerGearConfig({
      mouseDpi,
      pollingRateHz: pollingRate,
      csCrosshairCode: csCrosshair,
      valorantProfile: valCrosshair,
    });
    const desk = userActiveSession?.stationName || 'All Cafe Battle Stations';
    addToast('Profile Deployed! ⚡', `Sens & crosshairs applied to ${desk}.`, 'success');
    onClose();
  };

  const applyPreset = (presetName: string) => {
    sound.playClick();
    if (presetName === 's1mple') {
      setMouseDpi(400);
      setPollingRate(1000);
      setCsCrosshair('CSGO-RUr5w-W22vB-pP3oD-N3yZ2-s5KPD');
      addToast('Preset Loaded: s1mple CS2 AWP God 🎯', '400 DPI, 1000Hz, yellow static dot', 'info');
    } else if (presetName === 'tenz') {
      setMouseDpi(800);
      setPollingRate(4000);
      setValCrosshair('0;s;1;P;c;5;h;0;m;1;0l;4;0o;2;0a;1;0f;0;1b;0');
      addToast('Preset Loaded: TenZ Valorant Radiant ⚡', '800 DPI, 4000Hz, cyan compact crosshair', 'info');
    } else if (presetName === 'vice-city') {
      setMouseDpi(1600);
      setPollingRate(1000);
      addToast('Preset Loaded: Vice City Cruise 🌴', '1600 DPI smooth camera turning', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1220] border-2 border-indigo-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  GEAR CLOUD LOCKER
                </span>
                <span className="text-xs text-zinc-400 font-mono">Auto-Syncs on Check-in</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Gamer DPI, Polling &amp; Crosshair Profile
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

        {/* Quick Pro Presets Strip */}
        <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800 mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Load Pro Presets:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset('s1mple')}
              className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold"
            >
              🎯 s1mple (CS2)
            </button>
            <button
              onClick={() => applyPreset('tenz')}
              className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
            >
              ⚡ TenZ (Valorant)
            </button>
            <button
              onClick={() => applyPreset('vice-city')}
              className="px-3 py-1 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 text-xs font-semibold"
            >
              🌴 Vice City Cruise
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {/* Mouse Hardware DPI */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Mouse className="w-4 h-4 text-cyan-400" />
                <span>Optical Sensor DPI Setting</span>
              </label>
              <span className="font-mono text-cyan-400 font-black text-sm">
                {mouseDpi} DPI
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[400, 800, 1600, 3200].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMouseDpi(val)}
                  className={`py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                    mouseDpi === val
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                  }`}
                >
                  {val} DPI
                </button>
              ))}
            </div>
          </div>

          {/* Polling Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>USB Polling Rate (Sensor Refresh)</span>
              </label>
              <span className="font-mono text-indigo-400 font-black text-sm">
                {pollingRate} Hz
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1000, 4000, 8000].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setPollingRate(rate)}
                  className={`py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                    pollingRate === rate
                      ? 'border-indigo-500 bg-indigo-950/40 text-indigo-300'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                  }`}
                >
                  {rate} Hz {rate === 8000 ? '(Razer HyperPolling)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* CS2 Crosshair Code */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-amber-400" />
                <span>Counter-Strike 2 Crosshair Share Code</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopy(csCrosshair, 'CS2 Crosshair')}
                className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                {copiedCode === 'CS2 Crosshair' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode === 'CS2 Crosshair' ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <input
              type="text"
              value={csCrosshair}
              onChange={(e) => setCsCrosshair(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Valorant Profile */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-rose-400" />
                <span>Valorant Crosshair Profile String</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopy(valCrosshair, 'Valorant Crosshair')}
                className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
              >
                {copiedCode === 'Valorant Crosshair' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode === 'Valorant Crosshair' ? 'Copied!' : 'Copy String'}</span>
              </button>
            </div>
            <input
              type="text"
              value={valCrosshair}
              onChange={(e) => setValCrosshair(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Active Rig: {userActiveSession?.stationName || 'PC-01 (Apex VIP)'}
          </span>
          <button
            onClick={handleSaveAndSync}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-indigo-600/30"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Save &amp; Deploy to Station</span>
          </button>
        </div>

      </div>
    </div>
  );
};
