import React, { useState } from 'react';
import { GamingStation } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { formatINR } from '../../utils/formatters';
import { Play, Clock, CreditCard, Banknote, QrCode } from 'lucide-react';

interface StartSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: GamingStation | null;
}

export const StartSessionModal: React.FC<StartSessionModalProps> = ({
  isOpen,
  onClose,
  station,
}) => {
  const { startSession, customers } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [durationHours, setDurationHours] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash'>('UPI');
  const [paidUpfront, setPaidUpfront] = useState(true);
  const [notes, setNotes] = useState('');

  if (!station) return null;

  const hourlyRate = station.hourlyRate;
  const estimatedGamingCharge = durationHours * hourlyRate;
  const gstTax = Math.round(estimatedGamingCharge * 0.18);
  const grandTotal = estimatedGamingCharge + gstTax;

  const handleQuickCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const custId = e.target.value;
    if (!custId) return;
    const cust = customers.find((c) => c.id === custId);
    if (cust) {
      setCustomerName(cust.name);
      setCustomerPhone(cust.phone);
    }
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    startSession({
      stationId: station.id,
      customerName,
      customerPhone,
      durationHours,
      hourlyRate,
      paymentMethod,
      paidUpfront,
      notes,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Start Gaming Session — ${station.name}`}
      subtitle={`Rate: ${formatINR(hourlyRate)}/hr • Category: ${station.type}`}
      maxWidth="md"
    >
      <form onSubmit={handleStart} className="space-y-4">
        {/* Customer selection */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-300">
              Customer Name *
            </label>
            <select
              onChange={handleQuickCustomerSelect}
              className="text-[11px] bg-dark-800 text-brand-purple rounded border border-dark-700 px-2 py-0.5"
            >
              <option value="">Quick select registered customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Rahul Sen"
            className="gaming-input w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Customer Phone Number
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="+91 98765 00000"
            className="gaming-input w-full"
          />
        </div>

        {/* Duration selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Initial Booking Duration
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[1, 2, 3, 4].map((hours) => (
              <button
                type="button"
                key={hours}
                onClick={() => setDurationHours(hours)}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  durationHours === hours
                    ? 'bg-brand-purple/20 border-brand-purple text-brand-purple'
                    : 'bg-dark-850 border-dark-750 text-slate-400 hover:text-white'
                }`}
              >
                {hours} {hours === 1 ? 'Hour' : 'Hours'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Or custom hours:</span>
            <input
              type="number"
              min="0.5"
              step="0.5"
              max="12"
              value={durationHours}
              onChange={(e) => setDurationHours(parseFloat(e.target.value) || 1)}
              className="gaming-input w-24 py-1 text-xs"
            />
          </div>
        </div>

        {/* Pricing breakdown card */}
        <div className="p-3 rounded-xl bg-dark-850 border border-dark-750 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Gaming Time ({durationHours}h × {formatINR(hourlyRate)})</span>
            <span className="text-white font-medium">{formatINR(estimatedGamingCharge)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Applicable GST (18%)</span>
            <span className="text-white font-medium">{formatINR(gstTax)}</span>
          </div>
          <div className="pt-2 border-t border-dark-750 flex justify-between text-sm font-bold">
            <span className="text-white">Estimated Grand Total</span>
            <span className="text-emerald-400 font-gaming">{formatINR(grandTotal)}</span>
          </div>
        </div>

        {/* Payment preference */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Payment Collection
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={paidUpfront}
                onChange={(e) => setPaidUpfront(e.target.checked)}
                className="rounded bg-dark-800 border-dark-700 text-brand-purple focus:ring-brand-purple"
              />
              <span>Collect payment upfront</span>
            </label>
          </div>

          {paidUpfront && (
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'UPI'
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                    : 'bg-dark-850 border-dark-750 text-slate-400'
                }`}
              >
                <QrCode className="w-4 h-4 text-cyan-400" /> UPI
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
                <CreditCard className="w-4 h-4 text-purple-400" /> Card (POS)
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
                <Banknote className="w-4 h-4 text-emerald-400" /> Cash
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Notes / Games Loaded
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. CS2 Tournament setup, 2 controllers"
            className="gaming-input w-full text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-cyan">
            <Play className="w-4 h-4 fill-current" /> Start Live Session
          </button>
        </div>
      </form>
    </Modal>
  );
};
