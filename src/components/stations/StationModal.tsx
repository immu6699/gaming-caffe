import React, { useState, useEffect } from 'react';
import { GamingStation, StationType, StationStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface StationModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationToEdit?: GamingStation | null;
}

export const StationModal: React.FC<StationModalProps> = ({
  isOpen,
  onClose,
  stationToEdit,
}) => {
  const { addStation, updateStation, branches } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<StationType>('PC');
  const [branchId, setBranchId] = useState('');
  const [hourlyRate, setHourlyRate] = useState(150);
  const [status, setStatus] = useState<StationStatus>('Available');

  // Specs
  const [gpu, setGpu] = useState('');
  const [cpu, setCpu] = useState('');
  const [ram, setRam] = useState('');
  const [monitor, setMonitor] = useState('');
  const [consoleModel, setConsoleModel] = useState('');
  const [peripherals, setPeripherals] = useState('');

  useEffect(() => {
    if (stationToEdit) {
      setName(stationToEdit.name);
      setType(stationToEdit.type);
      setBranchId(stationToEdit.branchId);
      setHourlyRate(stationToEdit.hourlyRate);
      setStatus(stationToEdit.status);
      setGpu(stationToEdit.specs.gpu || '');
      setCpu(stationToEdit.specs.cpu || '');
      setRam(stationToEdit.specs.ram || '');
      setMonitor(stationToEdit.specs.monitor || '');
      setConsoleModel(stationToEdit.specs.consoleModel || '');
      setPeripherals(stationToEdit.specs.peripherals || '');
    } else {
      setName('');
      setType('PC');
      setBranchId(branches[0]?.id || 'branch-1');
      setHourlyRate(150);
      setStatus('Available');
      setGpu('RTX 4080 Super');
      setCpu('Intel i7-14700K');
      setRam('32GB DDR5');
      setMonitor('27" 240Hz Fast IPS');
      setConsoleModel('');
      setPeripherals('Mechanical Gaming Keyboard + Mouse');
    }
  }, [stationToEdit, branches, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      type,
      branchId,
      status,
      hourlyRate: Number(hourlyRate),
      specs: {
        gpu: type === 'PC' || type === 'VR' ? gpu : undefined,
        cpu: type === 'PC' || type === 'VR' ? cpu : undefined,
        ram: type === 'PC' || type === 'VR' ? ram : undefined,
        monitor,
        consoleModel: type === 'Console' ? consoleModel : undefined,
        peripherals,
      },
    };

    if (stationToEdit) {
      updateStation(stationToEdit.id, payload);
    } else {
      addStation(payload);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={stationToEdit ? 'Edit Gaming Station' : 'Add New Gaming Station'}
      subtitle="Configure hardware specifications, branch allocation, and hourly billing rates."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Station Name / Identifier *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. PC-05 (Predator Rig)"
              className="gaming-input w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Station Category *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as StationType)}
              className="gaming-input w-full"
            >
              <option value="PC">Gaming PC</option>
              <option value="Console">Gaming Console (PS5 / Xbox)</option>
              <option value="VR">VR Simulator / Treadmill</option>
              <option value="Racing Sim">Racing Simulator</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Branch *
            </label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="gaming-input w-full"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hourly Rate (₹) *
            </label>
            <input
              type="number"
              min="20"
              max="2000"
              required
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="gaming-input w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StationStatus)}
              className="gaming-input w-full"
            >
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Specs Configuration */}
        <div className="p-3.5 rounded-xl bg-dark-850/80 border border-dark-750 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Hardware Specifications
          </p>

          {type === 'PC' || type === 'VR' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">GPU</label>
                <input
                  type="text"
                  value={gpu}
                  onChange={(e) => setGpu(e.target.value)}
                  placeholder="e.g. RTX 4080 Super"
                  className="gaming-input w-full text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">CPU</label>
                <input
                  type="text"
                  value={cpu}
                  onChange={(e) => setCpu(e.target.value)}
                  placeholder="e.g. i7-14700K"
                  className="gaming-input w-full text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">RAM</label>
                <input
                  type="text"
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  placeholder="e.g. 32GB DDR5"
                  className="gaming-input w-full text-xs"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Console Model</label>
              <input
                type="text"
                value={consoleModel}
                onChange={(e) => setConsoleModel(e.target.value)}
                placeholder="e.g. Sony PlayStation 5 Disc Edition + 2 Controllers"
                className="gaming-input w-full text-xs"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Display Monitor</label>
              <input
                type="text"
                value={monitor}
                onChange={(e) => setMonitor(e.target.value)}
                placeholder="e.g. 27'' 240Hz OLED"
                className="gaming-input w-full text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Peripherals / Accessories</label>
              <input
                type="text"
                value={peripherals}
                onChange={(e) => setPeripherals(e.target.value)}
                placeholder="e.g. Mechanical RGB KB, Gaming Headset"
                className="gaming-input w-full text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {stationToEdit ? 'Save Changes' : 'Create Station'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
