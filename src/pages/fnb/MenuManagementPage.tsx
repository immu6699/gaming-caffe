import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, FnbCategory } from '../../types';
import { MenuItemModal } from '../../components/fnb/MenuItemModal';
import { SearchFilter } from '../../components/common/SearchFilter';
import { ExportButton } from '../../components/common/ExportButton';
import { Badge } from '../../components/common/Badge';
import { formatINR } from '../../utils/formatters';
import {
  UtensilsCrossed,
  Plus,
  Clock,
  Edit2,
  Power,
  Flame,
  CheckCircle,
  AlertTriangle,
  LayoutGrid,
  List,
} from 'lucide-react';

export const MenuManagementPage: React.FC = () => {
  const { filteredMenuItems, toggleMenuItemAvailability } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<MenuItem | null>(null);

  const categories: FnbCategory[] = [
    'Snacks',
    'Fast Food',
    'Meals',
    'Energy Drinks',
    'Hot Beverages',
    'Cold Beverages',
    'Desserts',
  ];

  const filtered = filteredMenuItems.filter((item) => {
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
            CAFÉ MENU MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Menu catalog, recipes, dietary preferences, cost margins, and live counter availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-dark-850 p-1 rounded-lg border border-dark-750">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${
                viewMode === 'table' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button onClick={handleOpenAdd} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search menu items, SKU, ingredients..."
        filterValue={categoryFilter}
        onFilterChange={setCategoryFilter}
        filterLabel="All Categories"
        filterOptions={categories.map((c) => ({ label: c, value: c }))}
        extraActions={
          <ExportButton
            data={filtered}
            filename="QHAR_Cafe_Menu"
            label="Export Menu"
          />
        }
      />

      {/* Grid or Table Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const margin = Math.round(
              ((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100
            );

            return (
              <div
                key={item.id}
                className="gaming-card p-3.5 flex flex-col justify-between border-dark-750 hover:border-dark-600 relative overflow-hidden"
              >
                <div>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2.5 bg-dark-950">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        label={item.availability}
                        variant={item.availability === 'Available' ? 'success' : 'danger'}
                        size="sm"
                      />
                    </div>
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      {item.isVegetarian ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-dark-950" title="Vegetarian" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-dark-950" title="Non-Vegetarian" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">{item.sku} • {item.category}</span>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-dark-800">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-gaming font-bold text-emerald-400 text-base">
                        {formatINR(item.sellingPrice)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Cost: {formatINR(item.costPrice)} ({margin}% margin)
                      </span>
                    </div>

                    <div className="text-right text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" /> {item.prepTimeMinutes}m prep
                      </span>
                      <span>Stock: {item.stockQuantity} units</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-dark-850">
                    <button
                      onClick={() => toggleMenuItemAvailability(item.id)}
                      className={`text-xs py-1 px-2 rounded-md font-semibold flex-1 ${
                        item.availability === 'Available'
                          ? 'bg-dark-800 text-slate-300 hover:text-white'
                          : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.availability === 'Available' ? 'Deactivate' : 'Activate'}
                    </button>

                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="gaming-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-dark-850 text-slate-300 font-semibold border-b border-dark-750">
                <tr>
                  <th className="py-3 px-4">Item & SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Selling Price</th>
                  <th className="py-3 px-3">Cost Price</th>
                  <th className="py-3 px-3">Prep Time</th>
                  <th className="py-3 px-3">Stock Units</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800 text-slate-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-dark-850/40">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <span>{item.name}</span>
                        <div className="text-[10px] text-slate-400 font-mono">{item.sku}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3">{item.category}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      {formatINR(item.sellingPrice)}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {formatINR(item.costPrice)}
                    </td>
                    <td className="py-3 px-3 font-mono">{item.prepTimeMinutes} mins</td>
                    <td className="py-3 px-3 font-mono">{item.stockQuantity}</td>
                    <td className="py-3 px-3">
                      <Badge
                        label={item.availability}
                        variant={item.availability === 'Available' ? 'success' : 'danger'}
                        dot
                      />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => toggleMenuItemAvailability(item.id)}
                        className="btn-secondary py-1 px-2 text-xs"
                      >
                        Toggle Status
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Menu Item Modal */}
      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemToEdit={itemToEdit}
      />
    </div>
  );
};
