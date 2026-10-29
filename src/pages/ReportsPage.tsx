import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExportButton } from '../components/common/ExportButton';
import { formatINR } from '../utils/formatters';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  PieChart as PieIcon,
  Activity,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const { filteredInvoices, branches, stations, fnbOrders, bookings } = useApp();

  const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days'>('30days');

  // Revenue by branch data
  const branchPerformanceData = branches.map((b) => ({
    name: b.city,
    fullName: b.name,
    gaming: Math.round(b.todayRevenue * 0.7),
    fnb: Math.round(b.todayRevenue * 0.3),
    total: b.todayRevenue,
  }));

  // Station Utilization by type
  const stationTypeUsage = [
    { type: 'Gaming PCs (RTX 4080/4090)', hours: 840, revenue: 126000 },
    { type: 'PlayStation 5 Suites', hours: 520, revenue: 93600 },
    { type: 'Xbox Series X Lounges', hours: 380, revenue: 60800 },
    { type: 'VR Treadmill Simulator', hours: 210, revenue: 52500 },
  ];

  // Payment Methods distribution
  const paymentMethodsData = [
    { name: 'UPI QR (GPay / PhonePe)', value: 62, color: '#06b6d4' },
    { name: 'Credit / Debit Cards', value: 24, color: '#8b5cf6' },
    { name: 'Cash Counter', value: 11, color: '#10b981' },
    { name: 'NetBanking / Wallet', value: 3, color: '#f59e0b' },
  ];

  // Daily Trend Data for 7 / 30 / 90 days
  const dailyTrends = [
    { date: 'Oct 21', revenue: 38500, sessions: 42, bookings: 14 },
    { date: 'Oct 22', revenue: 42100, sessions: 46, bookings: 18 },
    { date: 'Oct 23', revenue: 45800, sessions: 51, bookings: 22 },
    { date: 'Oct 24', revenue: 59200, sessions: 68, bookings: 31 },
    { date: 'Oct 25', revenue: 78500, sessions: 89, bookings: 44 },
    { date: 'Oct 26', revenue: 84200, sessions: 96, bookings: 48 },
    { date: 'Oct 27 (Today)', revenue: 68400, sessions: 74, bookings: 36 },
  ];

  const totalGamingRevenue = filteredInvoices
    .filter((i) => i.paymentStatus === 'Paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalRefunds = filteredInvoices
    .filter((i) => i.paymentStatus === 'Refunded')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const exportPayload = dailyTrends.map((d) => ({
    Date: d.date,
    'Revenue (INR)': d.revenue,
    'Live Sessions': d.sessions,
    'Advance Bookings': d.bookings,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
            REPORTS & BUSINESS ANALYTICS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Financial audit trail, regional branch comparisons, hardware utilization, and payment channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-dark-850 p-1 rounded-lg border border-dark-750">
            {(['7days', '30days', '90days'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  dateRange === r ? 'bg-brand-purple text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === '7days' ? 'Last 7 Days' : r === '30days' ? 'Last 30 Days' : 'Last Quarter'}
              </button>
            ))}
          </div>

          <ExportButton
            data={exportPayload}
            filename="QHAR_Executive_Report"
            label="Export Report"
          />
        </div>
      </div>

      {/* Top 4 Key Summary Numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="gaming-card p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Revenue</span>
          <p className="text-xl font-bold font-gaming text-emerald-400 mt-1">{formatINR(totalGamingRevenue)}</p>
          <span className="text-[11px] text-emerald-400 font-medium">↑ +18.4% vs last period</span>
        </div>

        <div className="gaming-card p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Hours Billed</span>
          <p className="text-xl font-bold font-gaming text-cyan-400 mt-1">1,950 Hours</p>
          <span className="text-[11px] text-cyan-400 font-medium">92% PC & Console uptime</span>
        </div>

        <div className="gaming-card p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase">Average Ticket Size</span>
          <p className="text-xl font-bold font-gaming text-purple-400 mt-1">₹485 / visit</p>
          <span className="text-[11px] text-slate-400 font-medium">Avg 2.2 hrs + F&B snack</span>
        </div>

        <div className="gaming-card p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Refunds</span>
          <p className="text-xl font-bold font-gaming text-amber-400 mt-1">{formatINR(totalRefunds)}</p>
          <span className="text-[11px] text-slate-400 font-medium">&lt; 0.8% dispute rate</span>
        </div>
      </div>

      {/* Daily Trends Chart */}
      <div className="gaming-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white font-gaming">
              DAILY REVENUE & VOLUME TRAJECTORY
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated daily turnover correlated with player sessions
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
            Peak: Sat & Sun
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1017',
                  borderColor: '#233148',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [formatINR(Number(val)), 'Revenue']}
              />
              <Bar dataKey="revenue" name="Daily Revenue (₹)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Branch Performance + Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Branch Performance Comparison */}
        <div className="gaming-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-gaming mb-1">
              BRANCH PERFORMANCE BENCHMARK
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Regional earnings categorized by Gaming vs. Food & Beverage
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchPerformanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c1017',
                    borderColor: '#233148',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [formatINR(Number(val)), '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="gaming" name="Gaming Operations" fill="#8b5cf6" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="fnb" name="F&B Cafe & POS" fill="#06b6d4" stackId="a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="gaming-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-gaming mb-1">
              PAYMENT METHOD DISTRIBUTION
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Transaction share by digital UPI, card swipe, and counter cash
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
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
                  formatter={(val: any) => [`${val}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-dark-800">
            {paymentMethodsData.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-2 rounded-lg bg-dark-850">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-slate-300 text-[11px] truncate">{p.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
