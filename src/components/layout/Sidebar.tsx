import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Gamepad2,
  LayoutDashboard,
  Building2,
  Monitor,
  Activity,
  CalendarCheck,
  Users,
  CreditCard,
  Tags,
  BarChart3,
  ShieldCheck,
  Bell,
  Settings,
  LogOut,
  UtensilsCrossed,
  ChevronDown,
  ChevronRight,
  Flame,
  ChefHat,
  Package,
  Layers,
  ShoppingBag,
  ListOrdered,
  X,
  FileSpreadsheet,
  Trophy,
  Banknote,
  ArrowRight,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const {
    filteredSessions,
    filteredBookings,
    notifications,
    filteredFnbOrders,
    stockItems,
    currentUser,
    activeRole,
  } = useApp();

  const [isFnbExpanded, setIsFnbExpanded] = useState(
    location.pathname.startsWith('/fnb')
  );

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const activeSessionsCount = filteredSessions.filter((s) => s.status === 'Active' || s.status === 'Overdue').length;
  const todayBookingsCount = filteredBookings.filter((b) => b.status === 'Confirmed').length;
  const kitchenOrdersCount = filteredFnbOrders.filter((o) => o.orderStatus === 'Preparing' || o.orderStatus === 'New').length;
  const lowStockCount = stockItems.filter((s) => s.status === 'Low Stock' || s.status === 'Out of Stock').length;

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-zinc-850 text-white font-semibold border-l-2 border-indigo-500 shadow-sm'
        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850/50'
    }`;

  const subNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 pl-7 ${
      isActive
        ? 'text-indigo-300 font-semibold bg-indigo-950/40 border-l-2 border-indigo-400'
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/30'
    }`;

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-dark-900/95 backdrop-blur-2xl border-r border-dark-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-dark-800 bg-dark-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-base font-extrabold tracking-tight text-white">
                  QHAR
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  OPS
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium">
                GamingCaffe Suite
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          {/* Main Group */}
          <div className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Core Operations
          </div>

          <NavLink to="/" end className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 text-brand-purple" />
              <span>Dashboard</span>
            </div>
          </NavLink>

          <NavLink to="/branches" className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Branch Management</span>
            </div>
          </NavLink>

          <NavLink to="/stations" className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <Monitor className="w-4 h-4 text-cyan-400" />
              <span>Gaming Stations</span>
            </div>
          </NavLink>

          <NavLink to="/sessions" className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Live Sessions</span>
            </div>
            {activeSessionsCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                {activeSessionsCount} Live
              </span>
            )}
          </NavLink>

          <NavLink to="/bookings" className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <CalendarCheck className="w-4 h-4 text-purple-400" />
              <span>Bookings</span>
            </div>
            {todayBookingsCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-dark-750 text-slate-300">
                {todayBookingsCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/tournaments" className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Tournaments</span>
            </div>
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-gaming">
              CUP
            </span>
          </NavLink>

          {/* F&B Management Section (Collapsible) */}
          <div className="pt-3">
            <div className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Café & POS</span>
              <span className="text-[10px] text-amber-400 font-semibold px-1 rounded bg-amber-400/10">F&B</span>
            </div>

            <button
              onClick={() => setIsFnbExpanded(!isFnbExpanded)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-dark-850 transition-colors"
            >
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <span>Food & Beverages</span>
              </div>
              <div className="flex items-center gap-1.5">
                {kitchenOrdersCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {kitchenOrdersCount}
                  </span>
                )}
                {isFnbExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {isFnbExpanded && (
              <div className="space-y-1 my-1 animate-in slide-in-from-top-2 duration-150">
                <NavLink to="/fnb" end className={subNavLinkClasses} onClick={closeSidebar}>
                  <span>F&B Overview</span>
                </NavLink>

                <NavLink to="/fnb/pos" className={subNavLinkClasses} onClick={closeSidebar}>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-semibold text-rose-300">Cashier POS</span>
                  </div>
                </NavLink>

                <NavLink to="/fnb/menu" className={subNavLinkClasses} onClick={closeSidebar}>
                  <span>Menu Management</span>
                </NavLink>

                <NavLink to="/fnb/categories" className={subNavLinkClasses} onClick={closeSidebar}>
                  <span>Categories</span>
                </NavLink>

                <NavLink to="/fnb/orders" className={subNavLinkClasses} onClick={closeSidebar}>
                  <span>Orders Log</span>
                </NavLink>

                <NavLink to="/fnb/kitchen" className={subNavLinkClasses} onClick={closeSidebar}>
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-1.5">
                      <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                      <span>Kitchen (KDS)</span>
                    </span>
                    {kitchenOrdersCount > 0 && (
                      <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 rounded">
                        {kitchenOrdersCount}
                      </span>
                    )}
                  </div>
                </NavLink>

                <NavLink to="/fnb/inventory" className={subNavLinkClasses} onClick={closeSidebar}>
                  <div className="flex items-center justify-between w-full">
                    <span>Stock & Inventory</span>
                    {lowStockCount > 0 && (
                      <span className="text-[10px] bg-rose-500/30 text-rose-300 px-1.5 rounded font-bold">
                        {lowStockCount} low
                      </span>
                    )}
                  </div>
                </NavLink>

                <NavLink to="/fnb/reports" className={subNavLinkClasses} onClick={closeSidebar}>
                  <span>F&B Analytics</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Administration Group */}
          <div className="pt-3 px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Administration
          </div>

          <NavLink to="/customers" className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Customers</span>
            </div>
          </NavLink>

          <NavLink to="/billing" className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Billing & Payments</span>
            </div>
          </NavLink>

          <NavLink to="/shift-register" className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <Banknote className="w-4 h-4 text-emerald-400" />
              <span>Shift Register (Till)</span>
            </div>
          </NavLink>

          <NavLink to="/pricing" className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <Tags className="w-4 h-4 text-cyan-400" />
              <span>Pricing Management</span>
            </div>
          </NavLink>

          <NavLink to="/reports" className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Reports & Analytics</span>
            </div>
          </NavLink>

          <NavLink to="/staff" className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-brand-purple" />
              <span>Staff & Roles</span>
            </div>
          </NavLink>

          <NavLink to="/notifications" className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Notifications</span>
            </div>
            {unreadNotifs > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {unreadNotifs}
              </span>
            )}
          </NavLink>

          <NavLink to="/settings" className={navLinkClasses} onClick={closeSidebar}>
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </div>
          </NavLink>
        </div>

        {/* Switch to Gamer Portal Banner */}
        <div className="p-3 border-t border-dark-800">
          <NavLink
            to="/user"
            onClick={closeSidebar}
            className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-indigo-950/70 via-indigo-900/40 to-cyan-950/40 border border-indigo-500/30 hover:border-indigo-400 text-indigo-200 transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Gamer Portal
                </p>
                <p className="text-[10px] text-zinc-400">Customer Facing View</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
        </div>

        {/* Footer User Info */}
        <div className="p-3.5 border-t border-dark-800 bg-dark-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-indigo-600 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[11px] text-brand-purple font-medium truncate">{activeRole}</p>
            </div>
          </div>
          <NavLink
            to="/settings"
            title="Log Out / Switch Account"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-dark-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </NavLink>
        </div>
      </aside>
    </>
  );
};
