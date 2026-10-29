import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Users,
  Calendar,
  Gamepad2,
  Award,
  Zap,
  CheckCircle,
  X,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface TournamentEvent {
  id: string;
  title: string;
  game: string;
  format: '5v5' | '1v1' | '2v2';
  prizePool: number;
  entryFee: number;
  dateStr: string;
  totalSlots: number;
  registeredCount: number;
  rules: string;
  isRegistered?: boolean;
}

export const UserTournamentsPage: React.FC = () => {
  const { currentCustomer, addToast } = useApp();

  const [tournaments, setTournaments] = useState<TournamentEvent[]>([
    {
      id: 'tour-val-01',
      title: 'Valorant 5v5 Bangalore LAN Invitational',
      game: 'Valorant',
      format: '5v5',
      prizePool: 50000,
      entryFee: 0,
      dateStr: 'This Saturday, 11:00 AM',
      totalSlots: 16,
      registeredCount: 12,
      rules: 'Double elimination, 128-tick custom server, riot anti-cheat verified hardware, best of 3 finals.',
      isRegistered: true,
    },
    {
      id: 'tour-tek-02',
      title: 'Tekken 8 King of Iron Fist Cafe Brawl',
      game: 'Tekken 8',
      format: '1v1',
      prizePool: 15000,
      entryFee: 150,
      dateStr: 'Sunday, 03:00 PM',
      totalSlots: 32,
      registeredCount: 22,
      rules: 'PS5 dedicated fighting stick station, 3 rounds, double elimination bracket.',
    },
    {
      id: 'tour-fc-03',
      title: 'EA FC 24 Champions Weekend Cup',
      game: 'EA FC 24',
      format: '1v1',
      prizePool: 20000,
      entryFee: 200,
      dateStr: 'Next Friday, 06:00 PM',
      totalSlots: 64,
      registeredCount: 38,
      rules: '95 rated overall teams, 6 minute halves, tactical defending only.',
    },
    {
      id: 'tour-cs-04',
      title: 'CS2 Wingman 2v2 Tactical Showdown',
      game: 'Counter-Strike 2',
      format: '2v2',
      prizePool: 25000,
      entryFee: 300,
      dateStr: 'Next Saturday, 01:00 PM',
      totalSlots: 16,
      registeredCount: 8,
      rules: 'Faceit Level 8+ recommended, MR12, best of 1 swiss bracket into bo3 finals.',
    },
  ]);

  const [filterGame, setFilterGame] = useState<string>('ALL');
  const [selectedTourModal, setSelectedTourModal] = useState<TournamentEvent | null>(null);

  // Registration Form State
  const [teamName, setTeamName] = useState('');
  const [captainTag, setCaptainTag] = useState(currentCustomer.gamerTag || currentCustomer.name);
  const [teammates, setTeammates] = useState('');
  const [discordTag, setDiscordTag] = useState('');

  const filteredTournaments = tournaments.filter((t) => {
    if (filterGame === 'ALL') return true;
    return t.game.toLowerCase().includes(filterGame.toLowerCase());
  });

  const handleOpenRegister = (t: TournamentEvent) => {
    setSelectedTourModal(t);
    setTeamName(currentCustomer.gamerTag ? `${currentCustomer.gamerTag} Esports` : 'Apex Squad');
    setCaptainTag(currentCustomer.gamerTag || currentCustomer.name);
    setTeammates(t.format === '5v5' ? 'Player2, Player3, Player4, Player5' : t.format === '2v2' ? 'WingmanBro_9' : '');
    setDiscordTag(`${currentCustomer.gamerTag || 'gamer'}#2024`);
  };

  const handleConfirmRegistration = () => {
    if (!selectedTourModal) return;

    setTournaments((prev) =>
      prev.map((t) =>
        t.id === selectedTourModal.id
          ? { ...t, isRegistered: true, registeredCount: t.registeredCount + 1 }
          : t
      )
    );

    sound.playSessionStart();
    addToast(
      'Squad Registered! 🏆',
      `Registered for ${selectedTourModal.title}. Check in 30 mins before bracket launch.`,
      'success'
    );
    setSelectedTourModal(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-[#121630] via-[#10142b] to-[#0a0d1d] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>OFFICIAL CAFE ESPORTS LEAGUE &bull; CASH PRIZE POOLS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              LAN Tournaments & Esports Cups
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Register your squad, lock in your bracket seeds, and compete in high-stakes LAN cups broadcasted live on arena video walls with casters!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-black/40 border border-zinc-800 rounded-2xl p-4">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-semibold">
                Total Month Prize Pool
              </p>
              <p className="text-2xl font-black font-mono text-amber-400">₹1,10,000</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-semibold">
                Gamer Status
              </p>
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Competitor</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'Valorant', 'Tekken 8', 'EA FC 24', 'Counter-Strike 2'].map((g) => (
          <button
            key={g}
            onClick={() => setFilterGame(g)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterGame === g
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {g === 'ALL' ? 'All Tournaments' : g}
          </button>
        ))}
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTournaments.map((tour) => {
          const slotsLeft = tour.totalSlots - tour.registeredCount;
          return (
            <div
              key={tour.id}
              className={`rounded-3xl border bg-[#0d1222] p-6 flex flex-col justify-between transition-all relative overflow-hidden ${
                tour.isRegistered
                  ? 'border-emerald-500/40 bg-[#0d1916]'
                  : 'border-zinc-800 hover:border-indigo-500/40 hover:shadow-xl'
              }`}
            >
              <div>
                {/* Header: Game & Format */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                      {tour.game}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {tour.format}
                    </span>
                  </div>

                  {tour.isRegistered ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Registered</span>
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-semibold text-cyan-400">
                      {slotsLeft} slots remaining
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-white mb-2">{tour.title}</h3>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{tour.rules}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800 mb-4 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Prize Pool</span>
                    <p className="font-bold font-mono text-amber-400 text-sm">
                      ₹{tour.prizePool.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Entry Fee</span>
                    <p className="font-semibold text-white">
                      {tour.entryFee === 0 ? 'Free Entry' : `₹${tour.entryFee}`}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Match Date</span>
                    <p className="font-semibold text-zinc-300 truncate">{tour.dateStr}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {tour.registeredCount} / {tour.totalSlots} Squads Locked
                </span>

                {tour.isRegistered ? (
                  <button
                    disabled
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold cursor-default"
                  >
                    Slot Confirmed ✓
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenRegister(tour)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
                  >
                    <span>Register Squad</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* REGISTRATION MODAL */}
      {selectedTourModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-indigo-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Register: {selectedTourModal.game}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {selectedTourModal.format} &bull; Prize Pool: ₹{selectedTourModal.prizePool}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTourModal(null)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Team / Clan Name *
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Shadow Vanguard Esports"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Captain GamerTag *
                </label>
                <input
                  type="text"
                  value={captainTag}
                  onChange={(e) => setCaptainTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {selectedTourModal.format !== '1v1' && (
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Teammates GamerTags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={teammates}
                    onChange={(e) => setTeammates(e.target.value)}
                    placeholder="e.g. Fragger_X, SmokesGod, Sentinel_9"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Discord Tag / Phone (For match lobby calls)
                </label>
                <input
                  type="text"
                  value={discordTag}
                  onChange={(e) => setDiscordTag(e.target.value)}
                  placeholder="e.g. ViperX#1234 or +91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={handleConfirmRegistration}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm LAN Registration</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
