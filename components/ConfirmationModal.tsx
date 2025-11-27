import React from 'react';
import { AlertTriangle, CheckCircle, LogOut, ShieldCheck, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: 'login' | 'logout' | 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal"
}) => {
  if (!isOpen) return null;

  // Konfigurasi visual berdasarkan tipe modal
  const config = {
    login: {
      icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
      bgIcon: "bg-indigo-100",
      btnConfirm: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
    },
    logout: {
      icon: <LogOut className="w-8 h-8 text-rose-600" />,
      bgIcon: "bg-rose-100",
      btnConfirm: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500",
    },
    danger: {
      icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
      bgIcon: "bg-amber-100",
      btnConfirm: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    },
    info: {
      icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
      bgIcon: "bg-emerald-100",
      btnConfirm: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
    }
  };

  const theme = config[type];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full transform transition-all scale-100 animate-fade-in-up border border-slate-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className={`w-16 h-16 ${theme.bgIcon} rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner`}>
            {theme.icon}
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {title}
          </h3>
          
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.btnConfirm}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
        
        {/* Garis dekoratif di bawah */}
        <div className={`h-1.5 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-20 ${type === 'login' || type === 'info' ? 'text-indigo-500' : 'text-rose-500'}`}></div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
