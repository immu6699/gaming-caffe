import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { formatINR } from '../../utils/formatters';
import { Calendar, Clock, Monitor, User, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { filteredStations, addBooking, customers, selectedBranchId, branches } = useApp();

  const todayStr = new Date().toISOString().slice(0, 10);
  const [stationId, setStationId] = useState(filteredStations[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('16:00');
  const [durationHours, setDurationHours] = useState(2);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [specialRequests, setSpecialRequests] = useState('');

  const selectedStation = filteredStations.find((s) => s.id === stationId) || filteredStations[0];
  const rate = selectedStation?.hourlyRate || 150;
  const subtotal = durationHours * rate;
  const tax = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + tax;

  // Calculate end time
  const [startH, startM] = startTime.split(':').map(Number);
  const endH = (startH + Math.floor(durationHours)) % 24;
  const endM = (startM + Math.round((durationHours % 1) * 60)) % 60;
  const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cust = customers.find((c) => c.id === e.target.value);
    if (cust) {
      setCustomerName(cust.name);
      setCustomerEmail(cust.email);
      setCustomerPhone(cust.phone);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStation || !customerName.trim()) return;

    const success = addBooking({
      customerName,
      customerEmail: customerEmail || 'guest@gamer.in',
      customerPhone: customerPhone || '+91 98000 00000',
      branchId: selectedStation.branchId,
      stationId: selectedStation.id,
      stationName: selectedStation.name,
      stationType: selectedStation.type,
      bookingDate,
      startTime,
      endTime,
      durationHours,
      status: 'Confirmed',
      paymentStatus,
      totalAmount,
      specialRequests,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Station Booking"
      subtitle="Reserve gaming stations in advance with slot collision verification."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Station selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Gaming Station *
            </label>
            <select
              required
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
              className="gaming-input w-full"
            >
              {filteredStations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.type}) — {formatINR(st.hourlyRate)}/hr
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="gaming-input w-full"
            />
          </div>
        </div>

        {/* Time slot & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Start Time *
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="gaming-input w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Duration (Hours) *
            </label>
            <select
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="gaming-input w-full"
            >
              <option value={1}>1 Hour</option>
              <option value={2}>2 Hours</option>
              <option value={3}>3 Hours</option>
              <option value={4}>4 Hours</option>
              <option value={5}>5 Hours</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Calculated End Time
            </label>
            <input
              type="text"
              readOnly
              value={endTime}
              className="gaming-input w-full bg-dark-800 text-slate-400 font-mono"
            />
          </div>
        </div>

        {/* Customer info */}
        <div className="p-3.5 rounded-xl bg-dark-850/80 border border-dark-750 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Customer Information
            </span>
            <select
              onChange={handleCustomerSelect}
              className="text-xs bg-dark-800 text-slate-300 rounded border border-dark-700 px-2 py-0.5"
            >
              <option value="">Fill from existing customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Devansh Roy"
                className="gaming-input w-full text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="devansh@gmail.com"
                className="gaming-input w-full text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="gaming-input w-full text-xs"
              />
            </div>
          </div>
        </div>

        {/* Payment & pricing preview */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 rounded-xl bg-dark-850 border border-dark-750 gap-3">
          <div>
            <p className="text-xs text-slate-400">Total Booking Price (incl. 18% GST):</p>
            <p className="text-lg font-bold font-gaming text-emerald-400">
              {formatINR(totalAmount)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-300">Payment Status:</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as any)}
              className="gaming-input text-xs"
            >
              <option value="Paid">Pre-Paid (Confirmed)</option>
              <option value="Pending">Pay at Counter (Hold)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Special Requests / Notes
          </label>
          <input
            type="text"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="e.g. Needs Discord pre-configured, tournament warmup"
            className="gaming-input w-full text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Confirm & Save Booking
          </button>
        </div>
      </form>
    </Modal>
  );
};
