import React, { useState, useEffect } from 'react';
import { MenuItem, FnbCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: MenuItem | null;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({
  isOpen,
  onClose,
  itemToEdit,
}) => {
  const { addMenuItem, updateMenuItem } = useApp();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<FnbCategory>('Fast Food');
  const [description, setDescription] = useState('');
  const [sellingPrice, setSellingPrice] = useState(150);
  const [costPrice, setCostPrice] = useState(60);
  const [imageUrl, setImageUrl] = useState('');
  const [availability, setAvailability] = useState<MenuItem['availability']>('Available');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(10);
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [stockQuantity, setStockQuantity] = useState(25);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setSku(itemToEdit.sku);
      setCategory(itemToEdit.category);
      setDescription(itemToEdit.description);
      setSellingPrice(itemToEdit.sellingPrice);
      setCostPrice(itemToEdit.costPrice);
      setImageUrl(itemToEdit.imageUrl);
      setAvailability(itemToEdit.availability);
      setPrepTimeMinutes(itemToEdit.prepTimeMinutes);
      setIsVegetarian(itemToEdit.isVegetarian);
      setStockQuantity(itemToEdit.stockQuantity);
      setLowStockThreshold(itemToEdit.lowStockThreshold);
    } else {
      setName('');
      setSku(`FNB-${Math.floor(100 + Math.random() * 900)}`);
      setCategory('Fast Food');
      setDescription('');
      setSellingPrice(150);
      setCostPrice(60);
      setImageUrl('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80');
      setAvailability('Available');
      setPrepTimeMinutes(10);
      setIsVegetarian(true);
      setStockQuantity(30);
      setLowStockThreshold(8);
    }
  }, [itemToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      sku,
      category,
      description,
      sellingPrice: Number(sellingPrice),
      costPrice: Number(costPrice),
      imageUrl,
      availability,
      prepTimeMinutes: Number(prepTimeMinutes),
      isVegetarian,
      stockQuantity: Number(stockQuantity),
      lowStockThreshold: Number(lowStockThreshold),
    };

    if (itemToEdit) {
      updateMenuItem(itemToEdit.id, payload);
    } else {
      addMenuItem(payload);
    }
    onClose();
  };

  const categories: FnbCategory[] = [
    'Snacks',
    'Fast Food',
    'Meals',
    'Hot Beverages',
    'Cold Beverages',
    'Energy Drinks',
    'Desserts',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? 'Edit F&B Menu Item' : 'Add New F&B Menu Item'}
      subtitle="Configure pricing, recipe cost, kitchen prep time, and inventory parameters."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Loaded Nachos Grande"
              className="gaming-input w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              SKU / Code *
            </label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="gaming-input w-full font-mono text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FnbCategory)}
              className="gaming-input w-full text-xs"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Dietary Type
            </label>
            <select
              value={isVegetarian ? 'veg' : 'non-veg'}
              onChange={(e) => setIsVegetarian(e.target.value === 'veg')}
              className="gaming-input w-full text-xs"
            >
              <option value="veg">Vegetarian 🟢</option>
              <option value="non-veg">Non-Vegetarian 🔴</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Status *
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as any)}
              className="gaming-input w-full text-xs"
            >
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Temporarily Unavailable">Temporarily Unavailable</option>
            </select>
          </div>
        </div>

        {/* Pricing & Prep Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-dark-850 rounded-xl border border-dark-750">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Selling Price (₹) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="gaming-input w-full text-emerald-400 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Cost Price (₹)
            </label>
            <input
              type="number"
              min="0"
              value={costPrice}
              onChange={(e) => setCostPrice(Number(e.target.value))}
              className="gaming-input w-full text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Prep Time (Mins)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={prepTimeMinutes}
              onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
              className="gaming-input w-full"
            />
          </div>
        </div>

        {/* Stock & Threshold */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Current Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              className="gaming-input w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              min="1"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Number(e.target.value))}
              className="gaming-input w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Item Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="gaming-input w-full text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe flavors, ingredients, allergens..."
            className="gaming-input w-full text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {itemToEdit ? 'Save Changes' : 'Create Menu Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
