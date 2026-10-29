import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GamingStation, StationType, StationStatus } from '../types';
import { StationCard } from '../components/stations/StationCard';
import { StationModal } from '../components/stations/StationModal';
import { StartSessionModal } from '../components/stations/StartSessionModal';
import { ExtendSessionModal } from '../components/sessions/ExtendSessionModal';
import { EndSessionBillingModal } from '../components/sessions/EndSessionBillingModal';
import { SearchFilter } from '../components/common/SearchFilter';
import { ExportButton } from '../components/common/ExportButton';
import { EmptyState } from '../components/common/EmptyState';
import { getStationStatusBadge } from '../components/common/Badge';
import { formatINR, getElapsedDuration } from '../utils/formatters';
import { FloorPlanView } from '../components/floorplan/FloorPlanView';
import { RigWatchdogModal } from '../components/common/RigWatchdogModal';
import {
  Monitor,
  LayoutGrid,
  List,
  Plus,
  Play,
  StopCircle,
  Wrench,
  Trash2,
  Edit2,
  Gamepad,
  Map,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export const StationsPage: React.FC = () => {
  const {
    filteredStations,
    sessions,
    deleteStation,
    updateStation,
    branches,
  } = useApp();

  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'table'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modal states
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [stationToEdit, setStationToEdit] = useState<GamingStation | null>(null);

  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [selectedStationForStart, setSelectedStationForStart] = useState<GamingStation | null>(null);

  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [selectedSessionForExtend, setSelectedSessionForExtend] = useState<any>(null);

  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [selectedSessionForEnd, setSelectedSessionForEnd] = useState<any>(null);
  const [watchdogStation, setWatchdogStation] = useState<GamingStation | null>(null);

  // Filter logic
  const filtered = filteredStations.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (st.specs.gpu && st.specs.gpu.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (st.specs.consoleModel && st.specs.consoleModel.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || st.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || st.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStartSession = (station: GamingStation) => {
    setSelectedStationForStart(station);
    setIsStartModalOpen(true);
  };

  const handleEndSession = (station: GamingStation) => {
    const session = sessions.find((s) => s.stationId === station.id && s.status !== 'Completed');
    if (session) {
      setSelectedSessionForEnd(session);
      setIsEndModalOpen(true);
    }
  };

  const handleExtendSession = (station: GamingStation) => {
    const session = sessions.find((s) => s.stationId === station.id && s.status !== 'Completed');
    if (session) {
      setSelectedSessionForExtend(session);
      setIsExtendModalOpen(true);
    }
  };

  const handleEditStation = (station: GamingStation) => {
    setStationToEdit(station);
    setIsStationModalOpen(true);
  };

  const handleToggleMaintenance = (station: GamingStation) => {
    const newStatus: StationStatus = station.status === 'Maintenance' ? 'Available' : 'Maintenance';
    updateStation(station.id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
              GAMING STATIONS
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-dark-800 text-slate-300 border border-dark-700">
              {filtered.length} total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time management for Gaming PCs, PS5 / Xbox consoles, and VR simulators.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Map / Grid / Table Toggle */}
          <div className="flex items-center bg-dark-850 p-1 rounded-lg border border-dark-750">
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1.5 rounded-md transition-all text-xs font-semibold flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Interactive 2D Floor Plan"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">2D Arena Map</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setStationToEdit(null);
              setIsStationModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" /> Add Station
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search by station name, GPU, model..."
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterLabel="All Statuses"
          filterOptions={[
            { label: 'Available', value: 'Available' },
            { label: 'In Use', value: 'In Use' },
            { label: 'Booked', value: 'Booked' },
            { label: 'Maintenance', value: 'Maintenance' },
            { label: 'Offline', value: 'Offline' },
          ]}
          extraActions={
            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="gaming-input text-xs sm:text-sm pr-6 bg-dark-850"
              >
                <option value="ALL">All Categories</option>
                <option value="PC">Gaming PCs</option>
                <option value="Console">Consoles</option>
                <option value="VR">VR Simulator</option>
              </select>

              <ExportButton
                data={filtered}
                filename="QHAR_Gaming_Stations"
                label="Export"
              />
            </div>
          }
        />
      </div>

      {/* 2D Arena Floor Plan Map View */}
      {viewMode === 'map' ? (
        <FloorPlanView
          onStartSession={handleStartSession}
          onEndSession={handleEndSession}
        />
      ) : viewMode === 'grid' ? (
        filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                onStartSession={handleStartSession}
                onEndSession={handleEndSession}
                onExtendSession={handleExtendSession}
                onEditStation={handleEditStation}
                onToggleMaintenance={handleToggleMaintenance}
                onOpenWatchdog={(st) => setWatchdogStation(st)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Monitor}
            title="No stations found"
            description="No stations match your current search and filter criteria."
            actionButton={
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setTypeFilter('ALL');
                }}
                className="btn-secondary text-xs"
              >
                Reset Filters
              </button>
            }
          />
        )
      ) : (
        /* Table View */
        <div className="gaming-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-dark-850 text-slate-300 font-semibold border-b border-dark-750">
                <tr>
                  <th className="py-3 px-4">Station</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Rate</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Current Customer</th>
                  <th className="py-3 px-3">Session Timing</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800 text-slate-200">
                {filtered.map((station) => {
                  const timing = station.sessionStartTime
                    ? getElapsedDuration(station.sessionStartTime, station.scheduledEndTime)
                    : null;
                  return (
                    <tr key={station.id} className="hover:bg-dark-850/40">
                      <td className="py-3 px-4 font-bold text-white font-gaming">
                        {station.name}
                        <div className="text-[11px] text-slate-400 font-normal font-sans">
                          {station.specs.gpu || station.specs.consoleModel}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-300">
                        {station.type}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        {formatINR(station.hourlyRate)}/hr
                      </td>
                      <td className="py-3 px-3">
                        {getStationStatusBadge(station.status)}
                      </td>
                      <td className="py-3 px-3">
                        {station.currentCustomerName ? (
                          <span className="font-semibold text-white">
                            {station.currentCustomerName}
                          </span>
                        ) : (
                          <span className="text-slate-500">--</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        {timing ? (
                          <div>
                            <span className="text-cyan-400 font-semibold">
                              {timing.elapsedText} elapsed
                            </span>
                            <div className="text-slate-400">{timing.remainingText}</div>
                          </div>
                        ) : (
                          <span className="text-slate-500">Idle</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {station.status === 'Available' ? (
                          <button
                            onClick={() => handleStartSession(station)}
                            className="btn-cyan py-1 px-2.5 text-xs"
                          >
                            <Play className="w-3 h-3 fill-current" /> Start
                          </button>
                        ) : station.status === 'In Use' ? (
                          <button
                            onClick={() => handleEndSession(station)}
                            className="btn-danger py-1 px-2.5 text-xs"
                          >
                            <StopCircle className="w-3 h-3" /> End
                          </button>
                        ) : null}

                        <button
                          onClick={() => handleEditStation(station)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteStation(station.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-dark-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <StationModal
        isOpen={isStationModalOpen}
        onClose={() => setIsStationModalOpen(false)}
        stationToEdit={stationToEdit}
      />

      <StartSessionModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        station={selectedStationForStart}
      />

      <ExtendSessionModal
        isOpen={isExtendModalOpen}
        onClose={() => setIsExtendModalOpen(false)}
        session={selectedSessionForExtend}
      />

      <EndSessionBillingModal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        session={selectedSessionForEnd}
      />

      {/* Hardware Rig Watchdog & Sanitation Modal */}
      <RigWatchdogModal
        isOpen={!!watchdogStation}
        onClose={() => setWatchdogStation(null)}
        station={watchdogStation}
      />
    </div>
  );
};
