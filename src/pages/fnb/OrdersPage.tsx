import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FnbOrder, FnbOrderStatus } from '../../types';
import { SearchFilter } from '../../components/common/SearchFilter';
import { ExportButton } from '../../components/common/ExportButton';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { Badge, getOrderStatusBadge } from '../../components/common/Badge';
import { formatINR, formatDateTime } from '../../utils/formatters';
import {
  ShoppingBag,
  Clock,
  User,
  Monitor,
  Printer,
  XCircle,
  CheckCircle,
  ChefHat,
  Flame,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrdersPage: React.FC = () => {
  const { filteredFnbOrders, updateOrderStatus } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Cancel order modal
  const [orderToCancel, setOrderToCancel] = useState<FnbOrder | null>(null);
  const [cancelReason, setCancelReason] = useState('Customer Changed Mind');

  // Details modal
  const [selectedOrder, setSelectedOrder] = useState<FnbOrder | null>(null);

  const filtered = filteredFnbOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.stationName && order.stationName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmCancel = () => {
    if (orderToCancel) {
      updateOrderStatus(orderToCancel.id, 'Cancelled', cancelReason);
      setOrderToCancel(null);
    }
  };

  const handleNextStatus = (order: FnbOrder) => {
    switch (order.orderStatus) {
      case 'New':
        updateOrderStatus(order.id, 'Accepted');
        break;
      case 'Accepted':
        updateOrderStatus(order.id, 'Preparing');
        break;
      case 'Preparing':
        updateOrderStatus(order.id, 'Ready');
        break;
      case 'Ready':
        updateOrderStatus(order.id, 'Served / Delivered');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
            FOOD & BEVERAGE ORDERS LOG
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete transaction record of counter walk-ins and station food deliveries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/fnb/kitchen" className="btn-secondary">
            <ChefHat className="w-4 h-4 text-amber-400" /> Kitchen Display (KDS)
          </Link>
          <Link to="/fnb/pos" className="btn-primary">
            <Flame className="w-4 h-4 text-rose-300" /> Cashier POS
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by order #, gamer name, or station..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterLabel="All Statuses"
        filterOptions={[
          { label: 'New', value: 'New' },
          { label: 'Accepted', value: 'Accepted' },
          { label: 'Preparing', value: 'Preparing' },
          { label: 'Ready', value: 'Ready' },
          { label: 'Served / Delivered', value: 'Served / Delivered' },
          { label: 'Cancelled', value: 'Cancelled' },
        ]}
        extraActions={
          <ExportButton
            data={filtered}
            filename="QHAR_Fnb_Orders"
            label="Export Orders"
          />
        }
      />

      {/* Orders Table */}
      {filtered.length > 0 ? (
        <div className="gaming-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-dark-850 text-slate-300 font-semibold border-b border-dark-750">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-3">Placed At</th>
                  <th className="py-3 px-3">Destination / Customer</th>
                  <th className="py-3 px-3">Items Ordered</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Kitchen Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800 text-slate-200">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-dark-850/40">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {order.orderNumber}
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {formatDateTime(order.createdAt)}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{order.customerName}</div>
                      <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                        {order.stationName || order.orderType}
                      </span>
                    </td>

                    <td className="py-3 px-3 max-w-[200px]">
                      <span className="text-slate-300 line-clamp-1">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      {formatINR(order.total)}
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-white font-medium">{order.paymentMethod}</div>
                      <span
                        className={`text-[10px] font-semibold ${
                          order.paymentStatus === 'Paid'
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      {getOrderStatusBadge(order.orderStatus)}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {order.orderStatus !== 'Served / Delivered' &&
                        order.orderStatus !== 'Cancelled' && (
                          <button
                            onClick={() => handleNextStatus(order)}
                            className="btn-cyan py-1 px-2.5 text-xs font-semibold"
                          >
                            Advance Status
                          </button>
                        )}

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn-secondary py-1 px-2 text-xs"
                      >
                        Details
                      </button>

                      {order.orderStatus !== 'Served / Delivered' &&
                        order.orderStatus !== 'Cancelled' && (
                          <button
                            onClick={() => setOrderToCancel(order)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-400"
                            title="Cancel Order"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No food & beverage orders found"
          description="Place orders via Cashier POS or select a different filter."
        />
      )}

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Breakdown — ${selectedOrder?.orderNumber}`}
        subtitle={`Placed on ${formatDateTime(selectedOrder?.createdAt)}`}
        maxWidth="md"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="p-3 bg-dark-850 rounded-xl border border-dark-750 text-xs space-y-1">
              <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
              <p><strong>Delivery Destination:</strong> {selectedOrder.stationName || selectedOrder.orderType}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
              <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
            </div>

            <div className="border border-dark-750 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-dark-800 text-slate-300 font-semibold border-b border-dark-750">
                  <tr>
                    <th className="py-2 px-3">Item</th>
                    <th className="py-2 px-2 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800 text-slate-200">
                  {selectedOrder.items.map((i, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3">
                        <span className="font-semibold text-white">{i.name}</span>
                        {i.specialInstructions && (
                          <span className="block text-[10px] text-amber-400 italic">
                            "{i.specialInstructions}"
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center">{i.quantity}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatINR(i.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-xs space-y-1 text-right text-slate-400">
              <p>Subtotal: {formatINR(selectedOrder.subtotal)}</p>
              <p>GST (5%): {formatINR(selectedOrder.tax)}</p>
              <p className="font-bold text-sm text-emerald-400 pt-1 border-t border-dark-750 font-gaming">
                Total: {formatINR(selectedOrder.total)}
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-dark-800">
              <button onClick={() => setSelectedOrder(null)} className="btn-secondary text-xs">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={!!orderToCancel}
        onClose={() => setOrderToCancel(null)}
        title="Cancel Food & Beverage Order"
        subtitle={`Order #${orderToCancel?.orderNumber} (${formatINR(orderToCancel?.total || 0)})`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl text-xs text-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>Are you sure you want to cancel this order? Kitchen preparation will be halted.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Cancellation Reason *
            </label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="gaming-input w-full text-xs"
            >
              <option value="Customer Changed Mind">Customer Changed Mind</option>
              <option value="Ingredient Stock Depleted">Ingredient Stock Depleted</option>
              <option value="Excessive Preparation Delay">Excessive Preparation Delay</option>
              <option value="Customer Left Café">Customer Left Café</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
            <button onClick={() => setOrderToCancel(null)} className="btn-secondary text-xs">
              Keep Order
            </button>
            <button onClick={handleConfirmCancel} className="btn-danger text-xs">
              Confirm Cancellation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
