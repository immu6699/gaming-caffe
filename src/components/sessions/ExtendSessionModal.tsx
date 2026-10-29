import React, { useState } from 'react';
import { LiveSession } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { formatINR } from '../../utils/formatters';
import { Clock, Plus } from 'lucide-react';

interface ExtendSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: LiveSession | null;
}

export const ExtendSessionModal: React.FC<ExtendSessionModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const { extendSession } = useApp();
  const [minutes, setMinutes] = useState(30);

  if (!session) return null;

  const additionalCost = Math.round((minutes / 60) * session.hourlyRate);

  const handleExtend = () => {
    extendSession(session.id, minutes);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Extend Gaming Session"
      subtitle={`Station: ${session.stationName} • Gamer: ${session.customerName}`}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="p-3 bg-dark-850 rounded-xl border border-dark-750 text-xs">
          <p className="text-slate-400 mb-1">Scheduled End Time:</p>
          <p className="text-white font-mono font-bold text-sm">
            {new Date(session.scheduledEndTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Select Extension Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[15, 30, 60].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMinutes(m)}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                  minutes === m
                    ? 'bg-brand-purple/20 border-brand-purple text-brand-purple'
                    : 'bg-dark-850 border-dark-750 text-slate-400 hover:text-white'
                }`}
              >
                +{m} Mins
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Custom minutes:</span>
            <input
              type="number"
              min="5"
              step="5"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 15)}
              className="gaming-input w-24 py-1 text-xs text-right"
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-dark-850/80 border border-dark-750 flex items-center justify-between text-xs">
          <span className="text-slate-300">Additional Charge:</span>
          <span className="text-emerald-400 font-bold font-gaming text-sm">
            +{formatINR(additionalCost)}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-dark-800">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleExtend} className="btn-primary">
            <Plus className="w-4 h-4" /> Add +{minutes}m
          </button>
        </div>
      </div>
    </Modal>
  );
};
