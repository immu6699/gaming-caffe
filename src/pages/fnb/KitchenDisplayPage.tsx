import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FnbOrder } from '../../types';
import { Badge } from '../../components/common/Badge';
import { formatTimeOnly } from '../../utils/formatters';
import {
  ChefHat,
  Clock,
  CheckCircle,
  Play,
  Flame,
  AlertTriangle,
  RotateCw,
  BellRing,
  UtensilsCrossed,
} from 'lucide-react';

export const KitchenDisplayPage: React.FC = () => {
  const { filteredFnbOrders, updateOrderStatus, addToast } = useApp();

  const [tick, setTick] = useState(0);

  // Live timer tick every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter for active kitchen tickets
  const activeOrders = filteredFnbOrders.filter(
    (o) =>
      o.orderStatus === 'New' ||
      o.orderStatus === 'Accepted' ||
      o.orderStatus === 'Preparing' ||
      o.orderStatus === 'Ready'
  );

  // Sort: New and Preparing first, oldest first
  const sortedOrders = [...activeOrders].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeA - timeB;
  });

  const getElapsedMins = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    return Math.floor(diffMs / (1000 * 60));
  };

  const handleStatusChange = (order: FnbOrder, newStatus: FnbOrder['orderStatus']) => {
    updateOrderStatus(order.id, newStatus);
    if (newStatus === 'Ready') {
      addToast('Order Ready!', `Order ${order.orderNumber} is ready for delivery/pickup.`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 p-5 rounded-2xl border border-dark-750/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-amber-400" />
              KITCHEN DISPLAY SYSTEM (KDS)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Live Tickets ({activeOrders.length})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time preparation board with elapsed timers and delay alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTick((t) => t + 1);
              addToast('Kitchen Board Refreshed', '', 'info');
            }}
            className="btn-secondary text-xs"
          >
            <RotateCw className="w-3.5 h-3.5" /> Refresh Board
          </button>
        </div>
      </div>

      {/* Ticket Cards Grid */}
      {sortedOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedOrders.map((order) => {
            const elapsedMins = getElapsedMins(order.createdAt);
            const isDelayed = elapsedMins >= 15;

            return (
              <div
                key={order.id}
                className={`gaming-card p-4 rounded-xl flex flex-col justify-between border-2 transition-all ${
                  order.orderStatus === 'Ready'
                    ? 'border-emerald-500/60 bg-emerald-950/20'
                    : isDelayed
                    ? 'border-rose-500/80 bg-rose-950/20 animate-pulse'
                    : order.orderStatus === 'Preparing'
                    ? 'border-amber-500/60 bg-amber-950/15'
                    : 'border-cyan-500/40 bg-dark-900'
                }`}
              >
                <div>
                  {/* Top Bar: Order Number & Elapsed Time */}
                  <div className="flex items-start justify-between pb-2 mb-2 border-b border-dark-750">
                    <div>
                      <span className="font-mono font-black text-white text-base">
                        {order.orderNumber}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {order.stationName ? (
                          <span className="text-cyan-400 font-semibold">
                            🎯 {order.stationName}
                          </span>
                        ) : (
                          <span className="text-slate-300">Takeaway Counter</span>
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          isDelayed
                            ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                            : 'bg-dark-800 text-slate-300'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {elapsedMins}m ago
                      </span>
                      {isDelayed && (
                        <span className="text-[10px] text-rose-400 font-bold uppercase block mt-0.5">
                          Delayed!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Gamer Info */}
                  <div className="text-xs text-slate-300 mb-2 font-medium">
                    Gamer: <span className="text-white font-bold">{order.customerName}</span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 py-2 border-t border-b border-dark-800/80 my-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between text-xs gap-2">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded bg-dark-750 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                            {item.quantity}x
                          </span>
                          <div>
                            <span className="font-bold text-slate-100">{item.name}</span>
                            {item.specialInstructions && (
                              <p className="text-[11px] text-amber-300 bg-amber-950/40 p-1 rounded mt-0.5 border border-amber-500/20 italic">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <p className="text-[11px] text-slate-400 italic mb-2">
                      Order Note: "{order.notes}"
                    </p>
                  )}
                </div>

                {/* Status Action Buttons */}
                <div className="pt-3 border-t border-dark-800 space-y-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Current Phase:</span>
                    <Badge
                      label={order.orderStatus}
                      variant={
                        order.orderStatus === 'Ready'
                          ? 'success'
                          : order.orderStatus === 'Preparing'
                          ? 'warning'
                          : 'cyan'
                      }
                      dot
                    />
                  </div>

                  {order.orderStatus === 'New' && (
                    <button
                      onClick={() => handleStatusChange(order, 'Accepted')}
                      className="btn-cyan w-full py-2 text-xs font-bold uppercase tracking-wider"
                    >
                      <CheckCircle className="w-4 h-4" /> Accept Order
                    </button>
                  )}

                  {order.orderStatus === 'Accepted' && (
                    <button
                      onClick={() => handleStatusChange(order, 'Preparing')}
                      className="btn-primary w-full py-2 text-xs font-bold uppercase tracking-wider"
                    >
                      <Flame className="w-4 h-4" /> Start Preparing
                    </button>
                  )}

                  {order.orderStatus === 'Preparing' && (
                    <button
                      onClick={() => handleStatusChange(order, 'Ready')}
                      className="btn-cyan w-full py-2 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-500"
                    >
                      <CheckCircle className="w-4 h-4" /> Mark as Ready
                    </button>
                  )}

                  {order.orderStatus === 'Ready' && (
                    <button
                      onClick={() => handleStatusChange(order, 'Served / Delivered')}
                      className="btn-secondary w-full py-2 text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-white"
                    >
                      Served / Delivered ✔
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center gaming-card rounded-2xl border-dashed border-dark-750">
          <ChefHat className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Kitchen Queue is Clear!</h3>
          <p className="text-xs text-slate-400">All customer tickets have been prepared and delivered.</p>
        </div>
      )}
    </div>
  );
};
