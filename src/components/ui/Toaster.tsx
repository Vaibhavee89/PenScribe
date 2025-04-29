import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning';

type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

type ShowToastOptions = {
  type?: ToastType;
  message: string;
  duration?: number;
};

// Global state for toasts
let toasts: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...toasts]));
};

export const showToast = ({
  type = 'success',
  message,
  duration = 4000,
}: ShowToastOptions) => {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.push({ id, type, message });
  notifyListeners();

  setTimeout(() => {
    toasts = toasts.filter((toast) => toast.id !== id);
    notifyListeners();
  }, duration);
};

export const Toaster = () => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (updatedToasts: Toast[]) => {
      setCurrentToasts(updatedToasts);
    };

    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const removeToast = (id: string) => {
    toasts = toasts.filter((toast) => toast.id !== id);
    notifyListeners();
  };

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {currentToasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

const Toast = ({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) => {
  const { type, message } = toast;

  const bgColor = {
    success: 'bg-success-100 border-success-500',
    error: 'bg-error-100 border-error-500',
    warning: 'bg-warning-100 border-warning-500',
  }[type];

  const textColor = {
    success: 'text-success-800',
    error: 'text-error-800',
    warning: 'text-warning-800',
  }[type];

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
  }[type];

  return (
    <div
      className={`p-4 rounded-lg shadow-md border-l-4 flex items-start gap-3 animate-slide-up ${bgColor} max-w-md`}
    >
      <Icon className={textColor} size={20} />
      <div className={`flex-1 ${textColor}`}>{message}</div>
      <button
        onClick={onRemove}
        className="text-gray-500 hover:text-gray-700"
        aria-label="Close toast"
      >
        <X size={16} />
      </button>
    </div>
  );
};