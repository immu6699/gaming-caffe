import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CAFE_GAMES_CATALOG, CafeGame } from '../../data/cafeGamesData';
import {
  Gamepad2,
  Monitor,
  Flame,
  Zap,
  Clock,
  Trophy,
  UtensilsCrossed,
  CreditCard,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Cpu,
  Tv,
  Plus,
  Compass,
  Star,
  Users,
  Play,
  X,
} from 'lucide-react';
import { sound } from '../../utils/audio';

export const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentCustomer,
    userActiveSession,
    stations,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    menuItems,
    orderFnbFromUser,
    extendSession,
    addToast,
  } = useApp();

  // Active session live countdown simulation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!userActiveSession) return;
    const calculateTime = () => {
      const end = new Date(userActiveSession.scheduledEndTime).getTime();
      const now = Date.now();
      const diff = Math.max(0, end - now);
      const totalSec = Math.floor(diff / 1000);
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [userActiveSession]);

  const activeStation = userActiveSession
    ? stations.find((s) => s.id === userActiveSession.stationId)
    : undefined;

  const quickExtend = (mins: number) => {
    if (!userActiveSession) return;
    extendSession(userActiveSession.id, mins);
    sound.playSessionStart();
    addToast('Time Added! ⚡', `Extended session on ${userActiveSession.stationName} by ${mins} minutes.`, 'success');
  };

  const quickOrderSnack = (itemName: string) => {
    const item = menuItems.find((m) => m.name.toLowerCase().includes(itemName.toLowerCase()));
    if (!item) {
      navigate('/user/cafe');
      return;
    }
    const stationName = userActiveSession ? userActiveSession.stationName : 'Customer Seat';
    orderFnbFromUser({
      stationName,
      items: [{ menuItem: item, quantity: 1 }],
      payWithWallet: (currentCustomer.walletBalance ?? 0) >= item.sellingPrice,
    });
  };

  const [selectedGameToLaunch, setSelectedGameToLaunch] = useState<CafeGame | null>(null);

  const handlePlayDashboardGame = (game: CafeGame) => {
    sound.playSessionStart();
    setSelectedGameToLaunch(game);
  };

  const handleQuickCheat = (code: string, label: string, fx: string) => {
    sound.playCheatCode();
    if (fx === 'tank') sound.playExplosion();
    else if (fx === 'weapons') sound.playGunshot();

    addToast(
      `CHEAT CODE ACTIVATED: ${code} ⚡`,
      `${label} - Injected into Cafe PC Battle Rig memory!`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* 1. CYBER HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-indigo-500/20 bg-gradient-to-r from-[#0d1326] via-[#101935] to-[#0d1326] p-6 sm:p-8 shadow-2xl">
        {/* Glow orb background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ELITE ESPORTS EXPERIENCE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-zinc-300">Level 42 Radiant Rank</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              WELCOME BACK,{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent uppercase">
                {currentCustomer.gamerTag || currentCustomer.name}
              </span>{' '}
              ⚡
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Book ultra low-latency 360Hz PCs, 4K PS5 suites, order gourmet hot snacks straight to your desk, or compete in community LAN tournaments.
            </p>

            {/* Quick stats chips */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-zinc-400">Streak:</span>
                <span className="font-bold text-white font-mono">
                  {currentCustomer.streakDays ?? 6} Days Active
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
                <Trophy className="w-4 h-4 text-indigo-400" />
                <span className="text-zinc-400">Loyalty Tier:</span>
                <span className="font-bold text-indigo-300">
                  {currentCustomer.status === 'VIP' ? 'VIP Radiant Club' : 'Gold Challenger'}
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-400">Balance:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  ₹{currentCustomer.walletBalance ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto">
            <Link
              to="/user/stations"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Monitor className="w-4 h-4" />
              <span>Book Gaming Rig Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/user/cafe"
              className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              <span>Order Cafe Food to Seat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. LIVE SEATED RIG HUD (OR CALL-TO-ACTION IF NOT SEATED) */}
      {userActiveSession ? (
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0c1a17] via-[#091512] to-[#070e0d] p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left: Station live status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                  LIVE DESK SESSION RUNNING
                </span>
                <span className="text-xs text-zinc-500">&bull;</span>
                <span className="text-xs text-zinc-400">
                  Station: <strong className="text-white">{userActiveSession.stationName}</strong>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">
                Seated at {userActiveSession.stationName}
              </h2>

              <p className="text-xs text-zinc-400 max-w-xl">
                {activeStation?.specs.gpu || 'RTX 4090 24GB'} &bull; {activeStation?.specs.monitor || '360Hz Fast-IPS'} &bull; Rate: ₹{userActiveSession.hourlyRate}/hr
              </p>
            </div>

            {/* Middle: Live countdown timer */}
            <div className="bg-black/50 border border-emerald-500/20 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-inner">
              <Clock className="w-6 h-6 text-emerald-400 animate-pulse" />
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Time Remaining
                </p>
                <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </p>
              </div>
            </div>

            {/* Right: Quick actions for seated player */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => quickExtend(30)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Add 30 minutes to your current session"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+30 Min</span>
              </button>

              <button
                onClick={() => quickExtend(60)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Add 1 hour to your current session"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+1 Hour</span>
              </button>

              <Link
                to="/user/session"
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Full Desk HUD</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">No Active Session Seated</p>
              <p className="text-xs text-zinc-400">
                Are you at the cafe? Pick an available station to unlock your high-FPS gaming desk!
              </p>
            </div>
          </div>
          <Link
            to="/user/stations"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap"
          >
            <span>View Available Rigs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 2.5 VICE CITY & CAFE PC ARCADE SPOTLIGHT (ATTRACTIVENESS DEMO) */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-pink-500/40 bg-black shadow-2xl min-h-[380px] flex flex-col justify-end group">
        {/* Background Big Cover Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e071d] via-[#0e071d]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e071d] via-[#0e071d]/60 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs uppercase tracking-wider shadow-lg">
                🌴 CAFE LEGEND #1
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/40 text-cyan-300 font-mono font-bold text-xs">
                240 FPS (4K RTX)
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>10/10 Legend</span>
              </span>
            </div>

            <Link
              to="/user/games"
              className="text-xs font-bold text-pink-300 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/50 border border-pink-500/30 backdrop-blur-md"
            >
              <span>Explore All 12 Games</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-lg">
              Grand Theft Auto: Vice City (RTX Remaster)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mt-1 leading-relaxed">
              Cruising down Ocean Drive with Emotion 98.3 playing on heavy cafe CRT headphones. The undisputed king of Indian cyber cafes!
            </p>
          </div>

          {/* Action & Cheat Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => {
                const vc = CAFE_GAMES_CATALOG.find((g) => g.id === 'gta-vice-city');
                if (vc) handlePlayDashboardGame(vc);
              }}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </div>
              <span>PLAY VICE CITY NOW</span>
            </button>

            <Link
              to="/user/games"
              className="px-4 py-3 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-pink-500/30 text-pink-300 text-xs font-bold flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4 text-pink-400" />
              <span>Interactive Cockpit &amp; Cheats</span>
            </Link>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-zinc-300 ml-auto hidden sm:flex">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>6 Gamers Playing in Cafe</span>
            </div>
          </div>

          {/* Quick Cheats Strip */}
          <div className="pt-2 border-t border-pink-500/20 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-pink-400 font-mono">
              Quick Cheats:
            </span>
            {[
              { code: 'PANZER', label: 'Rhino Tank', icon: '🚜', fx: 'tank' },
              { code: 'ASPIRINE', label: '100% Health', icon: '💊', fx: 'heal' },
              { code: 'NUTTERTOOLS', label: 'Heavy Guns', icon: '💣', fx: 'weapons' },
              { code: 'SEAWAYS', label: 'Drive on Water', icon: '🌊', fx: 'water' },
            ].map((c) => (
              <button
                key={c.code}
                onClick={() => handleQuickCheat(c.code, c.label, c.fx)}
                className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-pink-600 border border-pink-500/30 text-pink-300 hover:text-white font-mono text-[11px] font-bold transition-all"
              >
                {c.icon} {c.code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2.6 CAFE GAMES LIST WITH BIG IMAGES & PLAY BUTTONS (USER REQUESTED) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Battle Station Games &bull; Ready to Play
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Pre-installed on NVMe Gen4 SSDs across all cafe rigs &bull; Click &quot;PLAY&quot; to boot immediately
            </p>
          </div>

          <Link
            to="/user/games"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View Full Game Catalog &rarr;</span>
          </Link>
        </div>

        {/* Big Images Poster Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CAFE_GAMES_CATALOG.slice(0, 4).map((game) => (
            <div
              key={game.id}
              className="rounded-3xl border-2 border-zinc-800 bg-[#0c101d] overflow-hidden flex flex-col justify-between hover:border-indigo-500/60 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 group"
            >
              {/* Big Cover Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                <img
                  src={game.coverImage}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-transparent to-black/40" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-md">
                    {game.badge}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-md">
                    {game.testedFps.split(' ')[0]} FPS
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3 pointer-events-none flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                  <Star className="w-3 h-3 fill-current text-amber-400" />
                  <span>{game.rating}</span>
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                  <button
                    onClick={() => handlePlayDashboardGame(game)}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-2xl shadow-emerald-500/50 scale-95 group-hover:scale-100 transition-transform"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>PLAY NOW</span>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono mb-1">
                    <span>{game.category}</span>
                    <span>{game.storageGb} GB</span>
                  </div>

                  <h3 className="font-black text-white text-base group-hover:text-cyan-300 transition-colors leading-tight">
                    {game.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                    {game.subtitle}
                  </p>
                </div>

                {/* Prominent Play Button */}
                <div className="pt-3 border-t border-zinc-800/80">
                  <button
                    onClick={() => handlePlayDashboardGame(game)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>PLAY GAME</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. FEATURED RIGS SPOTLIGHT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Monitor className="w-5 h-5 text-indigo-400" />
              <span>Elite Gaming Stations & Rigs</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Browse top tier hardware tuned with low-latency displays and zero thermal throttling
            </p>
          </div>
          <Link
            to="/user/stations"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Explore All Rigs ({stations.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stations.slice(0, 4).map((station) => (
            <div
              key={station.id}
              className="rounded-2xl border border-zinc-800 bg-[#0c101d] p-4 flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {station.type}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      station.status === 'Available'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : station.status === 'In Use'
                        ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        station.status === 'Available'
                          ? 'bg-emerald-400'
                          : station.status === 'In Use'
                          ? 'bg-red-400'
                          : 'bg-amber-400'
                      }`}
                    />
                    {station.status}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">
                  {station.name}
                </h3>
                <p className="text-xs text-zinc-400 mb-3 line-clamp-2">
                  {station.specs.gpu || station.specs.consoleModel} &bull; {station.specs.monitor}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500">Hourly Rate</span>
                  <p className="text-base font-bold font-mono text-emerald-400">
                    ₹{station.hourlyRate}
                    <span className="text-xs text-zinc-400 font-normal">/hr</span>
                  </p>
                </div>
                <Link
                  to="/user/stations"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all"
                >
                  Book Slot
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. IN-SEAT CAFE SNACKS QUICK CAROUSEL */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-amber-400" />
              <span>Gamer Fuel & In-Seat Cafe</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Chilled energy drinks, crunchy peri-peri bites, and smash burgers delivered straight to your rig
            </p>
          </div>
          <Link
            to="/user/cafe"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Full Cafe Menu</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              name: 'Monster Ultra White 500ml',
              category: 'Energy Drinks',
              price: 180,
              tag: '⚡ 0 Sugar',
            },
            {
              name: 'Crispy Peri-Peri Fries',
              category: 'Snacks',
              price: 140,
              tag: '🌶️ Hot & Crispy',
            },
            {
              name: 'Double Smash Beef Burger',
              category: 'Fast Food',
              price: 260,
              tag: '⭐ Bestseller',
            },
            {
              name: 'Hazelnut Iced Cold Brew',
              category: 'Cold Beverages',
              price: 160,
              tag: '☕ Focus Brew',
            },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-zinc-800 bg-[#0c101d] p-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors"
            >
              <div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 inline-block mb-2">
                  {item.tag}
                </span>
                <h4 className="font-bold text-white text-xs sm:text-sm mb-1 leading-snug">
                  {item.name}
                </h4>
                <p className="text-[11px] text-zinc-500">{item.category}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 mt-3 flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-emerald-400">
                  ₹{item.price}
                </span>
                <button
                  onClick={() => quickOrderSnack(item.name)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. ESPORTS TOURNAMENTS BANNER & LEADERBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Tournament Spotlight */}
        <div className="lg:col-span-2 rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-[#0e1428] via-[#0c101e] to-[#070a12] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                LAN CHAMPIONSHIP &bull; WEEKEND SPECIAL
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                12 SLOTS REMAINING
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              Valorant 5v5 Bangalore LAN Invitational
            </h3>
            <p className="text-xs text-zinc-400 max-w-lg leading-relaxed">
              Standard competitive tournament rules, 128-tick private server, anti-cheat hardware lockdown, broadcast on cafe video walls with live casting.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase">Prize Pool</p>
                <p className="text-xl font-black font-mono text-amber-400">₹50,000</p>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase">Schedule</p>
                <p className="text-xs font-bold text-white">This Saturday, 11:00 AM</p>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase">Format</p>
                <p className="text-xs font-bold text-white">Double Elimination</p>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              Entry: Free for VIP / ₹200 Solo
            </span>
            <Link
              to="/user/tournaments"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all shadow-md shadow-indigo-600/30"
            >
              <span>Register Squad</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Top Gamers Leaderboard */}
        <div className="rounded-3xl border border-zinc-800 bg-[#0c101d] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Arena Hall of Fame</span>
              </h3>
              <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                This Week
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { rank: '1', tag: 'ViperX_IGL', hours: '142h', xp: '3,480 XP', badge: '🥇' },
                { rank: '2', tag: 'Valkyrie_Queen', hours: '86h', xp: '2,150 XP', badge: '🥈' },
                { rank: '3', tag: 'ShadowStrike_7', hours: '64h', xp: '1,890 XP', badge: '🥉' },
                { rank: '4', tag: 'CyberSamurai', hours: '52h', xp: '1,420 XP', badge: '⭐' },
              ].map((gamer) => (
                <div
                  key={gamer.tag}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    gamer.tag === currentCustomer.gamerTag
                      ? 'border-indigo-500/50 bg-indigo-600/10 text-white'
                      : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold w-4 text-center">{gamer.badge}</span>
                    <div>
                      <p className="font-bold flex items-center gap-1.5">
                        {gamer.tag}
                        {gamer.tag === currentCustomer.gamerTag && (
                          <span className="text-[9px] bg-indigo-500/30 text-indigo-300 px-1 rounded">
                            YOU
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-zinc-500">{gamer.hours} played</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-cyan-400">
                    {gamer.xp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 mt-3 text-center">
            <Link
              to="/user/profile"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View Your Rank & XP Progress &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK GAME LAUNCH MODAL */}
      {selectedGameToLaunch && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e101f] border-2 border-indigo-500/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Launch {selectedGameToLaunch.title}</h3>
                  <p className="text-[11px] text-zinc-400">{selectedGameToLaunch.testedFps}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGameToLaunch(null)}
                className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-video border border-zinc-800 mb-4">
              <img
                src={selectedGameToLaunch.bannerImage}
                alt={selectedGameToLaunch.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-3">
                <span className="text-xs font-black text-white">{selectedGameToLaunch.tagline}</span>
              </div>
            </div>

            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 text-xs text-zinc-300 mb-4 space-y-1">
              <p>Target Station: <strong className="text-white">{userActiveSession ? userActiveSession.stationName : 'PC-01 (Apex VIP 360Hz)'}</strong></p>
              <p>Storage: <strong className="text-cyan-400 font-mono">{selectedGameToLaunch.storageGb} GB Pre-allocated</strong></p>
              <p className="text-amber-300 italic pt-1">&quot;{selectedGameToLaunch.seniorWisdomNote}&quot;</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedGameToLaunch(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sound.playSessionStart();
                  addToast(
                    `Game Session Initialized! 🎮`,
                    `Booting ${selectedGameToLaunch.title} at ${selectedGameToLaunch.testedFps}. Have fun!`,
                    'success'
                  );
                  setSelectedGameToLaunch(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>BOOT RIG &amp; PLAY</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
