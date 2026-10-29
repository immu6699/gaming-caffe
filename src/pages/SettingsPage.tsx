import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Save,
  Gamepad2,
  Clock,
  Shield,
  Bell,
  Coins,
  CheckCircle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { addToast } = useApp();

  const [cafeName, setCafeName] = useState('QHAR GamingCaffe Arena');
  const [tagline, setTagline] = useState('Next-Gen Esports & Lounge Operations');
  const [supportEmail, setSupportEmail] = useState('ops@qhargamingcaffe.com');
  const [supportPhone, setSupportPhone] = useState('+91 98450 11223');
  const [defaultCurrency, setDefaultCurrency] = useState('INR (₹)');
  const [gstPercent, setGstPercent] = useState(18);
  const [overdueGraceMinutes, setOverdueGraceMinutes] = useState(10);
  const [enableSoundAlerts, setEnableSoundAlerts] = useState(true);
  const [autoFlagMaintenance, setAutoFlagMaintenance] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Settings Saved', 'System configurations updated across all operational terminals.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
          SYSTEM & BRANDING SETTINGS
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure corporate café identity, GST rates, operational grace periods, and audit parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding Profile Card */}
        <div className="gaming-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
            <Gamepad2 className="w-5 h-5 text-brand-purple" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Café Brand Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Café Brand Name *
              </label>
              <input
                type="text"
                required
                value={cafeName}
                onChange={(e) => setCafeName(e.target.value)}
                className="gaming-input w-full font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="gaming-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Support & Booking Helpdesk Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="gaming-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Centralized Helpdesk Mobile
              </label>
              <input
                type="tel"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="gaming-input w-full"
              />
            </div>
          </div>
        </div>

        {/* Financial & GST Parameters */}
        <div className="gaming-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
            <Coins className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Financial & GST Rules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Default Currency
              </label>
              <input
                type="text"
                readOnly
                value={defaultCurrency}
                className="gaming-input w-full bg-dark-800 text-slate-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gaming Hardware GST Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="28"
                value={gstPercent}
                onChange={(e) => setGstPercent(Number(e.target.value))}
                className="gaming-input w-full font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                F&B Cafe GST Rate (%)
              </label>
              <input
                type="number"
                readOnly
                value={5}
                className="gaming-input w-full bg-dark-800 text-slate-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Operational Automation & Thresholds */}
        <div className="gaming-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Operations & Alert Automation
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Overdue Session Grace Period (Minutes)
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={overdueGraceMinutes}
                onChange={(e) => setOverdueGraceMinutes(Number(e.target.value))}
                className="gaming-input w-full font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Time before station is flagged in red on cashier dashboard.
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={enableSoundAlerts}
                  onChange={(e) => setEnableSoundAlerts(e.target.checked)}
                  className="rounded bg-dark-800 border-dark-750 text-brand-purple focus:ring-brand-purple"
                />
                <span>Enable audio chimes for new kitchen orders & overdue stations</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={autoFlagMaintenance}
                  onChange={(e) => setAutoFlagMaintenance(e.target.checked)}
                  className="rounded bg-dark-800 border-dark-750 text-brand-purple focus:ring-brand-purple"
                />
                <span>Auto-flag stations for maintenance review after 500 operating hours</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button type="submit" className="btn-primary px-6 py-2.5">
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
