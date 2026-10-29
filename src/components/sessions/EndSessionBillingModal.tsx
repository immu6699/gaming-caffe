import React, { useState } from 'react';
import { LiveSession } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { formatINR, getElapsedDuration } from '../../utils/formatters';
import { StopCircle, Receipt, CreditCard, Banknote, QrCode } from 'lucide-react';

interface EndSessionBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: LiveSession | null;
}

export const EndSessionBillingModal: React.FC<EndSessionBillingModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const { endSession, fnbOrders } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash'>('UPI');

  if (!session) return null;

  const timing = getElapsedDuration(session.startTime, session.scheduledEndTime);
  const durationHours = Math.max(
    0.5,
    Math.round(((timing.elapsedMinutes || 60) / 60) * 10) / 10
  );
  const gamingCharge = Math.round(durationHours * session.hourlyRate);

  // Linked F&B orders
  const linkedOrders = fnbOrders.filter((o) => o.sessionId === session.id);
  const fnbTotal = linkedOrders.reduce((sum, o) => sum + o.total, 0);

  const subtotal = gamingCharge + fnbTotal;
  const gamingGst = Math.round(gamingCharge * 0.18);
  const fnbGst = Math.round(fnbTotal * 0.05);
  const totalTax = gamingGst + fnbGst;
  const grandTotal = subtotal + totalTax;

  const handleConfirmEnd = () => {
    endSession(session.id, paymentMethod);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="End Session & Final Settlement"
      subtitle={`Station: ${session.stationName} • Gamer: ${session.customerName}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Itemized charges table */}
        <div className="border border-dark-750 rounded-xl overflow-hidden bg-dark-850">
          <div className="p-3 bg-dark-800 border-b border-dark-750 text-xs font-semibold text-white flex justify-between">
            <span>Billable Item</span>
            <span>Amount</span>
          </div>

          <div className="p-3 space-y-2.5 text-xs">
            {/* Gaming Station charge */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-white">{session.stationName}</p>
                <p className="text-slate-400 text-[11px]">
                  Duration: {timing.elapsedText} ({durationHours}h billable @ {formatINR(session.hourlyRate)}/hr)
                </p>
              </div>
              <span className="font-mono font-medium text-slate-200">
                {formatINR(gamingCharge)}
              </span>
            </div>

            {/* F&B Orders if any */}
            {linkedOrders.length > 0 && (
              <div className="pt-2 border-t border-dark-750/70">
                <p className="font-semibold text-amber-400 mb-1">
                  Food & Beverages Orders ({linkedOrders.length})
                </p>
                {linkedOrders.map((ord) => (
                  <div key={ord.id} className="flex justify-between text-slate-300 text-[11px] mb-1">
                    <span>
                      {ord.orderNumber} ({ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')})
                    </span>
                    <span className="font-mono">{formatINR(ord.total)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tax calculations */}
            <div className="pt-2 border-t border-dark-750/70 space-y-1 text-slate-400 text-[11px]">
              <div className="flex justify-between">
                <span>Gaming GST (18%)</span>
                <span>{formatINR(gamingGst)}</span>
              </div>
              {fnbTotal > 0 && (
                <div className="flex justify-between">
                  <span>F&B GST (5%)</span>
                  <span>{formatINR(fnbGst)}</span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="pt-3 border-t border-dark-700 flex justify-between items-center text-sm font-bold">
              <span className="text-white">Final Amount Payable:</span>
              <span className="text-lg font-gaming text-emerald-400">
                {formatINR(grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment method selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Record Payment Method *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('UPI')}
              className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                paymentMethod === 'UPI'
                  ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                  : 'bg-dark-850 border-dark-750 text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4 text-cyan-400" /> UPI QR
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('Card')}
              className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                paymentMethod === 'Card'
                  ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                  : 'bg-dark-850 border-dark-750 text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-purple-400" /> Card POS
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('Cash')}
              className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                paymentMethod === 'Cash'
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                  : 'bg-dark-850 border-dark-750 text-slate-400 hover:text-white'
              }`}
            >
              <Banknote className="w-4 h-4 text-emerald-400" /> Cash
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmEnd}
            className="btn-danger font-semibold px-4 py-2"
          >
            <StopCircle className="w-4 h-4" /> End Session & Checkout
          </button>
        </div>
      </div>
    </Modal>
  );
};
