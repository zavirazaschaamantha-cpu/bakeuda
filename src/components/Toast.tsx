/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  text: string;
  type: 'success' | 'warning' | 'danger' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ text, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyle = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-100 bg-white text-slate-800 dark:bg-gray-900 dark:border-emerald-950/40 dark:text-slate-100 shadow-emerald-500/5';
      case 'warning':
        return 'border-amber-100 bg-white text-slate-800 dark:bg-gray-900 dark:border-amber-950/40 dark:text-slate-100 shadow-amber-500/5';
      case 'danger':
        return 'border-red-100 bg-white text-slate-800 dark:bg-gray-900 dark:border-red-950/40 dark:text-slate-100 shadow-red-500/5';
      case 'info':
        return 'border-blue-100 bg-white text-slate-800 dark:bg-gray-900 dark:border-blue-950/40 dark:text-slate-100 shadow-blue-500/5';
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl transition-all duration-300 animate-slide-up max-w-sm text-xs font-semibold ${getStyle()}`}>
      {getIcon()}
      <p className="leading-snug">{text}</p>
    </div>
  );
};
