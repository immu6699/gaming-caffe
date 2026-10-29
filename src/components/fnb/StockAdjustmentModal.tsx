import React, { useState } from 'react';
import { StockItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Package, Plus, Minus } from 'lucide-react';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItem: StockItem | null;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  stockItem,
}) => {
  const { adjustStock } = useApp();

  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [quantity, setQuantity] = useState(10);
  const [reason, setReason] = useState('New Supplier Delivery Received');

  if (!stockItem) return null;

  const current = stockItem.currentStock;
  const delta = adjustmentType === 'add' ? quantity : -quantity;
  const resultingStock = Math.max(0, current + delta);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adjustStock(stockItem.id, delta, `${adjustmentType === 'add' ? 'Added' : 'Deducted'} ${quantity} ${stockItem.unit}: ${reason}`);
    onClose();
  };

  const reasonPresets = [
    'New Supplier Delivery Received',
    'Inventory Count Audit Correction',
    'Kitchen Spillage / Wastage',
    'Damaged / Expired Goods Discarded',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Adjust Stock — ${stockItem.name}`}
      subtitle={`SKU: ${stockItem.sku} • Current Level: ${stockItem.currentStock} ${stockItem.unit}`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Adjustment Type */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setAdjustmentType('add')}
            className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              adjustmentType === 'add'
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                : 'bg-dark-850 border-dark-750 text-slate-400'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Restock / Add (+)
          </button>

          <button
            type="button"
            onClick={() => setAdjustmentType('subtract')}
            className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              adjustmentType === 'subtract'
                ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                : 'bg-dark-850 border-dark-750 text-slate-400'
            }`}
          >
            <Minus className="w-4 h-4 text-rose-400" /> Deduct / Waste (-)
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Quantity to {adjustmentType === 'add' ? 'Add' : 'Deduct'} ({stockItem.unit}) *
          </label>
          <input
            type="number"
            min="1"
            required
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="gaming-input w-full"
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Reason for Adjustment *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="gaming-input w-full text-xs mb-2"
          >
            {reasonPresets.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Calculation Summary */}
        <div className="p-3 bg-dark-850 rounded-xl border border-dark-750 text-xs space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>Current Stock:</span>
            <span>{current} {stockItem.unit}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Change:</span>
            <span className={adjustmentType === 'add' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {adjustmentType === 'add' ? `+${quantity}` : `-${quantity}`} {stockItem.unit}
            </span>
          </div>
          <div className="pt-2 border-t border-dark-750 flex justify-between font-bold text-white">
            <span>New Stock Level:</span>
            <span className="text-cyan-400 font-mono text-sm">
              {resultingStock} {stockItem.unit}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Stock Adjustment
          </button>
        </div>
      </form>
    </Modal>
  );
};
