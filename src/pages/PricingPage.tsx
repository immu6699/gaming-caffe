import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PricingRule } from '../types';
import { Modal } from '../components/common/Modal';
import { formatINR } from '../utils/formatters';
import {
  Tags,
  Edit2,
  Calculator,
  Clock,
  Sparkles,
  CheckCircle,
  Percent,
  Calendar,
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { pricingRules, updatePricingRule, branches } = useApp();

  const [ruleToEdit, setRuleToEdit] = useState<PricingRule | null>(null);
  const [baseHourlyRate, setBaseHourlyRate] = useState(150);
  const [weekendRate, setWeekendRate] = useState(180);
  const [peakHourRate, setPeakHourRate] = useState(200);
  const [peakHoursStart, setPeakHoursStart] = useState('18:00');
  const [peakHoursEnd, setPeakHoursEnd] = useState('23:30');

  // Interactive Live Rate Simulator Tool
  const [simCategory, setSimCategory] = useState<string>('PC_VIP');
  const [simDay, setSimDay] = useState<'weekday' | 'weekend'>('weekday');
  const [simTime, setSimTime] = useState<string>('20:00');
  const [simHours, setSimHours] = useState<number>(3);

  const handleOpenEdit = (rule: PricingRule) => {
    setRuleToEdit(rule);
    setBaseHourlyRate(rule.baseHourlyRate);
    setWeekendRate(rule.weekendRate);
    setPeakHourRate(rule.peakHourRate);
    setPeakHoursStart(rule.peakHoursStart);
    setPeakHoursEnd(rule.peakHoursEnd);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleToEdit) return;

    updatePricingRule(ruleToEdit.id, {
      baseHourlyRate: Number(baseHourlyRate),
      weekendRate: Number(weekendRate),
      peakHourRate: Number(peakHourRate),
      peakHoursStart,
      peakHoursEnd,
    });
    setRuleToEdit(null);
  };

  // Calculate simulated price
  const activeSimRule = pricingRules.find((r) => r.category === simCategory) || pricingRules[0];
  const isWeekend = simDay === 'weekend';
  const isPeak =
    simTime >= (activeSimRule?.peakHoursStart || '18:00') &&
    simTime <= (activeSimRule?.peakHoursEnd || '23:30');

  let appliedRate = activeSimRule?.baseHourlyRate || 150;
  let rateTag = 'Standard Weekday Base Rate';

  if (isWeekend && isPeak) {
    appliedRate = Math.round(activeSimRule?.peakHourRate * 1.1) || 240;
    rateTag = 'Weekend Peak Surge (+10%)';
  } else if (isWeekend) {
    appliedRate = activeSimRule?.weekendRate || 180;
    rateTag = 'Weekend Flat Rate';
  } else if (isPeak) {
    appliedRate = activeSimRule?.peakHourRate || 200;
    rateTag = 'Weekday Peak Hours Surge';
  }

  const simulatedSubtotal = appliedRate * simHours;
  const simulatedTax = Math.round(simulatedSubtotal * 0.18);
  const simulatedTotal = simulatedSubtotal + simulatedTax;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
          PRICING & TARIFF CONFIGURATION
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure base hourly rates, dynamic weekend multipliers, peak hours surges, and simulated pricing.
        </p>
      </div>

      {/* Main Grid: Rules Table + Live Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Tags className="w-4 h-4 text-cyan-400" /> Hourly Rate Schemes
            </h2>
            <span className="text-xs text-slate-400">18% GST Applicable</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pricingRules.map((rule) => (
              <div
                key={rule.id}
                className="gaming-card p-5 border-dark-750 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base font-bold text-white font-gaming">
                        {rule.name}
                      </h3>
                      <span className="text-xs font-mono text-cyan-400 font-semibold">
                        {rule.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenEdit(rule)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
                      title="Edit Rule"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs my-3">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-dark-850">
                      <span className="text-slate-400">Base Weekday Rate:</span>
                      <span className="font-mono font-bold text-white">
                        {formatINR(rule.baseHourlyRate)}/hr
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded-lg bg-dark-850">
                      <span className="text-slate-400">Weekend Rate (Sat-Sun):</span>
                      <span className="font-mono font-bold text-brand-purple">
                        {formatINR(rule.weekendRate)}/hr
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded-lg bg-dark-850">
                      <div>
                        <span className="text-slate-400 block">Peak Hours Surge:</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {rule.peakHoursStart} - {rule.peakHoursEnd}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-amber-400">
                        {formatINR(rule.peakHourRate)}/hr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-dark-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Min Booking: {rule.minBookingHours}h</span>
                  <span>GST: {rule.taxRatePercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Rate Simulator Tool */}
        <div className="gaming-card p-5 flex flex-col justify-between border-cyan-500/20 bg-dark-900/90 shadow-glow-cyan/5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-gaming">
                RATE SIMULATOR
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Test pricing engine calculation for any station, day, and time slot.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Station Hardware Tier
                </label>
                <select
                  value={simCategory}
                  onChange={(e) => setSimCategory(e.target.value)}
                  className="gaming-input w-full text-xs"
                >
                  {pricingRules.map((r) => (
                    <option key={r.id} value={r.category}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Day of Week
                  </label>
                  <select
                    value={simDay}
                    onChange={(e) => setSimDay(e.target.value as any)}
                    className="gaming-input w-full text-xs"
                  >
                    <option value="weekday">Weekday (Mon-Fri)</option>
                    <option value="weekend">Weekend (Sat-Sun)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={simTime}
                    onChange={(e) => setSimTime(e.target.value)}
                    className="gaming-input w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Session Duration ({simHours} hrs)
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={simHours}
                  onChange={(e) => setSimHours(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Result Calculation Preview */}
          <div className="mt-5 p-4 rounded-xl bg-dark-850 border border-dark-750 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Rule Applied:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
                {rateTag}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Applied Rate:</span>
              <span className="font-mono font-bold text-white">{formatINR(appliedRate)}/hr</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Subtotal ({simHours}h):</span>
              <span className="font-mono">{formatINR(simulatedSubtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>GST (18%):</span>
              <span className="font-mono">{formatINR(simulatedTax)}</span>
            </div>
            <div className="pt-2 border-t border-dark-750 flex justify-between items-center text-sm font-bold">
              <span className="text-white">Estimated Charge:</span>
              <span className="text-base font-gaming text-emerald-400">
                {formatINR(simulatedTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Pricing Rule Modal */}
      <Modal
        isOpen={!!ruleToEdit}
        onClose={() => setRuleToEdit(null)}
        title={`Edit Pricing Rule — ${ruleToEdit?.name}`}
        subtitle="Changes affect all future bookings and sessions created with this category."
        maxWidth="md"
      >
        <form onSubmit={handleSaveRule} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Base Weekday Rate (₹/hr) *
              </label>
              <input
                type="number"
                min="50"
                required
                value={baseHourlyRate}
                onChange={(e) => setBaseHourlyRate(Number(e.target.value))}
                className="gaming-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Weekend Rate (₹/hr) *
              </label>
              <input
                type="number"
                min="50"
                required
                value={weekendRate}
                onChange={(e) => setWeekendRate(Number(e.target.value))}
                className="gaming-input w-full"
              />
            </div>
          </div>

          <div className="p-3 bg-dark-850 rounded-xl border border-dark-750 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Peak Hours Dynamic Surcharge
            </p>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Peak Hourly Rate (₹/hr) *
              </label>
              <input
                type="number"
                min="50"
                required
                value={peakHourRate}
                onChange={(e) => setPeakHourRate(Number(e.target.value))}
                className="gaming-input w-full text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Peak Hours Start
                </label>
                <input
                  type="time"
                  value={peakHoursStart}
                  onChange={(e) => setPeakHoursStart(e.target.value)}
                  className="gaming-input w-full text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Peak Hours End
                </label>
                <input
                  type="time"
                  value={peakHoursEnd}
                  onChange={(e) => setPeakHoursEnd(e.target.value)}
                  className="gaming-input w-full text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800">
            <button type="button" onClick={() => setRuleToEdit(null)} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs">
              Save Pricing Rule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
