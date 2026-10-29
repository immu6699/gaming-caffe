import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  CAFE_GAMES_CATALOG,
  SENIOR_CAFE_MASTER,
  CafeGame,
  ClassicCheat,
} from '../../data/cafeGamesData';
import {
  Gamepad2,
  Sparkles,
  Zap,
  Flame,
  Radio,
  Volume2,
  VolumeX,
  Tv,
  Monitor,
  Cpu,
  Trophy,
  Clock,
  Play,
  RotateCcw,
  Shield,
  Heart,
  Car,
  Crosshair,
  ChevronRight,
  Info,
  CheckCircle,
  Search,
  ExternalLink,
  Sliders,
  Award,
  Coffee,
  Bookmark,
  Share2,
  Terminal,
  Grid,
  List,
  Star,
  Users,
  HardDrive,
  X,
} from 'lucide-react';
import { sound } from '../../utils/audio';

const VICE_CITY_RADIO_STATIONS = [
  { id: 'flash', name: 'Flash FM', dj: 'Toni', genre: '80s Pop & Synthwave', track: 'Michael Jackson - Billie Jean' },
  { id: 'wave', name: 'Wave 103', dj: 'Adam First', genre: 'New Wave & Post-Punk', track: 'A Flock of Seagulls - I Ran' },
  { id: 'emotion', name: 'Emotion 98.3', dj: 'Fernando Martinez', genre: 'Power Ballads', track: 'Cutting Crew - (I Just) Died In Your Arms' },
  { id: 'vrock', name: 'V-Rock', dj: 'Lazlow', genre: 'Heavy Metal & Hard Rock', track: 'Judas Priest - You\'ve Got Another Thing Comin\'' },
  { id: 'fever', name: 'Fever 105', dj: 'Oliver "Ladykiller" Biscuit', genre: 'Disco & Soul', track: 'Michael Jackson - Wanna Be Startin\' Somethin\'' },
];

