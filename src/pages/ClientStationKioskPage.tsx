import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Monitor,
  Lock,
  Unlock,
  Clock,
  AlertTriangle,
  Plus,
  UtensilsCrossed,
  BellRing,
  Volume2,
  ShieldAlert,
  Sparkles,
  QrCode,
  Zap,
  ArrowRight,
  ChevronRight,
  Wifi,
  Cpu,
  Tv,
  CheckCircle,
  X,
  CreditCard,
  Gamepad2,
} from 'lucide-react';
import { sound } from '../utils/audio';

export const ClientStationKioskPage: React.FC = () => {
  const { stationId: paramStationId } = useParams<{ stationId?: string }>();
  const navigate = useNavigate();

  const {
    stations,
    sessions,
    startSession,
    extendSession,
    endSession,
    requestDeskAssistance,
    broadcastCafePA,
    addToast,
  } = useApp();

  // Find targeted station or default to PC-01
  const activeStation =
    stations.find((s) => s.id === paramStationId || s.name.toLowerCase().includes((paramStationId || '').toLowerCase())) ||
    stations[0];

  const activeSession = sessions.find(
    (sess) => sess.stationId === activeStation.id && (sess.status === 'Active' || sess.status === 'Overdue')
  );

  // Live countdown state
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (!activeSession) return 0;
    const diff = new Date(activeSession.scheduledEndTime).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  });

  // Simulator test toggles
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [warningDismissed, setWarningDismissed] = useState<boolean>(false);

  // Sync timer with active session
  useEffect(() => {
    if (!activeSession) {
      setRemainingSeconds(0);
      setIsLockedOut(false);
      setShowWarningModal(false);
      return;
    }

    const interval = setInterval(() => {
      const diff = new Date(activeSession.scheduledEndTime).getTime() - Date.now();
      const secLeft = Math.floor(diff / 1000);

      if (secLeft <= 0) {
        setRemainingSeconds(0);
        setIsLockedOut(true);
        setShowWarningModal(false);
      } else {
        setRemainingSeconds(secLeft);
        setIsLockedOut(false);

        // 5-minute warning (300 seconds)
        if (secLeft <= 300 && secLeft > 0 && !warningDismissed && !showWarningModal) {
          setShowWarningModal(true);
          sound.playAlert();
          sound.speakCafePA(
            `Bhaiya, attention on station ${activeStation.name}! 5 minutes remaining. Would you like to extend?`
          );
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, activeStation.name, warningDismissed, showWarningModal]);

  // Format time as HH:MM:SS
  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Actions
  const handleExtend = (minutes: number) => {
    if (!activeSession) return;
    extendSession(activeSession.id, minutes);
    setShowWarningModal(false);
    setIsLockedOut(false);
    setWarningDismissed(true);
    sound.playSessionStart();
    sound.speakCafePA(`Station ${activeStation.name} extended by ${minutes} minutes. Keep gaming!`);
    addToast(`Session Extended! ⚡`, `Added ${minutes} minutes to ${activeStation.name}.`, 'success');
  };

  const handleSimulateStart1Hour = () => {
    startSession({
      stationId: activeStation.id,
      customerName: 'Devansh Roy',
      customerPhone: '+91 98765 43210',
      durationHours: 1,
      hourlyRate: activeStation.hourlyRate,
      paidUpfront: true,
      paymentMethod: 'UPI',
      notes: '1-Hour Walk-in Session',
    });
    setWarningDismissed(false);
    setIsLockedOut(false);
    setShowWarningModal(false);
    sound.playSessionStart();
    sound.speakCafePA(`Station ${activeStation.name} unlocked for 1 hour! Enjoy your game!`);
    addToast('Station Unlocked! 🎮', `1-hour session activated on ${activeStation.name}.`, 'success');
  };

  const handleSimulate5MinWarning = () => {
    setShowWarningModal(true);
    sound.playAlert();
    sound.speakCafePA(`Attention on ${activeStation.name}! 5 minutes remaining on your 1-hour session.`);
    addToast('5-Minute Alert Triggered! ⚠️', 'Simulated the customer session expiration warning popup.', 'warning');
  };

  const handleSimulateLockout = () => {
    setIsLockedOut(true);
    setShowWarningModal(false);
    sound.playAlert();
    sound.speakCafePA(`Time over on ${activeStation.name}. Station locked.`);
  };

  return (
    <div className="min-h-screen bg-[#07090f] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[400px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none" />

      {/* TOP CONTROLLER & TEST TOOLBAR (FOR ADMIN & DEMO PURPOSES) */}
      <header className="sticky top-0 z-40 bg-[#0d1222]/95 backdrop-blur-xl border-b border-indigo-900/30 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Station Switcher Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase font-black tracking-widest text-indigo-400">
                CLIENT PC KIOSK DISPLAY
              </span>
            </div>

            <select
              value={activeStation.id}
              onChange={(e) => navigate(`/client/${e.target.value}`)}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.type} - {st.status})
                </option>
              ))}
            </select>
          </div>

          {/* Test Simulation Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {!activeSession ? (
              <button
                onClick={handleSimulateStart1Hour}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Simulate 1-Hr Customer Start</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSimulate5MinWarning}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                  title="Simulate 5-minute remaining warning popup"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Test 5-Min Warning Popup</span>
                </button>

                <button
                  onClick={handleSimulateLockout}
                  className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/40 border border-red-500/40 text-red-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                  title="Simulate 0-minute time-up lock"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Test Time-Over Lock</span>
                </button>
              </>
            )}

            <Link
              to="/stations"
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold"
            >
              Back to Admin Panel &rarr;
            </Link>
          </div>

        </div>
      </header>

      {/* MAIN SCREEN DISPLAY AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between relative z-10">
        
        {/* =========================================================================
            STATE 1: IDLE LOCKED STATION (Customer just walked in, PC locked)
           ========================================================================= */}
        {!activeSession || isLockedOut ? (
          <div className="my-auto py-12 flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-6">
            
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 p-0.5 shadow-2xl shadow-red-500/30 animate-pulse">
              <div className="w-full h-full bg-[#12081c] rounded-[22px] flex items-center justify-center">
                <Lock className="w-10 h-10 text-red-400" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-black tracking-widest text-red-400 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30">
                {isLockedOut ? 'PLAYTIME CONCLUDED &bull; DESK LOCKED' : 'STATION LOCKED &bull; READY FOR ACTION'}
              </span>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {activeStation.name}
              </h1>

              <p className="text-sm text-zinc-400 max-w-lg mx-auto">
                {activeStation.specs.gpu || 'RTX 4090 24GB'} &bull; {activeStation.specs.monitor || '360Hz Fast-IPS'} &bull; {activeStation.specs.peripherals || 'Razer Huntsman Pro'}
              </p>
            </div>

            {/* QR Code & Counter Notice Card */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-center gap-4">
                {/* Simulated QR Code */}
                <div className="w-28 h-28 bg-white rounded-2xl p-2 flex flex-col items-center justify-between shadow-xl">
                  <div className="w-full h-full flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-6 h-6 border-4 border-black rounded-sm flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-black" />
                      </div>
                      <div className="w-6 h-6 border-4 border-black rounded-sm flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-black" />
                      </div>
                    </div>
                    <div className="text-center font-black text-[9px] text-indigo-700">QHAR</div>
                    <div className="flex justify-between">
                      <div className="w-6 h-6 border-4 border-black rounded-sm flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-black" />
                      </div>
                      <div className="w-6 h-6 grid grid-cols-2 gap-0.5 p-0.5">
                        <div className="bg-black" />
                        <div className="bg-black" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-left space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                    Hourly Gaming Rate
                  </p>
                  <p className="text-3xl font-black font-mono text-emerald-400">
                    ₹{activeStation.hourlyRate}
                    <span className="text-xs text-zinc-400 font-normal">/hr</span>
                  </p>
                  <p className="text-xs text-zinc-300 font-semibold">
                    Scan with Phone to Unlock or Visit Reception Counter
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <button
                  onClick={handleSimulateStart1Hour}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 font-black text-xs uppercase tracking-wider text-black shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4 fill-current" />
                  <span>Start 1-Hour Session (Admin Unlock)</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-500 font-mono">
              QHAR High-Speed 360Hz Network &bull; Station ID: #{activeStation.id.toUpperCase()}
            </p>
          </div>
        ) : (
          /* =========================================================================
             STATE 2: ACTIVE SESSION SEATED (Customer playing, floating transparent HUD)
             ========================================================================= */
          <div className="space-y-6">
            
            {/* Top Transparent Live Game HUD Overlay */}
            <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-r from-[#091814]/90 via-[#0a1b16]/90 to-[#071310]/90 backdrop-blur-xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                    LIVE GAMING SESSION IN PROGRESS
                  </span>
                  <span className="text-xs text-zinc-500">&bull;</span>
                  <span className="text-xs text-zinc-300 font-mono">
                    Player: <strong>{activeSession.customerName}</strong>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {activeStation.name}
                </h2>
                <p className="text-xs text-zinc-400">
                  {activeStation.specs.gpu} &bull; {activeStation.specs.monitor} &bull; Rate: ₹{activeSession.hourlyRate}/hr
                </p>
              </div>

              {/* Digital HUD Countdown Clock */}
              <div className="bg-black/70 border border-emerald-500/30 rounded-3xl px-8 py-4 flex items-center gap-6 shadow-2xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    PLAYTIME REMAINING
                  </p>
                  <p
                    className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                      remainingSeconds <= 300 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
                    }`}
                  >
                    {formatTime(remainingSeconds)}
                  </p>
                </div>

                <div className="text-right border-l border-zinc-800 pl-4 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase">Current Bill</span>
                  <p className="text-xl font-bold font-mono text-white">
                    ₹{activeSession.estimatedCharge}
                  </p>
                  <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Paid
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleExtend(30)}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+30 Min</span>
                </button>

                <button
                  onClick={() => handleExtend(60)}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+1 Hour</span>
                </button>

                <button
                  onClick={() => {
                    requestDeskAssistance(activeStation.name, 'Customer requested attendant from PC');
                    sound.playAlert();
                    addToast('Attendant Summoned! 🏃', 'Counter floor runner notified.', 'info');
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <BellRing className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                  <span>Call Staff</span>
                </button>
              </div>

            </div>

            {/* Simulated Desktop / Game Ready Background */}
            <div className="rounded-3xl border border-zinc-800 bg-[#0c101d] p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white">
                Battle Station Unlocked &bull; DirectPlay Active
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Games are running at uncapped FPS in full-screen. The floating timer HUD remains discreetly accessible.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleSimulate5MinWarning}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30"
                >
                  Trigger 5-Minute Warning Popup Now ⚠️
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* =========================================================================
          STATE 3: THE 5-MINUTE WARNING & EXTEND POPUP MODAL (THE EXACT USER FEATURE)
         ========================================================================= */}
      {showWarningModal && activeSession && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#120e24] border-2 border-amber-500/60 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            
            {/* Top Warning Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center animate-bounce">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">
                    SESSION EXPIRATION WARNING
                  </span>
                  <h3 className="text-xl font-black text-white">
                    Playtime Ending Soon!
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowWarningModal(false);
                  setWarningDismissed(true);
                }}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message */}
            <div className="space-y-2 mb-6">
              <p className="text-sm text-zinc-200">
                Hey <strong className="text-white">{activeSession.customerName}</strong>, your 1-hour session on{' '}
                <strong className="text-amber-300">{activeStation.name}</strong> will conclude in{' '}
                <span className="text-amber-400 font-mono font-black text-base">{formatTime(remainingSeconds)}</span>.
              </p>
              <p className="text-xs text-zinc-400">
                Would you like to extend your session right now to continue playing without any interruption or lockout?
              </p>
            </div>

            {/* Quick Extension Options */}
            <div className="space-y-2.5 mb-6">
              <button
                onClick={() => handleExtend(30)}
                className="w-full p-3.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-950/50 text-white flex items-center justify-between transition-all group hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    +30m
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-white group-hover:text-emerald-300">
                      Extend by +30 Minutes
                    </p>
                    <p className="text-[11px] text-zinc-400">Instant unlock, resume match</p>
                  </div>
                </div>
                <span className="font-mono font-black text-emerald-400 text-base">
                  +₹{Math.round(activeStation.hourlyRate * 0.5)}
                </span>
              </button>

              <button
                onClick={() => handleExtend(60)}
                className="w-full p-3.5 rounded-2xl border-2 border-indigo-500/50 bg-indigo-950/40 hover:bg-indigo-950/60 text-white flex items-center justify-between transition-all group hover:scale-[1.02] shadow-lg shadow-indigo-600/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                    +1h
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-white group-hover:text-cyan-300">
                      Extend by +1 Full Hour (Recommended)
                    </p>
                    <p className="text-[11px] text-zinc-400">Best value for ranked comp grind</p>
                  </div>
                </div>
                <span className="font-mono font-black text-cyan-400 text-base">
                  +₹{activeStation.hourlyRate}
                </span>
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-800 text-xs">
              <button
                onClick={() => {
                  setShowWarningModal(false);
                  setWarningDismissed(true);
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-semibold"
              >
                No, I&apos;ll finish at 1 hour
              </button>

              <button
                onClick={() => {
                  requestDeskAssistance(activeStation.name, 'Customer wants counter assistance to extend session');
                  sound.playAlert();
                  addToast('Runner Summoned', 'Counter bhaiya notified to visit your desk.', 'info');
                  setShowWarningModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Call Counter Bhaiya</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
