import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { Badge, getStationStatusBadge, getOrderStatusBadge } from '../components/common/Badge';
import { formatINR, formatDateTime, getElapsedDuration } from '../utils/formatters';
import {
  DollarSign,
  Activity,
  Monitor,
  Calendar,
  Users,
  AlertCircle,
  UtensilsCrossed,
  ChefHat,
  Package,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Play,
  CheckCircle,
  X,
  Gamepad2,
  SlidersHorizontal,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { SpeedSeatBar } from '../components/common/SpeedSeatBar';
import { ShiftStickyNotesBoard } from '../components/common/ShiftStickyNotesBoard';
import { GamerPassportModal } from '../components/common/GamerPassportModal';
import { Customer } from '../types';
import { Moon, Flame, Trophy, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    filteredStations,
    filteredSessions,
    filteredBookings,
    customers,
    filteredInvoices,
    filteredFnbOrders,
    stockItems,
    selectedBranch,
    arenaAtmosphere,
  } = useApp();

  const [revenueTimeframe, setRevenueTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [passportCustomer, setPassportCustomer] = useState<Customer | null>(null);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  // KPI calculations
  const totalRevenueToday = filteredInvoices
    .filter((inv) => inv.paymentStatus === 'Paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const pendingPayments = filteredInvoices
    .filter((inv) => inv.paymentStatus === 'Pending' || inv.paymentStatus === 'Partially Paid')
    .reduce((sum, inv) => sum + inv.outstandingAmount, 0);

  const activeSessions = filteredSessions.filter((s) => s.status === 'Active' || s.status === 'Overdue');
  const availableStations = filteredStations.filter((s) => s.status === 'Available');
  const todayBookings = filteredBookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending');

  // F&B Metrics (Section 18.H)
  const fnbRevenueToday = filteredFnbOrders
    .filter((o) => o.paymentStatus === 'Paid' || o.paymentStatus === 'Added to Bill')
    .reduce((sum, o) => sum + o.total, 0);

  const newOrdersCount = filteredFnbOrders.filter((o) => o.orderStatus === 'New').length;
  const preparingOrdersCount = filteredFnbOrders.filter((o) => o.orderStatus === 'Preparing').length;
  const readyOrdersCount = filteredFnbOrders.filter((o) => o.orderStatus === 'Ready').length;
  const lowStockCount = stockItems.filter((s) => s.status === 'Low Stock' || s.status === 'Out of Stock').length;

  // Overdue sessions alert
  const overdueSessions = activeSessions.filter((s) => {
    const dur = getElapsedDuration(s.startTime, s.scheduledEndTime);
    return dur.isOverdue;
  });

  // Sample chart data for Daily, Weekly, Monthly
  const dailyRevenueData = [
    { time: '10 AM', gaming: 2400, fnb: 850 },
    { time: '12 PM', gaming: 4200, fnb: 1800 },
    { time: '02 PM', gaming: 5800, fnb: 2600 },
    { time: '04 PM', gaming: 8400, fnb: 3400 },
    { time: '06 PM', gaming: 14200, fnb: 5100 },
    { time: '08 PM', gaming: 19500, fnb: 7200 },
    { time: '10 PM', gaming: 23400, fnb: 8900 },
    { time: '12 AM', gaming: 16800, fnb: 4800 },
  ];

  const weeklyRevenueData = [
    { time: 'Mon', gaming: 28000, fnb: 9500 },
    { time: 'Tue', gaming: 31000, fnb: 11200 },
    { time: 'Wed', gaming: 34000, fnb: 12400 },
    { time: 'Thu', gaming: 39000, fnb: 14000 },
    { time: 'Fri', gaming: 58000, fnb: 22000 },
    { time: 'Sat', gaming: 74000, fnb: 29500 },
    { time: 'Sun', gaming: 82000, fnb: 32000 },
  ];

  const monthlyRevenueData = [
    { time: 'Week 1', gaming: 240000, fnb: 85000 },
    { time: 'Week 2', gaming: 280000, fnb: 98000 },
    { time: 'Week 3', gaming: 310000, fnb: 112000 },
    { time: 'Week 4', gaming: 345000, fnb: 128000 },
  ];

  const chartData =
    revenueTimeframe === 'daily'
      ? dailyRevenueData
      : revenueTimeframe === 'weekly'
      ? weeklyRevenueData
      : monthlyRevenueData;

  // Station Utilization Breakdown
  const pcCount = filteredStations.filter((s) => s.type === 'PC').length;
  const consoleCount = filteredStations.filter((s) => s.type === 'Console').length;
  const vrCount = filteredStations.filter((s) => s.type === 'VR' || s.type === 'Racing Sim').length;

  const inUseCount = filteredStations.filter((s) => s.status === 'In Use').length;
  const utilizationPercent = filteredStations.length
    ? Math.round((inUseCount / filteredStations.length) * 100)
    : 0;

  const utilizationChartData = [
    { name: 'In Use', value: inUseCount, color: '#06b6d4' },
    { name: 'Available', value: availableStations.length, color: '#10b981' },
    { name: 'Booked', value: filteredStations.filter((s) => s.status === 'Booked').length, color: '#8b5cf6' },
    { name: 'Maintenance', value: filteredStations.filter((s) => s.status === 'Maintenance').length, color: '#f59e0b' },
  ];

  // Best-selling F&B items
  const bestSellers = [
    { name: 'Crispy Peri-Peri Burger', sales: 48, revenue: 9120 },
    { name: 'Monster Energy Ultra', sales: 62, revenue: 8060 },
    { name: 'Red Bull Energy 250ml', sales: 54, revenue: 6750 },
    { name: 'Cajun Fries Basket', sales: 45, revenue: 4950 },
    { name: 'Hazelnut Cappuccino', sales: 38, revenue: 5320 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Hero Command Center */}
      <div className="relative overflow-hidden rounded-xl bg-dark-900 p-4 sm:p-5 border border-dark-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                Operations Command Center
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Arena
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              {selectedBranch
                ? `Real-time session monitoring & cashier operations for ${selectedBranch.name} (${selectedBranch.code})`
                : 'Consolidated overview across all active café branches'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link to="/stations" className="btn-cyan text-xs py-2 px-3.5 font-semibold shrink-0 whitespace-nowrap">
              <Play className="w-3.5 h-3.5 fill-current" /> Launch Session
            </Link>
            <Link to="/fnb/pos" className="btn-primary text-xs py-2 px-3.5 font-semibold shrink-0 whitespace-nowrap">
              <UtensilsCrossed className="w-3.5 h-3.5" /> Cashier POS
            </Link>
          </div>
        </div>
      </div>

      {/* Reassuring Telemetry Status / Soft Overdue Notice */}
      {overdueSessions.length > 0 && !isAlertDismissed ? (
        <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-wrap items-center justify-between gap-2.5 text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-amber-200 font-medium">
              Notice: {overdueSessions.length} gaming session(s) reached schedule. Extend time or settle bill at counter.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/sessions" className="text-amber-400 hover:text-amber-300 font-semibold text-xs flex items-center gap-1 shrink-0">
              View Sessions <ArrowRight className="w-3 h-3" />
            </Link>
            <button onClick={() => setIsAlertDismissed(true)} className="text-zinc-500 hover:text-zinc-300 p-0.5" title="Dismiss">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-2 rounded-xl bg-dark-900 border border-dark-800 flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-zinc-200">Arena Telemetry:</span>
            <span className="text-emerald-400 font-medium">100% Systems Operational</span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-zinc-400 hidden sm:inline">{filteredStations.length} Pods Online & Synchronized</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400 text-[11px] font-mono">
            <span>⚡ 54ms QoS Fiber</span>
            <span>🔥 GPU Avg 52°C</span>
            <span className="text-indigo-400 font-sans font-semibold">Ready for Rush Hour</span>
          </div>
        </div>
      )}

      {/* Lounge Atmosphere Command Bar */}
      <div className="px-4 py-2.5 rounded-xl border border-dark-800 bg-dark-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center text-indigo-400 flex-shrink-0">
            {arenaAtmosphere === 'Midnight LAN Rush' && <Moon className="w-3.5 h-3.5" />}
            {arenaAtmosphere === 'Tournament Finals' && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
            {arenaAtmosphere === 'Happy Hour Rush' && <Sparkles className="w-3.5 h-3.5 text-rose-400" />}
            {arenaAtmosphere === 'Standard' && <Flame className="w-3.5 h-3.5 text-indigo-400" />}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-zinc-200">
              Lounge Atmosphere: <span className="text-indigo-400 font-bold">{arenaAtmosphere}</span>
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <p className="text-zinc-400">
              {arenaAtmosphere === 'Midnight LAN Rush' && 'Flat ₹60/hr overnight pass active + Complimentary hot chai counter running'}
              {arenaAtmosphere === 'Tournament Finals' && 'Tournament finals feed on video walls + Low-latency QoS router priority enabled'}
              {arenaAtmosphere === 'Happy Hour Rush' && 'Student squad 15% discount active (COLLEGERUSH15) + 20% off burger combos'}
              {arenaAtmosphere === 'Standard' && 'Normal peak-hour tariffs applying across all PC, PS5, and VR pod stations'}
            </p>
          </div>
        </div>

        <Link
          to="/pricing"
          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap"
        >
          Tariff Rules <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Core Gaming KPI Cards (Responsive 2/3/6 columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard
          title="Total Revenue Today"
          value={formatINR(totalRevenueToday)}
          subtitle="Gaming + F&B Reconciled"
          icon={DollarSign}
          trend={{ value: '14.2%', isPositive: true }}
          accentColor="emerald"
          onClick={() => navigate('/billing')}
        />
        <StatCard
          title="Active Sessions"
          value={activeSessions.length}
          subtitle={overdueSessions.length > 0 ? `${overdueSessions.length} grace period` : 'All on schedule'}
          icon={Activity}
          accentColor="cyan"
          onClick={() => navigate('/sessions')}
        />
        <StatCard
          title="Available Stations"
          value={availableStations.length}
          subtitle={`of ${filteredStations.length} total stations`}
          icon={Monitor}
          accentColor="purple"
          onClick={() => navigate('/stations')}
        />
        <StatCard
          title="Today's Bookings"
          value={todayBookings.length}
          subtitle="Confirmed reservations"
          icon={Calendar}
          accentColor="purple"
          onClick={() => navigate('/bookings')}
        />
        <StatCard
          title="Registered Gamers"
          value={customers.length}
          subtitle="Active membership"
          icon={Users}
          accentColor="cyan"
          onClick={() => navigate('/customers')}
        />
        <StatCard
          title="Pending Payments"
          value={formatINR(pendingPayments)}
          subtitle="Awaiting counter settlement"
          icon={AlertCircle}
          accentColor="rose"
          onClick={() => navigate('/billing')}
        />
      </div>

      {/* Express 1-Click Speed Seat Bar */}
      <SpeedSeatBar />

      {/* NEW: Live Interactive Arena Pod Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Live Arena Floor Pods ({filteredStations.length})
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {availableStations.length} Free
            </span>
          </div>
          <Link
            to="/stations"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Manage All Stations <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredStations.slice(0, 5).map((st) => {
            const activeSess = filteredSessions.find(
              (s) => s.stationId === st.id && (s.status === 'Active' || s.status === 'Overdue')
            );
            const timing = activeSess ? getElapsedDuration(activeSess.startTime, activeSess.scheduledEndTime) : null;
            const isOccupied = st.status === 'In Use' && activeSess;

            return (
              <div
                key={st.id}
                onClick={() => navigate('/stations')}
                className="gaming-card p-3 flex flex-col justify-between hover:border-zinc-700 transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xs font-bold text-white font-display truncate">
                      {st.name.split('(')[0].trim()}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                        st.status === 'Available'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : st.status === 'In Use'
                          ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {st.status}
                    </span>
                  </div>

                  {isOccupied ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-300 font-medium truncate flex items-center gap-1">
                          <Users className="w-3 h-3 text-zinc-500" /> {activeSess.customerName.split(' ')[0]}
                        </span>
                        <span className="font-mono text-indigo-300 text-[10px]">
                          {timing?.remainingText}
                        </span>
                      </div>
                      <div className="w-full bg-dark-950 h-1 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                ((timing?.elapsedMinutes || 1) /
                                  ((timing?.elapsedMinutes || 1) + (timing?.remainingMinutes || 1))) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate">{activeSess.notes || 'Gaming Session'}</p>
                    </div>
                  ) : (
                    <div className="py-1.5 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-mono font-semibold text-emerald-400">
                        ₹{st.hourlyRate}/h
                      </span>
                      <span className="text-[10px] text-zinc-500 mt-0.5">Click to Seat Gamer</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 mt-2 border-t border-dark-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="capitalize">{st.type}</span>
                  <span className="font-mono text-zinc-500">{st.specs?.gpu || st.specs?.consoleModel || 'Ready'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Food & Beverages Integrated Section (18.H) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Food & Beverage Operations
            </h2>
          </div>
          <Link
            to="/fnb"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            F&B Center <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <StatCard
            title="F&B Revenue Today"
            value={formatINR(fnbRevenueToday)}
            subtitle="Snacks & Drinks sales"
            icon={DollarSign}
            accentColor="amber"
            onClick={() => navigate('/fnb/reports')}
          />
          <StatCard
            title="New Orders"
            value={newOrdersCount}
            subtitle="Awaiting acceptance"
            icon={UtensilsCrossed}
            accentColor="purple"
            onClick={() => navigate('/fnb/orders')}
          />
          <StatCard
            title="Orders Preparing"
            value={preparingOrdersCount}
            subtitle="In kitchen queue"
            icon={ChefHat}
            accentColor="cyan"
            onClick={() => navigate('/fnb/kitchen')}
          />
          <StatCard
            title="Orders Ready"
            value={readyOrdersCount}
            subtitle="Ready to serve/pickup"
            icon={CheckCircle}
            accentColor="emerald"
            onClick={() => navigate('/fnb/kitchen')}
          />
          <StatCard
            title="Low-Stock Items"
            value={lowStockCount}
            subtitle="Need replenishment"
            icon={Package}
            accentColor="rose"
            onClick={() => navigate('/fnb/inventory')}
          />
        </div>
      </div>

      {/* Charts Section: Revenue breakdown + Station Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Analytics Chart */}
        <div className="lg:col-span-2 gaming-card p-5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-white font-gaming">
                REVENUE TRENDS
              </h3>
              <p className="text-xs text-slate-400">
                Itemized breakdown of Gaming vs. Food & Beverage intake
              </p>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center gap-1 bg-dark-850 p-1 rounded-lg border border-dark-750">
              {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setRevenueTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                    revenueTimeframe === tf
                      ? 'bg-brand-purple text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gamingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="fnbGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c1017',
                    borderColor: '#233148',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [formatINR(Number(value)), '']}
                />
                <Area
                  type="monotone"
                  dataKey="gaming"
                  name="Gaming Revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#gamingGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="fnb"
                  name="F&B Cafe Revenue"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#fnbGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-dark-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-purple" />
              <span className="text-slate-300">Gaming Sessions & Reservations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Food, Beverages & Energy Drinks</span>
            </div>
          </div>
        </div>

        {/* Station Utilization Donut */}
        <div className="gaming-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white font-gaming">
                OCCUPANCY RATE
              </h3>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                {utilizationPercent}% Occupied
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live hardware capacity across {filteredStations.length} stations
            </p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={utilizationChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {utilizationChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c1017',
                    borderColor: '#233148',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-dark-800">
            {utilizationChartData.map((d) => (
              <div key={d.name} className="flex items-center justify-between bg-dark-850 p-2 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-300">{d.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Bookings & Best-Selling F&B Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Bookings */}
        <div className="gaming-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white font-gaming uppercase tracking-wide">
                Recent Bookings
              </h3>
              <p className="text-xs text-slate-400">Upcoming gamer slots</p>
            </div>
            <Link to="/bookings" className="text-xs text-brand-purple hover:underline font-semibold">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-dark-850 text-slate-400 border-b border-dark-750">
                <tr>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-2">Station</th>
                  <th className="py-2.5 px-2">Time Slot</th>
                  <th className="py-2.5 px-2">Amount</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {filteredBookings.slice(0, 4).map((b) => (
                  <tr key={b.id} className="hover:bg-dark-850/40">
                    <td className="py-2.5 px-3 font-semibold text-white">
                      {b.customerName}
                    </td>
                    <td className="py-2.5 px-2 text-slate-300">
                      {b.stationName}
                    </td>
                    <td className="py-2.5 px-2 text-slate-400 font-mono">
                      {b.startTime} - {b.endTime}
                    </td>
                    <td className="py-2.5 px-2 text-emerald-400 font-mono font-medium">
                      {formatINR(b.totalAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Badge
                        label={b.status}
                        variant={b.status === 'Confirmed' ? 'success' : 'warning'}
                        size="sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Selling F&B Items */}
        <div className="gaming-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white font-gaming uppercase tracking-wide">
                Top Selling Café Items
              </h3>
              <p className="text-xs text-slate-400">Popular food & beverage orders</p>
            </div>
            <Link to="/fnb/menu" className="text-xs text-amber-400 hover:underline font-semibold">
              Manage Menu
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-dark-850 text-slate-400 border-b border-dark-750">
                <tr>
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-2 text-center">Units Sold</th>
                  <th className="py-2.5 px-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {bestSellers.map((item, idx) => (
                  <tr key={idx} className="hover:bg-dark-850/40">
                    <td className="py-2.5 px-3 font-medium text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-dark-750 flex items-center justify-center text-[10px] font-bold text-slate-300">
                        #{idx + 1}
                      </span>
                      <span>{item.name}</span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono font-semibold text-slate-300">
                      {item.sales}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-emerald-400">
                      {formatINR(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Front-Desk Shift Sticky Notes & Handover Board */}
      <ShiftStickyNotesBoard />

      {/* Gamer VIP Passport & Social Profile Modal */}
      <GamerPassportModal
        isOpen={!!passportCustomer}
        onClose={() => setPassportCustomer(null)}
        customer={passportCustomer}
      />
    </div>
  );
};
