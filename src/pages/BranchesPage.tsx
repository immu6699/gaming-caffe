import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Branch } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { SearchFilter } from '../components/common/SearchFilter';
import { ExportButton } from '../components/common/ExportButton';
import { formatINR } from '../utils/formatters';
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Monitor,
  Activity,
  DollarSign,
  Clock,
  Edit2,
  Power,
  CheckCircle,
} from 'lucide-react';

export const BranchesPage: React.FC = () => {
  const { branches, addBranch, updateBranch, setSelectedBranchId } = useApp();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branchToEdit, setBranchToEdit] = useState<Branch | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [managerName, setManagerName] = useState('');
  const [totalStations, setTotalStations] = useState(24);
  const [status, setStatus] = useState<Branch['status']>('Active');
  const [openingHours, setOpeningHours] = useState('10:00 AM - 02:00 AM');
  const [gstin, setGstin] = useState('');

  const filteredBranches = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setBranchToEdit(null);
    setName('');
    setCode(`QHAR-BR${Math.floor(10 + Math.random() * 90)}`);
    setAddress('');
    setCity('Bengaluru');
    setContactNumber('+91 ');
    setEmail('');
    setManagerName('');
    setTotalStations(20);
    setStatus('Active');
    setOpeningHours('10:00 AM - 02:00 AM');
    setGstin('29AABCR1234F1Z1');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Branch) => {
    setBranchToEdit(b);
    setName(b.name);
    setCode(b.code);
    setAddress(b.address);
    setCity(b.city);
    setContactNumber(b.contactNumber);
    setEmail(b.email);
    setManagerName(b.managerName);
    setTotalStations(b.totalStations);
    setStatus(b.status);
    setOpeningHours(b.openingHours);
    setGstin(b.gstin);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      code,
      address,
      city,
      contactNumber,
      email,
      managerName,
      totalStations: Number(totalStations),
      status,
      openingHours,
      gstin,
    };

    if (branchToEdit) {
      updateBranch(branchToEdit.id, payload);
    } else {
      addBranch(payload);
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (b: Branch) => {
    const nextStatus = b.status === 'Active' ? 'Closed' : 'Active';
    updateBranch(b.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
            BRANCH MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Oversee multi-location café branches, station allocations, and regional revenues.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Add New Branch
        </button>
      </div>

      {/* Search & Export Toolbar */}
      <SearchFilter
        searchTerm={search}
        onSearchChange={setSearch}
        placeholder="Search branches by name, city or code..."
        extraActions={
          <ExportButton
            data={filteredBranches}
            filename="QHAR_Branches_Directory"
            label="Export Branches"
          />
        }
      />

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className="gaming-card p-5 flex flex-col justify-between border-dark-750 hover:border-dark-600 relative overflow-hidden"
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                branch.status === 'Active' ? 'bg-cyan-500' : 'bg-rose-500'
              }`}
            />

            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-dark-850 border border-dark-750 text-cyan-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-gaming">
                      {branch.name}
                    </h3>
                    <span className="text-xs font-mono font-semibold text-brand-purple">
                      {branch.code}
                    </span>
                  </div>
                </div>

                <Badge
                  label={branch.status}
                  variant={branch.status === 'Active' ? 'success' : 'danger'}
                  dot
                />
              </div>

              {/* Location & Contact */}
              <div className="space-y-1.5 text-xs text-slate-300 my-3 pb-3 border-b border-dark-800">
                <p className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{branch.address}, {branch.city}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>{branch.contactNumber}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>{branch.openingHours}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-400">
                  <UserCheck className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>Manager: <strong className="text-white">{branch.managerName}</strong></span>
                </p>
              </div>

              {/* Branch Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center my-3">
                <div className="p-2 rounded-lg bg-dark-850 border border-dark-750/70">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Stations</p>
                  <p className="text-sm font-bold font-gaming text-white mt-0.5">{branch.totalStations}</p>
                </div>
                <div className="p-2 rounded-lg bg-dark-850 border border-dark-750/70">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Active</p>
                  <p className="text-sm font-bold font-gaming text-cyan-400 mt-0.5">{branch.activeSessions}</p>
                </div>
                <div className="p-2 rounded-lg bg-dark-850 border border-dark-750/70">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Revenue</p>
                  <p className="text-xs font-bold font-gaming text-emerald-400 mt-0.5">{formatINR(branch.todayRevenue)}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-dark-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedBranchId(branch.id)}
                className="btn-secondary py-1.5 px-3 text-xs flex-1 text-center"
              >
                Switch to Branch
              </button>
              <button
                onClick={() => handleOpenEdit(branch)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
                title="Edit Branch"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleToggleStatus(branch)}
                className={`p-1.5 rounded-lg transition-colors ${
                  branch.status === 'Active'
                    ? 'text-slate-400 hover:text-rose-400 hover:bg-dark-800'
                    : 'text-slate-400 hover:text-emerald-400 hover:bg-dark-800'
                }`}
                title={branch.status === 'Active' ? 'Deactivate Branch' : 'Activate Branch'}
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Branch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={branchToEdit ? 'Edit Branch Details' : 'Register New Branch'}
        subtitle="Manage regional operations, physical address, and GSTIN registration."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Branch Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Indiranagar Esports Lounge"
                className="gaming-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Branch Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. QHAR-IN04"
                className="gaming-input w-full font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="gaming-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GSTIN Number
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="29AABCR1234F1Z5"
                className="gaming-input w-full font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Physical Address *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Building, street, landmark"
              className="gaming-input w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="gaming-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Branch Manager
              </label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="gaming-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Total Gaming Stations
              </label>
              <input
                type="number"
                min="1"
                value={totalStations}
                onChange={(e) => setTotalStations(Number(e.target.value))}
                className="gaming-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="10:00 AM - 02:00 AM"
                className="gaming-input w-full text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="gaming-input w-full text-xs"
              >
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {branchToEdit ? 'Save Changes' : 'Register Branch'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
