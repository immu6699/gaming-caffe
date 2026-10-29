import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge, getOrderStatusBadge } from '../../components/common/Badge';
import { formatINR, formatDateTime } from '../../utils/formatters';
import {
  UtensilsCrossed,
  ChefHat,
  Package,
  CheckCircle,
  Clock,
  ArrowRight,
  Flame,
  Plus,
  ShoppingBag,
  ListOrdered,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export const FnbDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { filteredFnbOrders, menuItems, stockItems } = useApp();

  const totalFnbRevenue = filteredFnbOrders
    .filter((o) => o.paymentStatus === 'Paid' || o.paymentStatus === 'Added to Bill')
    .reduce((sum, o) => sum + o.total, 0);

  const newOrders = filteredFnbOrders.filter((o) => o.orderStatus === 'New');
  const preparingOrders = filteredFnbOrders.filter((o) => o.orderStatus === 'Preparing');
  const readyOrders = filteredFnbOrders.filter((o) => o.orderStatus === 'Ready');
  const lowStockItems = stockItems.filter(
    (s) => s.status === 'Low Stock' || s.status === 'Out of Stock'
  );

  // Category sales breakdown
  const categorySalesData = [
    { name: 'Fast Food', orders: 124, revenue: 23560 },
    { name: 'Energy Drinks', orders: 186, revenue: 24180 },
    { name: 'Snacks', orders: 98, revenue: 12740 },
    { name: 'Beverages', orders: 84, revenue: 11760 },
    { name: 'Meals', orders: 52, revenue: 11960 },
    { name: 'Desserts', orders: 42, revenue: 6300 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 p-5 rounded-2xl border border-dark-750/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
              FOOD & BEVERAGES OVERVIEW
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              CAFÉ & POS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cashier point-of-sale, live kitchen tickets (KDS), menu management, and inventory stock.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/fnb/pos" className="btn-primary text-xs py-2">
            <Flame className="w-4 h-4 text-rose-300" /> Open Cashier POS
          </Link>
          <Link to="/fnb/kitchen" className="btn-cyan text-xs py-2">
            <ChefHat className="w-4 h-4" /> Kitchen Display ({preparingOrders.length})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="F&B Sales Today"
          value={formatINR(totalFnbRevenue)}
          subtitle="Orders reconciled"
          icon={UtensilsCrossed}
          trend={{ value: '22.5%', isPositive: true }}
          accentColor="emerald"
          onClick={() => navigate('/fnb/reports')}
        />
        <StatCard
          title="New Orders"
          value={newOrders.length}
          subtitle="Awaiting accept"
          icon={ShoppingBag}
          accentColor="purple"
          onClick={() => navigate('/fnb/orders')}
        />
        <StatCard
          title="Kitchen In-Prep"
          value={preparingOrders.length}
          subtitle="Chef preparing"
          icon={ChefHat}
          accentColor="amber"
          onClick={() => navigate('/fnb/kitchen')}
        />
        <StatCard
          title="Ready to Serve"
          value={readyOrders.length}
          subtitle="Pickup / Station delivery"
          icon={CheckCircle}
          accentColor="cyan"
          onClick={() => navigate('/fnb/kitchen')}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockItems.length}
          subtitle="Needs restock"
          icon={Package}
          accentColor="rose"
          onClick={() => navigate('/fnb/inventory')}
        />
      </div>

      {/* Two Columns: Category Breakdown + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Category Sales Chart */}
        <div className="lg:col-span-2 gaming-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white font-gaming">
                CATEGORY VOLUME BREAKDOWN
              </h3>
              <p className="text-xs text-slate-400">
                Turnover by snacks, fast food, and energy drinks
              </p>
            </div>
            <Link to="/fnb/reports" className="text-xs text-brand-purple hover:underline font-semibold">
              Full Report
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                  formatter={(val: any) => [formatINR(Number(val)), 'Sales']}
                />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Links & Shortcuts */}
        <div className="gaming-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-white font-gaming uppercase tracking-wider">
            F&B Operational Modules
          </h3>

          <div className="space-y-2.5">
            <Link
              to="/fnb/pos"
              className="p-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Cashier Point of Sale (POS)
                  </h4>
                  <p className="text-[11px] text-slate-400">Order taking, station delivery, cart checkout</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
            </Link>

            <Link
              to="/fnb/kitchen"
              className="p-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Kitchen Display System (KDS)
                  </h4>
                  <p className="text-[11px] text-slate-400">Live chef tickets & order preparation status</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
            </Link>

            <Link
              to="/fnb/menu"
              className="p-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-purple/20 text-brand-purple">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Menu Management
                  </h4>
                  <p className="text-[11px] text-slate-400">Items, variants, pricing, and availability</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
            </Link>

            <Link
              to="/fnb/inventory"
              className="p-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Stock & Inventory
                  </h4>
                  <p className="text-[11px] text-slate-400">Ingredient tracking and low-stock alerts</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Log Preview */}
      <div className="gaming-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-gaming uppercase tracking-wide">
              Recent Food & Beverage Orders
            </h3>
            <p className="text-xs text-slate-400">Station deliveries and walk-in counter tickets</p>
          </div>
          <Link to="/fnb/orders" className="text-xs text-brand-purple hover:underline font-semibold">
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-dark-850 text-slate-300 font-semibold border-b border-dark-750">
              <tr>
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Destination / Customer</th>
                <th className="py-2.5 px-3">Items Ordered</th>
                <th className="py-2.5 px-3">Total</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3 text-right">Kitchen Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 text-slate-200">
              {filteredFnbOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-dark-850/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-white">
                    {order.orderNumber}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-white">{order.customerName}</div>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {order.stationName || order.orderType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-slate-300">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                    {formatINR(order.total)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-slate-300 font-medium">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {getOrderStatusBadge(order.orderStatus)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
