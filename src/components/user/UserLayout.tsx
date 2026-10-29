import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Gamepad2,
  Compass,
  Monitor,
  Activity,
  UtensilsCrossed,
  Trophy,
  CreditCard,
  User,
  ShieldCheck,
  ChevronDown,
  BellRing,
  Plus,
  Flame,
  ArrowRight,
  Sparkles,
  Zap,
  Menu,
  X,
  Volume2,
  VolumeX,
  CheckCircle,
  Clock,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import { ToastContainer } from '../common/Toast';
import { sound } from '../../utils/audio';

export const UserLayout: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentCustomer,
    customers,
    setCurrentCustomerId,
    userActiveSession,
    topUpUserWallet,
    requestDeskAssistance,
    soundEnabled,
    setSoundEnabled,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    visualTheme,
    setVisualTheme,
    addToast,
  } = useApp();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isCallStaffOpen, setIsCallStaffOpen] = useState(false);
  const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(500);
  const [customTopUp, setCustomTopUp] = useState<string>('');
  const [deskReason, setDeskReason] = useState<string>('Peripherals / Mousepad Swap');
  const [deskCustomNote, setDeskCustomNote] = useState<string>('');

  const navLinks = [
    { label: 'Gamer Hub', to: '/user', icon: Compass, exact: true },
    { label: 'Book Rig', to: '/user/stations', icon: Monitor },
    { label: 'Vice City & Games', to: '/user/games', icon: Gamepad2, badge: 'HOT' },
    {
      label: 'Live Desk HUD',
      to: '/user/session',
      icon: Activity,
      badge: userActiveSession ? 'LIVE' : undefined,
    },
    { label: 'In-Seat Cafe', to: '/user/cafe', icon: UtensilsCrossed },
    { label: 'Tournaments', to: '/user/tournaments', icon: Trophy },
    { label: 'Wallet & Passes', to: '/user/wallet', icon: CreditCard },
    { label: 'Gamer ID', to: '/user/profile', icon: User },
  ];

  const handleTopUpConfirm = () => {
    const finalAmount = customTopUp ? parseInt(customTopUp, 10) : topUpAmount;
    if (isNaN(finalAmount) || finalAmount < 100) return;

    let bonus = 0;
    if (finalAmount >= 2000) bonus = 400;
    else if (finalAmount >= 1000) bonus = 150;
    else if (finalAmount >= 500) bonus = 50;

    topUpUserWallet(finalAmount, bonus);
    setIsTopUpOpen(false);
    setCustomTopUp('');
  };

  const handleCallStaff = () => {
    const note = deskCustomNote.trim() ? `${deskReason}: ${deskCustomNote}` : deskReason;
    const stationTarget = userActiveSession ? userActiveSession.stationName : 'Customer Lounge / Seat';
    requestDeskAssistance(stationTarget, note);
    setIsCallStaffOpen(false);
    setDeskCustomNote('');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Cyber Ambient Backdrop */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[350px] bg-indigo-600/[0.07] rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-[600px] h-[350px] bg-cyan-500/[0.04] rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-1/2 left-10 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Top Gamer Header */}
      <header className="sticky top-0 z-30 bg-[#0b0e17]/90 backdrop-blur-xl border-b border-indigo-900/30 shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand & Arena Logo */}
            <div className="flex items-center gap-3">
              <Link to="/user" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-[#0d111e] rounded-[10px] flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black tracking-wider text-base sm:text-lg bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                      QHAR ARENA
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Gamer Portal
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 hidden sm:block">
                    Elite Gaming Cafe & Esports Hub
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    className={({ isActive }) =>
                      `relative px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 flex items-center gap-2 ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/20'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right: Gamer Actions, Wallet & Mode Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Active Session Indicator Pill */}
              {userActiveSession ? (
                <Link
                  to="/user/session"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 transition-colors text-xs font-semibold shadow-sm"
                  title="View your live playing desk"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{userActiveSession.stationName.split(' ')[0]}</span>
                  <span className="text-[11px] text-emerald-400/80 font-mono">LIVE</span>
                </Link>
              ) : null}

              {/* Direct Dark 🌙 / White ☀️ Theme Toggle */}
              <button
                onClick={() => {
                  const nextTheme = visualTheme === 'white-clean' ? 'enterprise-dark' : 'white-clean';
                  setVisualTheme(nextTheme);
                  sound.playClick();
                  addToast(
                    nextTheme === 'white-clean' ? 'White Theme Activated ☀️' : 'Dark Theme Activated 🌙',
                    nextTheme === 'white-clean' ? 'Switched to clean high-contrast light mode' : 'Switched to sleek obsidian dark mode',
                    'info'
                  );
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  visualTheme === 'white-clean'
                    ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100 shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-indigo-300 hover:border-indigo-500/40 hover:bg-zinc-800'
                }`}
                title={visualTheme === 'white-clean' ? 'Switch to Dark Theme 🌙' : 'Switch to White Theme ☀️'}
              >
                {visualTheme === 'white-clean' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">White Theme</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Dark Theme</span>
                  </>
                )}
              </button>

              {/* Call Staff Button */}
              <button
                onClick={() => setIsCallStaffOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300 hover:bg-red-900/40 transition-colors text-xs font-semibold"
                title="Call Desk Attendant / Staff Assistance"
              >
                <BellRing className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                <span className="hidden md:inline">Call Staff</span>
              </button>

              {/* Wallet Pill */}
              <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-lg p-1 gap-1.5 shadow-sm">
                <Link
                  to="/user/wallet"
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-zinc-200 hover:text-white"
                >
                  <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-mono text-emerald-400 font-bold">
                    ₹{currentCustomer.walletBalance ?? 0}
                  </span>
                </Link>
                <button
                  onClick={() => setIsTopUpOpen(true)}
                  className="w-6 h-6 rounded bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors text-xs"
                  title="Add Money to Gamer Wallet"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Gamer Profile Menu Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileSwitcherOpen(!isProfileSwitcherOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
                    {(currentCustomer.gamerTag || currentCustomer.name).charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold leading-tight text-white flex items-center gap-1">
                      {currentCustomer.gamerTag || currentCustomer.name}
                      {currentCustomer.status === 'VIP' && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded border border-amber-500/30">
                          VIP
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      {currentCustomer.loyaltyXP || 1200} XP
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {/* Switcher Dropdown */}
                {isProfileSwitcherOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0d111d] border border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="p-2 border-b border-zinc-800/80 mb-2">
                      <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Active Gamer Profile
                      </p>
                      <p className="text-sm font-bold text-white">
                        {currentCustomer.name}
                      </p>
                      <p className="text-xs text-indigo-400 font-mono">
                        Tag: @{currentCustomer.gamerTag || 'NoTag'}
                      </p>
                    </div>

                    <p className="px-2 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider mb-1">
                      Switch Demo Gamer
                    </p>
                    <div className="space-y-1">
                      {customers.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setCurrentCustomerId(c.id);
                            setIsProfileSwitcherOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                            c.id === currentCustomer.id
                              ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                              : 'text-zinc-300 hover:bg-zinc-800/50'
                          }`}
                        >
                          <div>
                            <span className="font-medium">{c.gamerTag || c.name}</span>
                            <span className="block text-[10px] text-zinc-500">{c.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">
                            ₹{c.walletBalance}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-zinc-800/80 mt-2 pt-2">
                      <Link
                        to="/user/profile"
                        onClick={() => setIsProfileSwitcherOpen(false)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg"
                      >
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Manage Gamer ID & Ranks</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* SWITCH TO ADMIN PANEL BUTTON (Eye-catching & Instant) */}
              <Link
                to="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/40 text-amber-300 hover:from-amber-600/30 hover:to-orange-600/30 transition-all text-xs font-bold shadow-md shadow-amber-950/30 group"
                title="Switch back to Cafe Admin & Operations Panel"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Admin Panel</span>
                <ExternalLink className="w-3 h-3 text-amber-400/80" />
              </Link>

              {/* Mobile hamburger toggle */}
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              >
                {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="lg:hidden border-t border-zinc-800/80 bg-[#090d16] px-4 py-3 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Render */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <Outlet />
      </main>

      {/* Footer / Status bar */}
      <footer className="border-t border-zinc-900 bg-[#05070c] py-6 text-zinc-500 text-xs mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p>
              QHAR GamingCaffe Arena System &bull; High-Frequency 360Hz & 4K LAN Network Active
            </p>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link to="/user/stations" className="hover:text-indigo-400 transition-colors">
              Rigs
            </Link>
            <Link to="/user/cafe" className="hover:text-indigo-400 transition-colors">
              In-Seat Cafe
            </Link>
            <Link to="/user/tournaments" className="hover:text-indigo-400 transition-colors">
              Tournaments
            </Link>
            <Link to="/" className="text-amber-400 hover:text-amber-300 font-semibold">
              Staff Portal &rarr;
            </Link>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Quick Wallet Top-Up */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1322] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Top-Up Gamer Wallet</h3>
                  <p className="text-xs text-zinc-400">
                    Instant balance recharge with bonus gaming credits
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTopUpOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-zinc-900/60 rounded-xl p-3.5 border border-zinc-800 mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-zinc-400">Current Balance</p>
                <p className="text-xl font-bold font-mono text-emerald-400">
                  ₹{currentCustomer.walletBalance ?? 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-zinc-400">Player ID</p>
                <p className="text-xs font-semibold text-zinc-300">
                  @{currentCustomer.gamerTag || currentCustomer.name}
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold text-zinc-300 mb-2">Select Recharge Amount</p>
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {[
                { amount: 300, bonus: 0 },
                { amount: 500, bonus: 50, tag: '+₹50 Bonus' },
                { amount: 1000, bonus: 150, tag: '+₹150 Bonus', popular: true },
                { amount: 2000, bonus: 400, tag: '+₹400 Bonus', elite: true },
              ].map((pack) => (
                <button
                  key={pack.amount}
                  type="button"
                  onClick={() => {
                    setTopUpAmount(pack.amount);
                    setCustomTopUp('');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    topUpAmount === pack.amount && !customTopUp
                      ? 'border-indigo-500 bg-indigo-600/20 text-white'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {pack.tag && (
                    <span className="absolute -top-2 right-2 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-gradient-to-r from-emerald-500 to-teal-400 text-black">
                      {pack.tag}
                    </span>
                  )}
                  <p className="text-lg font-bold font-mono">₹{pack.amount}</p>
                  <p className="text-[10px] text-zinc-400">
                    Get ₹{pack.amount + pack.bonus} in wallet
                  </p>
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Or Custom Amount (₹)
              </label>
              <input
                type="number"
                min="100"
                step="50"
                placeholder="Enter custom amount e.g. 750"
                value={customTopUp}
                onChange={(e) => setCustomTopUp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleTopUpConfirm}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 font-bold text-white shadow-lg shadow-indigo-600/30 text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>
                Pay & Recharge ₹{customTopUp || topUpAmount} via UPI / Card
              </span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Call Staff / Assistance */}
      {isCallStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1322] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Call Desk Attendant</h3>
                  <p className="text-xs text-zinc-400">
                    A staff floor runner will be dispatched immediately
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCallStaffOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 mb-4">
              <p className="text-[11px] text-zinc-400">Target Station</p>
              <p className="text-sm font-bold text-indigo-300">
                {userActiveSession ? userActiveSession.stationName : 'General Gaming Zone / Lounge'}
              </p>
            </div>

            <p className="text-xs font-semibold text-zinc-300 mb-2">Select Assistance Reason</p>
            <div className="space-y-2 mb-4">
              {[
                'Peripherals / Mousepad Swap or Clean',
                'Audio / Headset / Mic Troubleshooting',
                'Steam / Discord / Game Launcher Login Help',
                'In-Seat Food Delivery Status',
                'Clean Desk / Trash Pickup',
                'General Staff Assistance',
              ].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setDeskReason(reason)}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition-colors ${
                    deskReason === reason
                      ? 'border-indigo-500 bg-indigo-600/20 text-white'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Additional Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. need 2nd PS5 controller, left ear cup silent"
                value={deskCustomNote}
                onChange={(e) => setDeskCustomNote(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleCallStaff}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-white text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-colors"
            >
              <BellRing className="w-4 h-4" />
              <span>Dispatch Runner to Desk</span>
            </button>
          </div>
        </div>
      )}

      {/* Global Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};
