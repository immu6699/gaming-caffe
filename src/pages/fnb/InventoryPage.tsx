import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StockItem } from '../../types';
import { StockAdjustmentModal } from '../../components/fnb/StockAdjustmentModal';
import { SearchFilter } from '../../components/common/SearchFilter';
import { ExportButton } from '../../components/common/ExportButton';
import { Badge } from '../../components/common/Badge';
import { formatINR, formatDateOnly } from '../../utils/formatters';
import {
  Package,
  Plus,
  AlertTriangle,
  CheckCircle,
  Truck,
  RotateCcw,
  Boxes,
  Minus,
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { stockItems } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Stock Adjustment Modal
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);

  const filtered = stockItems.filter((item) => {
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockCount = stockItems.filter(
    (s) => s.status === 'Low Stock' || s.status === 'Out of Stock'
  ).length;

  const totalInventoryValue = stockItems.reduce(
    (sum, s) => sum + s.currentStock * s.costPerUnit,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
            INVENTORY & INGREDIENTS STOCK
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time stock levels for packaged drinks, snacks, burger ingredients, and coffee beans.
          </p>
        </div>

        {/* Inventory Value Badge */}
        <div className="px-4 py-2 rounded-xl bg-dark-850 border border-dark-750 text-right">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Stock Value</span>
          <p className="text-sm font-bold font-gaming text-emerald-400">
            {formatINR(totalInventoryValue)}
          </p>
        </div>
      </div>

      {/* Low stock warning banner */}
      {lowStockCount > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-amber-200 font-semibold">
              Attention: {lowStockCount} ingredient/packaged item(s) have fallen below their safety reorder threshold!
            </span>
          </div>
          <span className="text-amber-400 font-bold font-mono">Restock Recommended</span>
        </div>
      )}

      {/* Search Toolbar */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search stock by SKU, name, or supplier..."
        filterValue={categoryFilter}
        onFilterChange={setCategoryFilter}
        filterLabel="All Stock Categories"
        filterOptions={[
          { label: 'Beverages', value: 'Beverages' },
          { label: 'Raw Ingredients', value: 'Raw Ingredients' },
          { label: 'Packaged Goods', value: 'Packaged Goods' },
          { label: 'Disposables', value: 'Disposables' },
        ]}
        extraActions={
          <ExportButton
            data={filtered}
            filename="QHAR_Stock_Inventory"
            label="Export Stock"
          />
        }
      />

      {/* Inventory Table */}
      <div className="gaming-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-dark-850 text-slate-300 font-semibold border-b border-dark-750">
              <tr>
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Current Level</th>
                <th className="py-3 px-3">Safety Min</th>
                <th className="py-3 px-3">Cost / Unit</th>
                <th className="py-3 px-3">Supplier</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 text-slate-200">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-dark-850/40">
                  <td className="py-3 px-4 font-bold text-white">
                    {item.name}
                    <div className="text-[10px] text-slate-400 font-mono">{item.sku}</div>
                  </td>

                  <td className="py-3 px-3 text-slate-300">{item.category}</td>

                  <td className="py-3 px-3 font-mono font-bold text-base">
                    <span
                      className={
                        item.status === 'Low Stock' || item.status === 'Out of Stock'
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                      }
                    >
                      {item.currentStock} {item.unit}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-400">
                    {item.minThreshold} {item.unit}
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-300">
                    {formatINR(item.costPerUnit)}
                  </td>

                  <td className="py-3 px-3 text-slate-300">{item.supplierName}</td>

                  <td className="py-3 px-3">
                    <Badge
                      label={item.status}
                      variant={
                        item.status === 'In Stock'
                          ? 'success'
                          : item.status === 'Low Stock'
                          ? 'warning'
                          : 'danger'
                      }
                      dot
                    />
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedStockItem(item)}
                      className="btn-secondary py-1 px-3 text-xs"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={!!selectedStockItem}
        onClose={() => setSelectedStockItem(null)}
        stockItem={selectedStockItem}
      />
    </div>
  );
};
