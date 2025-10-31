"use client"

import { CheckCircle, X } from "lucide-react"
import { useEffect } from "react"

interface SuccessModalProps {
  isOpen: boolean
  message: string
  onClose: () => void
  autoClose?: number
}

export function SuccessModal({ isOpen, message, onClose, autoClose = 3000 }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, autoClose)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-lime-200/80 border-2 border-lime-400 rounded-lg p-8 max-w-md mx-auto shadow-xl backdrop-blur-sm">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-lime-300 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center gap-4">
          <CheckCircle size={64} className="text-green-600" />
          <h2 className="text-2xl font-bold text-center text-gray-800">{message}</h2>
          <p className="text-sm text-gray-700 text-center">This modal will close in a few seconds</p>
        </div>
      </div>
    </div>
  )
}
