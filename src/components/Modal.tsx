/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'warning' | 'danger' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        let bgColor = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
        let textColor = 'text-gray-800 dark:text-gray-200';
        let Icon = Info;
        let iconColor = 'text-blue-500';

        switch (toast.type) {
          case 'success':
            bgColor = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50';
            textColor = 'text-emerald-800 dark:text-emerald-200';
            Icon = CheckCircle2;
            iconColor = 'text-emerald-500';
            break;
          case 'warning':
            bgColor = 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50';
            textColor = 'text-amber-800 dark:text-amber-200';
            Icon = AlertTriangle;
            iconColor = 'text-amber-500';
            break;
          case 'danger':
            bgColor = 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50';
            textColor = 'text-red-800 dark:text-red-200';
            Icon = XCircle;
            iconColor = 'text-red-500';
            break;
          case 'info':
            bgColor = 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50';
            textColor = 'text-blue-800 dark:text-blue-200';
            Icon = Info;
            iconColor = 'text-blue-500';
            break;
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 animate-fade-in ${bgColor}`}
          >
            <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {toast.text}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div
        className={`relative bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-gray-800">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-gray-850 dark:hover:text-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
