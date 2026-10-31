import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LanChallenge } from '../../types';
import {
  Swords,
  Trophy,
  Users,
  Shield,
  Zap,
  Check,
  X,
  Clock,
  Sparkles,
  Flame,
  Radio,
  ChevronRight,
  Volume2,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface LanChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStationId?: string;
}

export const LanChallengeModal: React.FC<LanChallengeModalProps> = ({
  isOpen,
  onClose,
  preselectedStationId,
}) => {
  const {
    stations,
    currentCustomer,
    userActiveSession,
    lanChallenges,
    sendLanChallenge,
    respondLanChallenge,
    completeLanChallenge,
    broadcastCafePA,
    addToast,
  } = useApp();

  const [selectedStationName, setSelectedStationName] = useState<string>(
    preselectedStationId || 'PC-02 (Titan Esports)'
  );
  const [targetGamerTag, setTargetGamerTag] = useState<string>('ShadowStrike_7');
  const [selectedGame, setSelectedGame] = useState<string>('CS2 AWP 1v1 (Aim Map)');
  const [selectedWager, setSelectedWager] = useState<string>('Loser buys Monster Energy 500ml');
  const [customWager, setCustomWager] = useState<string>('');

  if (!isOpen) return null;

  const currentStation = userActiveSession?.stationName || 'PC-01 (Apex VIP)';
  const currentGamer = currentCustomer.gamerTag || currentCustomer.name;

  const handleDispatchChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    const finalWager = customWager.trim() || selectedWager;

    sendLanChallenge({
      fromStationName: currentStation,
      fromGamerTag: currentGamer,
      toStationName: selectedStationName,
      toGamerTag: targetGamerTag,
      gameTitle: selectedGame,
      wager: finalWager,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1220] border-2 border-red-500/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <Swords className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  STATION-TO-STATION LAN BATTLE
                </span>
                <span className="text-xs text-zinc-400 font-mono">128-Tick Local Routing</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                1v1 Grudge Matchmaker &amp; Wager Arena
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

        {/* Two Columns: Send Challenge + Active LAN Challenges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form: Dispatch New Challenge */}
          <div className="lg:col-span-7 space-y-4">
            <form onSubmit={handleDispatchChallenge} className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Issue a 1v1 Battle Challenge</span>
              </h4>

              {/* Opponent Station Picker */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Target Opponent Station:
                </label>
                <select
                  value={selectedStationName}
                  onChange={(e) => {
                    setSelectedStationName(e.target.value);
                    const st = stations.find((s) => s.name === e.target.value);
                    if (st?.currentCustomerName) {
                      setTargetGamerTag(st.currentCustomerName);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold focus:outline-none focus:border-red-500"
                >
                  {stations
                    .filter((s) => s.name !== currentStation)
                    .map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.type} &bull; {s.currentCustomerName ? `@${s.currentCustomerName}` : 'Seated Gamer'})
                      </option>
                    ))}
                </select>
              </div>

              {/* Game Title Picker */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Battle Game Discipline:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Tekken 8 (Best of 5)', icon: '🥊' },
                    { name: 'CS2 AWP 1v1 (Aim Map)', icon: '💥' },
                    { name: 'EA FC 24 Derby Match', icon: '⚽' },
                    { name: 'NFS Most Wanted Drag', icon: '🏎️' },
                    { name: 'Valorant Deathmatch Duel', icon: '🎯' },
                    { name: 'GTA Vice City Tank Derby', icon: '🚜' },
                  ].map((g) => (
                    <button
                      key={g.name}
                      type="button"
                      onClick={() => setSelectedGame(g.name)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                        selectedGame === g.name
                          ? 'border-red-500 bg-red-950/40 text-red-300'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{g.icon}</span>
                      <span className="truncate">{g.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wager Selection */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  The Stakes / Wager:
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[
                    'Loser buys Monster Energy 500ml',
                    'Double Cheese Maggi & Dip',
                    '₹100 Cafe Wallet Recharge',
                    'Pure Bragging Rights & GG',
                  ].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => {
                        setSelectedWager(w);
                        setCustomWager('');
                      }}
                      className={`p-2 rounded-xl border text-left text-[11px] font-semibold transition-all ${
                        selectedWager === w && !customWager
                          ? 'border-amber-500 bg-amber-950/30 text-amber-300'
                          : 'border-zinc-800 bg-zinc-900/40 text-zinc-400'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or write custom wager (e.g. loser washes mousepad)..."
                  value={customWager}
                  onChange={(e) => setCustomWager(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Swords className="w-4 h-4" />
                <span>Broadcast 1v1 Challenge to {selectedStationName}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Live Cafe Challenges Feed */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Live Arena Challenges</span>
                </h4>
                <span className="text-[10px] font-mono text-cyan-400">
                  {lanChallenges.length} Active
                </span>
              </div>

              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {lanChallenges.map((chal) => (
                  <div
                    key={chal.id}
                    className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/20">
                        {chal.gameTitle}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          chal.status === 'Accepted'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : chal.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {chal.status}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-200">
                      <strong>@{chal.fromGamerTag}</strong> ({chal.fromStationName}) vs.{' '}
                      <strong>@{chal.toGamerTag}</strong> ({chal.toStationName})
                    </div>

                    <p className="text-[11px] text-amber-300 font-mono">
                      Wager: {chal.wager}
                    </p>

                    {/* Actions if pending */}
                    {chal.status === 'Pending' && (
                      <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                        <button
                          onClick={() => respondLanChallenge(chal.id, true)}
                          className="flex-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Accept Challenge</span>
                        </button>
                        <button
                          onClick={() => respondLanChallenge(chal.id, false)}
                          className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px]"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {/* If accepted, declare winner button */}
                    {chal.status === 'Accepted' && (
                      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-semibold animate-pulse">
                          Match In Progress!
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => completeLanChallenge(chal.id, chal.fromGamerTag)}
                            className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-amber-500 hover:text-black text-amber-300 text-[10px] font-bold"
                            title="Declare winner"
                          >
                            @{chal.fromGamerTag} Won
                          </button>
                          <button
                            onClick={() => completeLanChallenge(chal.id, chal.toGamerTag)}
                            className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-amber-500 hover:text-black text-amber-300 text-[10px] font-bold"
                            title="Declare winner"
                          >
                            @{chal.toGamerTag} Won
                          </button>
                        </div>
                      </div>
                    )}

                    {chal.status === 'Completed' && (
                      <div className="pt-1 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Winner: @{chal.winnerTag} (Claimed Wager!)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick PA Voice Shoutout */}
            <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Test Counter Voice PA</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  broadcastCafePA(
                    `Bhaiya, attention all desks! 1v1 grudge match starting on Station ${selectedStationName}!`
                  )
                }
                className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-mono text-[10px]"
              >
                Broadcast Voice 📢
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
