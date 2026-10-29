import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer, StationType } from '../types';
import { Modal } from '../components/common/Modal';
import { SearchFilter } from '../components/common/SearchFilter';
import { ExportButton } from '../components/common/ExportButton';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { formatINR, formatDateOnly } from '../utils/formatters';
import {
  Users,
  Plus,
  Crown,
  Wallet,
  Clock,
  Calendar,
  Gamepad,
  Phone,
  Mail,
  Edit2,
  Receipt,
  UserCheck,
  Flame,
  Zap,
  Trophy,
} from 'lucide-react';
import { GamerPassportModal } from '../components/common/GamerPassportModal';

export const CustomersPage: React.FC = () => {
  const { customers, addCustomer, updateCustomer, invoices, bookings } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Customer modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

  // Customer Details Drawer/Modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [passportCustomer, setPassportCustomer] = useState<Customer | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<Customer['status']>('Active');
  const [preferredStationType, setPreferredStationType] = useState<StationType>('PC');
  const [walletBalance, setWalletBalance] = useState(0);
  const [notes, setNotes] = useState('');

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setCustomerToEdit(null);
    setName('');
    setEmail('');
    setPhone('+91 ');
    setStatus('Active');
    setPreferredStationType('PC');
    setWalletBalance(0);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setCustomerToEdit(c);
    setName(c.name);
    setEmail(c.email);
    setPhone(c.phone);
    setStatus(c.status);
    setPreferredStationType(c.preferredStationType);
    setWalletBalance(c.walletBalance);
    setNotes(c.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      email,
      phone,
      registrationDate: customerToEdit ? customerToEdit.registrationDate : new Date().toISOString().slice(0, 10),
      status,
      preferredStationType,
      walletBalance: Number(walletBalance),
      notes,
    };

    if (customerToEdit) {
      updateCustomer(customerToEdit.id, payload);
    } else {
      addCustomer(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
            CUSTOMER PROFILES
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Registered gamers, play-time records, loyalty VIP tiers, and lifetime spending.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Enroll New Gamer
        </button>
      </div>

      {/* Search & Export Toolbar */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search gamers by name, email, or mobile..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterLabel="All Statuses"
        filterOptions={[
          { label: 'Active', value: 'Active' },
          { label: 'VIP Members', value: 'VIP' },
          { label: 'Suspended', value: 'Suspended' },
        ]}
        extraActions={
          <ExportButton
            data={filtered}
            filename="QHAR_Customer_Database"
            label="Export Customers"
          />
        }
      />

      {/* Customer Table */}
      {filtered.length > 0 ? (
        <div className="gaming-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-dark-850 text-slate-300 font-semibold border-b border-dark-750">
                <tr>
                  <th className="py-3 px-4">Gamer Name</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Status / Tier</th>
                  <th className="py-3 px-3">Hours Played</th>
                  <th className="py-3 px-3">Total Spend</th>
                  <th className="py-3 px-3">Wallet</th>
                  <th className="py-3 px-3">Last Visit</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800 text-slate-200">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-dark-850/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
                            c.status === 'VIP'
                              ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-extrabold shadow-sm'
                              : 'bg-dark-800 border border-dark-750'
                          }`}
                        >
                          {c.status === 'VIP' ? <Crown className="w-4 h-4 fill-current" /> : c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-white hover:text-cyan-400 cursor-pointer" onClick={() => setPassportCustomer(c)}>
                              {c.name}
                            </p>
                            {c.gamerTag && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-semibold">
                                {c.gamerTag}
                              </span>
                            )}
                            {c.streakDays && c.streakDays > 1 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-950/60 text-orange-400 border border-orange-800/60 flex items-center gap-0.5">
                                <Flame className="w-2.5 h-2.5 fill-current" /> {c.streakDays}d
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {c.gameRanks?.[0]?.rank ? `${c.gameRanks[0].game}: ${c.gameRanks[0].rank}` : `Member since ${formatDateOnly(c.registrationDate)}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-mono text-slate-200">{c.phone}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{c.email}</p>
                    </td>

                    <td className="py-3 px-3">
                      <Badge
                        label={c.status}
                        variant={c.status === 'VIP' ? 'warning' : c.status === 'Active' ? 'success' : 'danger'}
                        dot
                      />
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-cyan-400">{c.totalHoursPlayed}h</span>
                      <div className="text-[10px] text-slate-400">{c.totalBookings} visits</div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      {formatINR(c.totalSpending)}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-300">
                      {formatINR(c.walletBalance)}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-400">
                      {formatDateOnly(c.lastVisit)}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setPassportCustomer(c)}
                        className="btn-cyan py-1 px-2.5 text-xs font-bold"
                        title="View Gamer Social Passport & Perks"
                      >
                        Gamer Passport
                      </button>
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="btn-secondary py-1 px-2.5 text-xs"
                      >
                        History
                      </button>
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
                        title="Edit Customer"
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
      ) : (
        <EmptyState
          icon={Users}
          title="No gamers found"
          description="Try modifying your search or enroll a new gamer."
        />
      )}

      {/* Customer Detail Drawer / Modal */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={`Gamer Profile — ${selectedCustomer?.name}`}
        subtitle={`Member ID: ${selectedCustomer?.id} • Status: ${selectedCustomer?.status}`}
        maxWidth="lg"
      >
        {selectedCustomer && (
          <div className="space-y-5">
            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-dark-850 rounded-xl border border-dark-750">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Lifetime Spend</p>
                <p className="text-base font-bold font-gaming text-emerald-400 mt-1">
                  {formatINR(selectedCustomer.totalSpending)}
                </p>
              </div>
              <div className="p-3 bg-dark-850 rounded-xl border border-dark-750">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Playtime</p>
                <p className="text-base font-bold font-gaming text-cyan-400 mt-1">
                  {selectedCustomer.totalHoursPlayed} Hours
                </p>
              </div>
              <div className="p-3 bg-dark-850 rounded-xl border border-dark-750">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Wallet Credits</p>
                <p className="text-base font-bold font-gaming text-white mt-1">
                  {formatINR(selectedCustomer.walletBalance)}
                </p>
              </div>
            </div>

            {/* Gamer notes */}
            {selectedCustomer.notes && (
              <div className="p-3 bg-dark-850/80 rounded-xl border border-dark-750 text-xs">
                <span className="font-semibold text-brand-purple block mb-0.5">Staff Notes:</span>
                <p className="text-slate-300">{selectedCustomer.notes}</p>
              </div>
            )}

            {/* Invoices History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Recent Billing History
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {invoices
                  .filter((inv) => inv.customerName === selectedCustomer.name)
                  .map((inv) => (
                    <div
                      key={inv.id}
                      className="p-2.5 rounded-lg bg-dark-850 border border-dark-750 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-white">{inv.invoiceNumber}</span>
                        <p className="text-[10px] text-slate-400">
                          {inv.items.map((i) => i.description).join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-400">
                          {formatINR(inv.totalAmount)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{inv.paymentMethod}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-dark-800">
              <button onClick={() => setSelectedCustomer(null)} className="btn-secondary text-xs">
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Gamer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={customerToEdit ? 'Edit Gamer Profile' : 'Enroll New Gamer'}
        subtitle="Manage customer membership, loyalty tier, and credits."
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Yash Vardhan"
              className="gaming-input w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="gaming-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yash@gmail.com"
                className="gaming-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Membership Tier
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="gaming-input w-full text-xs"
              >
                <option value="Active">Active Gamer</option>
                <option value="VIP">VIP Tier</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Preferred Rig
              </label>
              <select
                value={preferredStationType}
                onChange={(e) => setPreferredStationType(e.target.value as any)}
                className="gaming-input w-full text-xs"
              >
                <option value="PC">Gaming PC</option>
                <option value="Console">Console (PS5)</option>
                <option value="VR">VR Simulator</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Wallet Credits (₹)
              </label>
              <input
                type="number"
                min="0"
                value={walletBalance}
                onChange={(e) => setWalletBalance(Number(e.target.value))}
                className="gaming-input w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Player Notes & Preferences
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Fav games, peripherals sensitivity, dietary needs..."
              className="gaming-input w-full text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {customerToEdit ? 'Save Profile' : 'Enroll Gamer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Gamer VIP Passport & Social Profile Modal */}
      <GamerPassportModal
        isOpen={!!passportCustomer}
        onClose={() => setPassportCustomer(null)}
        customer={passportCustomer}
      />
    </div>
  );
};
