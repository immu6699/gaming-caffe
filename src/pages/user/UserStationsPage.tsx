import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GamingStation, StationType } from '../../types';
import {
  Monitor,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Calendar,
  CreditCard,
  X,
  Sparkles,
  Gamepad2,
  Tv,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { sound } from '../../utils/audio';

export const UserStationsPage: React.FC = () => {
  const {
    stations,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    currentCustomer,
    bookStationFromUser,
    addToast,
  } = useApp();

  const [selectedType, setSelectedType] = useState<StationType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStationModal, setActiveStationModal] = useState<GamingStation | null>(null);

  // Booking Form State inside modal
  const todayStr = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState<string>(todayStr);
  const [bookingTime, setBookingTime] = useState<string>('16:00');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [payWithWallet, setPayWithWallet] = useState<boolean>(true);

  // Filtered stations
  const filtered = stations.filter((station) => {
    const matchesBranch = selectedBranchId === 'ALL' || station.branchId === selectedBranchId;
    const matchesType = selectedType === 'ALL' || station.type === selectedType;
    const matchesSearch =
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (station.specs.gpu && station.specs.gpu.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (station.specs.monitor && station.specs.monitor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (station.specs.consoleModel && station.specs.consoleModel.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesBranch && matchesType && matchesSearch;
  });

  const handleOpenBooking = (station: GamingStation) => {
    setActiveStationModal(station);
    // set start time to next round hour
    const now = new Date();
    const nextHour = (now.getHours() + 1) % 24;
    setBookingTime(`${String(nextHour).padStart(2, '0')}:00`);
    setDurationHours(2);
    setSpecialRequests('');
    setPayWithWallet((currentCustomer.walletBalance ?? 0) >= station.hourlyRate * 2);
  };

  const handleConfirmBooking = () => {
    if (!activeStationModal) return;

    // Calculate end time
    const [startH, startM] = bookingTime.split(':').map(Number);
    const endH = (startH + durationHours) % 24;
    const endTime = `${String(endH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;

    const success = bookStationFromUser({
      stationId: activeStationModal.id,
      bookingDate,
      startTime: bookingTime,
      endTime,
      durationHours,
      specialRequests: specialRequests.trim() || undefined,
      payWithWallet,
    });

    if (success) {
      setActiveStationModal(null);
    }
  };

  // Pricing calculation helper
  const calculatePricing = (rate: number, hours: number) => {
    const base = rate * hours;
    const vipDiscount = currentCustomer.status === 'VIP' ? Math.round(base * 0.1) : 0;
    const tax = Math.round((base - vipDiscount) * 0.18);
    const total = base - vipDiscount + tax;
    return { base, vipDiscount, tax, total };
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Monitor className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Battle Station Inventory & Booking
              </h1>
              <p className="text-xs text-zinc-400">
                Reserve your desired rig with guaranteed hardware specs and low-latency peripherals
              </p>
            </div>
          </div>
        </div>

        {/* Branch Filter Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-semibold whitespace-nowrap">
            Branch Arena:
          </span>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Arenas & Lounges</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0b0f1a] border border-zinc-800 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['ALL', 'PC', 'Console', 'VR', 'Racing Sim'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              {type === 'ALL'
                ? 'All Hardware'
                : type === 'PC'
                ? 'PC Battle Rigs'
                : type === 'Console'
                ? 'PS5 & Xbox Suites'
                : type === 'VR'
                ? 'VR Arena Pods'
                : 'Sim Racing DD'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search specs, GPU, monitor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((station) => {
          const branchObj = branches.find((b) => b.id === station.branchId);
          const isAvailable = station.status === 'Available';
          const isInUse = station.status === 'In Use';

          return (
            <div
              key={station.id}
              className={`rounded-2xl border bg-[#0d1222] p-5 flex flex-col justify-between transition-all duration-200 relative group overflow-hidden ${
                isAvailable
                  ? 'border-zinc-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10'
                  : isInUse
                  ? 'border-red-900/30 bg-[#0d111c]'
                  : 'border-zinc-800/60 opacity-80'
              }`}
            >
              {/* Header: Type and Status */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700">
                      {station.type}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {branchObj?.city || 'Downtown Arena'}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                      isAvailable
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : isInUse
                        ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isAvailable
                          ? 'bg-emerald-400 animate-pulse'
                          : isInUse
                          ? 'bg-red-400'
                          : 'bg-amber-400'
                      }`}
                    />
                    {station.status === 'Available'
                      ? 'Available Now'
                      : station.status === 'In Use'
                      ? 'Currently Playing'
                      : station.status}
                  </span>
                </div>

                {/* Station Name */}
                <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors mb-2">
                  {station.name}
                </h3>

                {/* Hardware Specs list */}
                <div className="space-y-1.5 mb-4 text-xs text-zinc-400 bg-zinc-900/50 rounded-xl p-3 border border-zinc-800/80">
                  {station.specs.gpu && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">GPU:</span>
                      <span className="font-semibold text-zinc-200">{station.specs.gpu}</span>
                    </div>
                  )}
                  {station.specs.cpu && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">CPU:</span>
                      <span className="font-semibold text-zinc-200">{station.specs.cpu}</span>
                    </div>
                  )}
                  {station.specs.consoleModel && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">System:</span>
                      <span className="font-semibold text-zinc-200">{station.specs.consoleModel}</span>
                    </div>
                  )}
                  {station.specs.monitor && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Display:</span>
                      <span className="font-semibold text-cyan-300">{station.specs.monitor}</span>
                    </div>
                  )}
                  {station.specs.peripherals && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Gear:</span>
                      <span className="font-semibold text-zinc-300 truncate max-w-[180px]">
                        {station.specs.peripherals}
                      </span>
                    </div>
                  )}
                </div>

                {/* Pre-installed games badges */}
                <div className="mb-4">
                  <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5">
                    Pre-Installed Games
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {station.type === 'PC' && (
                      <>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          Valorant
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          CS2 240Hz
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          Cyberpunk 2077
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          Apex Legends
                        </span>
                      </>
                    )}
                    {station.type === 'Console' && (
                      <>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          EA FC 24
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          Tekken 8
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          Spider-Man 2
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          Mortal Kombat 1
                        </span>
                      </>
                    )}
                    {station.type === 'Racing Sim' && (
                      <>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          Assetto Corsa
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          Forza Horizon 5
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          F1 23
                        </span>
                      </>
                    )}
                    {station.type === 'VR' && (
                      <>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          Beat Saber
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          Half-Life: Alyx
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-850 text-zinc-300">
                          Superhot VR
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer: Hourly Price and Action Button */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500">Hourly Rate</span>
                  <p className="text-lg font-black font-mono text-emerald-400">
                    ₹{station.hourlyRate}
                    <span className="text-xs text-zinc-400 font-normal">/hr</span>
                  </p>
                </div>

                <button
                  onClick={() => handleOpenBooking(station)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                    isAvailable
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/25'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isAvailable ? 'Book This Rig' : 'Reserve Ahead'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOOKING MODAL */}
      {activeStationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-indigo-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Reserve {activeStationModal.name}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Rate: ₹{activeStationModal.hourlyRate}/hr &bull; {activeStationModal.type}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveStationModal(null)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gamer Tag pill */}
            <div className="bg-zinc-900/60 rounded-xl p-3 border border-zinc-800 mb-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-zinc-500">Booking For Gamer:</span>
                <p className="font-bold text-white">
                  {currentCustomer.name}{' '}
                  <span className="text-indigo-400 font-mono">
                    (@{currentCustomer.gamerTag || 'NoTag'})
                  </span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-zinc-500">Wallet Balance:</span>
                <p className="font-mono font-bold text-emerald-400">
                  ₹{currentCustomer.walletBalance ?? 0}
                </p>
              </div>
            </div>

            {/* Date and Time Selector */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Booking Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  min={todayStr}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Playtime Duration Buttons */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Duration (Hours)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 5].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setDurationHours(hrs)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      durationHours === hrs
                        ? 'border-indigo-500 bg-indigo-600/20 text-white'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {hrs} {hrs === 1 ? 'Hour' : 'Hours'}
                    {hrs === 5 && (
                      <span className="block text-[9px] text-cyan-400 uppercase font-black">
                        Grind Pack
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Special Requests / Setup Note
              </label>
              <input
                type="text"
                placeholder="e.g. Discord sound setup, clean mousepad, tournament warmup"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Pricing Breakdown Card */}
            {(() => {
              const pricing = calculatePricing(activeStationModal.hourlyRate, durationHours);
              return (
                <div className="bg-zinc-900/80 rounded-2xl p-3.5 border border-zinc-800 mb-5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>
                      Rig Rate (₹{activeStationModal.hourlyRate} &times; {durationHours}h)
                    </span>
                    <span className="font-mono">₹{pricing.base}</span>
                  </div>

                  {pricing.vipDiscount > 0 && (
                    <div className="flex items-center justify-between text-amber-400">
                      <span>VIP Radiant Discount (10%)</span>
                      <span className="font-mono">-₹{pricing.vipDiscount}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-zinc-400">
                    <span>GST (18%)</span>
                    <span className="font-mono">₹{pricing.tax}</span>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-sm font-bold text-white">
                    <span>Total Amount Payable</span>
                    <span className="font-mono text-emerald-400 text-base">
                      ₹{pricing.total}
                    </span>
                  </div>

                  {/* Payment Mode Selector */}
                  <div className="pt-2 border-t border-zinc-800/80">
                    <p className="text-[11px] text-zinc-400 font-semibold mb-1.5">
                      Select Payment Mode:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPayWithWallet(true)}
                        className={`p-2 rounded-xl border text-xs font-medium text-left flex items-center gap-2 ${
                          payWithWallet
                            ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                            : 'border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span>Gamer Wallet</span>
                          <span className="block text-[10px] text-zinc-500 font-mono">
                            ₹{currentCustomer.walletBalance ?? 0}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayWithWallet(false)}
                        className={`p-2 rounded-xl border text-xs font-medium text-left flex items-center gap-2 ${
                          !payWithWallet
                            ? 'border-indigo-500 bg-indigo-950/30 text-indigo-300'
                            : 'border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <Zap className="w-4 h-4 text-indigo-400" />
                        <div>
                          <span>Pay at Desk</span>
                          <span className="block text-[10px] text-zinc-500">
                            Cash / UPI on arrival
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Confirm Button */}
            <button
              onClick={handleConfirmBooking}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm & Lock Rig Slot</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
