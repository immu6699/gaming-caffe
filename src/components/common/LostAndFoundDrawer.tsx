import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LostAndFoundItem } from '../../types';
import { Modal } from './Modal';
import { sound } from '../../utils/audio';
import {
  PackageSearch,
  Plus,
  CheckCircle,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  Search,
  Lock,
} from 'lucide-react';

interface LostAndFoundDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LostAndFoundDrawer: React.FC<LostAndFoundDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { lostAndFound, addLostItem, claimLostItem, currentUser } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [claimingItem, setClaimingItem] = useState<LostAndFoundItem | null>(null);
  const [claimedByName, setClaimedByName] = useState('');

  // Form states
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<LostAndFoundItem['category']>('Electronics');
  const [foundLocation, setFoundLocation] = useState('');
  const [notes, setNotes] = useState('');

  const filteredItems = lostAndFound.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.foundLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !foundLocation.trim()) return;

    addLostItem({
      itemName: itemName.trim(),
      category,
      foundLocation: foundLocation.trim(),
      reportedBy: currentUser.name,
      status: 'In Safe Locker',
      notes: notes.trim() || 'Deposited in Front Desk Safe Locker A-2',
    });

    setItemName('');
    setFoundLocation('');
    setNotes('');
    setIsAdding(false);
  };

  const handleConfirmClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingItem || !claimedByName.trim()) return;

    claimLostItem(claimingItem.id, claimedByName.trim());
    setClaimingItem(null);
    setClaimedByName('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="FRONT DESK LOST & FOUND SAFE LOCKER"
      size="lg"
    >
      <div className="space-y-4 animate-in fade-in duration-150">
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-dark-850 p-4 rounded-xl border border-dark-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                Locker Drawer A-2 (Physical Custody)
              </h4>
              <p className="text-xs text-slate-400">
                Log forgotten electronics, AirPods, student cards, and keys left at gaming seats.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsAdding(!isAdding);
            }}
            className="btn-cyan text-xs py-2 px-3 flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            {isAdding ? 'Close Form' : 'Log Found Item'}
          </button>
        </div>

        {/* Add Form */}
        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-xl bg-dark-900 border border-cyan-500/40 shadow-glow-cyan/15 space-y-3"
          >
            <h5 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Log Forgotten Item into Safe Locker
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Item Description</label>
                <input
                  type="text"
                  placeholder="e.g. Apple AirPods Pro (Black case with Red Bull sticker)"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="input-field text-xs py-2 mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as LostAndFoundItem['category'])}
                  className="input-field text-xs py-2 mt-1"
                >
                  <option value="Electronics">📱 Electronics / Earbuds</option>
                  <option value="Accessories">🕶️ Glasses / Wearables</option>
                  <option value="ID Cards / Wallet">🪪 ID Cards / Wallet</option>
                  <option value="Apparel">🧢 Caps / Jackets</option>
                  <option value="Other">📦 Other Items</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Found Location</label>
                <input
                  type="text"
                  placeholder="e.g. PC-04 Under desk or PS5-02 Couch"
                  value={foundLocation}
                  onChange={(e) => setFoundLocation(e.target.value)}
                  className="input-field text-xs py-2 mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Locker Notes & Marks</label>
                <input
                  type="text"
                  placeholder="e.g. Scratched corner, deposited in Box B"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field text-xs py-2 mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button type="submit" className="btn-cyan text-xs py-1.5 px-4 font-bold">
                Deposit in Locker
              </button>
            </div>
          </form>
        )}

        {/* Claim Item Dialog Inline */}
        {claimingItem && (
          <form
            onSubmit={handleConfirmClaim}
            className="p-4 rounded-xl bg-dark-900 border border-emerald-500/50 shadow-glow-emerald/20 space-y-3 animate-in fade-in"
          >
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Handover Verification — {claimingItem.itemName}
              </h5>
              <button
                type="button"
                onClick={() => setClaimingItem(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Claiming Gamer's Full Name & Phone
              </label>
              <input
                type="text"
                placeholder="e.g. Devansh Roy (+91 98765 43210)"
                value={claimedByName}
                onChange={(e) => setClaimedByName(e.target.value)}
                className="input-field text-xs py-2 mt-1"
                required
                autoFocus
              />
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Verification check: Make sure customer unlocks device or verifies physical identifier before handing over from safe locker.
            </p>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setClaimingItem(null)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs py-1.5 px-4 font-bold bg-emerald-600 hover:bg-emerald-500">
                Confirm Handover & Release
              </button>
            </div>
          </form>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search items by name, station number, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field text-xs pl-8 py-2 w-full"
          />
        </div>

        {/* Items List */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 italic">
              No lost & found items found. Safe locker is clean!
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  item.status === 'In Safe Locker'
                    ? 'bg-dark-850 border-dark-750'
                    : 'bg-dark-900/50 border-dark-800 opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.itemName}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'In Safe Locker'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <MapPin className="w-3 h-3" /> Found at: {item.foundLocation}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.foundAt}
                    </span>
                    <span>Logged by: {item.reportedBy}</span>
                  </div>

                  {item.claimedBy && (
                    <p className="text-[11px] text-emerald-300 font-medium">
                      ✓ Handed over to: {item.claimedBy} ({item.claimedAt})
                    </p>
                  )}
                </div>

                {item.status === 'In Safe Locker' && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setClaimingItem(item);
                    }}
                    className="btn-cyan text-xs py-1.5 px-3 flex-shrink-0"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Handover to Gamer
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-dark-800">
          <button onClick={onClose} className="btn-secondary text-xs py-2 px-5 font-bold">
            Close Locker
          </button>
        </div>
      </div>
    </Modal>
  );
};
