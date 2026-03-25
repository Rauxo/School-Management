import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/utils/cn"

const Modal = ({ isOpen, onClose, title, children, className }) => {
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className={cn(
        "relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200",
        className
      )}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100 transition-colors">
            <X className="size-5 text-slate-500" />
          </button>
        </div>
        <div className="mt-2 text-slate-600">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
