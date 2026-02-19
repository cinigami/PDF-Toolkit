import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isError = toast.type === 'error';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-[420px] animate-[slideIn_0.2s_ease-out] ${
        isError
          ? 'bg-red-600 text-white'
          : 'bg-emerald-600 text-white'
      }`}
    >
      {isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
      <span className="flex-1 text-sm">{toast.message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 cursor-pointer">
        <X size={16} />
      </button>
    </div>
  );
}
