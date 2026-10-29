import React from 'react';
import { Invoice } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatINR, formatDateTime } from '../../utils/formatters';
import { Printer, Download, Gamepad2, CheckCircle, CreditCard } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onPayOutstanding?: (invoice: Invoice) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onPayOutstanding,
}) => {
  const { branches } = useApp();

  if (!invoice) return null;

  const branch = branches.find((b) => b.id === invoice.branchId) || branches[0];

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = () => {
    switch (invoice.paymentStatus) {
      case 'Paid':
        return <Badge label="Paid in Full" variant="success" dot />;
      case 'Partially Paid':
        return <Badge label="Partially Paid" variant="warning" dot />;
      case 'Pending':
        return <Badge label="Payment Pending" variant="danger" dot />;
      case 'Refunded':
        return <Badge label="Refunded" variant="neutral" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tax Invoice — ${invoice.invoiceNumber}`}
      subtitle={`Generated on ${formatDateTime(invoice.createdAt)}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Printable Area */}
        <div id="printable-receipt" className="space-y-5">
          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b border-dark-750 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Gamepad2 className="w-5 h-5 text-brand-purple" />
                <span className="font-gaming text-lg font-black tracking-wider text-white">
                  QHAR GAMINGCAFFE
                </span>
              </div>
              <p className="text-xs text-slate-300 font-semibold">{branch?.name}</p>
              <p className="text-[11px] text-slate-400">{branch?.address}, {branch?.city}</p>
              <p className="text-[11px] text-slate-400">GSTIN: {branch?.gstin}</p>
              <p className="text-[11px] text-slate-400">Phone: {branch?.contactNumber}</p>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Invoice Status
              </span>
              {getStatusBadge()}
              <div className="mt-2 text-xs font-mono text-slate-300">
                <p>Ref: <span className="font-semibold">{invoice.referenceType} #{invoice.referenceId}</span></p>
                {invoice.transactionRef && (
                  <p className="text-[10px] text-slate-400">Txn: {invoice.transactionRef}</p>
                )}
              </div>
            </div>
          </div>

          {/* Billed To Customer */}
          <div className="p-3 bg-dark-850/60 rounded-xl border border-dark-750/60 flex justify-between text-xs">
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold block mb-0.5">
                Billed To:
              </span>
              <p className="font-bold text-white text-sm">{invoice.customerName}</p>
              {invoice.customerPhone && (
                <p className="text-slate-300">{invoice.customerPhone}</p>
              )}
            </div>

            <div className="text-right">
              <span className="text-slate-400 uppercase text-[10px] font-bold block mb-0.5">
                Payment Method
              </span>
              <p className="font-semibold text-slate-200">{invoice.paymentMethod}</p>
              <p className="text-slate-400 text-[11px]">
                Paid Date: {formatDateTime(invoice.createdAt)}
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-dark-750 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-dark-800 text-slate-300 font-semibold border-b border-dark-750">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-2 text-center">Type</th>
                  <th className="py-2.5 px-2 text-center">Qty / Hrs</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/80 text-slate-200">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-dark-850/30">
                    <td className="py-2.5 px-3 font-medium text-white">{item.description}</td>
                    <td className="py-2.5 px-2 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-dark-750 text-slate-300">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{formatINR(item.rate)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">{formatINR(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end">
            <div className="w-72 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-slate-200">{formatINR(invoice.subtotal)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promotional Discount</span>
                  <span className="font-mono">-{formatINR(invoice.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>GST Tax (Goods & Services)</span>
                <span className="font-mono text-slate-200">{formatINR(invoice.taxAmount)}</span>
              </div>
              <div className="pt-2 border-t border-dark-750 flex justify-between font-bold text-sm">
                <span className="text-white">Total Amount</span>
                <span className="text-emerald-400 font-gaming">{formatINR(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Amount Paid</span>
                <span className="font-mono font-semibold">{formatINR(invoice.amountPaid)}</span>
              </div>
              {invoice.outstandingAmount > 0 && (
                <div className="flex justify-between text-rose-400 font-bold pt-1 border-t border-rose-900/50">
                  <span>Balance Outstanding</span>
                  <span className="font-mono">{formatINR(invoice.outstandingAmount)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-secondary py-1.5 px-3 text-xs"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              Print Receipt
            </button>
          </div>

          <div className="flex items-center gap-2">
            {invoice.outstandingAmount > 0 && onPayOutstanding && (
              <button
                onClick={() => onPayOutstanding(invoice)}
                className="btn-primary py-1.5 text-xs"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Record ₹{invoice.outstandingAmount} Payment
              </button>
            )}
            <button onClick={onClose} className="btn-secondary py-1.5 text-xs">
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
