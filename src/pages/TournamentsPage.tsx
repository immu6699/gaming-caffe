import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { formatINR } from '../utils/formatters';
import { sound } from '../utils/audio';
import {
  Trophy,
  Plus,
  Users,
  Gamepad2,
  Calendar,
  Flame,
  CheckCircle,
  Crown,
  Medal,
  Clock,
  Swords,
} from 'lucide-react';

interface Tournament {
  id: string;
  title: string;
  game: string;
  format: '5v5' | '1v1' | 'Squad';
  prizePool: number;
  date: string;
  status: 'Upcoming' | 'Live In-Progress' | 'Completed';
  registeredTeams: number;
  maxTeams: number;
  assignedStations: string[];
}

export const TournamentsPage: React.FC = () => {
  const { addToast } = useApp();

  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 'tour-1',
      title: 'QHAR Valorant Masters Cup 2026',
      game: 'Valorant',
      format: '5v5',
      prizePool: 30000,
      date: 'This Saturday, 4:00 PM',
      status: 'Live In-Progress',
      registeredTeams: 8,
      maxTeams: 8,
      assignedStations: ['PC-01', 'PC-02', 'PC-03', 'PC-04', 'PC-05'],
    },
    {
      id: 'tour-2',
      title: 'PlayStation FC 24 Weekend Clash',
      game: 'EA Sports FC 24',
      format: '1v1',
      prizePool: 12000,
      date: 'Sunday, 2:00 PM',
      status: 'Upcoming',
      registeredTeams: 14,
      maxTeams: 16,
      assignedStations: ['PS5-01', 'PS5-02'],
    },
    {
      id: 'tour-3',
      title: 'Counter-Strike 2 Duel of Titans',
      game: 'CS2',
      format: '5v5',
      prizePool: 25000,
      date: 'Nov 02, 2026',
      status: 'Upcoming',
      registeredTeams: 6,
      maxTeams: 8,
      assignedStations: ['PC-06', 'PC-07', 'PC-08'],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('Valorant');
  const [format, setFormat] = useState<Tournament['format']>('5v5');
  const [prizePool, setPrizePool] = useState(20000);
  const [date, setDate] = useState('Saturday, 5:00 PM');
  const [maxTeams, setMaxTeams] = useState(8);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playSessionStart();
    const newTour: Tournament = {
      id: `tour-${Date.now().toString().slice(-4)}`,
      title,
      game,
      format,
      prizePool: Number(prizePool),
      date,
      status: 'Upcoming',
      registeredTeams: 1,
      maxTeams: Number(maxTeams),
      assignedStations: ['PC-01', 'PC-02'],
    };

    setTournaments([newTour, ...tournaments]);
    setIsModalOpen(false);
    addToast('Tournament Created', `${title} registration is now live.`, 'success');
  };

  // Sample Live Match Bracket
  const bracketMatches = [
    {
      round: 'Semi-Final 1',
      teamA: 'Team Velocity (3)',
      teamB: 'Hydra Esports (1)',
      status: 'Completed',
      score: '13 - 9',
    },
    {
      round: 'Semi-Final 2',
      teamA: 'Apex Predators',
      teamB: 'Cyber Phoenix',
      status: 'In Play',
      score: '11 - 10 (Map 3)',
    },
    {
      round: 'Grand Final',
      teamA: 'Team Velocity',
      teamB: 'Winner of SF2',
      status: 'Queued',
      score: 'Best of 3',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              ESPORTS TOURNAMENTS & MATCH LOBBIES
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              WEEKEND ARENA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Host café LAN cups, manage bracket matchups, prize pools, and dedicated tournament station locks.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Create Tournament
        </button>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tournaments.map((tour) => (
          <div
            key={tour.id}
            className={`gaming-card p-5 border-2 flex flex-col justify-between relative overflow-hidden ${
              tour.status === 'Live In-Progress'
                ? 'border-yellow-500/50 bg-yellow-950/10 shadow-glow-purple/20'
                : 'border-dark-750'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold font-gaming uppercase tracking-wider px-2 py-0.5 rounded bg-dark-850 text-cyan-400 border border-dark-750">
                  {tour.game} ({tour.format})
                </span>
                <Badge
                  label={tour.status}
                  variant={tour.status === 'Live In-Progress' ? 'warning' : 'neutral'}
                  dot={tour.status === 'Live In-Progress'}
                />
              </div>

              <h3 className="text-base font-bold text-white font-gaming mt-1">
                {tour.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> {tour.date}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-dark-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Prize Pool:</span>
                <span className="text-base font-bold font-gaming text-yellow-400">
                  {formatINR(tour.prizePool)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Slots Filled:</span>
                <span className="font-mono font-bold text-white">
                  {tour.registeredTeams} / {tour.maxTeams} Teams
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Station Allocation:</span>
                <span className="font-mono text-cyan-400 font-semibold">
                  {tour.assignedStations.join(', ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Match Bracket Viewer */}
      <div className="gaming-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-dark-800">
          <div>
            <h3 className="text-sm font-bold text-white font-gaming uppercase tracking-wider flex items-center gap-2">
              <Swords className="w-4 h-4 text-rose-400" />
              LIVE MATCH BRACKET & ARENA BROADCAST
            </h3>
            <p className="text-xs text-slate-400">
              Valorant Masters Cup 2026 — Real-time game score and team progress
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Broadcasting on Main Lounge Screen
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bracketMatches.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border space-y-2.5 ${
                m.status === 'In Play'
                  ? 'bg-rose-950/20 border-rose-500/40 ring-1 ring-rose-500/40'
                  : 'bg-dark-850 border-dark-750'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-gaming font-bold text-slate-300">{m.round}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    m.status === 'In Play'
                      ? 'bg-rose-500/30 text-rose-300 animate-pulse'
                      : 'bg-dark-800 text-slate-400'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-750/70 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-white font-bold">
                  <span>{m.teamA}</span>
                  <span className="font-mono text-cyan-400">VS</span>
                  <span>{m.teamB}</span>
                </div>
                <div className="text-center font-mono text-[11px] text-amber-400 font-bold pt-1 border-t border-dark-800">
                  {m.score}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Tournament Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Host Esports Tournament"
        subtitle="Set game title, bracket format, prize pool, and reserved station slots."
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tournament Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Saturday Night CS2 Brawl"
              className="gaming-input w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Esports Game *
              </label>
              <select
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="gaming-input w-full text-xs"
              >
                <option value="Valorant">Valorant (PC)</option>
                <option value="CS2">Counter-Strike 2 (PC)</option>
                <option value="EA Sports FC 24">EA Sports FC 24 (PS5)</option>
                <option value="Mortal Kombat 1">Mortal Kombat 1 (PS5)</option>
                <option value="Tekken 8">Tekken 8 (PS5)</option>
                <option value="BGMI / PUBG">PUBG / BGMI</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="gaming-input w-full text-xs"
              >
                <option value="5v5">5v5 Squad LAN</option>
                <option value="1v1">1v1 Solo Duel</option>
                <option value="Squad">Battle Royale Squad</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Prize Pool (₹) *
              </label>
              <input
                type="number"
                min="1000"
                value={prizePool}
                onChange={(e) => setPrizePool(Number(e.target.value))}
                className="gaming-input w-full text-yellow-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max Participant Teams
              </label>
              <input
                type="number"
                min="4"
                max="64"
                value={maxTeams}
                onChange={(e) => setMaxTeams(Number(e.target.value))}
                className="gaming-input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Event Date & Schedule
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. This Saturday, 5:00 PM"
              className="gaming-input w-full text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs">
              Publish Tournament
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
