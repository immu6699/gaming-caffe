import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  Shield,
  Flame,
  Award,
  Radio,
  Tv,
  CheckCircle,
  HelpCircle,
  X,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Obstacle {
  id: number;
  x: number; // 0 to 100% of road
  y: number; // 0 to 100% down screen
  type: 'cop' | 'barricade' | 'cash' | 'cassette';
  speed: number;
}

export const ViceCityCruiserDemo: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  // Game states
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [cashCollected, setCashCollected] = useState<number>(1200);
  const [health, setHealth] = useState<number>(100);
  const [speedKmh, setSpeedKmh] = useState<number>(140);
  const [carX, setCarX] = useState<number>(50); // percentage 20% to 80%
  const [isNitroActive, setIsNitroActive] = useState<boolean>(false);
  const [activeCheat, setActiveCheat] = useState<string | null>(null);
  const [cheatEffectTimer, setCheatEffectTimer] = useState<number>(0);
  const [cheatInput, setCheatInput] = useState<string>('');
  const [isCrtScanlines, setIsCrtScanlines] = useState<boolean>(true);
  const [isTankMode, setIsTankMode] = useState<boolean>(false);
  const [isSeawaysMode, setIsSeawaysMode] = useState<boolean>(false);
  const [isLaserFiring, setIsLaserFiring] = useState<boolean>(false);
  const [stationRig, setStationRig] = useState<string>('PC-01 (Apex Predator VIP)');

  // Obstacles state
  const [obstacles, setObstacles] = useState<Obstacle[]>([
    { id: 1, x: 30, y: 15, type: 'cash', speed: 1.2 },
    { id: 2, x: 70, y: 40, type: 'cop', speed: 1.5 },
    { id: 3, x: 45, y: 70, type: 'cassette', speed: 1.1 },
  ]);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  // Move player Left or Right
  const moveLeft = () => {
    if (isGameOver) return;
    setCarX((prev) => Math.max(20, prev - 8));
    sound.playClick();
  };

  const moveRight = () => {
    if (isGameOver) return;
    setCarX((prev) => Math.min(80, prev + 8));
    sound.playClick();
  };

  const triggerNitro = () => {
    if (isGameOver) return;
    setIsNitroActive(true);
    setSpeedKmh((prev) => Math.min(280, prev + 60));
    sound.playNitro();
    setTimeout(() => {
      setIsNitroActive(false);
      setSpeedKmh(140);
    }, 2500);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        moveLeft();
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        moveRight();
      } else if (e.code === 'Space') {
        e.preventDefault();
        triggerNitro();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  // Main Game Loop for obstacle movement & collision
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const gameInterval = setInterval(() => {
      setObstacles((prevObs) => {
        const nextObs: Obstacle[] = [];
        const baseSpeed = isNitroActive ? 3.5 : 1.8;

        prevObs.forEach((obs) => {
          const newY = obs.y + obs.speed * baseSpeed;

          // Check collision with player car (car is around y = 82% to 92%)
          if (newY >= 78 && newY <= 92 && Math.abs(obs.x - carX) < 14) {
            // Collision triggered!
            if (obs.type === 'cash') {
              setCashCollected((c) => c + 100);
              setScore((s) => s + 250);
              sound.playCoin();
            } else if (obs.type === 'cassette') {
              setCashCollected((c) => c + 250);
              setScore((s) => s + 500);
              sound.playCheatCode();
            } else if (obs.type === 'cop' || obs.type === 'barricade') {
              if (isTankMode) {
                // Tank crushes obstacle!
                sound.playExplosion();
                setScore((s) => s + 400);
              } else if (isSeawaysMode) {
                // Skims past obstacle on water!
                sound.playCoin();
                setScore((s) => s + 150);
              } else {
                // Car damaged
                sound.playExplosion();
                setHealth((h) => {
                  const updated = Math.max(0, h - 30);
                  if (updated <= 0) {
                    setIsGameOver(true);
                  }
                  return updated;
                });
              }
            }
            // Consumed/hit, do not carry over
            return;
          }

          if (newY < 105) {
            nextObs.push({ ...obs, y: newY });
          }
        });

        // Spawn new obstacle if fewer than 4
        if (nextObs.length < 4 && Math.random() > 0.4) {
          const types: ('cop' | 'barricade' | 'cash' | 'cassette')[] = [
            'cop',
            'barricade',
            'cash',
            'cash',
            'cassette',
          ];
          const chosenType = types[Math.floor(Math.random() * types.length)];
          const randomX = Math.floor(Math.random() * 55) + 22;
          nextObs.push({
            id: Date.now() + Math.random(),
            x: randomX,
            y: 0,
            type: chosenType,
            speed: 1 + Math.random() * 0.8,
          });
        }

        return nextObs;
      });

      // Passive score increase
      setScore((s) => s + (isNitroActive ? 5 : 2));
    }, 50);

    return () => clearInterval(gameInterval);
  }, [isPlaying, isGameOver, carX, isNitroActive, isTankMode, isSeawaysMode]);

  // Apply Vice City Cheat Code
  const applyCheat = (code: string) => {
    const clean = code.trim().toUpperCase();
    sound.playCheatCode();

    if (clean === 'PANZER') {
      setIsTankMode(true);
      setActiveCheat('PANZER: RHINO TANK MODE ACTIVATED!');
      setTimeout(() => setIsTankMode(false), 8000);
    } else if (clean === 'ASPIRINE') {
      setHealth(100);
      setActiveCheat('ASPIRINE: 100% HEALTH & REPAIRS RESTORED!');
    } else if (clean === 'NUTTERTOOLS') {
      setIsLaserFiring(true);
      setActiveCheat('NUTTERTOOLS: DUAL TURRET LASER VOLLEY!');
      sound.playGunshot();
      // Clear all cops and barricades
      setObstacles((prev) => prev.filter((o) => o.type === 'cash' || o.type === 'cassette'));
      setTimeout(() => setIsLaserFiring(false), 4000);
    } else if (clean === 'SEAWAYS') {
      setIsSeawaysMode(true);
      setActiveCheat('SEAWAYS: NEON HOVERCRAFT OVER WATER!');
      setTimeout(() => setIsSeawaysMode(false), 8000);
    } else if (clean === 'BIGBANG') {
      sound.playExplosion();
      setActiveCheat('BIGBANG: ALL POLICE & BARRICADES DETONATED!');
      setObstacles((prev) => prev.filter((o) => o.type === 'cash' || o.type === 'cassette'));
      setScore((s) => s + 1000);
    } else if (clean === 'LEAVEMEALONE') {
      setActiveCheat('LEAVEMEALONE: ZERO WANTED LEVEL IN VICE CITY!');
      setObstacles((prev) => prev.filter((o) => o.type !== 'cop'));
    } else {
      setActiveCheat(`CHEAT ACCEPTED: [${clean}] BONUS XP!`);
      setCashCollected((c) => c + 300);
    }

    setCheatInput('');
    setTimeout(() => setActiveCheat(null), 3500);
  };

  const restartGame = () => {
    setHealth(100);
    setScore(0);
    setCarX(50);
    setIsGameOver(false);
    setIsTankMode(false);
    setIsSeawaysMode(false);
    setObstacles([
      { id: 1, x: 30, y: 15, type: 'cash', speed: 1.2 },
      { id: 2, x: 70, y: 40, type: 'cop', speed: 1.5 },
      { id: 3, x: 45, y: 70, type: 'cassette', speed: 1.1 },
    ]);
    sound.playSessionStart();
  };

  return (
    <div className="relative rounded-3xl border-2 border-fuchsia-500/40 bg-gradient-to-b from-[#180a29] via-[#0d071a] to-[#080310] p-4 sm:p-6 shadow-2xl shadow-fuchsia-600/20 overflow-hidden text-white font-sans">
      
      {/* Vice City Neon Gradient Background Glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Banner Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-fuchsia-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-600 via-pink-500 to-cyan-400 p-[2px] shadow-lg shadow-pink-500/30">
            <div className="w-full h-full bg-[#120722] rounded-[14px] flex items-center justify-center">
              <span className="text-xl">🌴</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-wider bg-gradient-to-r from-fuchsia-400 via-pink-300 to-cyan-300 bg-clip-text text-transparent uppercase">
                VICE CITY 1986 CRUISER
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 animate-pulse">
                LIVE DEMO RIG
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Steer Tommy Vercetti's cruiser down Ocean Drive &bull; Enter classic cyber cafe cheats!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsCrtScanlines(!isCrtScanlines)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isCrtScanlines
                ? 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300'
                : 'bg-zinc-800/60 border-zinc-700 text-zinc-400'
            }`}
            title="Toggle authentic 2002 cyber cafe CRT scanline monitor effect"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>CRT 2002 {isCrtScanlines ? 'ON' : 'OFF'}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Cheat Notification Banner */}
      {activeCheat && (
        <div className="relative z-20 my-3 p-3 rounded-2xl bg-gradient-to-r from-fuchsia-600/90 via-pink-600/90 to-cyan-500/90 text-white text-xs sm:text-sm font-black tracking-wider text-center shadow-lg shadow-pink-500/40 flex items-center justify-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{activeCheat}</span>
          <Sparkles className="w-4 h-4 text-yellow-300" />
        </div>
      )}

      {/* Main Game Stage / Canvas Simulation */}
      <div className="relative mt-4 rounded-2xl overflow-hidden border border-fuchsia-500/40 bg-[#090312] aspect-[16/10] sm:aspect-[16/9] flex flex-col justify-between p-4 shadow-inner">
        
        {/* Optional Retro CRT Scanlines overlay */}
        {isCrtScanlines && (
          <div
            className="absolute inset-0 pointer-events-none z-30 opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%)',
              backgroundSize: '100% 4px',
            }}
          />
        )}

        {/* Ocean View Retro Sunset Horizon */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Synthwave Sunset Sky */}
          <div className="h-1/2 bg-gradient-to-b from-[#1a0536] via-[#3d0b52] to-[#b31e6f] relative">
            {/* Giant Retro Sun */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-t from-amber-400 via-pink-500 to-fuchsia-600 blur-[2px] opacity-90 shadow-[0_0_60px_rgba(236,72,153,0.8)]">
              {/* Sun horizontal line cuts */}
              <div className="absolute inset-0 flex flex-col justify-end gap-1.5 pb-2">
                <div className="h-1 bg-[#1a0536]/80 w-full" />
                <div className="h-1.5 bg-[#1a0536]/80 w-full" />
                <div className="h-2 bg-[#1a0536]/80 w-full" />
                <div className="h-2.5 bg-[#1a0536]/80 w-full" />
              </div>
            </div>

            {/* Neon Miami Palms silhouette */}
            <div className="absolute bottom-0 left-4 text-4xl opacity-75">🌴🌴</div>
            <div className="absolute bottom-0 right-4 text-4xl opacity-75">🌴🌴</div>
          </div>

          {/* Perspective Moving Synthwave Road / Ocean */}
          <div
            className={`h-1/2 relative overflow-hidden ${
              isSeawaysMode
                ? 'bg-gradient-to-b from-cyan-900 via-teal-900 to-[#022c22]'
                : 'bg-gradient-to-b from-[#24083a] via-[#150424] to-[#0c0214]'
            }`}
          >
            {/* Road perspective boundaries */}
            <div
              className="absolute inset-0 mx-auto w-4/5"
              style={{
                background: isSeawaysMode
                  ? 'radial-gradient(ellipse at center, rgba(6,182,212,0.2) 0%, rgba(2,44,34,0.8) 100%)'
                  : 'linear-gradient(to bottom, #19052a 0%, #10031c 100%)',
                clipPath: 'polygon(25% 0%, 75% 0%, 95% 100%, 5% 100%)',
              }}
            >
              {/* Animated Road Lane Markers */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 flex flex-col justify-between py-2">
                <div className="h-6 w-full bg-pink-500/80 rounded animate-pulse" />
                <div className="h-8 w-full bg-pink-500/80 rounded animate-pulse" />
                <div className="h-12 w-full bg-pink-500/80 rounded animate-pulse" />
                <div className="h-16 w-full bg-pink-500/80 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* HUD Top Overlay Bar */}
        <div className="relative z-20 flex items-center justify-between gap-3 text-xs">
          {/* Health & Status */}
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-fuchsia-500/30">
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-400">Tommy's Armor</p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-24 sm:w-32 h-2.5 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                  <div
                    className={`h-full transition-all duration-300 ${
                      health > 50
                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                        : health > 20
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                        : 'bg-gradient-to-r from-red-600 to-red-400 animate-pulse'
                    }`}
                    style={{ width: `${health}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-xs">{health}%</span>
              </div>
            </div>

            <div className="h-6 w-px bg-zinc-700 hidden sm:block" />

            <div className="hidden sm:block">
              <p className="text-[10px] uppercase font-bold text-zinc-400">Speed</p>
              <p className="font-mono font-extrabold text-cyan-300">
                {speedKmh} <span className="text-[10px] font-normal text-zinc-400">KM/H</span>
              </p>
            </div>
          </div>

          {/* Cash & Score */}
          <div className="flex items-center gap-2">
            <div className="bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-500/30 text-right">
              <p className="text-[10px] uppercase font-bold text-emerald-400">Vice City Cash</p>
              <p className="font-mono font-black text-emerald-300 text-sm sm:text-base">
                ${cashCollected}
              </p>
            </div>

            <div className="bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-fuchsia-500/30 text-right">
              <p className="text-[10px] uppercase font-bold text-fuchsia-300">Score</p>
              <p className="font-mono font-black text-white text-sm sm:text-base">{score}</p>
            </div>
          </div>
        </div>

        {/* Interactive Obstacles on Road */}
        <div className="relative z-10 flex-1 w-full pointer-events-none">
          {obstacles.map((obs) => (
            <div
              key={obs.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
              style={{
                left: `${obs.x}%`,
                top: `${obs.y}%`,
                transform: `scale(${0.6 + (obs.y / 100) * 0.8})`,
              }}
            >
              {obs.type === 'cop' && (
                <div className="flex flex-col items-center">
                  <span className="text-xs animate-ping mb-0.5">🚨</span>
                  <div className="px-2 py-1 rounded-lg bg-blue-900 border border-cyan-400 shadow-lg shadow-cyan-500/50 text-[10px] font-black uppercase text-cyan-200">
                    VCPD CRUISER
                  </div>
                </div>
              )}

              {obs.type === 'barricade' && (
                <div className="px-2.5 py-1 rounded bg-amber-600/90 border border-yellow-300 shadow-md text-[10px] font-black text-black">
                  ⚠️ ROADBLOCK
                </div>
              )}

              {obs.type === 'cash' && (
                <div className="p-1 rounded-lg bg-emerald-500/30 border border-emerald-400 shadow-lg shadow-emerald-500/50 flex items-center gap-1 text-[11px] font-black text-emerald-300 animate-bounce">
                  <span>💼</span>
                  <span>+$100</span>
                </div>
              )}

              {obs.type === 'cassette' && (
                <div className="p-1 rounded-lg bg-fuchsia-500/30 border border-pink-400 shadow-lg shadow-fuchsia-500/50 flex items-center gap-1 text-[11px] font-black text-pink-300 animate-pulse">
                  <span>📼</span>
                  <span>FLASH FM</span>
                </div>
              )}
            </div>
          ))}

          {/* Player Car / Tank / Seaways Craft */}
          <div
            className="absolute bottom-6 -translate-x-1/2 transition-all duration-75 z-20 flex flex-col items-center"
            style={{ left: `${carX}%` }}
          >
            {/* Nitro flames or water spray */}
            {isNitroActive && (
              <div className="flex gap-4 -mb-2">
                <span className="w-2.5 h-6 bg-gradient-to-t from-cyan-400 via-blue-500 to-transparent rounded-full animate-bounce" />
                <span className="w-2.5 h-6 bg-gradient-to-t from-cyan-400 via-blue-500 to-transparent rounded-full animate-bounce" />
              </div>
            )}

            {isLaserFiring && (
              <div className="w-full flex justify-between px-2 -mb-8">
                <div className="w-1.5 h-36 bg-pink-500 shadow-[0_0_12px_#ec4899] animate-pulse" />
                <div className="w-1.5 h-36 bg-pink-500 shadow-[0_0_12px_#ec4899] animate-pulse" />
              </div>
            )}

            {/* Car body graphics */}
            {isTankMode ? (
              <div className="relative px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-700 via-fuchsia-600 to-pink-700 border-2 border-fuchsia-300 shadow-2xl shadow-fuchsia-500/60 flex flex-col items-center">
                <div className="w-3 h-8 bg-zinc-900 border border-fuchsia-300 -mt-6 rounded-t" />
                <span className="text-[10px] font-black tracking-widest text-white">
                  RHINO TANK (PANZER)
                </span>
                <span className="text-[9px] text-fuchsia-200">INVULNERABLE RAMMING</span>
              </div>
            ) : isSeawaysMode ? (
              <div className="relative px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-600 border-2 border-cyan-300 shadow-2xl shadow-cyan-500/60 flex flex-col items-center">
                <span className="text-[10px] font-black tracking-widest text-white">
                  OCEAN HOVERCRAFT
                </span>
                <div className="flex gap-2 text-xs">🌊 🌊 🌊</div>
              </div>
            ) : (
              <div className="relative px-6 py-3 rounded-2xl bg-gradient-to-r from-white via-zinc-100 to-zinc-200 border-2 border-pink-400 shadow-2xl shadow-pink-500/50 flex flex-col items-center group">
                <div className="w-10 h-3 bg-cyan-900/80 rounded-t-lg -mt-4 border border-cyan-400/40" />
                <span className="text-[10px] font-black tracking-widest text-pink-700">
                  CHEETAH 1986
                </span>
                <span className="text-[9px] font-bold text-zinc-600">TOMMY VERCETTI</span>
              </div>
            )}
          </div>
        </div>

        {/* Game Over Screen Modal */}
        {isGameOver && (
          <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
            <span className="text-4xl">💥</span>
            <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-red-500 via-pink-500 to-fuchsia-400 bg-clip-text text-transparent uppercase">
              BUSTED / RIG CRASHED!
            </h3>
            <p className="text-xs text-zinc-300 max-w-sm">
              Your Cheetah caught fire on Ocean Beach! Bhaiya says "Bhai time over ho gaya, par tu
              cheat code try kar sakta tha!"
            </p>
            <div className="flex items-center gap-4 py-2">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase">Final Score</p>
                <p className="text-xl font-mono font-black text-white">{score}</p>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase">Cash Earned</p>
                <p className="text-xl font-mono font-black text-emerald-400">${cashCollected}</p>
              </div>
            </div>
            <button
              onClick={restartGame}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-500 hover:to-pink-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-500/30 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Insert 10-Rupee Coin & Respawn</span>
            </button>
          </div>
        )}

        {/* Touch Controls Bar for Mobile & Quick Play */}
        <div className="relative z-20 flex items-center justify-between gap-2 pt-2 border-t border-fuchsia-500/20">
          <div className="flex items-center gap-2">
            <button
              onClick={moveLeft}
              className="px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-fuchsia-500/30 text-white font-black text-xs transition-colors flex items-center gap-1"
            >
              <span>&larr;</span>
              <span>STEER LEFT</span>
            </button>
            <button
              onClick={moveRight}
              className="px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-fuchsia-500/30 text-white font-black text-xs transition-colors flex items-center gap-1"
            >
              <span>STEER RIGHT</span>
              <span>&rarr;</span>
            </button>
          </div>

          <button
            onClick={triggerNitro}
            disabled={isNitroActive || isGameOver}
            className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-md ${
              isNitroActive
                ? 'bg-cyan-500 text-black shadow-cyan-500/50 animate-pulse'
                : 'bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 text-white shadow-pink-500/30'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{isNitroActive ? 'NITRO ACTIVE!' : 'NITRO PURGE (SPACE)'}</span>
          </button>
        </div>
      </div>

      {/* Cyber Cafe Vice City Cheat Codes Toolbar */}
      <div className="mt-4 p-4 rounded-2xl border border-fuchsia-500/30 bg-[#120624]/90 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">📜</span>
            <h4 className="text-xs sm:text-sm font-black text-fuchsia-300 uppercase tracking-wide">
              CAFE MONITOR CHEAT SHEET (CLICK TO ACTIVATE INSTANTLY)
            </h4>
          </div>
          <span className="text-[11px] text-zinc-400">
            Or type code & hit Enter:
          </span>
        </div>

        {/* Cheat Code Quick Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { code: 'PANZER', label: 'Tank Mode', color: 'from-fuchsia-600 to-pink-600' },
            { code: 'ASPIRINE', label: '100% Health', color: 'from-emerald-600 to-teal-600' },
            { code: 'NUTTERTOOLS', label: 'Minigun Lasers', color: 'from-amber-600 to-orange-600' },
            { code: 'SEAWAYS', label: 'Drive on Water', color: 'from-cyan-600 to-blue-600' },
            { code: 'BIGBANG', label: 'Explode All Cops', color: 'from-red-600 to-rose-600' },
            { code: 'LEAVEMEALONE', label: 'Zero Wanted', color: 'from-indigo-600 to-purple-600' },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => applyCheat(item.code)}
              className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${item.color} text-white font-mono font-black text-xs shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1`}
              title={`Activate cheat: ${item.code}`}
            >
              <Zap className="w-3 h-3 text-yellow-300" />
              <span>{item.code}</span>
              <span className="text-[10px] font-normal opacity-85">({item.label})</span>
            </button>
          ))}
        </div>

        {/* Custom Cheat Code Text Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (cheatInput.trim()) applyCheat(cheatInput);
          }}
          className="flex items-center gap-2 pt-1"
        >
          <input
            type="text"
            value={cheatInput}
            onChange={(e) => setCheatInput(e.target.value)}
            placeholder="Type any Vice City cheat (e.g. PANZER, ASPIRINE, NUTTERTOOLS)..."
            className="flex-1 bg-black/60 border border-fuchsia-500/40 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider transition-colors"
          >
            Apply Cheat
          </button>
        </form>
      </div>

      {/* Senior Cafe Master 30-Year Memory Note */}
      <div className="mt-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3 text-xs text-zinc-400">
        <span className="text-xl">👴</span>
        <div>
          <strong className="text-zinc-200">Senior Bhaiya's 30-Year Rule: </strong>
          "In 2002, we charged ₹15/hr for Vice City. If someone entered PANZER and backed into the
          cafe door, we charged ₹5 extra for keyboard wear and tear! Enjoy the demo, beta!"
        </div>
      </div>
    </div>
  );
};
