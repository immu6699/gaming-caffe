import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Invoice } from '../types';
import { InvoiceModal } from '../components/billing/InvoiceModal';
import { Modal } from '../components/common/Modal';
import { SearchFilter } from '../components/common/SearchFilter';
import { ExportButton } from '../components/common/ExportButton';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { formatINR, formatDateTime } from '../utils/formatters';
import {
  CreditCard,
  Printer,
  DollarSign,
  AlertCircle,
  CheckCircle,
  FileText,
  RotateCcw,
  Banknote,
  QrCode,
} from 'lucide-react';

export const BillingPage: React.FC = () => {
  const { filteredInvoices, recordPayment, processRefund } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);
  const [invoiceToPay, setInvoiceToPay] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Card' | 'Cash' | 'NetBanking'>('UPI');

  // Refund modal
  const [invoiceToRefund, setInvoiceToRefund] = useState<Invoice | null>(null);
  const [refundReason, setRefundReason] = useState('Customer Dispute / System Issue');

  const filtered = filteredInvoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.transactionRef && inv.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = filtered
    .filter((inv) => inv.paymentStatus === 'Paid')
    .reduce((sum, inv) => sum + inv.amountPaid, 0);

  const totalOutstanding = filtered
    .filter((inv) => inv.paymentStatus === 'Pending' || inv.paymentStatus === 'Partially Paid')
    .reduce((sum, inv) => sum + inv.outstandingAmount, 0);

  const handleOpenPay = (inv: Invoice) => {
    setInvoiceToPay(inv);
    setPayAmount(inv.outstandingAmount);
    setPayMethod('UPI');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceToPay || payAmount <= 0) return;
    recordPayment(invoiceToPay.id, payAmount, payMethod);
    setInvoiceToPay(null);
  };

  const handleConfirmRefund = () => {
    if (invoiceToRefund) {
      processRefund(invoiceToRefund.id, refundReason);
      setInvoiceToRefund(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
            BILLING & INVOICES
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Reconciled tax invoices, GST breakdowns, multi-payment receipts, and refunds.
          </p>
        </div>

        {/* Quick summary metrics */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Collected</span>
            <p className="text-sm font-bold font-gaming text-emerald-400">{formatINR(totalCollected)}</p>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Outstanding Due</span>
            <p className="text-sm font-bold font-gaming text-rose-400">{formatINR(totalOutstanding)}</p>
          </div>
        </div>
      </div>

      {/* Search & Export Toolbar */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by invoice #, customer name, transaction ref..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterLabel="All Invoices"
        filterOptions={[
          { label: 'Paid', value: 'Paid' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Partially Paid', value: 'Partially Paid' },
          { label: 'Refunded', value: 'Refunded' },
        ]}
        extraActions={
          <ExportButton
            data={filtered}
            filename="QHAR_Tax_Invoices"
            label="Export Invoices"
          />
        }
      />

      {/* Invoice Table */}
      {filtered.length > 0 ? (
        <div className="gaming-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-dark-850 text-slate-300 font-semibold border-b border-dark-750">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Type / Ref</th>
                  <th className="py-3 px-3">Subtotal</th>
                  <th className="py-3 px-3">GST Tax</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Due Balance</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800 text-slate-200">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-dark-850/40">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                      {formatDateTime(inv.createdAt)}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{inv.customerName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {inv.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-dark-750 text-slate-300 font-semibold">
                        {inv.referenceType}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-300">
                      {formatINR(inv.subtotal)}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                      {formatINR(inv.taxAmount)}
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-emerald-400 text-sm">
                      {formatINR(inv.totalAmount)}
                    </td>

                    <td className="py-3 px-3 font-mono font-semibold">
                      {inv.outstandingAmount > 0 ? (
                        <span className="text-rose-400">{formatINR(inv.outstandingAmount)}</span>
                      ) : (
                        <span className="text-slate-500">₹0</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <Badge
                        label={inv.paymentStatus}
                        variant={
                          inv.paymentStatus === 'Paid'
                            ? 'success'
                            : inv.paymentStatus === 'Partially Paid'
                            ? 'warning'
                            : inv.paymentStatus === 'Pending'
                            ? 'danger'
                            : 'neutral'
                        }
                        dot
                      />
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedInvoiceForView(inv)}
                        className="btn-secondary py-1 px-2.5 text-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400" /> View & Print
                      </button>

                      {inv.outstandingAmount > 0 && (
                        <button
                          onClick={() => handleOpenPay(inv)}
                          className="btn-primary py-1 px-2.5 text-xs"
                        >
                          Record Payment
                        </button>
                      )}

                      {inv.paymentStatus === 'Paid' && (
                        <button
                          onClick={() => setInvoiceToRefund(inv)}
                          className="p-1 rounded-md text-slate-400 hover:text-amber-400 hover:bg-dark-800"
                          title="Process Refund"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
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
          icon={CreditCard}
          title="No invoices found"
          description="Invoices are automatically created upon session completion, booking advance, or POS orders."
        />
      )}

      {/* Invoice Printable View Modal */}
      <InvoiceModal
        isOpen={!!selectedInvoiceForView}
        onClose={() => setSelectedInvoiceForView(null)}
        invoice={selectedInvoiceForView}
        onPayOutstanding={(inv) => {
          setSelectedInvoiceForView(null);
          handleOpenPay(inv);
        }}
      />

      {/* Record Payment Modal */}
      <Modal
        isOpen={!!invoiceToPay}
        onClose={() => setInvoiceToPay(null)}
        title={`Record Payment — ${invoiceToPay?.invoiceNumber}`}
        subtitle={`Outstanding Due: ${formatINR(invoiceToPay?.outstandingAmount || 0)}`}
        maxWidth="sm"
      >
        <form onSubmit={handleConfirmPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Amount to Collect (₹) *
            </label>
            <input
              type="number"
              min="1"
              max={invoiceToPay?.outstandingAmount}
              required
              value={payAmount}
              onChange={(e) => setPayAmount(Number(e.target.value))}
              className="gaming-input w-full text-emerald-400 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Payment Method *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPayMethod('UPI')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 ${
                  payMethod === 'UPI'
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                    : 'bg-dark-850 border-dark-750 text-slate-400'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" /> UPI
              </button>
              <button
                type="button"
                onClick={() => setPayMethod('Card')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 ${
                  payMethod === 'Card'
                    ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                    : 'bg-dark-850 border-dark-750 text-slate-400'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> Card
              </button>
              <button
                type="button"
                onClick={() => setPayMethod('Cash')}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 ${
                  payMethod === 'Cash'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                    : 'bg-dark-850 border-dark-750 text-slate-400'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" /> Cash
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
            <button type="button" onClick={() => setInvoiceToPay(null)} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs">
              Confirm Payment
            </button>
          </div>
        </form>
      </Modal>

      {/* Process Refund Modal */}
      <Modal
        isOpen={!!invoiceToRefund}
        onClose={() => setInvoiceToRefund(null)}
        title="Process Invoice Refund"
        subtitle={`Invoice: ${invoiceToRefund?.invoiceNumber} (${formatINR(invoiceToRefund?.totalAmount || 0)})`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-200">
            Confirming refund will mark invoice as Refunded and record an audit log for the branch manager.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Refund Reason *
            </label>
            <select
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="gaming-input w-full text-xs"
            >
              <option value="Customer Dispute / Session Interruption">Customer Dispute / Session Interruption</option>
              <option value="Double Payment / System Duplicate">Double Payment / System Duplicate</option>
              <option value="Hardware / Network Failure">Hardware / Network Failure</option>
              <option value="Manager Discretionary Compensation">Manager Discretionary Compensation</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
            <button onClick={() => setInvoiceToRefund(null)} className="btn-secondary text-xs">
              Cancel
            </button>
            <button onClick={handleConfirmRefund} className="btn-danger text-xs">
              Issue Refund
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
