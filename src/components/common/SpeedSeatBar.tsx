import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';
import { sound } from '../../utils/audio';
import {
  Zap,
  Play,
  Monitor,
  Gamepad,
  Glasses,
  Check,
  CreditCard,
  Banknote,
  QrCode,
} from 'lucide-react';

export const SpeedSeatBar: React.FC = () => {
  const { filteredStations, speedSeat } = useApp();

  const availableStations = filteredStations.filter((s) => s.status === 'Available');
  const [selectedStationId, setSelectedStationId] = useState<string>(
    availableStations[0]?.id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI'>('UPI');

  const selectedStation = availableStations.find((s) => s.id === selectedStationId);

  const presets = [
    { label: '1 Hr Quick Play', hours: 1, badge: 'Popular' },
    { label: '2 Hr Duo Match', hours: 2, badge: 'Save ₹20' },
    { label: '4 Hr Grinder', hours: 4, badge: 'Top Value' },
    { label: 'All-Night Pass (7h)', hours: 7, badge: 'Midnight' },
  ];

  if (availableStations.length === 0) {
    return null; // Arena is 100% full!
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-dark-900 border border-dark-800 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 relative z-10">
        {/* Left Label */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-display tracking-tight uppercase">
                Express Walk-In <span className="text-indigo-400 font-extrabold">"Speed Seat"</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                1-CLICK
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Rush-hour cashier launcher: seat walk-in gamers in under 3 seconds without typing forms.
            </p>
          </div>
        </div>

        {/* Center: Available Station Selector & Payment Mode */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          <div className="flex items-center gap-2 bg-dark-950 px-2.5 py-1.5 rounded-lg border border-dark-800">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Station:</span>
            <select
              value={selectedStationId || availableStations[0]?.id}
              onChange={(e) => {
                sound.playClick();
                setSelectedStationId(e.target.value);
              }}
              className="bg-dark-900 text-xs font-semibold text-zinc-200 py-1 px-2.5 rounded-md border border-dark-750 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {availableStations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} (₹{st.hourlyRate}/h)
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Toggle */}
          <div className="flex items-center bg-dark-950 p-1 rounded-lg border border-dark-800 gap-1">
            <button
              onClick={() => {
                sound.playClick();
                setPaymentMethod('UPI');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                paymentMethod === 'UPI'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" /> UPI QR
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setPaymentMethod('Cash');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                paymentMethod === 'Cash'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Banknote className="w-3.5 h-3.5" /> Cash
            </button>
          </div>
        </div>

        {/* Right: Quick Launch Preset Action Buttons (Grid wraps properly on all screen widths) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full xl:w-auto">
          {presets.map((p) => {
            const currentStation = selectedStation || availableStations[0];
            const rate = currentStation ? currentStation.hourlyRate : 120;
            const cost =
              p.hours === 1
                ? rate
                : p.hours === 2
                ? Math.round(rate * 1.8) // discount
                : p.hours === 4
                ? Math.round(rate * 3.4)
                : Math.round(rate * 4.8);

            return (
              <button
                key={p.hours}
                onClick={() => {
                  if (currentStation) {
                    speedSeat(currentStation.id, p.hours, paymentMethod);
                  }
                }}
                className="group relative flex flex-col items-center justify-center py-2 px-2.5 rounded-lg bg-dark-950 hover:bg-zinc-850 border border-dark-800 hover:border-zinc-700 transition-all active:scale-95 shadow-sm min-w-[95px]"
              >
                <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 group-hover:text-zinc-200 whitespace-nowrap">
                  {p.label}
                </span>
                <span className="text-xs font-mono font-bold text-white group-hover:text-indigo-300">
                  {formatINR(cost)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