export const UserGamesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    stations,
    userActiveSession,
    currentCustomer,
    addToast,
    startSession,
  } = useApp();

  // Filter & Layout State
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'poster' | 'banner'>('poster');

  // Currently playing / booting game modal
  const [activeGameModal, setActiveGameModal] = useState<CafeGame | null>(null);
  const [bootingProgress, setBootingProgress] = useState<number>(0);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [selectedStationIdForLaunch, setSelectedStationIdForLaunch] = useState<string>('');

  // Vice City Simulator State
  const [vcHealth, setVcHealth] = useState<number>(100);
  const [vcArmor, setVcArmor] = useState<number>(100);
  const [vcWantedStars, setVcWantedStars] = useState<number>(0);
  const [vcVehicle, setVcVehicle] = useState<string>('Infernus Sports (Ocean Drive)');
  const [vcActiveRadioIndex, setVcActiveRadioIndex] = useState<number>(0);
  const [vcScreenEffect, setVcScreenEffect] = useState<string | null>(null);
  const [vcCrtScanlines, setVcCrtScanlines] = useState<boolean>(false);
  const [customCheatInput, setCustomCheatInput] = useState<string>('');
  const [lastExecutedCheat, setLastExecutedCheat] = useState<string>('PANZER (Spawn Rhino Tank)');
  const [showCheatSheetModal, setShowCheatSheetModal] = useState<boolean>(false);

  // Senior Tip
  const [seniorTip, setSeniorTip] = useState<string>(
    '"In 2003, we had 30 PCs and 28 were running Vice City simultaneously. If you didn\'t know PANZER and ASPIRINE by heart, you weren\'t allowed in my cafe!"'
  );

  const seniorQuotes = [
    '"Rule #1 of cyber cafe since 1999: You do NOT peek AWP Long doors if the guy on PC-03 has a 12-round streak, or you will buy him a cold Mountain Dew!"',
    '"Back in 2002, kids used to crowd around Tommy Vercetti\'s screen holding handwritten cheat sheets on photocopy paper. That was our Google!"',
    '"Double Cheese Maggi + Ice Cold Limca at 2 AM adds +25% reaction time to any LAN match. Science hasn\'t proven it, but 30 years of cafe boys have!"',
    '"If someone accidentally kicks the blue coaxial LAN cable under the wooden desk, ALL 12 PCs disconnect together! Keep your feet still!"',
    '"In 1995 we played Road Rash with arrow keys and chain whips. In 2024 you play on 360Hz RTX 4090s. The hardware changed, but the gamer spirit is forever."',
  ];

  const handleNextSeniorTip = () => {
    sound.playClick();
    const nextIdx = Math.floor(Math.random() * seniorQuotes.length);
    setSeniorTip(seniorQuotes[nextIdx]);
  };

  // Launch / Play Game Trigger
  const handlePlayGame = (game: CafeGame) => {
    sound.playSessionStart();
    setActiveGameModal(game);
    setBootingProgress(15);
    setIsGameRunning(false);

    // Default station if active session
    if (userActiveSession) {
      setSelectedStationIdForLaunch(userActiveSession.stationId);
    } else {
      const avail = stations.find((s) => s.status === 'Available');
      if (avail) setSelectedStationIdForLaunch(avail.id);
    }

    // Simulate fast NVMe Gen4 game engine boot
    setTimeout(() => setBootingProgress(45), 250);
    setTimeout(() => setBootingProgress(85), 550);
    setTimeout(() => {
      setBootingProgress(100);
      setIsGameRunning(true);
      addToast(
        `▶ NOW PLAYING: ${game.title}!`,
        `Preloaded at ${game.testedFps} on zero-latency NVMe Gen4 storage. Enjoy your session!`,
        'success'
      );
    }, 850);
  };

  // Vice City cheat execution
  const executeCheat = (code: string) => {
    const upper = code.trim().toUpperCase();
    sound.playCheatCode();

    if (upper === 'PANZER') {
      setVcVehicle('Rhino Military Tank (Armored 360° Cannon)');
      setVcScreenEffect('tank');
      setLastExecutedCheat('PANZER: 60-Ton Rhino Tank Air-Dropped onto Ocean Drive! 💥');
      addToast('CHEAT ACTIVATED: PANZER 🚜', 'Pink Rhino tank deployed! Blow up everything in your path!', 'success');
      sound.playExplosion();
    } else if (upper === 'ASPIRINE') {
      setVcHealth(100);
      setVcScreenEffect('heal');
      setLastExecutedCheat('ASPIRINE: 100% Health Restored to Maximum! 💚');
      addToast('CHEAT ACTIVATED: ASPIRINE 💊', 'Full Health Restored! Tommy Vercetti is invincible!', 'success');
    } else if (upper === 'NUTTERTOOLS') {
      setVcScreenEffect('weapons');
      setLastExecutedCheat('NUTTERTOOLS: Heavy Weapons Pack (Minigun, RPG, Grenades)! 🔫');
      addToast('CHEAT ACTIVATED: NUTTERTOOLS 💣', 'Heavy armory unlocked! Minigun ready to shred!', 'success');
      sound.playGunshot();
    } else if (upper === 'SEAWAYS') {
      setVcVehicle('Amphibious Sports Car (Gliding over Ocean Beach Waves) 🌊');
      setVcScreenEffect('water');
      setLastExecutedCheat('SEAWAYS: Car Glides Directly onto Starfish Island Waters! 🌊');
      addToast('CHEAT ACTIVATED: SEAWAYS 🌊', 'Cars now float and cruise on water like speedboats!', 'success');
      sound.playNitro();
    } else if (upper === 'LEAVEMEALONE') {
      setVcWantedStars(0);
      setVcScreenEffect('police-clear');
      setLastExecutedCheat('LEAVEMEALONE: All Police Wanted Stars Wiped to ZERO! ⭐');
      addToast('CHEAT ACTIVATED: LEAVEMEALONE 🚨', 'Wanted level cleared! Police call off the choppers!', 'info');
    } else if (upper === 'BIGBANG') {
      setVcScreenEffect('explosion');
      setLastExecutedCheat('BIGBANG: Massive Chain Explosions Across Ocean Drive! 💥');
      addToast('CHEAT ACTIVATED: BIGBANG 💣', 'All nearby vehicles detonated into giant fireballs!', 'warning');
      sound.playExplosion();
    } else {
      setVcScreenEffect('generic');
      setLastExecutedCheat(`${upper}: Custom Cafe Code Activated!`);
      addToast(`CHEAT ACTIVATED: ${upper} ⚡`, 'Senior cafe cheat injected into rig memory!', 'success');
    }

    setCustomCheatInput('');
    setTimeout(() => setVcScreenEffect(null), 1800);
  };

  const handleNextRadio = () => {
    sound.playClick();
    setVcActiveRadioIndex((prev) => (prev + 1) % VICE_CITY_RADIO_STATIONS.length);
  };

  // Filter games
  const filteredGames = CAFE_GAMES_CATALOG.filter((game) => {
    const matchesCategory =
      activeCategory === 'ALL' ||
      (activeCategory === 'CLASSICS' && game.category === 'Cafe Classics') ||
      (activeCategory === 'ESPORTS' && game.category === 'Competitive Esports') ||
      (activeCategory === 'AAA' && game.category === 'AAA Graphics') ||
      (activeCategory === 'FIGHTING' && game.category === 'Console Brawler');

    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const featuredViceCity = CAFE_GAMES_CATALOG.find((g) => g.id === 'gta-vice-city') || CAFE_GAMES_CATALOG[0];

  return (
    <div className="space-y-8">
      
      {/* 1. MASSIVE HERO BANNER: GTA VICE CITY WITH BIG PLAY BUTTON & 30-YEAR CAFE FLAVOR */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-pink-500/40 bg-black shadow-2xl group min-h-[440px] sm:min-h-[500px] flex flex-col justify-end">
        {/* Background Big Cover Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${featuredViceCity.bannerImage}')` }}
        >
          {/* Gradients to darken text area */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090514] via-[#090514]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090514] via-[#090514]/60 to-transparent" />
          <div className="absolute inset-0 bg-pink-900/10 mix-blend-overlay" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 p-6 sm:p-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-600/40">
              🌴 {featuredViceCity.badge}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/40 text-cyan-300 font-mono font-bold text-xs">
              ⚡ {featuredViceCity.testedFps}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>{featuredViceCity.rating}</span>
            </span>
            <span className="text-xs text-zinc-300 font-mono hidden sm:inline">
              {featuredViceCity.developer} &bull; {featuredViceCity.era}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
            {featuredViceCity.title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-200 line-clamp-2 max-w-2xl drop-shadow-md leading-relaxed">
            {featuredViceCity.description}
          </p>

          {/* Big Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => handlePlayGame(featuredViceCity)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-sm uppercase tracking-wider flex items-center gap-3 shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <span className="text-base tracking-wide">PLAY VICE CITY NOW</span>
            </button>

            <button
              onClick={() => setShowCheatSheetModal(true)}
              className="px-5 py-4 rounded-2xl bg-black/70 hover:bg-black/90 backdrop-blur-md border border-pink-500/40 hover:border-pink-400 text-pink-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <Bookmark className="w-4 h-4 text-pink-400" />
              <span>Vintage A4 Cheats</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-black/60 backdrop-blur-md border border-zinc-700 text-xs text-zinc-300">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>
                <strong className="text-white font-mono">{featuredViceCity.activePlayersInCafe}</strong> Seated in Cafe Playing
              </span>
            </div>
          </div>

          {/* Senior Cafe Operator Wisdom Quote */}
          <div className="pt-2 flex items-center gap-3 text-xs text-amber-300/90 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="italic">{seniorTip}</span>
            <button
              onClick={handleNextSeniorTip}
              className="text-[10px] text-pink-400 hover:text-pink-300 underline font-semibold ml-auto whitespace-nowrap"
            >
              Next Memory &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE GRAND GAMES CATALOG (WITH BIG COVERS AND PROMINENT PLAY BUTTONS) */}
      <div className="space-y-6">
        
        {/* Header, Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-black text-white">
                Battle Station Game Library
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
                {filteredGames.length} Titles Ready
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Click &quot;PLAY&quot; on any title to boot instantly on high-FPS cafe battle stations
            </p>
          </div>

          {/* Search & Layout Toggles */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search games, Vice City, CS, NFS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode('poster')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'poster'
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Big Vertical Poster Cards"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('banner')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'banner'
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Cinematic Wide Banners"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'All Titles' },
            { id: 'CLASSICS', label: '🌴 Cafe Classics (Vice City, CS, NFS, Road Rash)' },
            { id: 'ESPORTS', label: '🎯 Competitive Esports (CS2, Valorant, CoD)' },
            { id: 'AAA', label: '⚡ AAA Ray Tracing (Cyberpunk, GTA V, Forza)' },
            { id: 'FIGHTING', label: '🥊 1v1 Console & Couch (Tekken 8, EA FC 24)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                sound.playClick();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-600/30 scale-105'
                  : 'bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ----------------- LAYOUT 1: BIG POSTER CARDS (STEAM/PS5 STYLE) ----------------- */}
        {viewMode === 'poster' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="rounded-3xl border-2 border-zinc-800 bg-[#0c101d] overflow-hidden flex flex-col justify-between hover:border-indigo-500/60 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 group"
              >
                {/* BIG IMAGE POSTER CONTAINER */}
                <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Subtle Gradient Overlay */}
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

                  {/* Rating star on corner */}
                  <div className="absolute bottom-3 left-3 pointer-events-none flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-current text-amber-400" />
                    <span>{game.rating}</span>
                  </div>

                  {/* BIG HOVER PLAY BUTTON (PULSING ON HOVER) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <button
                      onClick={() => handlePlayGame(game)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-2xl shadow-emerald-500/50 scale-95 group-hover:scale-100 transition-transform"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>PLAY NOW</span>
                    </button>
                  </div>
                </div>

                {/* CARD BODY CONTENT */}
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

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {game.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* PROMINENT PLAY BUTTON BAR */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
                    <button
                      onClick={() => handlePlayGame(game)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>PLAY GAME</span>
                    </button>

                    {game.classicCheats && game.classicCheats.length > 0 && (
                      <button
                        onClick={() => {
                          handlePlayGame(game);
                          if (game.classicCheats && game.classicCheats[0]) {
                            executeCheat(game.classicCheats[0].code);
                          }
                        }}
                        className="p-2.5 rounded-xl bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/40 text-xs font-bold transition-colors"
                        title={`Quick Cheat: ${game.classicCheats[0]?.code}`}
                      >
                        ⚡
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ----------------- LAYOUT 2: CINEMATIC WIDE BANNERS (NETFLIX / EPIC STYLE) ----------------- */}
        {viewMode === 'banner' && (
          <div className="space-y-4">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="rounded-3xl border-2 border-zinc-800 bg-[#0c101d] overflow-hidden flex flex-col md:flex-row hover:border-indigo-500/50 hover:shadow-2xl transition-all group min-h-[180px]"
              >
                {/* Banner Image */}
                <div className="md:w-72 lg:w-96 relative aspect-video md:aspect-auto overflow-hidden bg-zinc-900">
                  <img
                    src={game.bannerImage}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0c101d] hidden md:block" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white border border-white/20">
                      {game.badge}
                    </span>
                  </div>
                </div>

                {/* Banner Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold text-indigo-400">
                          {game.category}
                        </span>
                        <span className="text-zinc-600">&bull;</span>
                        <span className="text-xs text-zinc-400 font-mono">
                          {game.developer} ({game.releaseYear})
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-2 py-0.5 rounded">
                        {game.testedFps}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-zinc-300 mt-1 max-w-3xl leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-800">
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span>Rating: <strong className="text-amber-400 font-bold">{game.rating}</strong></span>
                      <span>&bull;</span>
                      <span>Storage: <strong className="text-white font-mono">{game.storageGb} GB</strong></span>
                      <span>&bull;</span>
                      <span>Cafe Seated: <strong className="text-cyan-400 font-mono">{game.activePlayersInCafe} Gamers</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayGame(game)}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>PLAY GAME NOW</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 3. INTERACTIVE GAME LAUNCHING & PLAYING COCKPIT MODAL */}
      {activeGameModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e101f] border-2 border-indigo-500/50 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/30">
                  <div className="w-full h-full bg-[#0d1222] rounded-[14px] flex items-center justify-center">
                    <Play className="w-6 h-6 text-emerald-400 fill-current ml-0.5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {isGameRunning ? '● SESSION LIVE RUNNING' : 'ALLOCATING NVMe RIG STORAGE'}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {activeGameModal.testedFps}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {activeGameModal.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveGameModal(null)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Big Cinematic Banner Inside Modal */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/7] border border-zinc-800 mb-6 shadow-inner">
              <img
                src={activeGameModal.bannerImage}
                alt={activeGameModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                <p className="text-xs text-cyan-300 font-mono font-bold">
                  Target Station: {stations.find((s) => s.id === selectedStationIdForLaunch)?.name || 'PC-01 (Apex Predator VIP)'}
                </p>
                <p className="text-lg font-black text-white drop-shadow-md">
                  {activeGameModal.tagline}
                </p>
              </div>
            </div>

            {/* Booting Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>
                    {isGameRunning
                      ? 'DirectX 12 Ultimate & RTX 4090 Shaders Loaded'
                      : 'Syncing Steam / Cafe LAN Client...'}
                  </span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {bootingProgress}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-300"
                  style={{ width: `${bootingProgress}%` }}
                />
              </div>
            </div>

            {/* Station Seating / Target Station Selector */}
            <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">
                  Deploy to Gaming Cafe Battle Rig:
                </span>
                {userActiveSession ? (
                  <span className="text-xs text-emerald-400 font-bold">
                    Currently Seated at {userActiveSession.stationName}
                  </span>
                ) : (
                  <span className="text-xs text-amber-400">
                    Walk-in Seating Available
                  </span>
                )}
              </div>

              <select
                value={selectedStationIdForLaunch}
                onChange={(e) => setSelectedStationIdForLaunch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                {stations.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} &mdash; {st.type} ({st.specs.gpu || 'RTX 4090'}) &bull; ₹{st.hourlyRate}/hr [{st.status}]
                  </option>
                ))}
              </select>
            </div>

            {/* Cheats section if Vice City or CS */}
            {activeGameModal.classicCheats && (
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-4 h-4" />
                    <span>In-Game Cheat Codes &amp; Commands:</span>
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Click to execute on desk rig
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeGameModal.classicCheats.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => executeCheat(c.code)}
                      className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-pink-500 text-left transition-all group"
                    >
                      <p className="font-mono font-bold text-xs text-pink-300 group-hover:text-white">
                        {c.code.split(';')[0]}
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {c.effect}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Senior Bhaiya Wisdom Quote */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs italic text-amber-300 mb-6 flex items-start gap-3">
              <span className="text-base not-italic">☕</span>
              <div>
                <strong className="not-italic text-amber-200 block mb-0.5">
                  Senior Cafe Operator Note:
                </strong>
                {activeGameModal.seniorWisdomNote}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-800">
              <button
                onClick={() => setActiveGameModal(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs"
              >
                Close Launcher
              </button>

              <button
                onClick={() => {
                  sound.playSessionStart();
                  addToast(
                    `Game Session Initialized! 🎮`,
                    `${activeGameModal.title} running smoothly on ${stations.find((s) => s.id === selectedStationIdForLaunch)?.name || 'Desk PC'}. Frag away!`,
                    'success'
                  );
                  setActiveGameModal(null);
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>CONFIRM RIG &amp; PLAY NOW</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. VINTAGE A4 CHEAT SHEET MODAL */}
      {showCheatSheetModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#120a1e] border-2 border-pink-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-pink-500/20 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center font-bold">
                  A4
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Vintage Cyber Cafe Cheat Sheet &bull; Vice City Edition
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Hand-photocopied laminated sheet from 2002 taped to the monitor bezel
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCheatSheetModal(false)}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-pink-500/10 border border-pink-500/30 rounded-xl text-xs text-pink-300">
                💡 <strong>Senior Bhaiya&apos;s Tip:</strong> In 2002, kids paid ₹5 to get a copy of this cheat sheet! Click any cheat code below to execute it immediately in the live simulator cockpit.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SENIOR_CAFE_MASTER.handwrittenCheatSheet.map((cheat) => (
                  <button
                    key={cheat.code}
                    onClick={() => {
                      executeCheat(cheat.code);
                      setShowCheatSheetModal(false);
                    }}
                    className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-pink-500 hover:bg-pink-950/20 text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-pink-400 group-hover:text-pink-300">
                        {cheat.code}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono group-hover:text-white">
                        Run &rarr;
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-1 leading-snug">
                      {cheat.meaning}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                All codes 100% verified on QHAR Cafe PC Rigs
              </span>
              <button
                onClick={() => setShowCheatSheetModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs"
              >
                Close Cheat Sheet
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
