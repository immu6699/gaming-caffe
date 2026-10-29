import React from 'react';
import { Customer } from '../../types';
import { Modal } from './Modal';
import { formatINR, formatDateOnly } from '../../utils/formatters';
import { sound } from '../../utils/audio';
import { useApp } from '../../context/AppContext';
import {
  Gamepad2,
  Crown,
  Flame,
  Cake,
  Heart,
  Coffee,
  Monitor,
  Trophy,
  Wallet,
  Sparkles,
  CheckCircle,
  Gift,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface GamerPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const GamerPassportModal: React.FC<GamerPassportModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  const { updateCustomer, addToast } = useApp();

  if (!customer) return null;

  const xp = customer.loyaltyXP || 1200;
  const streak = customer.streakDays || 1;
  const currentTier =
    xp >= 3000
      ? { name: 'Apex Predator VIP', color: 'from-amber-400 to-rose-500', next: 5000 }
      : xp >= 2000
      ? { name: 'Diamond Master', color: 'from-cyan-400 to-blue-600', next: 3000 }
      : xp >= 1000
      ? { name: 'Platinum Contender', color: 'from-purple-400 to-indigo-600', next: 2000 }
      : { name: 'Gold Challenger', color: 'from-yellow-400 to-amber-600', next: 1000 };

  const progressPercent = Math.min(
    100,
    Math.round(((xp % 1000) / 1000) * 100)
  );

  const isBirthdaySoon = customer.birthday ? true : false;

  const handleGiftWalletBonus = () => {
    sound.playCashRegister();
    updateCustomer(customer.id, {
      walletBalance: (customer.walletBalance || 0) + 200,
    });
    addToast(
      '₹200 Loyalty Bonus Credited',
      `Added ₹200 courtesy credit to ${customer.name}'s wallet!`,
      'success'
    );
  };

  const handleApplyBirthdayPass = () => {
    sound.playSessionStart();
    addToast(
      '🎂 Birthday Pass Granted!',
      `1-Hour Complimentary Gaming session coupon unlocked for ${customer.name}!`,
      'success'
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="GAMER PASSPORT & SOCIAL PROFILE"
      size="lg"
    >
      <div className="space-y-5 animate-in fade-in duration-150">
        {/* Hero Gamer ID Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-900 via-dark-850 to-dark-950 border-2 border-brand-purple/40 p-5 shadow-glow-purple/20">
          {/* Subtle Ambient Watermark */}
          <Gamepad2 className="absolute -right-6 -bottom-6 w-44 h-44 text-brand-purple/5 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-purple to-cyan-500 p-0.5 shadow-lg shadow-brand-purple/30 flex items-center justify-center">
                  <div className="w-full h-full bg-dark-900 rounded-[14px] flex items-center justify-center text-2xl font-black font-gaming text-cyan-300">
                    {customer.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                {customer.status === 'VIP' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 text-dark-950 flex items-center justify-center shadow-md">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white font-gaming tracking-wide">
                    {customer.gamerTag || customer.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {customer.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {customer.name} • {customer.phone}
                </p>
                <p className="text-[11px] text-slate-500">
                  Member since {formatDateOnly(customer.registrationDate)} ({customer.totalBookings} visits)
                </p>
              </div>
            </div>

            {/* Streak & XP Badges */}
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-orange-950/40 border border-orange-500/40 text-center">
                <div className="flex items-center justify-center gap-1 text-orange-400 font-black text-sm">
                  <Flame className="w-4 h-4 fill-current" />
                  {streak} Days
                </div>
                <p className="text-[9px] uppercase tracking-wider text-orange-300 font-bold mt-0.5">
                  Active Streak
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center">
                <div className="flex items-center justify-center gap-1 text-cyan-300 font-mono font-black text-sm">
                  <Zap className="w-4 h-4 fill-current text-cyan-400" />
                  {xp} XP
                </div>
                <p className="text-[9px] uppercase tracking-wider text-cyan-300 font-bold mt-0.5">
                  Total Gamer XP
                </p>
              </div>
            </div>
          </div>

          {/* Loyalty Level Progress Bar */}
          <div className="mt-5 pt-4 border-t border-dark-800/80 relative z-10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-white uppercase text-[11px] tracking-wide">
                  Tier: {currentTier.name}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {progressPercent}% to next reward tier
              </span>
            </div>
            <div className="h-2 w-full bg-dark-950 rounded-full overflow-hidden p-0.5 border border-dark-750">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${currentTier.color} transition-all duration-500`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Birthday Alert Notification if Available */}
        {isBirthdaySoon && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-pink-950/40 to-purple-950/40 border border-pink-500/40 flex items-center justify-between text-xs animate-pulse">
            <div className="flex items-center gap-2.5">
              <Cake className="w-5 h-5 text-pink-400 flex-shrink-0" />
              <div>
                <p className="text-pink-200 font-bold">
                  Gamer Birthday Celebrated: {customer.birthday} 🎂
                </p>
                <p className="text-[11px] text-pink-300/80">
                  QHAR Hospitality Rule: Greet player & offer 1 Complimentary Free Hour pass!
                </p>
              </div>
            </div>
            <button
              onClick={handleApplyBirthdayPass}
              className="btn-cyan text-[11px] py-1.5 px-3 flex-shrink-0"
            >
              <Gift className="w-3 h-3" /> Apply Free Pass
            </button>
          </div>
        )}

        {/* Competitive Game Ranks */}
        <div className="bg-dark-850 p-4 rounded-xl border border-dark-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" /> Verified Competitive Game Ranks
            </h4>
            <span className="text-[10px] text-slate-400">Synced LAN Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {customer.gameRanks && customer.gameRanks.length > 0 ? (
              customer.gameRanks.map((gr, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-dark-900 border border-dark-750 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white">{gr.game}</span>
                    <p className="text-[11px] text-cyan-400 font-semibold">{gr.rank}</p>
                  </div>
                  {gr.rating && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-300 border border-dark-700">
                      {gr.rating}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-xs text-slate-400 italic">
                Competitive ranks not yet linked. Player plays casually.
              </div>
            )}
          </div>
        </div>

        {/* Personal Lounge Quirks & Habits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase mb-1">
              <Monitor className="w-3.5 h-3.5" /> Preferred Seat
            </div>
            <p className="text-xs font-medium text-white">
              {customer.preferredSeat || `${customer.preferredStationType} Area`}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase mb-1">
              <Coffee className="w-3.5 h-3.5" /> Favorite Snack
            </div>
            <p className="text-xs font-medium text-white truncate">
              {customer.favoritePerk || 'Peri-Peri Fries + Cold Beverage'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase mb-1">
              <Wallet className="w-3.5 h-3.5" /> Prepaid Wallet
            </div>
            <p className="text-xs font-mono font-bold text-emerald-400">
              {formatINR(customer.walletBalance || 0)}
            </p>
          </div>
        </div>

        {/* Staff Handover Secret Notes */}
        <div className="p-3.5 rounded-xl bg-dark-850/80 border border-dark-800">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> Counter Hospitality Notes
          </h4>
          <p className="text-xs text-slate-300 italic">
            "{customer.notes || 'Friendly regular player. Keep cold drinks ready upon check-in.'}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-dark-800">
          <button
            onClick={handleGiftWalletBonus}
            className="btn-secondary text-xs py-2 px-3 w-full sm:w-auto flex items-center justify-center gap-1.5 text-emerald-300 hover:text-emerald-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Gift ₹200 Courtesy Bonus
          </button>

          <button
            onClick={onClose}
            className="btn-cyan text-xs py-2 px-5 w-full sm:w-auto font-bold"
          >
            Close Passport
          </button>
        </div>
      </div>
    </Modal>
  );
};
