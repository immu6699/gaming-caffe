import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Smartphone,
  Check,
  X,
  Zap,
  Plus,
  UtensilsCrossed,
  BellRing,
  Volume2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface MobileDeskRemoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDeskRemoteModal: React.FC<MobileDeskRemoteModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    userActiveSession,
    currentCustomer,
    extendSession,
    requestDeskAssistance,
    addToast,
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [mobileVolume, setMobileVolume] = useState<number>(80);

  if (!isOpen) return null;

  const stationName = userActiveSession?.stationName || 'PC-01 (Apex Predator VIP)';
  const remoteUrl = `${window.location.origin}/user/session?station=${encodeURIComponent(
    stationName
  )}&remote=true`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(remoteUrl);
    setCopiedLink(true);
    sound.playClick();
    addToast('Remote URL Copied! 📋', 'Open on your mobile phone to control your desk.', 'info');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleQuickMobileExtend = (mins: number) => {
    if (userActiveSession) {
      extendSession(userActiveSession.id, mins);
      sound.playSessionStart();
      addToast(`Extended Session! ⚡`, `Added ${mins} minutes via Mobile Desk Remote.`, 'success');
    } else {
      addToast('No Active Session', 'Sit down at a desk to control playtime.', 'warning');
    }
  };

  const handleQuickCheatTrigger = (code: string) => {
    sound.playCheatCode();
    addToast(`Mobile Cheat Triggered: ${code} ⚡`, 'Injected to PC via mobile remote link!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0d1222] border-2 border-cyan-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Smartphone className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  DESK REMOTE COMPANION
                </span>
                <span className="text-xs text-zinc-400 font-mono">Zero Alt-Tab Lag</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                In-Seat Mobile Phone Remote
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

        {/* QR Code & Pairing Section */}
        <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-center gap-5 mb-6">
          {/* Simulated High-Res QR Code Card */}
          <div className="w-36 h-36 rounded-2xl bg-white p-2.5 flex flex-col items-center justify-between shadow-xl flex-shrink-0">
            {/* Visual SVG QR Grid */}
            <div className="w-full h-full flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-7 h-7 border-4 border-black rounded-md flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-sm" />
                </div>
                <div className="w-7 h-7 border-4 border-black rounded-md flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-sm" />
                </div>
              </div>
              <div className="flex items-center justify-center my-1">
                <div className="p-1 rounded bg-indigo-600 text-white font-black text-[9px]">
                  QHAR
                </div>
              </div>
              <div className="flex justify-between">
                <div className="w-7 h-7 border-4 border-black rounded-md flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-sm" />
                </div>
                <div className="w-6 h-6 grid grid-cols-2 gap-1 p-0.5">
                  <div className="bg-black rounded-xs" />
                  <div className="bg-black rounded-xs" />
                  <div className="bg-black rounded-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Pairing Info */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
              Scan with Phone Camera
            </span>
            <h4 className="text-base font-bold text-white">
              Paired to {stationName}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Order drinks, extend playtime, trigger Vice City cheats, and call cafe staff from your phone without minimizing your game!
            </p>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors mx-auto sm:mx-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Remote Link'}</span>
            </button>
          </div>
        </div>

        {/* Quick Remote Dashboard Simulation */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Interactive Remote Desk Controls:
          </h4>

          <div className="grid grid-cols-2 gap-3">
            {/* Quick +30m */}
            <button
              onClick={() => handleQuickMobileExtend(30)}
              className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 flex items-center justify-between text-left group transition-all"
            >
              <div>
                <span className="text-[10px] text-zinc-400 block">Add Playtime</span>
                <span className="font-bold text-sm text-white group-hover:text-emerald-300">
                  +30 Minutes
                </span>
              </div>
              <Plus className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </button>

            {/* Quick +1 Hour */}
            <button
              onClick={() => handleQuickMobileExtend(60)}
              className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 flex items-center justify-between text-left group transition-all"
            >
              <div>
                <span className="text-[10px] text-zinc-400 block">Add Playtime</span>
                <span className="font-bold text-sm text-white group-hover:text-emerald-300">
                  +1 Hour Play
                </span>
              </div>
              <Plus className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </button>

            {/* In-Seat Food */}
            <button
              onClick={() => {
                sound.playClick();
                addToast('Opening Cafe Menu... 🍔', 'Select your snack to send to this desk.', 'info');
                onClose();
              }}
              className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 flex items-center justify-between text-left group transition-all"
            >
              <div>
                <span className="text-[10px] text-zinc-400 block">Seat Delivery</span>
                <span className="font-bold text-sm text-white group-hover:text-amber-300">
                  Order Food / Maggi
                </span>
              </div>
              <UtensilsCrossed className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </button>

            {/* Call Staff Runner */}
            <button
              onClick={() => {
                requestDeskAssistance(stationName, 'Mobile remote dispatch requested');
                sound.playAlert();
                addToast('Runner Dispatched! 🏃', 'Floor attendant heading to your desk.', 'success');
              }}
              className="p-3.5 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 text-red-300 flex items-center justify-between text-left group transition-all"
            >
              <div>
                <span className="text-[10px] text-red-400 block">Floor Service</span>
                <span className="font-bold text-sm text-white group-hover:text-red-300">
                  Call Attendant
                </span>
              </div>
              <BellRing className="w-5 h-5 text-red-400 animate-bounce" />
            </button>
          </div>

          {/* Quick Cheat Remote Buttons */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase text-pink-400 tracking-wider block mb-2">
              Inject Cheats from Mobile Phone:
            </span>
            <div className="flex flex-wrap gap-2">
              {['PANZER', 'ASPIRINE', 'NUTTERTOOLS', 'SEAWAYS'].map((c) => (
                <button
                  key={c}
                  onClick={() => handleQuickCheatTrigger(c)}
                  className="px-3 py-1.5 rounded-xl bg-pink-950/30 border border-pink-500/30 hover:border-pink-400 text-pink-300 hover:text-white font-mono text-xs font-bold transition-colors"
                >
                  ⚡ {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Encrypted local WebSockets &bull; Latency &lt; 2ms
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs"
          >
            Close Remote
          </button>
        </div>

      </div>
    </div>
  );
};
