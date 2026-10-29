import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Zap,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Trophy,
  Flame,
  CheckCircle,
  Receipt,
  Clock,
  QrCode,
} from 'lucide-react';
import { sound } from '../../utils/audio';

export const UserWalletPage: React.FC = () => {
  const { currentCustomer, topUpUserWallet, invoices, addToast } = useApp();

  const [topUpAmount, setTopUpAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [filterType, setFilterType] = useState<'ALL' | 'TOPUP' | 'GAMING' | 'CAFE'>('ALL');

  const handleRecharge = (amount: number, bonus = 0) => {
    topUpUserWallet(amount, bonus);
    setCustomAmount('');
  };

  const handleBuyPass = (title: string, price: number) => {
    if ((currentCustomer.walletBalance ?? 0) < price) {
      addToast(
        'Insufficient Balance',
        `Pass price is ₹${price}. Please top-up ₹${price - (currentCustomer.walletBalance ?? 0)} more.`,
        'error'
      );
      return;
    }
    // Deduct pass cost
    topUpUserWallet(-price, 0);
    sound.playSessionStart();
    addToast('Pass Activated! 🎟️', `${title} is now active on your gamer profile!`, 'success');
  };

  // Filter invoices for current gamer
  const userInvoices = invoices.filter(
    (inv) =>
      inv.customerName.toLowerCase() === currentCustomer.name.toLowerCase() ||
      (currentCustomer.gamerTag && inv.customerName.toLowerCase().includes(currentCustomer.gamerTag.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Top Section: Cyberpunk Holographic Gamer Pass & Wallet Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Digital Holographic VIP Gamer Card */}
        <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-tr from-[#15122e] via-[#0d1633] to-[#0a2336] p-6 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between h-64 group">
          {/* Holographic light sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-widest text-indigo-300">
                  QHAR ARENA PASS
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentCustomer.status} RADIANT
                </span>
              </div>
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>

            <p className="text-xl font-black tracking-tight text-white uppercase font-mono">
              @{currentCustomer.gamerTag || currentCustomer.name}
            </p>
            <p className="text-xs text-zinc-400">{currentCustomer.name}</p>
          </div>

          <div className="pt-4 border-t border-indigo-500/20 flex items-end justify-between">
            <div>
              <p className="text-[10px] text-zinc-400 uppercase font-mono">Member ID</p>
              <p className="font-mono text-xs font-semibold text-zinc-300">
                #QHAR-{(currentCustomer.id || 'CUST').toUpperCase()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-zinc-400 uppercase font-mono">Loyalty XP</p>
              <p className="font-mono text-sm font-bold text-cyan-400">
                {currentCustomer.loyaltyXP ?? 3480} XP
              </p>
            </div>
          </div>
        </div>

        {/* Current Wallet Balance & Instant Recharge */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-[#0c101d] p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Gamer Wallet Balance</span>
              </span>
              <span className="text-xs text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                Instant Zero-Fee Checkout
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <p className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                ₹{currentCustomer.walletBalance ?? 0}
              </p>
              <span className="text-xs text-zinc-400">Available Credits</span>
            </div>

            <p className="text-xs font-semibold text-zinc-300 mb-2">
              Select Top-Up Package (Get Free Bonus Gaming Credits):
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
              {[
                { amount: 300, bonus: 0 },
                { amount: 500, bonus: 50, tag: '+₹50 Bonus' },
                { amount: 1000, bonus: 150, tag: '+₹150 Bonus' },
                { amount: 2000, bonus: 400, tag: '+₹400 Bonus' },
              ].map((pack) => (
                <button
                  key={pack.amount}
                  onClick={() => handleRecharge(pack.amount, pack.bonus)}
                  className="p-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all relative group"
                >
                  {pack.tag && (
                    <span className="absolute -top-2 right-2 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-gradient-to-r from-emerald-500 to-teal-400 text-black">
                      {pack.tag}
                    </span>
                  )}
                  <p className="font-mono text-base font-bold text-white group-hover:text-emerald-400">
                    ₹{pack.amount}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    Get ₹{pack.amount + pack.bonus}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Recharge */}
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
            <input
              type="number"
              min="100"
              step="50"
              placeholder="Custom top-up amount e.g. 750"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs flex-1 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              onClick={() => {
                const amt = parseInt(customAmount, 10);
                if (!isNaN(amt) && amt >= 100) {
                  handleRecharge(amt, amt >= 1000 ? 100 : 0);
                }
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Recharge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gaming Time Passes & Unlimited Packages */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Gaming Passes & Unlimited Hours Packs</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Save up to 40% on PC & console hours with prepaid arena passes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Night Owl All-Nighter Pass',
              hours: '11:00 PM to 06:00 AM (7 hrs)',
              price: 499,
              regularPrice: 1050,
              badge: '🌙 Night Grind',
              desc: 'Continuous overnight rig access, free Monster energy drink included.',
            },
            {
              title: 'Weekend Warrior 10-Hour Pack',
              hours: '10 Hours Flexible Time',
              price: 899,
              regularPrice: 1500,
              badge: '🔥 Bestseller',
              desc: 'Use across any Saturday or Sunday sessions, valid for 30 days.',
            },
            {
              title: 'Esports VIP 30-Hour Pro Grind',
              hours: '30 Hours Full Rig Access',
              price: 2399,
              regularPrice: 4500,
              badge: '⭐ VIP Exclusive',
              desc: 'Dedicated 360Hz PC rig reservation priority & 15% cafe discount.',
            },
          ].map((pack) => (
            <div
              key={pack.title}
              className="rounded-3xl border border-zinc-800 bg-[#0d1222] p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-colors"
            >
              <div>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-500/30 inline-block mb-3">
                  {pack.badge}
                </span>
                <h3 className="font-bold text-white text-base mb-1">{pack.title}</h3>
                <p className="text-xs text-zinc-400 mb-3">{pack.desc}</p>
                <p className="text-xs font-semibold text-cyan-300 mb-4">{pack.hours}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 line-through">
                    ₹{pack.regularPrice}
                  </span>
                  <p className="text-xl font-black font-mono text-emerald-400">
                    ₹{pack.price}
                  </p>
                </div>
                <button
                  onClick={() => handleBuyPass(pack.title, pack.price)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-600/20"
                >
                  Buy Pass
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History & Invoices */}
      <div className="rounded-3xl border border-zinc-800 bg-[#0c101d] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-400" />
            <span>Recent Activity & Invoices</span>
          </h2>
          <span className="text-xs text-zinc-500 font-mono">
            {userInvoices.length} Records
          </span>
        </div>

        <div className="divide-y divide-zinc-800 text-xs overflow-x-auto">
          {userInvoices.length === 0 ? (
            <p className="text-zinc-500 py-4 text-center">No transaction history yet.</p>
          ) : (
            userInvoices.map((inv) => (
              <div
                key={inv.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-zinc-900/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      inv.invoiceNumber.startsWith('WAL')
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-950/60 text-indigo-400 border border-indigo-500/30'
                    }`}
                  >
                    {inv.invoiceNumber.startsWith('WAL') ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white">{inv.items[0]?.description || 'Session Settle'}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      {inv.invoiceNumber} &bull; {new Date(inv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-mono font-bold text-sm ${
                      inv.invoiceNumber.startsWith('WAL') ? 'text-emerald-400' : 'text-zinc-200'
                    }`}
                  >
                    {inv.invoiceNumber.startsWith('WAL') ? '+' : '-'}₹{inv.totalAmount}
                  </p>
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                    {inv.paymentStatus} via {inv.paymentMethod}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
