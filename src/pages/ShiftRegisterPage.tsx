import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatDateTime } from '../utils/formatters';
import { sound } from '../utils/audio';
import {
  CreditCard,
  Banknote,
  QrCode,
  DollarSign,
  Printer,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  User,
  RotateCcw,
} from 'lucide-react';

export const ShiftRegisterPage: React.FC = () => {
  const { currentUser, filteredInvoices, addToast } = useApp();

  const [openingFloat, setOpeningFloat] = useState(5000);
  const [actualCashCounted, setActualCashCounted] = useState(14850);
  const [payoutsExpense, setPayoutsExpense] = useState(650);
  const [shiftClosed, setShiftClosed] = useState(false);

  // System calculated numbers from today's invoices
  const systemCash = filteredInvoices
    .filter((i) => i.paymentMethod === 'Cash' && i.paymentStatus === 'Paid')
    .reduce((sum, i) => sum + i.amountPaid, 0);

  const systemUpi = filteredInvoices
    .filter((i) => i.paymentMethod === 'UPI' && i.paymentStatus === 'Paid')
    .reduce((sum, i) => sum + i.amountPaid, 0);

  const systemCard = filteredInvoices
    .filter((i) => i.paymentMethod === 'Card' && i.paymentStatus === 'Paid')
    .reduce((sum, i) => sum + i.amountPaid, 0);

  // Expected cash in drawer = Opening Float + System Cash Collections - Paid Out expenses
  const expectedCashInDrawer = openingFloat + systemCash - payoutsExpense;
  const discrepancy = actualCashCounted - expectedCashInDrawer; // 0 = balanced, + = surplus, - = shortage

  const handleCloseShift = () => {
    sound.playCashRegister();
    setShiftClosed(true);
    addToast('Shift Reconciled & Closed', 'Z-Report generated and synced to Central Cloud Ledger.', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-emerald-400" />
              CASH DRAWER REGISTER & SHIFT RECONCILIATION
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              AUDIT READY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cashier shift handover, drawer cash counts, digital collections balance, and daily Z-Report.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button onClick={() => window.print()} className="btn-secondary text-xs">
            <Printer className="w-4 h-4" /> Print Z-Report
          </button>
        </div>
      </div>

      {/* Active Shift Info */}
      <div className="p-4 rounded-xl bg-dark-900 border border-dark-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center font-bold text-white text-sm">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Cashier on Duty: {currentUser.name}</span>
              <span className="text-xs px-2 py-0.2 rounded bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                {currentUser.role}
              </span>
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5" /> Shift Started: Today, 10:00 AM • Active for 5h 15m
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
          Drawer Register: Active
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="gaming-card p-4">
          <span className="text-xs text-slate-400 uppercase font-semibold">Cash Drawer Expected</span>
          <p className="text-xl font-bold font-gaming text-emerald-400 mt-1">
            {formatINR(expectedCashInDrawer)}
          </p>
          <span className="text-[11px] text-slate-500">Opening float + cash collections - expenses</span>
        </div>

        <div className="gaming-card p-4">
          <span className="text-xs text-slate-400 uppercase font-semibold">UPI Digital Settlements</span>
          <p className="text-xl font-bold font-gaming text-cyan-400 mt-1">
            {formatINR(systemUpi)}
          </p>
          <span className="text-[11px] text-slate-500">Auto-reconciled bank ledger</span>
        </div>

        <div className="gaming-card p-4">
          <span className="text-xs text-slate-400 uppercase font-semibold">POS Card Swipe Machine</span>
          <p className="text-xl font-bold font-gaming text-purple-400 mt-1">
            {formatINR(systemCard)}
          </p>
          <span className="text-[11px] text-slate-500">HDFC / PineLabs terminal batch</span>
        </div>
      </div>

      {/* Cash Drawer Handover Balancing Worksheet */}
      <div className="gaming-card p-5 space-y-5">
        <h3 className="text-sm font-bold text-white font-gaming uppercase tracking-wider pb-3 border-b border-dark-800">
          Shift Handover Balancing Worksheet
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Left: Input drawer actuals */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Opening Cash Float (₹)
              </label>
              <input
                type="number"
                value={openingFloat}
                onChange={(e) => setOpeningFloat(Number(e.target.value))}
                className="gaming-input w-full font-mono text-xs"
              />
              <span className="text-[10px] text-slate-500">Cash present in till at start of shift</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Physical Cash Counted in Till (₹) *
              </label>
              <input
                type="number"
                value={actualCashCounted}
                onChange={(e) => setActualCashCounted(Number(e.target.value))}
                className="gaming-input w-full text-base font-bold font-mono text-emerald-400"
              />
              <span className="text-[10px] text-slate-500">Total counted notes & coins currently in drawer</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cash Paid-Out for Incidentals / Supplies (₹)
              </label>
              <input
                type="number"
                value={payoutsExpense}
                onChange={(e) => setPayoutsExpense(Number(e.target.value))}
                className="gaming-input w-full font-mono text-xs text-rose-400"
              />
              <span className="text-[10px] text-slate-500">Petty cash spent on water, emergency repairs, etc.</span>
            </div>
          </div>

          {/* Right: Reconciliation & Discrepancy Report */}
          <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Register Discrepancy Status
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Opening Float:</span>
                  <span className="font-mono text-slate-200">{formatINR(openingFloat)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>System Cash Sales:</span>
                  <span className="font-mono text-slate-200">{formatINR(systemCash)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Petty Cash Paid Out:</span>
                  <span className="font-mono text-rose-400">-{formatINR(payoutsExpense)}</span>
                </div>
                <div className="pt-2 border-t border-dark-750 flex justify-between font-bold text-white">
                  <span>Calculated Expected Total:</span>
                  <span className="font-mono text-emerald-400">{formatINR(expectedCashInDrawer)}</span>
                </div>
              </div>

              {/* Discrepancy Box */}
              <div
                className={`mt-4 p-3 rounded-lg border flex items-center justify-between text-xs font-bold ${
                  discrepancy === 0
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : discrepancy > 0
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
              >
                <span>Till Status:</span>
                <span className="font-mono text-sm">
                  {discrepancy === 0
                    ? 'PERFECTLY BALANCED (₹0)'
                    : discrepancy > 0
                    ? `Surplus of +${formatINR(discrepancy)}`
                    : `Shortage of -${formatINR(Math.abs(discrepancy))}`}
                </span>
              </div>
            </div>

            <button
              onClick={handleCloseShift}
              className="btn-primary w-full py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              <CheckCircle className="w-4 h-4" /> End Shift & Settle Register (Z-Report)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
