import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExportButton } from '../../components/common/ExportButton';
import { formatINR } from '../../utils/formatters';
import {
  UtensilsCrossed,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Package,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const FnbReportsPage: React.FC = () => {
  const { filteredFnbOrders } = useApp();

  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const totalFnbRevenue = filteredFnbOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = filteredFnbOrders.length;
  const avgOrderValue = totalOrders ? Math.round(totalFnbRevenue / totalOrders) : 0;
  const estimatedProfit = Math.round(totalFnbRevenue * 0.58); // Avg ~58% gross margin on cafe food/drinks

  const categoryBreakdown = [
    { name: 'Fast Food', sales: 48, revenue: 24500, color: '#f43f5e' },
    { name: 'Energy Drinks', sales: 86, revenue: 21200, color: '#06b6d4' },
    { name: 'Snacks & Fries', sales: 62, revenue: 14800, color: '#f59e0b' },
    { name: 'Coffee & Tea', sales: 44, revenue: 11200, color: '#8b5cf6' },
    { name: 'Meals & Bowls', sales: 28, revenue: 8900, color: '#10b981' },
  ];

  const salesTrend = [
    { day: 'Mon', revenue: 9800, cost: 4100 },
    { day: 'Tue', revenue: 11200, cost: 4800 },
    { day: 'Wed', revenue: 12400, cost: 5200 },
    { day: 'Thu', revenue: 14800, cost: 6100 },
    { day: 'Fri', revenue: 22600, cost: 9200 },
    { day: 'Sat', revenue: 29800, cost: 12100 },
    { day: 'Sun', revenue: 32400, cost: 13400 },
  ];

  const topItems = [
    { name: 'Crispy Peri-Peri Chicken Burger', qty: 68, revenue: 12920, margin: '55%' },
    { name: 'Monster Energy Ultra White (350ml)', qty: 94, revenue: 12220, margin: '27%' },
    { name: 'Loaded Nachos Grande', qty: 54, revenue: 8640, margin: '65%' },
    { name: 'Double Shot Hazelnut Cappuccino', qty: 46, revenue: 6440, margin: '71%' },
    { name: 'Warm Chocolate Walnut Brownie', qty: 38, revenue: 5700, margin: '63%' },
  ];

  const exportData = topItems.map((item) => ({
    'Menu Item': item.name,
    'Units Sold': item.qty,
    'Revenue (INR)': item.revenue,
    'Profit Margin': item.margin,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
            FOOD & BEVERAGE SALES ANALYTICS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cost-of-goods breakdown, gross profit margins, category sales, and product performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportButton
            data={exportData}
            filename="QHAR_Fnb_Analytics_Report"
            label="Export F&B Data"
          />
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="gaming-card p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase">F&B Total Revenue</span>
          <p className="text-xl font-bold font-gaming text-emerald-400 mt-1">{formatINR(totalFnbRevenue)}</p>
          <span className="text-[11px] text-emerald-400 font-medium">Reconciled counter & rig orders</span>
        </div>

        <div className="gaming-card p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase">Estimated Gross Profit</span>
          <p className="text-xl font-bold font-gaming text-cyan-400 mt-1">{formatINR(estimatedProfit)}</p>
          <span className="text-[11px] text-cyan-400 font-medium">~58% healthy café margin</span>
        </div>

        <div className="gaming-card p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Food Tickets</span>
          <p className="text-xl font-bold font-gaming text-purple-400 mt-1">{totalOrders} Orders</p>
          <span className="text-[11px] text-slate-400 font-medium">Counter + Station delivered</span>
        </div>

        <div className="gaming-card p-4">
          <span className="text-xs text-slate-400 font-semibold uppercase">Average Ticket (AOV)</span>
          <p className="text-xl font-bold font-gaming text-amber-400 mt-1">{formatINR(avgOrderValue)}</p>
          <span className="text-[11px] text-slate-400 font-medium">Includes combo attachments</span>
        </div>
      </div>

      {/* Sales vs Cost of Goods Chart */}
      <div className="gaming-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white font-gaming">
              SALES REVENUE VS. COST OF GOODS (COGS)
            </h3>
            <p className="text-xs text-slate-400">
              Weekly revenue compared against kitchen preparation and stock cost
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
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
              <Bar dataKey="revenue" name="Total Sales (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cost" name="Cost of Ingredients (₹)" fill="#64748b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Category Distribution & Top Selling Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Share */}
        <div className="gaming-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-gaming mb-1">
              CATEGORY REVENUE PROPORTION
            </h3>
            <p className="text-xs text-slate-400 mb-4">Sales share across major menu departments</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="revenue"
                >
                  {categoryBreakdown.map((entry, index) => (
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
                  formatter={(val: any) => [formatINR(Number(val)), 'Sales']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-dark-800">
            {categoryBreakdown.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-2 rounded-lg bg-dark-850">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-300 text-[11px] truncate">{c.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{formatINR(c.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Menu Items Table */}
        <div className="gaming-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white font-gaming">
                BEST-SELLING CAFÉ PRODUCTS
              </h3>
              <p className="text-xs text-slate-400">Ranked by unit velocity and margin</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-dark-850 text-slate-300 font-semibold border-b border-dark-750">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-2 text-center">Units</th>
                  <th className="py-2.5 px-3 text-right">Revenue</th>
                  <th className="py-2.5 px-2 text-center">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800 text-slate-200">
                {topItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-dark-850/40">
                    <td className="py-2.5 px-3 font-semibold text-white">
                      #{idx + 1} {item.name}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-cyan-400">
                      {item.qty}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      {formatINR(item.revenue)}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono font-semibold text-amber-400">
                      {item.margin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
