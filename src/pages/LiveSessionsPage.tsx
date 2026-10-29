import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LiveSession } from '../types';
import { ExtendSessionModal } from '../components/sessions/ExtendSessionModal';
import { EndSessionBillingModal } from '../components/sessions/EndSessionBillingModal';
import { SearchFilter } from '../components/common/SearchFilter';
import { ExportButton } from '../components/common/ExportButton';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { formatINR, formatDateTime, getElapsedDuration } from '../utils/formatters';
import {
  Activity,
  Clock,
  User,
  Plus,
  StopCircle,
  AlertTriangle,
  Play,
  Monitor,
  Calendar,
  UtensilsCrossed,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiveSessionsPage: React.FC = () => {
  const { filteredSessions, fnbOrders } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tick, setTick] = useState(0);

  // Modals
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [selectedSessionForExtend, setSelectedSessionForExtend] = useState<LiveSession | null>(null);

  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [selectedSessionForEnd, setSelectedSessionForEnd] = useState<LiveSession | null>(null);

  // Live timer tick every 10 seconds to update elapsed & remaining badges
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filteredSessions.filter((sess) => {
    const matchesSearch =
      sess.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sess.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sess.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || sess.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenExtend = (sess: LiveSession) => {
    setSelectedSessionForExtend(sess);
    setIsExtendModalOpen(true);
  };

  const handleOpenEnd = (sess: LiveSession) => {
    setSelectedSessionForEnd(sess);
    setIsEndModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
              LIVE GAMING SESSIONS
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Real-Time Tracking
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Active player sessions, live elapsed timers, linked café orders, and checkout settlement.
          </p>
        </div>

        <Link to="/stations" className="btn-cyan">
          <Play className="w-4 h-4 fill-current" /> Start New Session
        </Link>
      </div>

      {/* Search & Export Toolbar */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by customer name, phone, or station..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterLabel="All Sessions"
        filterOptions={[
          { label: 'Active', value: 'Active' },
          { label: 'Overdue', value: 'Overdue' },
          { label: 'Completed', value: 'Completed' },
        ]}
        extraActions={
          <ExportButton
            data={filtered}
            filename="QHAR_Live_Sessions"
            label="Export Sessions"
          />
        }
      />

      {/* Sessions Table */}
      {filtered.length > 0 ? (
        <div className="gaming-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-dark-850 text-slate-300 font-semibold border-b border-dark-750">
                <tr>
                  <th className="py-3 px-4">Station</th>
                  <th className="py-3 px-3">Gamer Details</th>
                  <th className="py-3 px-3">Start & End Time</th>
                  <th className="py-3 px-3">Duration Ticker</th>
                  <th className="py-3 px-3">Est. Gaming Charge</th>
                  <th className="py-3 px-3">Linked F&B Orders</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800 text-slate-200">
                {filtered.map((sess) => {
                  const timing = getElapsedDuration(sess.startTime, sess.scheduledEndTime);
                  const isFinished = sess.status === 'Completed';
                  const linkedFnb = fnbOrders.filter((o) => o.sessionId === sess.id);

                  return (
                    <tr
                      key={sess.id}
                      className={`hover:bg-dark-850/40 transition-colors ${
                        timing.isOverdue && !isFinished ? 'bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-white font-gaming">
                          {sess.stationName}
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400">
                          {formatINR(sess.hourlyRate)}/hr
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                          {sess.customerName}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {sess.customerPhone}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                        <div>
                          Start:{' '}
                          <span className="text-white">
                            {new Date(sess.startTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>
                        </div>
                        <div className="text-slate-400">
                          End:{' '}
                          <span>
                            {new Date(sess.scheduledEndTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {!isFinished ? (
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-white font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              {timing.elapsedText}
                            </span>
                            <span
                              className={`text-[11px] font-mono font-semibold block ${
                                timing.isOverdue
                                  ? 'text-rose-400 animate-pulse'
                                  : 'text-cyan-300'
                              }`}
                            >
                              {timing.remainingText}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">Session Closed</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-gaming font-bold text-emerald-400 text-sm">
                          {formatINR(sess.estimatedCharge)}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {sess.paymentStatus === 'Paid' ? (
                            <span className="text-emerald-400 font-semibold">Pre-Paid ({sess.paymentMethod})</span>
                          ) : (
                            <span className="text-amber-400 font-semibold">Pay at Checkout</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {linkedFnb.length > 0 ? (
                          <div className="space-y-0.5">
                            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                              <UtensilsCrossed className="w-3 h-3" />
                              {linkedFnb.length} Order(s)
                            </span>
                            <span className="text-[11px] font-mono text-slate-300 font-bold">
                              +
                              {formatINR(
                                linkedFnb.reduce((acc, o) => acc + o.total, 0)
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">No F&B</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {isFinished ? (
                          <Badge label="Completed" variant="neutral" />
                        ) : timing.isOverdue ? (
                          <Badge label="Overdue" variant="danger" dot />
                        ) : (
                          <Badge label="Live In-Play" variant="cyan" dot />
                        )}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                        {!isFinished && (
                          <>
                            <button
                              onClick={() => handleOpenExtend(sess)}
                              className="btn-secondary py-1 px-2.5 text-xs"
                            >
                              + Extend
                            </button>
                            <button
                              onClick={() => handleOpenEnd(sess)}
                              className="btn-danger py-1 px-2.5 text-xs font-semibold"
                            >
                              <StopCircle className="w-3.5 h-3.5" /> End & Bill
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Activity}
          title="No sessions match filter"
          description="There are currently no active or historical sessions matching your criteria."
        />
      )}

      {/* Modals */}
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
    </div>
  );
};
