import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
          info: <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-500/30 bg-emerald-950/40',
          warning: 'border-amber-500/30 bg-amber-950/40',
          error: 'border-rose-500/30 bg-rose-950/40',
          info: 'border-cyan-500/30 bg-cyan-950/40',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in slide-in-from-right-5 ${borders[toast.type]} bg-dark-900/90 text-slate-100`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
