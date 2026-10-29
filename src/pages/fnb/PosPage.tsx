import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, FnbCategory, FnbOrder } from '../../types';
import { Modal } from '../../components/common/Modal';
import { formatINR } from '../../utils/formatters';
import {
  Flame,
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  CreditCard,
  Banknote,
  QrCode,
  Monitor,
  Printer,
  Sparkles,
  Receipt,
  User,
  Coffee,
  Check,
} from 'lucide-react';

export const PosPage: React.FC = () => {
  const {
    filteredMenuItems,
    filteredSessions,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createFnbOrder,
    selectedBranchId,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [orderType, setOrderType] = useState<FnbOrder['orderType']>('Counter Pickup');
  const [paymentMethod, setPaymentMethod] = useState<FnbOrder['paymentMethod']>('UPI');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Receipt modal state after order completion
  const [completedOrder, setCompletedOrder] = useState<FnbOrder | null>(null);

  // Active gaming sessions for direct delivery
  const activeSessions = filteredSessions.filter((s) => s.status === 'Active' || s.status === 'Overdue');

  const categories: FnbCategory[] = [
    'Snacks',
    'Fast Food',
    'Meals',
    'Energy Drinks',
    'Hot Beverages',
    'Cold Beverages',
    'Desserts',
  ];

  const filteredItems = filteredMenuItems.filter((item) => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const applicableTax = Math.round((subtotal - discountAmount) * 0.05); // 5% GST on F&B
  const finalTotal = Math.max(0, subtotal - discountAmount + applicableTax);

  const handleStationSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    if (sessionId) {
      const sess = activeSessions.find((s) => s.id === sessionId);
      if (sess) {
        setCustomerName(sess.customerName);
        setOrderType('Station Delivery');
      }
    } else {
      setCustomerName('Walk-in Customer');
      setOrderType('Counter Pickup');
    }
  };

  const handleCheckout = () => {
    if (!cart.length) return;

    const matchedSession = activeSessions.find((s) => s.id === selectedSessionId);

    const orderData: Omit<FnbOrder, 'id' | 'orderNumber' | 'createdAt'> = {
      orderType,
      branchId: selectedBranchId === 'ALL' ? 'branch-1' : selectedBranchId,
      customerName,
      customerPhone: matchedSession?.customerPhone,
      stationId: matchedSession?.stationId,
      stationName: matchedSession?.stationName,
      sessionId: matchedSession?.id,
      items: cart.map((ci) => ({
        menuItemId: ci.menuItemId,
        name: ci.name,
        unitPrice: ci.unitPrice,
        quantity: ci.quantity,
        totalPrice: ci.totalPrice,
        selectedVariant: ci.selectedVariant,
        selectedAddons: ci.selectedAddons,
        specialInstructions: ci.specialInstructions,
      })),
      subtotal,
      discount: discountAmount,
      tax: applicableTax,
      total: finalTotal,
      paymentMethod,
      paymentStatus:
        paymentMethod === 'Add to Gaming Bill'
          ? 'Added to Bill'
          : 'Paid',
      orderStatus: 'New',
      notes,
    };

    const newOrderId = createFnbOrder(orderData);
    setCompletedOrder({
      ...orderData,
      id: newOrderId,
      orderNumber: `Q-ORD-${Math.floor(2100 + Math.random() * 8000)}`,
      createdAt: new Date().toISOString(),
    });

    clearCart();
    setDiscountAmount(0);
    setNotes('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-dark-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide flex items-center gap-2">
            <Flame className="w-6 h-6 text-rose-500 fill-current" />
            CASHIER POINT OF SALE (POS)
          </h1>
          <p className="text-xs text-slate-400">
            Speed-optimized counter checkout, station delivery, and bill attachment.
          </p>
        </div>
      </div>

      {/* Main Split Layout: Products Grid (Left) + Order Cart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Categories, Search & Product Grid (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Search bar & Category Tabs */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu items, burgers, energy drinks, coffee..."
                className="gaming-input pl-10 w-full"
              />
            </div>

            {/* Category horizontal pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === 'ALL'
                    ? 'bg-brand-purple text-white shadow-sm'
                    : 'bg-dark-900 border border-dark-750 text-slate-400 hover:text-white'
                }`}
              >
                All Menu ({filteredMenuItems.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-brand-purple text-white shadow-sm'
                      : 'bg-dark-900 border border-dark-750 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 max-h-[70vh] overflow-y-auto pr-1">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.availability === 'Available') {
                    addToCart(item);
                  }
                }}
                className={`gaming-card p-3 rounded-xl flex flex-col justify-between transition-all select-none ${
                  item.availability === 'Available'
                    ? 'cursor-pointer hover:border-brand-purple hover:scale-[1.01] active:scale-[0.98]'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2 bg-dark-950">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/75 text-white backdrop-blur-xs">
                        {item.prepTimeMinutes}m prep
                      </span>
                    </div>
                    {item.isVegetarian ? (
                      <span className="absolute top-1.5 left-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-dark-950" />
                    ) : (
                      <span className="absolute top-1.5 left-1.5 w-3 h-3 rounded-full bg-rose-500 border-2 border-dark-950" />
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-dark-800 flex items-center justify-between">
                  <span className="font-gaming font-bold text-emerald-400 text-sm">
                    {formatINR(item.sellingPrice)}
                  </span>
                  {item.availability === 'Available' ? (
                    <button className="p-1 rounded-md bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-rose-400 font-bold uppercase">Sold Out</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Order Cart & Fast Checkout (4-5 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 gaming-card p-4 sm:p-5 flex flex-col justify-between sticky top-20 border-dark-750 shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-dark-850">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-gaming">
                  CURRENT ORDER ({cart.reduce((s, i) => s + i.quantity, 0)})
                </h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Target Destination & Gaming Station Link */}
            <div className="space-y-2.5 my-3 p-3 bg-dark-850 rounded-xl border border-dark-750">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                  Deliver to Gaming Station (Optional)
                </label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => handleStationSelect(e.target.value)}
                  className="gaming-input w-full text-xs"
                >
                  <option value="">Counter Walk-in / Takeaway</option>
                  {activeSessions.map((sess) => (
                    <option key={sess.id} value={sess.id}>
                      {sess.stationName} — {sess.customerName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Customer / Billing Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Gamer name"
                  className="gaming-input w-full text-xs"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 my-3">
              {cart.length > 0 ? (
                cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-dark-850/80 border border-dark-750/70 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white truncate">{item.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatINR(item.unitPrice)} ea
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 bg-dark-900 border border-dark-700 rounded-lg p-0.5">
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-mono font-bold text-white text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-emerald-400 text-xs w-14 text-right">
                      {formatINR(item.totalPrice)}
                    </span>

                    <button
                      onClick={() => removeFromCart(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Click menu items on the left to add to order.
                </div>
              )}
            </div>
          </div>

          {/* Cart Pricing Summary & Checkout Button */}
          <div className="pt-3 border-t border-dark-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Items Subtotal:</span>
              <span className="font-mono text-slate-200">{formatINR(subtotal)}</span>
            </div>

            <div className="flex justify-between text-slate-400 items-center">
              <span>Discount (₹):</span>
              <input
                type="number"
                min="0"
                max={subtotal}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                className="gaming-input py-0.5 px-2 w-20 text-right text-xs"
              />
            </div>

            <div className="flex justify-between text-slate-400">
              <span>F&B GST (5%):</span>
              <span className="font-mono text-slate-200">{formatINR(applicableTax)}</span>
            </div>

            <div className="pt-2 border-t border-dark-750 flex justify-between items-center text-sm font-bold">
              <span className="text-white">Amount Payable:</span>
              <span className="text-lg font-gaming text-emerald-400">
                {formatINR(finalTotal)}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'UPI'
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                    : 'bg-dark-850 border-dark-750 text-slate-400'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" /> UPI QR
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'Card'
                    ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                    : 'bg-dark-850 border-dark-750 text-slate-400'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> Card POS
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'Cash'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                    : 'bg-dark-850 border-dark-750 text-slate-400'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" /> Cash
              </button>

              <button
                type="button"
                disabled={!selectedSessionId}
                onClick={() => setPaymentMethod('Add to Gaming Bill')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'Add to Gaming Bill'
                    ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                    : 'bg-dark-850 border-dark-750 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
                title={!selectedSessionId ? 'Select an active gaming station above to add to bill' : ''}
              >
                <Monitor className="w-3.5 h-3.5" /> Add to Rig Bill
              </button>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="btn-primary w-full py-2.5 mt-2 font-bold uppercase tracking-wider text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" /> Place Order ({formatINR(finalTotal)})
            </button>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <Modal
        isOpen={!!completedOrder}
        onClose={() => setCompletedOrder(null)}
        title="Order Confirmed & Receipt Ready"
        subtitle={`Order #${completedOrder?.orderNumber}`}
        maxWidth="sm"
      >
        {completedOrder && (
          <div className="space-y-4">
            <div id="printable-receipt" className="space-y-3 p-4 bg-white text-black rounded-lg">
              <div className="text-center border-b pb-2">
                <h3 className="font-bold text-base">QHAR GAMINGCAFFE</h3>
                <p className="text-xs text-gray-600">F&B Counter & Station Delivery</p>
                <p className="text-xs font-mono font-bold mt-1">Ticket: {completedOrder.orderNumber}</p>
              </div>

              <div className="text-xs space-y-1">
                <p><strong>Customer:</strong> {completedOrder.customerName}</p>
                {completedOrder.stationName && (
                  <p><strong>Station:</strong> {completedOrder.stationName}</p>
                )}
                <p><strong>Payment:</strong> {completedOrder.paymentMethod} ({completedOrder.paymentStatus})</p>
                <p><strong>Date:</strong> {new Date(completedOrder.createdAt).toLocaleString()}</p>
              </div>

              <table className="w-full text-xs border-t border-b py-2 my-2">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Item</th>
                    <th className="text-center py-1">Qty</th>
                    <th className="text-right py-1">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrder.items.map((i, idx) => (
                    <tr key={idx}>
                      <td className="py-1">{i.name}</td>
                      <td className="text-center py-1">{i.quantity}</td>
                      <td className="text-right py-1 font-mono">{formatINR(i.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-xs space-y-1 text-right">
                <p>Subtotal: {formatINR(completedOrder.subtotal)}</p>
                <p>GST (5%): {formatINR(completedOrder.tax)}</p>
                <p className="font-bold text-sm pt-1 border-t">Total: {formatINR(completedOrder.total)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="btn-secondary text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button
                onClick={() => setCompletedOrder(null)}
                className="btn-primary text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
