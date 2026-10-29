import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Clock,
  Zap,
  Plus,
  BellRing,
  UtensilsCrossed,
  Cpu,
  Monitor,
  Flame,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Wifi,
  Thermometer,
  ShieldCheck,
  CreditCard,
  X,
  Gamepad2,
} from 'lucide-react';
import { sound } from '../../utils/audio';

export const UserLiveSessionPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentCustomer,
    userActiveSession,
    stations,
    extendSession,
    requestDeskAssistance,
    orderFnbFromUser,
    menuItems,
    addToast,
    startSession,
  } = useApp();

  // Live Timer State
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; percent: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    percent: 100,
  });

  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callReason, setCallReason] = useState('Swap Mousepad / Clean Gear');
  const [customCallNote, setCustomCallNote] = useState('');

  // Station check-in picker for walk-ins who don't have active session yet
  const [selectedStationToStart, setSelectedStationToStart] = useState<string>('');
  const [walkinHours, setWalkinHours] = useState<number>(2);

  const activeStation = userActiveSession
    ? stations.find((s) => s.id === userActiveSession.stationId)
    : undefined;

  useEffect(() => {
    if (!userActiveSession) return;

    const timer = () => {
      const start = new Date(userActiveSession.startTime).getTime();
      const end = new Date(userActiveSession.scheduledEndTime).getTime();
      const now = Date.now();

      const totalDuration = Math.max(1, end - start);
      const remainingMs = Math.max(0, end - now);
      const percent = Math.min(100, Math.max(0, (remainingMs / totalDuration) * 100));

      const totalSec = Math.floor(remainingMs / 1000);
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      setTimeLeft({ hours, minutes, seconds, percent });
    };

    timer();
    const interval = setInterval(timer, 1000);
    return () => clearInterval(interval);
  }, [userActiveSession]);

  const handleExtend = (mins: number) => {
    if (!userActiveSession) return;
    extendSession(userActiveSession.id, mins);
    sound.playSessionStart();
    addToast(
      'Session Extended! ⚡',
      `Added ${mins} minutes to ${userActiveSession.stationName}. Keep fragging!`,
      'success'
    );
  };

  const handleCallStaff = () => {
    if (!userActiveSession) return;
    const finalReason = customCallNote.trim() ? `${callReason}: ${customCallNote}` : callReason;
    requestDeskAssistance(userActiveSession.stationName, finalReason);
    setIsCallModalOpen(false);
    setCustomCallNote('');
  };

  const handleStartWalkin = () => {
    if (!selectedStationToStart) {
      addToast('Please select a station', 'Choose an available rig to seat yourself', 'warning');
      return;
    }
    const st = stations.find((s) => s.id === selectedStationToStart);
    if (!st) return;

    startSession({
      stationId: st.id,
      customerName: currentCustomer.name,
      customerPhone: currentCustomer.phone,
      durationHours: walkinHours,
      hourlyRate: st.hourlyRate,
      paidUpfront: true,
      paymentMethod: 'UPI',
      notes: `Gamer Portal Check-in (@${currentCustomer.gamerTag || 'Player'})`,
    });
    sound.playSessionStart();
  };

  return (
    <div className="space-y-6">
      
      {/* If No Active Session Seated */}
      {!userActiveSession ? (
        <div className="rounded-3xl border border-zinc-800 bg-[#0d1222] p-8 text-center max-w-2xl mx-auto shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center">
            <Monitor className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">No Active Session Seated</h2>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Are you currently seated at a desk inside QHAR Gaming Cafe? Pick your station below to launch your in-seat gaming session HUD!
            </p>
          </div>

          <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 text-left space-y-3">
            <label className="block text-xs font-semibold text-zinc-300">
              Select Your Desk Station
            </label>
            <select
              value={selectedStationToStart}
              onChange={(e) => setSelectedStationToStart(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">-- Choose an Available Station --</option>
              {stations
                .filter((s) => s.status === 'Available')
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.type} - ₹{s.hourlyRate}/hr)
                  </option>
                ))}
            </select>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Playtime Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 5].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setWalkinHours(h)}
                    className={`py-1.5 rounded-lg border text-xs font-bold ${
                      walkinHours === h
                        ? 'border-indigo-500 bg-indigo-600/20 text-white'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartWalkin}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 font-bold text-white text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Desk Session</span>
            </button>

            <Link
              to="/user/stations"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-xs"
            >
              Browse Rig Inventory
            </Link>
          </div>
        </div>
      ) : (
        /* Seated Active Gamer HUD */
        <div className="space-y-6">
          
          {/* Top Live Banner */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#0a1815] via-[#091814] to-[#07110e] p-6 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              {/* Station Info */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>DESK TELEMETRY ACTIVE &bull; NO THERMAL THROTTLING</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {userActiveSession.stationName}
                </h1>

                <p className="text-xs text-zinc-400">
                  {activeStation?.specs.gpu || 'RTX 4090 24GB'} &bull; {activeStation?.specs.monitor || 'Alienware 360Hz Fast-IPS'} &bull; Hourly Rate: ₹{userActiveSession.hourlyRate}/hr
                </p>

                <div className="flex items-center gap-2 pt-1 text-xs text-zinc-400">
                  <span>Player:</span>
                  <span className="font-bold text-white">
                    {userActiveSession.customerName}
                  </span>
                  <span className="text-zinc-600">&bull;</span>
                  <span>Session Code:</span>
                  <span className="font-mono text-indigo-400 font-semibold">
                    #{userActiveSession.id.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Huge Digital HUD Countdown Clock */}
              <div className="bg-black/60 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl flex items-center gap-6">
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1">
                    PLAYTIME REMAINING
                  </p>
                  <p className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight">
                    {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </p>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${timeLeft.percent}%` }}
                    />
                  </div>
                </div>

                <div className="text-right border-l border-zinc-800 pl-4 space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase">Current Bill</p>
                  <p className="text-xl font-bold font-mono text-white">
                    ₹{userActiveSession.estimatedCharge}
                  </p>
                  <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {userActiveSession.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Desk Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Extend 30 min */}
            <button
              onClick={() => handleExtend(30)}
              className="p-4 rounded-2xl border border-zinc-800 bg-[#0d1222] hover:border-emerald-500/40 hover:bg-[#0f172a] transition-all flex items-center justify-between text-left group"
            >
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                  Quick Extend
                </span>
                <p className="text-base font-bold text-white group-hover:text-emerald-400">
                  +30 Minutes Play
                </p>
                <p className="text-xs font-mono text-emerald-400">
                  +₹{Math.round(userActiveSession.hourlyRate * 0.5)}
                </p>
              </div>
              <Plus className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </button>

            {/* Extend 1 hour */}
            <button
              onClick={() => handleExtend(60)}
              className="p-4 rounded-2xl border border-zinc-800 bg-[#0d1222] hover:border-emerald-500/40 hover:bg-[#0f172a] transition-all flex items-center justify-between text-left group"
            >
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                  Quick Extend
                </span>
                <p className="text-base font-bold text-white group-hover:text-emerald-400">
                  +1 Hour Play
                </p>
                <p className="text-xs font-mono text-emerald-400">
                  +₹{userActiveSession.hourlyRate}
                </p>
              </div>
              <Plus className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </button>

            {/* In-Seat Food Shortcut */}
            <Link
              to="/user/cafe"
              className="p-4 rounded-2xl border border-zinc-800 bg-[#0d1222] hover:border-amber-500/40 hover:bg-[#0f172a] transition-all flex items-center justify-between text-left group"
            >
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                  In-Seat Delivery
                </span>
                <p className="text-base font-bold text-white group-hover:text-amber-400">
                  Order Food to Seat
                </p>
                <p className="text-xs text-zinc-400">Snacks, Monster & Burgers</p>
              </div>
              <UtensilsCrossed className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </Link>

            {/* Call Attendant */}
            <button
              onClick={() => setIsCallModalOpen(true)}
              className="p-4 rounded-2xl border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 transition-all flex items-center justify-between text-left group"
            >
              <div>
                <span className="text-[10px] text-red-400 uppercase font-bold">
                  Floor Support
                </span>
                <p className="text-base font-bold text-white group-hover:text-red-300">
                  Call Desk Attendant
                </p>
                <p className="text-xs text-red-400/80">Help, Gear swap, Clean</p>
              </div>
              <BellRing className="w-5 h-5 text-red-400 animate-bounce" />
            </button>
          </div>

          {/* Rig Hardware Telemetry Gauges */}
          <div className="rounded-3xl border border-zinc-800 bg-[#0c101d] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Station Hardware Watchdog & Telemetry</span>
              </h2>
              <span className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" />
                <span>LAN Ping: 3ms (Zero Packet Loss)</span>
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">GPU Load</span>
                <p className="text-xl font-bold font-mono text-cyan-400">84%</p>
                <p className="text-[11px] text-zinc-400">RTX 4090 Direct Compute</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">Core Temp</span>
                <p className="text-xl font-bold font-mono text-emerald-400">62&deg;C</p>
                <p className="text-[11px] text-zinc-400">Asetek 360mm Liquid Loop</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">Monitor Refresh</span>
                <p className="text-xl font-bold font-mono text-indigo-400">360 Hz</p>
                <p className="text-[11px] text-zinc-400">G-Sync Fast-IPS Panel</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">Audio Latency</span>
                <p className="text-xl font-bold font-mono text-teal-400">1.2 ms</p>
                <p className="text-[11px] text-zinc-400">Sennheiser Hi-Fi DAC</p>
              </div>
            </div>
          </div>

          {/* Preloaded Cafe PC Games Launcher on Active Desk */}
          <div className="rounded-3xl border border-pink-500/30 bg-gradient-to-r from-[#170926] via-[#100720] to-[#0a0d1f] p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    DESK RIG PRE-LOADED
                  </span>
                  <span className="text-xs text-zinc-400">&bull;</span>
                  <span className="text-xs text-cyan-300 font-mono font-bold">NVMe Gen4 DirectPlay</span>
                </div>
                <h3 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-pink-400" />
                  <span>Launch Cafe Games on {userActiveSession.stationName}</span>
                </h3>
              </div>

              <Link
                to="/user/games"
                className="px-4 py-2 rounded-xl bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>Vice City Cheats &amp; Arcade Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  title: 'GTA: Vice City',
                  tag: '🌴 1986 RTX Remaster',
                  fps: '240 FPS (4K)',
                  desc: 'Ocean Drive cruise, Infernus, full cheat injector ready',
                  color: 'hover:border-pink-500/50 bg-pink-950/20 border-pink-500/20 text-pink-300',
                  badgeColor: 'bg-pink-500/20 text-pink-300',
                },
                {
                  title: 'Counter-Strike 2',
                  tag: '💥 de_dust2 LAN',
                  fps: '380 FPS (360Hz)',
                  desc: 'Ranked comp, low-jitter 128-tick Mumbai route',
                  color: 'hover:border-amber-500/50 bg-amber-950/20 border-amber-500/20 text-amber-300',
                  badgeColor: 'bg-amber-500/20 text-amber-300',
                },
                {
                  title: 'NFS: Most Wanted',
                  tag: '🏎️ BMW M3 GTR',
                  fps: '165 FPS (Ultra)',
                  desc: 'Rockport pursuit, Blacklist #1 rival battle',
                  color: 'hover:border-blue-500/50 bg-blue-950/20 border-blue-500/20 text-blue-300',
                  badgeColor: 'bg-blue-500/20 text-blue-300',
                },
                {
                  title: 'Tekken 8',
                  tag: '🥊 1v1 Grudge Match',
                  fps: '60 FPS (Zero Lag)',
                  desc: 'Tournament ready with Sanwa fight stick support',
                  color: 'hover:border-rose-500/50 bg-rose-950/20 border-rose-500/20 text-rose-300',
                  badgeColor: 'bg-rose-500/20 text-rose-300',
                },
              ].map((g) => (
                <div
                  key={g.title}
                  className={`p-3.5 rounded-2xl border ${g.color} flex flex-col justify-between transition-all group`}
                >
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1.5 ${g.badgeColor}`}>
                      {g.tag}
                    </span>
                    <h4 className="font-bold text-white text-sm group-hover:text-pink-300 transition-colors">
                      {g.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {g.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {g.fps}
                    </span>
                    <button
                      onClick={() => {
                        sound.playSessionStart();
                        addToast(
                          `Booting ${g.title} on ${userActiveSession.stationName}! 🚀`,
                          `Game engine initialized at locked ${g.fps}. Have a great gaming session!`,
                          'success'
                        );
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white hover:text-black text-white text-xs font-bold transition-all"
                    >
                      Play
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session In-Seat Orders & Bill Ledger */}
          <div className="rounded-3xl border border-zinc-800 bg-[#0c101d] p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span>Current Session Charges & In-Seat Orders</span>
            </h3>

            <div className="divide-y divide-zinc-800 text-xs">
              <div className="py-2.5 flex items-center justify-between text-zinc-300">
                <span>Gaming Rig Playtime Base Charge</span>
                <span className="font-mono font-bold text-white">
                  ₹{userActiveSession.estimatedCharge}
                </span>
              </div>

              {(userActiveSession.totalFnbAmount || 0) > 0 && (
                <div className="py-2.5 flex items-center justify-between text-amber-300">
                  <span>Linked In-Seat F&B Orders</span>
                  <span className="font-mono font-bold">
                    +₹{userActiveSession.totalFnbAmount}
                  </span>
                </div>
              )}

              <div className="py-2.5 flex items-center justify-between text-zinc-400">
                <span>Payment Status</span>
                <span className="font-semibold text-emerald-400">
                  {userActiveSession.paymentStatus} via {userActiveSession.paymentMethod || 'Desk'}
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* CALL ATTENDANT MODAL */}
      {isCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-red-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-white text-base">Call Floor Attendant</h3>
              </div>
              <button
                onClick={() => setIsCallModalOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-3">
              Station:{' '}
              <strong className="text-white">
                {userActiveSession?.stationName}
              </strong>
            </p>

            <div className="space-y-2 mb-4">
              {[
                'Swap Mousepad / Clean Gear',
                'Audio / Headset / Mic Issue',
                'Steam / Discord / Anti-cheat Login Help',
                'In-Seat Food Delivery Status',
                'Clean Desk / Clear Soda Cans',
                'Technical Game Crash / Driver Reset',
              ].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setCallReason(reason)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    callReason === reason
                      ? 'border-indigo-500 bg-indigo-600/20 text-white'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Specific Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. left headphone ear silent, bring peri-peri dip"
                value={customCallNote}
                onChange={(e) => setCustomCallNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleCallStaff}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
            >
              <BellRing className="w-4 h-4" />
              <span>Summon Runner to Desk</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
