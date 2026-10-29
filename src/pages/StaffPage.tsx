import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StaffMember, StaffRole } from '../types';
import { Modal } from '../components/common/Modal';
import { SearchFilter } from '../components/common/SearchFilter';
import { ExportButton } from '../components/common/ExportButton';
import { Badge } from '../components/common/Badge';
import {
  ShieldCheck,
  Plus,
  User,
  Shield,
  Key,
  Check,
  X,
  Edit2,
  Lock,
  Building,
} from 'lucide-react';

export const StaffPage: React.FC = () => {
  const {
    staffMembers,
    addStaff,
    updateStaff,
    activeRole,
    setActiveRole,
    branches,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<StaffMember | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>('Cashier');
  const [branchAccess, setBranchAccess] = useState<string[]>(['branch-1']);
  const [status, setStatus] = useState<StaffMember['status']>('Active');

  const filtered = staffMembers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    setStaffToEdit(null);
    setName('');
    setEmail('');
    setPhone('+91 ');
    setRole('Cashier');
    setBranchAccess(['branch-1']);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: StaffMember) => {
    setStaffToEdit(s);
    setName(s.name);
    setEmail(s.email);
    setPhone(s.phone);
    setRole(s.role);
    setBranchAccess(s.branchAccess);
    setStatus(s.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      email,
      phone,
      role,
      branchAccess,
      status,
      permissions: ['standard_access', 'operations_read'],
    };

    if (staffToEdit) {
      updateStaff(staffToEdit.id, payload);
    } else {
      addStaff(payload);
    }
    setIsModalOpen(false);
  };

  const permissionsMatrix = [
    { feature: 'Launch & End Live Sessions', roles: ['Super Admin', 'Cafe Owner', 'Branch Manager', 'Cashier'] },
    { feature: 'Point of Sale (POS) Food Ordering', roles: ['Super Admin', 'Cafe Owner', 'Branch Manager', 'Cashier'] },
    { feature: 'Kitchen Display (KDS) Status Prep', roles: ['Super Admin', 'Cafe Owner', 'Kitchen Staff'] },
    { feature: 'Inventory Stock In / Adjustments', roles: ['Super Admin', 'Cafe Owner', 'Branch Manager'] },
    { feature: 'Pricing Rules & Dynamic Peak Surcharge', roles: ['Super Admin', 'Cafe Owner'] },
    { feature: 'Process Customer Refunds & Overrides', roles: ['Super Admin', 'Cafe Owner', 'Branch Manager'] },
    { feature: 'Hardware Maintenance & Diagnostics', roles: ['Super Admin', 'Technician'] },
    { feature: 'Staff Management & Role Assignment', roles: ['Super Admin', 'Cafe Owner'] },
  ];

  const allRoles: StaffRole[] = [
    'Super Admin',
    'Cafe Owner',
    'Branch Manager',
    'Cashier',
    'Kitchen Staff',
    'Technician',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
            STAFF & ROLE-BASED ACCESS (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Staff directory, branch permission boundaries, and role enforcement.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      {/* Quick Active Persona Switcher */}
      <div className="p-4 rounded-xl bg-dark-900 border border-brand-purple/30 shadow-card-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-brand-purple" />
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Active Persona: <strong className="text-brand-purple">{activeRole}</strong>
            </span>
            <span className="text-[11px] text-slate-400">
              Switch role to preview restricted UI views and capabilities:
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {allRoles.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRole(r)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                activeRole === r
                  ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                  : 'bg-dark-850 text-slate-400 border-dark-750 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Search Toolbar */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search staff by name, email, or role..."
        filterValue={roleFilter}
        onFilterChange={setRoleFilter}
        filterLabel="All Roles"
        filterOptions={allRoles.map((r) => ({ label: r, value: r }))}
        extraActions={
          <ExportButton
            data={filtered}
            filename="QHAR_Staff_Roster"
            label="Export Staff"
          />
        }
      />

      {/* Staff Directory Table */}
      <div className="gaming-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-dark-850 text-slate-300 font-semibold border-b border-dark-750">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Branch Scope</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 text-slate-200">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-dark-850/40">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center font-bold text-white text-xs">
                        {s.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white">{s.name}</p>
                        <p className="text-[11px] text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-purple/15 text-brand-purple border border-brand-purple/30">
                      {s.role}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-slate-300 text-xs">
                      {s.branchAccess.includes('ALL')
                        ? 'All Branches (Enterprise)'
                        : s.branchAccess.map((bId) => branches.find((b) => b.id === bId)?.name || bId).join(', ')}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-400">
                    {s.phone}
                  </td>

                  <td className="py-3 px-3">
                    <Badge
                      label={s.status}
                      variant={s.status === 'Active' ? 'success' : 'neutral'}
                      dot
                    />
                  </td>

                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {s.lastActive}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
                      title="Edit Staff Member"
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

      {/* Role-Based Permissions Matrix */}
      <div className="gaming-card p-5 space-y-3">
        <div>
          <h3 className="text-base font-bold text-white font-gaming flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            ROLE PERMISSION BOUNDARIES MATRIX
          </h3>
          <p className="text-xs text-slate-400">
            Enforced at API gateway level with tenant and branch authorization tokens.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-dark-850 text-slate-300 font-semibold border-b border-dark-750">
              <tr>
                <th className="py-2.5 px-3">Operational Capability</th>
                {allRoles.map((r) => (
                  <th key={r} className="py-2.5 px-2 text-center text-[11px] whitespace-nowrap">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 text-slate-300">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-dark-850/40">
                  <td className="py-2.5 px-3 font-medium text-white">{item.feature}</td>
                  {allRoles.map((r) => {
                    const hasAccess = item.roles.includes(r);
                    return (
                      <td key={r} className="py-2.5 px-2 text-center">
                        {hasAccess ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-dark-800 text-slate-600">
                            <X className="w-3 h-3" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={staffToEdit ? 'Edit Staff Credentials' : 'Add Staff Member'}
        subtitle="Assign role, branch boundaries, and security authorizations."
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
              placeholder="e.g. Ramesh K"
              className="gaming-input w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@qhargamingcaffe.com"
                className="gaming-input w-full"
              />
            </div>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Assigned Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="gaming-input w-full text-xs"
              >
                {allRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="gaming-input w-full text-xs"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Branch Allocation
            </label>
            <select
              value={branchAccess[0] || 'ALL'}
              onChange={(e) => setBranchAccess([e.target.value])}
              className="gaming-input w-full text-xs"
            >
              <option value="ALL">All Branches (Global Access)</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs">
              {staffToEdit ? 'Save Changes' : 'Create Staff Profile'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
