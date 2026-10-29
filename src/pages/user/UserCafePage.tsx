import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, FnbCategory } from '../../types';
import {
  UtensilsCrossed,
  Search,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  CreditCard,
  Clock,
  CheckCircle,
  Flame,
  X,
  Sparkles,
  ArrowRight,
  Send,
} from 'lucide-react';
import { sound } from '../../utils/audio';

export const UserCafePage: React.FC = () => {
  const {
    menuItems,
    currentCustomer,
    userActiveSession,
    stations,
    orderFnbFromUser,
    addToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<FnbCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Cart state: map of menuItemId -> quantity
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [deliveryStation, setDeliveryStation] = useState<string>(
    userActiveSession ? userActiveSession.stationName : 'Front Counter Pickup'
  );
  const [orderNotes, setOrderNotes] = useState('');
  const [payWithWallet, setPayWithWallet] = useState(true);

  const categories: (FnbCategory | 'ALL')[] = [
    'ALL',
    'Energy Drinks',
    'Fast Food',
    'Snacks',
    'Cold Beverages',
    'Hot Beverages',
    'Meals',
    'Desserts',
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || item.isVegetarian;
    return matchesCat && matchesSearch && matchesVeg;
  });

  const updateQuantity = (itemId: string, delta: number) => {
    setCartQuantities((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
    sound.playClick();
  };

  const cartItemsList = Object.entries(cartQuantities)
    .map(([id, qty]) => {
      const item = menuItems.find((m) => m.id === id);
      return item ? { menuItem: item, quantity: qty } : null;
    })
    .filter(Boolean) as { menuItem: MenuItem; quantity: number }[];

  const totalItemsCount = cartItemsList.reduce((sum, ci) => sum + ci.quantity, 0);
  const subtotal = cartItemsList.reduce((sum, ci) => sum + ci.menuItem.sellingPrice * ci.quantity, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + tax;

  const handleCheckout = () => {
    if (cartItemsList.length === 0) return;

    const success = orderFnbFromUser({
      stationName: deliveryStation,
      items: cartItemsList,
      notes: orderNotes.trim() || undefined,
      payWithWallet,
    });

    if (success) {
      setCartQuantities({});
      setIsCartDrawerOpen(false);
      setOrderNotes('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-[#17130a] via-[#1f190e] to-[#120f09] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>DESK RUNNER DELIVERY &bull; 8-12 MINS GUARANTEED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              In-Seat Gourmet Cafe & Gamer Fuel
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Order refreshing chilled energy drinks, loaded smash burgers, and crispy fries directly to your gaming desk without pausing your match.
            </p>
          </div>

          {/* Floating Cart Pill (Mobile/Desktop) */}
          {totalItemsCount > 0 && (
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Desk Order ({totalItemsCount} items &bull; ₹{grandTotal})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0b0f1a] border border-zinc-800 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              {cat === 'ALL' ? 'All Menu' : cat}
            </button>
          ))}
        </div>

        {/* Right Search & Veg Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              vegOnly
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Veg Only</span>
          </button>

          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search food, drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const qty = cartQuantities[item.id] || 0;
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-800 bg-[#0d1222] p-4 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-xl transition-all group"
            >
              <div>
                {/* Header: Veg icon + Category */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.isVegetarian ? (
                      <span className="w-3.5 h-3.5 rounded border border-emerald-500 flex items-center justify-center p-[2px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </span>
                    ) : (
                      <span className="w-3.5 h-3.5 rounded border border-red-500 flex items-center justify-center p-[2px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {item.prepTimeMinutes || 10}m
                    </span>
                  </div>
                </div>

                {/* Name & Description */}
                <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                  {item.description}
                </p>
              </div>

              {/* Price & Add / Quantity Buttons */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500">Price</span>
                  <p className="text-base font-black font-mono text-emerald-400">
                    ₹{item.sellingPrice}
                  </p>
                </div>

                {qty === 0 ? (
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Seat</span>
                  </button>
                ) : (
                  <div className="flex items-center bg-zinc-900 border border-amber-500/40 rounded-xl p-0.5 gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold text-white px-1">
                      {qty}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center text-xs font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CART SLIDE-OVER DRAWER / MODAL */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-end">
          <div className="bg-[#0c101d] border-l border-zinc-800 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl relative animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">In-Seat Cafe Cart</h3>
                    <p className="text-xs text-zinc-400">{totalItemsCount} items queued</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Delivery Station Selector */}
              <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800 mb-4 space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Deliver To Station / Location
                </label>
                <select
                  value={deliveryStation}
                  onChange={(e) => setDeliveryStation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {userActiveSession && (
                    <option value={userActiveSession.stationName}>
                      🎮 My Current Desk: {userActiveSession.stationName}
                    </option>
                  )}
                  {stations.map((s) => (
                    <option key={s.id} value={s.name}>
                      Desk: {s.name}
                    </option>
                  ))}
                  <option value="Front Counter Pickup">Front Counter Pickup</option>
                  <option value="Gamer Lounge Sofa">Gamer Lounge Sofa Area</option>
                </select>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                {cartItemsList.map(({ menuItem, quantity }) => (
                  <div
                    key={menuItem.id}
                    className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{menuItem.name}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        ₹{menuItem.sellingPrice} &times; {quantity} = ₹{menuItem.sellingPrice * quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(menuItem.id, -1)}
                        className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-white px-1">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(menuItem.id, 1)}
                        className="w-5 h-5 rounded bg-amber-500 text-black flex items-center justify-center text-xs font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Instructions Note */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Preparation Note / Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra spicy dip, no ice in energy drink"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Bottom Checkout & Payment */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST (5%)</span>
                  <span className="font-mono">₹{tax}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-white pt-1 border-t border-zinc-800">
                  <span>Total Due</span>
                  <span className="font-mono text-emerald-400">₹{grandTotal}</span>
                </div>
              </div>

              {/* Payment selector */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPayWithWallet(true)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 ${
                    payWithWallet
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                      : 'border-zinc-800 text-zinc-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-semibold">Wallet</span>
                    <span className="block text-[10px] text-zinc-500 font-mono">
                      ₹{currentCustomer.walletBalance ?? 0}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPayWithWallet(false)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 ${
                    !payWithWallet
                      ? 'border-amber-500 bg-amber-950/30 text-amber-300'
                      : 'border-zinc-800 text-zinc-400'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="font-semibold">UPI at Desk</span>
                    <span className="block text-[10px] text-zinc-500">
                      Scan on delivery
                    </span>
                  </div>
                </button>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Place In-Seat Order &bull; ₹{grandTotal}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
