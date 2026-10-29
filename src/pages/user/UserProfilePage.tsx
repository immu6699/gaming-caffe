import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  Trophy,
  Flame,
  CreditCard,
  Edit3,
  CheckCircle,
  X,
  Sparkles,
  Gamepad2,
  Tv,
  Save,
  Award,
} from 'lucide-react';
import { sound } from '../../utils/audio';

export const UserProfilePage: React.FC = () => {
  const { currentCustomer, updateCurrentCustomerProfile, addToast } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Editable Form State
  const [gamerTag, setGamerTag] = useState(currentCustomer.gamerTag || '');
  const [name, setName] = useState(currentCustomer.name);
  const [email, setEmail] = useState(currentCustomer.email);
  const [phone, setPhone] = useState(currentCustomer.phone);
  const [favoritePerk, setFavoritePerk] = useState(currentCustomer.favoritePerk || '');
  const [preferredSeat, setPreferredSeat] = useState(currentCustomer.preferredSeat || '');
  const [notes, setNotes] = useState(currentCustomer.notes || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentCustomerProfile({
      gamerTag: gamerTag.trim() || undefined,
      name,
      email,
      phone,
      favoritePerk: favoritePerk.trim() || undefined,
      preferredSeat: preferredSeat.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    sound.playClick();
    setIsEditModalOpen(false);
  };

  const ranks = currentCustomer.gameRanks || [
    { game: 'Valorant', rank: 'Radiant', rating: '#412 Regional' },
    { game: 'CS2', rank: 'Faceit Level 10', rating: '2,420 ELO' },
    { game: 'Apex Legends', rank: 'Master', rating: 'Top 500' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Profile Header Banner */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-[#0e1326] via-[#111835] to-[#0c1224] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar Pill */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 p-[2px] shadow-xl shadow-indigo-600/30">
              <div className="w-full h-full bg-[#0a0e1c] rounded-[14px] flex items-center justify-center">
                <span className="text-3xl font-black text-white">
                  {(currentCustomer.gamerTag || currentCustomer.name).charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  @{currentCustomer.gamerTag || 'Player'}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentCustomer.status} RADIANT
                </span>
              </div>

              <p className="text-xs text-zinc-300">{currentCustomer.name}</p>
              <p className="text-xs text-zinc-500 font-mono">
                {currentCustomer.email} &bull; {currentCustomer.phone}
              </p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-indigo-400" />
            <span>Edit Gamer ID</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0d1222] space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase font-semibold">
            Total Playtime
          </span>
          <p className="text-2xl font-black font-mono text-white">
            {currentCustomer.totalHoursPlayed ?? 142}h
          </p>
          <p className="text-[11px] text-zinc-400">Competitive Rig Hours</p>
        </div>

        <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0d1222] space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase font-semibold">
            Active Streak
          </span>
          <p className="text-2xl font-black font-mono text-amber-400 flex items-center gap-1">
            <Flame className="w-5 h-5 fill-current" />
            <span>{currentCustomer.streakDays ?? 6} Days</span>
          </p>
          <p className="text-[11px] text-zinc-400">Daily Login Bonus Active</p>
        </div>

        <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0d1222] space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase font-semibold">
            Total Bookings
          </span>
          <p className="text-2xl font-black font-mono text-indigo-300">
            {currentCustomer.totalBookings ?? 28}
          </p>
          <p className="text-[11px] text-zinc-400">Advance Station Locks</p>
        </div>

        <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0d1222] space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase font-semibold">
            Loyalty XP
          </span>
          <p className="text-2xl font-black font-mono text-cyan-400">
            {currentCustomer.loyaltyXP ?? 3480}
          </p>
          <p className="text-[11px] text-zinc-400">Level 42 Radiant Rank</p>
        </div>
      </div>

      {/* Competitive Ranks Section */}
      <div className="rounded-3xl border border-zinc-800 bg-[#0c101d] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Competitive Esports Ranks & Badges</span>
          </h2>
          <span className="text-xs text-zinc-500 font-semibold">Verified Gamer ID</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ranks.map((r) => (
            <div
              key={r.game}
              className="p-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 space-y-1.5"
            >
              <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
                {r.game}
              </span>
              <p className="text-lg font-black text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>{r.rank}</span>
              </p>
              {r.rating && (
                <p className="text-xs font-mono text-emerald-400">{r.rating}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gamer Preferences */}
      <div className="rounded-3xl border border-zinc-800 bg-[#0c101d] p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-indigo-400" />
          <span>Hardware & Desk Preferences</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase">Preferred Rig / Seat</span>
            <p className="font-bold text-white text-sm">
              {currentCustomer.preferredSeat || 'PC-01 (Apex Predator VIP)'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase">Favorite In-Seat Fuel</span>
            <p className="font-bold text-amber-300 text-sm">
              {currentCustomer.favoritePerk || 'Monster Ultra White + Peri-Peri Fries'}
            </p>
          </div>

          <div className="sm:col-span-2 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase">Player Bio & Sensitivity Notes</span>
            <p className="text-zinc-300 leading-relaxed">
              {currentCustomer.notes || 'Competitive Valorant IGL; always plays on 800 DPI; custom Wooting 60HE keyboard.'}
            </p>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-indigo-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Edit Gamer Credentials</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  GamerTag (Display Handle) *
                </label>
                <input
                  type="text"
                  value={gamerTag}
                  onChange={(e) => setGamerTag(e.target.value)}
                  placeholder="e.g. ViperX_IGL"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Preferred Rig / Seat
                </label>
                <input
                  type="text"
                  value={preferredSeat}
                  onChange={(e) => setPreferredSeat(e.target.value)}
                  placeholder="e.g. PC-01 (Apex Predator VIP)"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Favorite Cafe Perk / Snack
                </label>
                <input
                  type="text"
                  value={favoritePerk}
                  onChange={(e) => setFavoritePerk(e.target.value)}
                  placeholder="e.g. Monster Ultra White + Peri-Peri Fries"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Gamer Notes & Hardware Tuning
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 800 DPI, raw input buffer, Wooting 60HE rapid trigger"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Gamer ID Credentials</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
