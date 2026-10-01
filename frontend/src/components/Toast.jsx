import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3500 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50',
    error: 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/50',
    info: 'bg-slate-900/90 border-blue-500/40 text-blue-200 shadow-slate-950/50',
    warning: 'bg-amber-950/90 border-amber-500/40 text-amber-200 shadow-amber-950/50',
  };

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const iconColors = {
    success: 'text-emerald-400',
    error: 'text-rose-400',
    info: 'text-blue-400',
    warning: 'text-amber-400',
  };

  const Icon = icons[type] || Info;

  return (
    <div
      className={`fixed top-20 right-4 z-50 ${styles[type] || styles.info} border px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-slide-in max-w-md`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColors[type] || 'text-blue-400'}`} />
      <span className="text-xs font-semibold flex-1 leading-snug">{message}</span>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
        title="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
