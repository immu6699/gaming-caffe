import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { BookingModal } from '../components/bookings/BookingModal';
import { Modal } from '../components/common/Modal';
import { SearchFilter } from '../components/common/SearchFilter';
import { ExportButton } from '../components/common/ExportButton';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { formatINR, formatDateOnly } from '../utils/formatters';
import {
  CalendarCheck,
  Plus,
  LayoutGrid,
  List,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const { filteredBookings, cancelBooking, rescheduleBooking } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  // Cancellation modal
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState('Customer Requested Cancellation');

  // Reschedule modal
  const [bookingToReschedule, setBookingToReschedule] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('17:00');
  const [newEndTime, setNewEndTime] = useState('19:00');

  const filtered = filteredBookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      cancelBooking(bookingToCancel.id, cancellationReason);
      setBookingToCancel(null);
    }
  };

  const handleConfirmReschedule = () => {
    if (bookingToReschedule && newDate) {
      rescheduleBooking(bookingToReschedule.id, newDate, newStartTime, newEndTime);
      setBookingToReschedule(null);
    }
  };

  const handleOpenReschedule = (b: Booking) => {
    setBookingToReschedule(b);
    setNewDate(b.bookingDate);
    setNewStartTime(b.startTime);
    setNewEndTime(b.endTime);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
            BOOKING MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Advance slot reservations, schedule calendar, conflict checks, and customer bookings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-dark-850 p-1 rounded-lg border border-dark-750">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'calendar' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Calendar Timeline View"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          <button onClick={() => setIsNewBookingModalOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> New Booking
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by customer, phone, or station..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterLabel="All Bookings"
        filterOptions={[
          { label: 'Confirmed', value: 'Confirmed' },
          { label: 'Pending', value: 'Pending' },
          { label: 'In Progress', value: 'In Progress' },
          { label: 'Completed', value: 'Completed' },
          { label: 'Cancelled', value: 'Cancelled' },
        ]}
        extraActions={
          <ExportButton
            data={filtered}
            filename="QHAR_Bookings_List"
            label="Export Bookings"
          />
        }
      />

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        filtered.length > 0 ? (
          <div className="gaming-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-dark-850 text-slate-300 font-semibold border-b border-dark-750">
                  <tr>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Station & Type</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Time Slot</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800 text-slate-200">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-dark-850/40">
                      <td className="py-3 px-4 font-mono font-bold text-slate-300">
                        #{b.id}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{b.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {b.customerPhone}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{b.stationName}</div>
                        <span className="text-[10px] text-brand-purple font-medium bg-brand-purple/10 px-1.5 py-0.5 rounded border border-brand-purple/20">
                          {b.stationType}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-300">
                        {formatDateOnly(b.bookingDate)}
                      </td>

                      <td className="py-3 px-3 font-mono">
                        <div className="text-white font-semibold">
                          {b.startTime} - {b.endTime}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {b.durationHours} Hours
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-emerald-400">
                          {formatINR(b.totalAmount)}
                        </div>
                        <span
                          className={`text-[10px] font-semibold ${
                            b.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <Badge
                          label={b.status}
                          variant={
                            b.status === 'Confirmed'
                              ? 'success'
                              : b.status === 'Pending'
                              ? 'warning'
                              : b.status === 'Cancelled'
                              ? 'danger'
                              : 'neutral'
                          }
                          dot={b.status !== 'Cancelled'}
                        />
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {b.status !== 'Cancelled' && (
                          <>
                            <button
                              onClick={() => handleOpenReschedule(b)}
                              className="btn-secondary py-1 px-2.5 text-xs"
                              title="Reschedule Booking"
                            >
                              <RotateCcw className="w-3 h-3" /> Reschedule
                            </button>
                            <button
                              onClick={() => setBookingToCancel(b)}
                              className="btn-danger py-1 px-2 text-xs"
                              title="Cancel Booking"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Cancel
                            </button>
                          </>
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
            icon={CalendarCheck}
            title="No bookings match criteria"
            description="Create an advance reservation slot or adjust your search filter."
          />
        )
      ) : (
        /* Calendar / Schedule View */
        <div className="gaming-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-800">
            <h3 className="text-sm font-bold text-white font-gaming uppercase tracking-wide">
              Timeline Calendar Overview
            </h3>
            <span className="text-xs text-slate-400">
              Showing active schedule slots for today
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-2 hover:border-dark-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">#{b.id}</span>
                  <Badge
                    label={b.status}
                    variant={b.status === 'Confirmed' ? 'success' : 'warning'}
                    size="sm"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white font-gaming">{b.stationName}</h4>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" /> {b.customerName}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-dark-800 text-xs font-mono flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {b.startTime} - {b.endTime}
                  </span>
                  <span className="font-bold text-emerald-400">{formatINR(b.totalAmount)}</span>
                </div>

                {b.specialRequests && (
                  <p className="text-[11px] text-slate-400 italic">
                    Note: "{b.specialRequests}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      <BookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
      />

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        title="Cancel Booking Reservation"
        subtitle={`Booking #${bookingToCancel?.id} for ${bookingToCancel?.customerName}`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl text-xs text-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>Are you sure you want to cancel this booking? This slot will be opened for other customers.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Cancellation Reason *
            </label>
            <select
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="gaming-input w-full text-xs"
            >
              <option value="Customer Requested Cancellation">Customer Requested Cancellation</option>
              <option value="Customer No-Show (Overdue)">Customer No-Show (Overdue)</option>
              <option value="Hardware Maintenance Conflict">Hardware Maintenance Conflict</option>
              <option value="Booking Rescheduled">Booking Rescheduled</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
            <button onClick={() => setBookingToCancel(null)} className="btn-secondary text-xs">
              Keep Booking
            </button>
            <button onClick={handleConfirmCancel} className="btn-danger text-xs">
              Confirm Cancellation
            </button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={!!bookingToReschedule}
        onClose={() => setBookingToReschedule(null)}
        title="Reschedule Slot"
        subtitle={`Station: ${bookingToReschedule?.stationName}`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              New Date *
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="gaming-input w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Start Time *
              </label>
              <input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="gaming-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New End Time *
              </label>
              <input
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="gaming-input w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
            <button onClick={() => setBookingToReschedule(null)} className="btn-secondary text-xs">
              Cancel
            </button>
            <button onClick={handleConfirmReschedule} className="btn-primary text-xs">
              Update Slot
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
