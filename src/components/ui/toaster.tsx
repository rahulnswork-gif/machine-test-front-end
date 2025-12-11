import { useToastStore } from '@/store/useToastStore'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Toaster = () => {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 p-4 rounded-lg shadow-lg border transition-all duration-300 animate-in slide-in-from-top-full fade-in zoom-in-95",
            toast.type === 'success' && "bg-white border-emerald-200 text-emerald-800",
            toast.type === 'error' && "bg-white border-red-200 text-red-800",
            toast.type === 'warning' && "bg-white border-amber-200 text-amber-800",
            toast.type === 'info' && "bg-white border-blue-200 text-blue-800"
          )}
        >
          {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
          {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
          {toast.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
          {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
          
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
